import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';


@Component({
  selector: 'example3-im',
  template: `
  <h2>Example3 - Avoid Reactive Programming</h2>
  Store value {{page}}
  `
})
export class Example3ImComponent implements OnDestroy  {
  subscription;
  page;

  constructor(private store: Store<any>) {
    this.subscription = this.store.select(s => s.page)
    .subscribe(page => this.page = page);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
