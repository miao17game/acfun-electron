import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { WebContentContext } from "../../models/content.model";
import { HistoryService } from "../../providers/history.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-content",
  templateUrl: "./content.html",
  styleUrls: ["./style.scss"]
})
export class ContentComponent implements OnInit, OnDestroy {
  public init = false;
  public loading = true;
  public currentPath = "";
  private preventUpdate = false;
  private queryParamsSubp!: Subscription;

  constructor(
    private webContent: WebContentContext,
    private history: HistoryService,
    private route: ActivatedRoute,
    private title: Title
  ) {
    this.queryParamsSubp = this.route.queryParams.subscribe(({ src }) => {
      this.preventUpdate = true;
      this.currentPath = src || this.webContent.currentSrc;
      const routePath = `webview::content?src=${encodeURIComponent(
        this.currentPath
      )}`;
      this.init = true;
      setTimeout(() => {
        this.history.replaceHistory(routePath);
      });
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.queryParamsSubp && !this.queryParamsSubp.closed) {
      this.queryParamsSubp.unsubscribe();
    }
  }

  onBootstrap(delegator: any) {
    this.webContent.updateHost(delegator);
  }

  onLoadingChanged(loading: boolean) {
    this.loading = loading;
  }

  onNavigationStop(src: string) {
    this.webContent.updateSrc(src);
    this.webContent.updateLoading(false);
    if (this.preventUpdate) {
      return (this.preventUpdate = false);
    }
    const route = `webview::content?src=${encodeURIComponent(src)}`;
    setTimeout(() => this.history.push(route));
  }

  onTitleChange(title: string) {
    this.title.setTitle(title);
    this.webContent.updateTitle(title);
  }
}
