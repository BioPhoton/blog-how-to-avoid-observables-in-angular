import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {Subscription } from 'rxjs';

@Component({
  selector: 'example4-pr',
  template: `
  <h2>Example4 - Use Promises</h2>
  Repositories Page [{{page}}]: 
  <ul>
  <li *ngFor="let name of names">{{name}}</li>
  </ul>
  `
})
export class Example4PrComponent implements OnDestroy  {
  pageSub = new Subscription();
  page;

  intervalId;
  
  httpSub = new Subscription();
  names;

  constructor(private store: Store<any>, private http: HttpClient) {
    this.pageSub = this.store.select(s => s.page)
      .subscribe(page => {
        this.page = page;
        this.updateList()
    });
    this.intervalId = setInterval(() => {
        this.updateList();
    })
  }

  updateList() {
    if(this.page === undefined) {
      return;
    }

    if(!this.httpSub.closed) {
      this.httpSub.unsubscribe();
    }

    this.httpSub = this.http
      .get(`https://api.github.com/orgs/ReactiveX/repos?page=${this.page}&per_page=5`)
      .subscribe((res: any) => {
        this.names =  res.map(i => i.name);
      });
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
    clearInterval(this.intervalId);
    this.httpSub.unsubscribe();
  }

}
