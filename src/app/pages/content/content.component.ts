import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { WebContentContext } from "../../models/content.model";
import { HistoryService } from "../../providers/history.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
    selector: "app-content",
    templateUrl: "./content.html",
    styleUrls: ["./style.scss"]
})
export class ContentComponent implements OnInit, OnDestroy {
    public init = false;
    public loading = true;
    public currentPath = '';
    private preventUpdate = false;
    private subscription!: Subscription;

    constructor(private webContent: WebContentContext, private history: HistoryService, private route: ActivatedRoute) {
        this.subscription = this.route.queryParams.subscribe(({ src }) => {
            this.preventUpdate = true;
            this.currentPath = src || this.webContent.currentSrc;
            const route = `/content?src=${encodeURIComponent(this.currentPath)}`;
            this.init = true;
            setTimeout(() => {
                this.history.replaceHistory(route)
            });
        })
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    onBootstrap(delegator: any) {
        this.webContent.updateHost(delegator);
    }

    onLoadingChanged(loading: boolean) {
        this.loading = loading;
    }

    onNavigationStop(src: string) {
        console.log(src);
        this.webContent.updateSrc(src);
        if (this.preventUpdate) return this.preventUpdate = false;
        const route = `/content?src=${encodeURIComponent(src)}`;
        setTimeout(() => this.history.push(route));
    }
}
