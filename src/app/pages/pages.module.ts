import { NgModule } from "@angular/core";
import { LayoutComponent } from "./shared/layout/layout.component";
import { ComponentsModule } from "../utils/components/components.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PreferenceComponent } from "./preference/preference.component";
import { ContentComponent } from "./content/content.component";
import { DirectivesModule } from "../utils/directives/directives.module";

@NgModule({
  declarations: [LayoutComponent, PreferenceComponent, ContentComponent],
  imports: [RouterModule, CommonModule, ComponentsModule, DirectivesModule],
  exports: [LayoutComponent]
})
export class PagesModule {}
