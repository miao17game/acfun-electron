import { Actions, Context } from "../helpers/context";
import { IPreferenceConfig } from "../../../app/metadata";
import { CoreService } from "../providers/core.service";

const defaultRule = {
  title: "认真你就输了",
  ruleName: "AcFun",
  indexPath: "https://www.acfun.cn/",
  selected: false
};

interface IPreferenceState extends IPreferenceConfig {
  init: boolean;
}

const defaultConfigs: IPreferenceState = {
  init: false,
  updateAt: 0,
  darkMode: false,
  webRules: []
};

@Context()
export class PreferenceContext extends Actions<IPreferenceState> {
  protected readonly initial: IPreferenceState = defaultConfigs;

  constructor(private core: CoreService) {
    super();
  }

  public async init() {
    try {
      this.update({ init: false });
      const result = await this.core.preferenceFetch();
      const webRules = result.webRules || [];
      if (webRules.length === 0) {
        webRules.push(defaultRule);
      }
      const currentSelected = webRules[0];
      currentSelected.selected = true;
      this.update(result);
      this.update({ init: true });
    } catch (error) {
      console.log(error);
    }
  }

  public async updateConfigs(updates: Partial<IPreferenceConfig>) {
    try {
      await this.core.preferenceUpdate(updates);
      this.init();
    } catch (error) {
      console.log(error);
    }
  }
}
