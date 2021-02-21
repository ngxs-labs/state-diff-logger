import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Add, Delete, Modify } from './test.actions';
import { TestState } from './test.state';

@Component({
  selector: 'state-diff-logger-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  testState$ = this.store.select(TestState);

  constructor(private store: Store) {}

  add() {
    this.store.dispatch(new Add());
  }

  modify() {
    this.store.dispatch(new Modify());
  }

  delete() {
    this.store.dispatch(new Delete());
  }
}
