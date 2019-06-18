import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { HistoryService } from "../../../providers/history.service";
import { CoreService } from "../../../providers/core.service";
import { WebContentContext } from "../../../models/content.model";
import { RouterComponent } from "../../../utils/plugins/router-component";
import { Subscription } from "rxjs";

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
export class LayoutComponent extends RouterComponent
  implements OnInit, OnDestroy {
  public showMenu = false;
  public showMsg = false;
  public actions = buildActions(this);
  public urls = buildRoutes(this);

  private routerSubp!: Subscription;

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
    this.routerSubp = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.changeRouteSelected();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.routerSubp && !this.routerSubp.closed) {
      this.routerSubp.unsubscribe();
    }
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

  private changeRouteSelected() {
    (this.urls || []).forEach(
      each => (each.selected = this.isRouteSelected(each.match))
    );
  }

  private isRouteSelected(match: RegExp | boolean) {
    if (typeof match === "boolean") {
      return match;
    }
    return match.test(this.router.url);
  }
}

function buildActions(instance: LayoutComponent) {
  const actions = {
    debug: {
      type: "plug",
      class: "icon-size-16",
      onclick: instance.onDebugClick.bind(instance)
    },
    settings: {
      type: "cog",
      class: "icon-size-19",
      onclick: instance.onSettingsClick.bind(instance)
    },
    menu: {
      type: "navicon",
      class: "icon-size-18",
      onclick: instance.onMenuClick.bind(instance)
    }
  };
  return Object.keys(actions).map(k => actions[k]);
}

function buildRoutes(instance: LayoutComponent) {
  return Object.keys(configs).map<{
    navigate: () => any;
    label: string;
    match: RegExp | boolean;
    selected: boolean;
  }>(k => {
    const item = configs[k];
    const navigation = item.navigate;
    return {
      navigate: () => {
        // instance["showMenu"] = false;
        return instance["router"].navigate([
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
      label: item.label,
      match: item.match || false,
      selected: false
    };
  });
}

function getPrimaryUrl(url: string) {
  const idx = url.indexOf("(");
  return idx < 0 ? url : url.substring(0, idx);
}
