import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HistoryService } from "../../../providers/history.service";
import { CoreService } from "../../../providers/core.service";
import { WebContentContext } from "../../../models/content.model";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.html",
  styleUrls: ["./style.scss"]
})
export class LayoutComponent implements OnInit {
  public showMenu = true;
  public showMsg = false;
  public urls = buildRoutes();
  public actions = buildActions(this);

  public get isWebContent() {
    return this.router.url.startsWith("/content");
  }

  public get currentPath() {
    return !this.isWebContent ? this.router.url : "/" + this.webContent.currentSrc;
  }

  public get canGoBack() {
    return this.history.canBack;
  }

  public get canGoForward() {
    return this.history.canForward;
  }

  constructor(private router: Router, private history: HistoryService, private core: CoreService, private webContent: WebContentContext) {
    this.core.initRouter(router, this.history.decide.bind(this.history));
  }

  ngOnInit() { }

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
      return this.webContent.currentWebview[method === "back" ? "goBack" : "goForward"]();
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
    this.router.navigateByUrl("/preference");
  }

  onUserCenterClick() {
    this.router.navigateByUrl("/usercenter");
  }
}

function buildActions(target: LayoutComponent) {
  const actions = {
    debug: {
      type: "plug",
      class: "icon-size-16",
      onclick: target.onDebugClick.bind(target)
    },
    usercenter: {
      type: "user-circle",
      class: "icon-size-17",
      onclick: target.onUserCenterClick.bind(target)
    },
    settings: {
      type: "cog",
      class: "icon-size-19",
      onclick: target.onSettingsClick.bind(target)
    },
    message: {
      type: "comments",
      class: "icon-size-19",
      onclick: target.onMessageBarClick.bind(target)
    },
    menu: {
      type: "navicon",
      class: "icon-size-18",
      onclick: target.onMenuClick.bind(target)
    }
  };
  return Object.keys(actions).map(k => actions[k]);
}

const routes = {
  home: "首页",
  dashboard: "工作台",
  preference: "偏好设置",
  content: "内容"
};

function buildRoutes(): [string, string][] {
  return Object.keys(routes).map<[string, string]>(k => [`/${k}`, routes[k]]);
}
