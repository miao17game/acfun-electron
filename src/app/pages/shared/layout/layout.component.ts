import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HistoryService } from "../../../providers/history.service";
import { CoreService } from "../../../providers/core.service";
import { WebContentContext } from "../../../models/content.model";
import { RouterComponent } from "../../../utils/plugins/router-component";

interface IRouteConf {
  label: string;
  navigate: { [prop: string]: any[] | string | false };
  match?: RegExp;
}

const configs: { [prop: string]: IRouteConf } = {
  content: {
    label: "认真你就输了",
    match: /\/.?\(webview:.+\)/gi,
    navigate: { webview: ["content"], primary: false }
  },
  dashboard: {
    label: "控制台",
    match: /^\/dashboard.?/gi,
    navigate: { primary: ["dashboard"] }
  },
  preference: {
    label: "偏好设置",
    match: /^\/preference.?/gi,
    navigate: { primary: ["preference"] }
  }
};

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent extends RouterComponent implements OnInit {
  public showMenu = false;
  public showMsg = false;
  public actions = buildActions.call(this);
  public urls = buildRoutes.call(this);

  public get isPrimaryOutletShow() {
    return getPrimaryUrl(this.router.url) !== "/";
  }

  public get isWebviewOutletShow() {
    return /\(webview:.+\)/g.test(this.router.url);
  }

  public get isWebContent() {
    return !this.isPrimaryOutletShow;
  }

  public get currentPath() {
    return !this.isWebContent
      ? getPrimaryUrl(this.router.url)
      : "/" + this.webContent.currentSrc;
  }

  public get canGoBack() {
    return this.history.canBack;
  }

  public get canGoForward() {
    return this.history.canForward;
  }

  constructor(
    router: Router,
    private title: Title,
    private history: HistoryService,
    private core: CoreService,
    private webContent: WebContentContext
  ) {
    super(router);
    this.core.initRouter(router, this.history.decide.bind(this.history));
  }

  ngOnInit() {}

  isRouteSelected(match: RegExp | boolean) {
    if (typeof match === "boolean") {
      return match;
    }
    return match.test(this.router.url);
  }

  onMenuClick() {
    this.showMenu = !this.showMenu;
  }

  onMessageBarClick() {
    this.showMsg = !this.showMsg;
  }

  private onNavigationActionInvoke(method: "forward" | "back") {
    const url = this.history[method === "back" ? "getBack" : "getForward"]();
    const isWebContent = url.startsWith("webview::");
    const alreayInWebContent = this.isWebContent;
    if (isWebContent && alreayInWebContent) {
      return this.webContent.currentWebview[
        method === "back" ? "goBack" : "goForward"
      ]();
    }
    if (isWebContent && !alreayInWebContent) {
      const cont = url.split("::")[1];
      const [component, qs] = cont.split("?");
      const query = qs
        .split(";")
        .map(i => i.split("=") as any)
        .reduce((p, c) => ({ ...p, [c[0]]: c[1] }), {});
      this.webContent.updateSrc(decodeURIComponent(url.substring(13)));
      return this.openWebview([component, query]).then(() => {
        this.title.setTitle(this.webContent.currentTitle);
      });
    }
    return this.router.navigateByUrl(url);
  }

  onBackClick() {
    return this.onNavigationActionInvoke("back");
  }

  onForwardClick() {
    return this.onNavigationActionInvoke("forward");
  }

  onDebugClick() {
    this.core.debugToolSwitch();
  }

  onSettingsClick() {
    this.router.navigate([{ outlets: { primary: ["preference"] } }]);
  }
}

function buildActions(this: LayoutComponent) {
  const actions = {
    debug: {
      type: "plug",
      class: "icon-size-16",
      onclick: this.onDebugClick.bind(this)
    },
    settings: {
      type: "cog",
      class: "icon-size-19",
      onclick: this.onSettingsClick.bind(this)
    },
    menu: {
      type: "navicon",
      class: "icon-size-18",
      onclick: this.onMenuClick.bind(this)
    }
  };
  return Object.keys(actions).map(k => actions[k]);
}

function buildRoutes(this: LayoutComponent) {
  return Object.keys(configs).map<[() => any, string, RegExp | boolean]>(k => {
    const item = configs[k];
    const navigation = item.navigate;
    return [
      () => {
        this["showMenu"] = false;
        return this["router"].navigate([
          {
            outlets: Object.keys(navigation).reduce(
              (p, c) => ({
                ...p,
                [c]: navigation[c] === false ? null : navigation[c]
              }),
              {}
            )
          }
        ]);
      },
      item.label,
      item.match || false
    ];
  });
}

function getPrimaryUrl(url: string) {
  const idx = url.indexOf("(");
  return idx < 0 ? url : url.substring(0, idx);
}
