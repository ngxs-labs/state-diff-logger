import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { NgxsModule, NGXS_PLUGINS } from '@ngxs/store';
import { TestState } from './test.state';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from '../environments/environment';
import { NgxsStateDiffLoggerPluginProvider } from '@ngxs-labs/state-diff-logger';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([TestState]),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [NgxsStateDiffLoggerPluginProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
