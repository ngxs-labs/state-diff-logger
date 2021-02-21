import { Injectable } from "@angular/core";
import { State, Action, StateContext } from "@ngxs/store";
import { Add, Delete, Modify } from "./test.actions";

export interface TestStateModel {
  array: string[];
  string: string;
  number: number;
}

@State<TestStateModel>({
  name: "aaaaa"
})
@Injectable()
export class TestState {
  @Action([Add])
  add(ctx: StateContext<TestStateModel>) {
    ctx.patchState({
      array: [...(ctx.getState().array || []), "new value"],
      string: "new value",
      number: 10
    });
  }

  @Action([Modify])
  modify(ctx: StateContext<TestStateModel>) {
    const modifiedArray = [...ctx.getState().array];
    modifiedArray.splice(modifiedArray.length - 2, 1, "modified value");
    ctx.patchState({
      array: [...modifiedArray],
      string: "modified value",
      number: 100
    });
  }

  @Action([Delete])
  delete(ctx: StateContext<TestStateModel>) {
    ctx.patchState({
      array: [...[...ctx.getState().array].slice(0, 1)],
      string: "",
      number: null
    });
  }
}
