import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "../pages/shared/layout/layout.component";
import { PreferenceComponent } from "../pages/preference/preference.component";
import { ContentComponent } from "../pages/content/content.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: `content`
      },
      {
        path: "content",
        component: ContentComponent,
        data: { title: "" }
      },
      {
        path: "preference",
        component: PreferenceComponent,
        data: { title: "偏好设置" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
