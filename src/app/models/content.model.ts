import { Actions, Context } from "../helpers/context";
import { CoreService } from "../providers/core.service";

interface IWebContentState {
    currentSrc: string;
    webview: any;
}

@Context()
export class WebContentContext extends Actions<IWebContentState> {
    protected readonly initial: IWebContentState = {
        currentSrc: 'https://www.acfun.cn/member/#area=splash',
        webview: {}
    };

    public get currentSrc() {
        return this.subject.getValue().currentSrc || '';
    }

    public get currentWebview() {
        return this.subject.getValue().webview || {};
    }

    constructor(private core: CoreService) {
        super();
    }

    public async init() { }

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
}
