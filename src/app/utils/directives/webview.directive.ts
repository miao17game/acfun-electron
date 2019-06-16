import { Directive, Input, ElementRef, OnChanges, Output, EventEmitter } from "@angular/core";

interface INativeWebview extends Element {
  src: string;
  loadURL(url: string, options?: any): void;
}

@Directive({
  selector: "webview"
})
export class WebviewDirective implements OnChanges {

  private ready = false;

  @Input()
  public src: string = 'http://localhost:80';

  @Output()
  public bootstrap = new EventEmitter<any>();

  @Output()
  public navigationStart = new EventEmitter<undefined>();

  @Output()
  public startLoading = new EventEmitter<boolean>();

  @Output()
  public contentLoaded = new EventEmitter<undefined>();

  @Output()
  public contentReady = new EventEmitter<undefined>();

  @Output()
  public stopLoading = new EventEmitter<boolean>();

  @Output()
  public navigationStop = new EventEmitter<string>();

  private get webview(): INativeWebview {
    this.bootstrap.emit(this.el.nativeElement);
    return this.el.nativeElement;
  }

  constructor(private el: ElementRef) {
    this.webview.addEventListener("new-window", (event: any) => {
      this.webview.loadURL(event.url);
    })
    this.webview.addEventListener("will-navigate", () => {
      this.navigationStart.emit();
    });
    this.webview.addEventListener("did-start-loading", () => {
      this.startLoading.emit(true);
    });
    this.webview.addEventListener("load-commit", () => {
      this.contentLoaded.emit();
    });
    this.webview.addEventListener("dom-ready", () => {
      this.ready = true;
      this.contentReady.emit();
    });
    this.webview.addEventListener("did-stop-loading", () => {
      this.stopLoading.emit(false);
    });
    this.webview.addEventListener("did-navigate", (event: any) => {
      this.navigationStop.emit(event.url);
    });
    this.webview.addEventListener("did-navigate-in-page", (event: any) => {
      this.navigationStop.emit(event.url);
    });
  }

  public ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    for (const name in changes) {
      if (!name) return;
      const change = changes[name];
      if (name === "src") {
        const previous = (change.previousValue || "").split("#")[0];
        const current = (change.currentValue || "").split("#")[0];
        if (previous !== current) {
          this.updateSrc(changes[name].currentValue);
        }
      }
    }
  }

  private updateSrc(src: string) {
    if (!this.ready) return this.webview.src = src;
    this.webview.loadURL(src);
    this.navigationStart.emit();
  }
}
