import { NgModule } from "@angular/core";
import { ElectronService } from "./electron.service";
import { HistoryService } from "./history.service";
import { CoreService } from "./core.service";
import { ContextService } from "./context.service";
import { WebContentContext } from "../models/content.model";

@NgModule({
  providers: [CoreService, ElectronService, HistoryService, ContextService, WebContentContext]
})
export class ProvidersModule { }
