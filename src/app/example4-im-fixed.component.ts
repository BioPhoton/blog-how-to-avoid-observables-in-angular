import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

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
export class Example4ImFixedComponent implements OnDestroy  {
  pageSub = new Subscription();
  page;

  intervalId;
  
  httpAbortController;
  names;

  constructor(private store: Store<any>) {
    this.pageSub = this.store.select(s => s.page)
      .subscribe(page => {
        this.page = page;
        this.updateList()
    });
    
    this.intervalId = setInterval(() => {
        this.updateList();
    }, 10000);
  }

  updateList() {
    if(this.page === undefined) {
      return;
    }

    if(this.httpAbortController) {
      this.httpAbortController.abort();
      this.httpAbortController = undefined;
    }

    this.httpAbortController = this.disposableFetch(
      `https://api.github.com/orgs/ReactiveX/repos?page=${this.page}&per_page=5`, 
      (res: any) => this.names =  res.map(i => i.name));
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
    clearInterval(this.intervalId);
    if(this.httpAbortController) {
      this.httpAbortController.abort();
      this.httpAbortController = undefined;
    }
  }

  disposableFetch(url, callback): AbortController {
    const httpController = new AbortController();
    const httpSignal = httpController.signal;
    
    fetch(url, {signal: httpSignal})
      .then(result => result.json())
      .then(callback);

    return httpController;
  }

}
