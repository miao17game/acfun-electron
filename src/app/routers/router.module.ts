import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreferenceComponent } from "../pages/preference/preference.component";
import { ContentComponent } from "../pages/content/content.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/dashboard"
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    data: { title: "仪表板" }
  },
  {
    path: "content",
    component: ContentComponent,
    outlet: "webview",
    data: { title: "" }
  },
  {
    path: "preference",
    component: PreferenceComponent,
    data: { title: "偏好设置" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
