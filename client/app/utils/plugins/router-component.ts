import { Router } from "@angular/router";

export class RouterComponent {
  constructor(protected router: Router) {}

  protected navigate(paths: any[]) {
    return this.router.navigate([{ outlets: { primary: paths } }]);
  }

  protected openWebview(paths: any[]) {
    return this.router.navigate([
      { outlets: { primary: null, webview: paths } }
    ]);
  }
}
