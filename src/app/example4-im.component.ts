import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {Subscription } from 'rxjs';

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
  
  httpSub = new Subscription();
  names;

  constructor(private store: Store<any>, private http: HttpClient) {
    this.pageSub = this.store.select(s => s.page)
      .subscribe(page => {
        this.page = page;
        if(!this.httpSub.closed) {
          this.httpSub.unsubscribe();
        }

        this.httpSub = this.http
          .get(`https://api.github.com/orgs/ReactiveX/repos?page=${this.page}&per_page=5`)
                .subscribe((res: any) => {
                  this.names =  res.map(i => i.name);
                });
    });
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
    this.httpSub.unsubscribe();
  }

}
