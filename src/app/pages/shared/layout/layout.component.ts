import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HistoryService } from "../../../providers/history.service";
import { CoreService } from "../../../providers/core.service";
import { WebContentContext } from "../../../models/content.model";

const routes = {
  content: {
    label: "认真你就输了",
    action: (router: Router) => {
      router.navigate([{ outlets: { webview: ["content"], primary: null } }]);
    }
  },
  preference: {
    label: "偏好设置",
    action: (router: Router) => {
      router.navigate([{ outlets: { primary: ["preference"] } }]);
    }
  }
};

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent implements OnInit {
  public showMenu = false;
  public showMsg = false;
  public urls: [() => any, string][] = [];
  public actions = buildActions(this);

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
    private router: Router,
    private route: ActivatedRoute,
    private history: HistoryService,
    private core: CoreService,
    private webContent: WebContentContext
  ) {
    this.core.initRouter(router, this.history.decide.bind(this.history));
  }

  ngOnInit() {
    this.urls = buildRoutes(this.router);
  }

  onMenuClick() {
    this.showMenu = !this.showMenu;
  }

  onMessageBarClick() {
    this.showMsg = !this.showMsg;
  }

  private onNavigationActionInvoke(method: "forward" | "back") {
    const url = this.history[method === "back" ? "getBack" : "getForward"]();
    const isWebContent = url.startsWith("/content?src=");
    const alreayInWebContent = this.isWebContent;
    if (isWebContent && alreayInWebContent) {
      return this.webContent.currentWebview[
        method === "back" ? "goBack" : "goForward"
      ]();
    }
    if (isWebContent && !alreayInWebContent) {
      this.webContent.updateSrc(decodeURIComponent(url.substring(13)));
      return this.router.navigateByUrl(url);
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

function buildActions(target: LayoutComponent) {
  const actions = {
    debug: {
      type: "plug",
      class: "icon-size-16",
      onclick: target.onDebugClick.bind(target)
    },
    settings: {
      type: "cog",
      class: "icon-size-19",
      onclick: target.onSettingsClick.bind(target)
    },
    // message: {
    //   type: "comments",
    //   class: "icon-size-19",
    //   onclick: target.onMessageBarClick.bind(target)
    // },
    menu: {
      type: "navicon",
      class: "icon-size-18",
      onclick: target.onMenuClick.bind(target)
    }
  };
  return Object.keys(actions).map(k => actions[k]);
}

function buildRoutes(router: Router): [() => any, string][] {
  return Object.keys(routes).map<[() => any, string]>(k => {
    const item = routes[k];
    if ("action" in item) {
      return [() => item.action(router), item.label];
    }
    return [() => router.navigateByUrl(`/${k}`), item.label];
  });
}

function getPrimaryUrl(url: string) {
  const idx = url.indexOf("(");
  return idx < 0 ? url : url.substring(0, idx);
}
