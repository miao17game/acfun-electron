import { Actions, Context } from "../helpers/context";
import { CoreService } from "../providers/core.service";

interface IWebContentState {
  currentSrc: string;
  webview: any;
  title: string;
  loading: boolean;
}

@Context()
export class WebContentContext extends Actions<IWebContentState> {
  protected readonly initial: IWebContentState = {
    currentSrc: "https://www.acfun.cn/",
    webview: {},
    title: "",
    loading: false
  };

  public get currentSrc() {
    return this.subject.getValue().currentSrc || "";
  }

  public get currentWebview() {
    return this.subject.getValue().webview || {};
  }

  public get currentTitle() {
    return this.subject.getValue().title || "";
  }

  public get isLinked() {
    return !this.subject.getValue().loading;
  }

  constructor(private core: CoreService) {
    super();
  }

  public async init() {}

  public updateHost(webview: any) {
    this.subject.next({
      ...this.last,
      webview
    });
  }

  public updateSrc(src: string) {
    this.subject.next({
      ...this.last,
      currentSrc: src
    });
  }

  public updateLoading(loading: boolean) {
    this.subject.next({
      ...this.last,
      loading
    });
  }

  public updateTitle(title: string) {
    this.subject.next({
      ...this.last,
      title
    });
  }
}
