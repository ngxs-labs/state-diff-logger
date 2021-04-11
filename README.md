

# NGXS State Diff Logger Plugin

This plugin enhances NGXS default logging, adding the state changes after each action execution. This way is much easier to debug what changes your action has done to the store.

![debug](https://raw.githubusercontent.com/ngxs-labs/state-diff-logger/main/docs/screenshot.png)

## Getting Started

In order to install the plugin you need to add the following packages

`npm install --save-dev @ngxs-labs/state-diff-logger jsondiffpatch`

`yarn add -D @ngxs-labs/state-diff-logger jsondiffpatch`

Next you need to include the plugin in you `app.module.ts`

```ts
// ...
import { NgxsStateDiffLoggerModule } from '@ngxs-labs/state-diff-logger';

@NgModule({
  imports: [
    BrowserModule,
    NgxsModule.forRoot([TestState]),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsStateDiffLoggerModule,
    //...
  ],
  //...
})
export class AppModule {}
```

That's it!

Now, each action will include changes to the store in the console.