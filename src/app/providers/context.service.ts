import { Injectable } from "@angular/core";
import { ContextCenter } from "../helpers/context";
import { CoreService } from "./core.service";
import { WebContentContext as WEBCONTENT } from "../models/content.model";
import { PreferenceContext as PREFERENCE } from "../models/preference.model";

const observers = { webContent: WEBCONTENT, preference: PREFERENCE };

@Injectable()
export class ContextService extends ContextCenter<typeof observers> {
  constructor(core: CoreService) {
    super();
    this.createRules(observers);
    this.inject(CoreService, () => core);
    this.finalize();
  }
}
