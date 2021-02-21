import { NgModule } from '@angular/core';
import { NgxsStateDiffLoggerPluginProvider } from './ngxs-state-diff-logger.provider';

@NgModule({ providers: [NgxsStateDiffLoggerPluginProvider] })
export class NgxsStateDiffLoggerModule {}
