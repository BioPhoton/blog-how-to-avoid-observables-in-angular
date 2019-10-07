import { Component } from '@angular/core';
import { Store } from '@ngrx/store';


@Component({
  selector: 'example3-rx',
  template: `
  <h2>Example3 - Leverage Reactive Programming</h2>
  Store value {{page | async}}
  `
})
export class Example3RxComponent  {
  page = this.store.select(s => s.page);

  constructor(private store: Store<any>) {

  }

}
