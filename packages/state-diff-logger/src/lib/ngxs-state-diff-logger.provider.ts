import { NGXS_PLUGINS } from "@ngxs/store";
import { NgxsStateDiffLoggerPlugin } from "./ngxs-state-diff-logger.plugin";

export const NgxsStateDiffLoggerPluginProvider = {
  provide: NGXS_PLUGINS,
  useClass: NgxsStateDiffLoggerPlugin,
  multi: true,
};
