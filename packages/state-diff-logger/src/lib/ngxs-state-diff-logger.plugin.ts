import { Injectable } from "@angular/core";
import {
  getActionTypeFromInstance,
  NgxsNextPluginFn,
  NgxsPlugin
} from "@ngxs/store";
import { catchError, tap } from "rxjs/operators";
import * as jsondiffpatch from "jsondiffpatch";
import { format } from "./browser-console-formatter";

@Injectable()
export class NgxsStateDiffLoggerPlugin implements NgxsPlugin {
  handle(state: any, event: any, next: NgxsNextPluginFn) {
    return next(state, event).pipe(
      tap(nextState => {
        var delta = jsondiffpatch.diff(state, nextState);
        console.group(getActionTypeFromInstance(event));
        if (delta) {
          console.log(...format(delta, null));
        } else {
          console.log("no changes");
        }

        console.groupEnd();
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
