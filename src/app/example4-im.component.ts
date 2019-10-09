import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'example4-im',
  template: `
  <h2>Example4 - Avoid Reactive Programming</h2>
  Repositories Page [{{page}}]: 
  <ul>
    <li *ngFor="let name of names">{{name}}</li>
  </ul>
  `
})
export class Example4ImComponent implements OnDestroy  {
  pageSub = new Subscription();
  page;

  intervalId;
  
  names;

  constructor(private store: Store<any>) {
    this.pageSub = this.store.select(s => s.page)
      .subscribe(page => {
        this.page = page;
        this.updateList()
    });

    this.intervalId = setInterval(() => {
        this.updateList();
    }, 10000)
  }

  updateList() {
    if(this.page === undefined) {
      return;
    }
     
    fetch(`https://api.github.com/orgs/ReactiveX/repos?page=${this.page}&per_page=5`)
      .then(result => result.json())
      .then((res: any) => this.names =  res.map(i => i.name));
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
    clearInterval(this.intervalId);
  }
}
