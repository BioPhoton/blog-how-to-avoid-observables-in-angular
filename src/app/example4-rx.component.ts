import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Component({
  selector: 'example4-rx',
  template: `
  <h2>Example4 - Leverage Reactive Programming</h2>
  Repositories Page [{{page | async}}]: 
  <ul>
  <li *ngFor="let name of names | async">{{name}}</li>
  </ul>
  `
})
export class Example4RxComponent  {
  page;
  names;
  
  constructor(private store: Store<any>, private http: HttpClient) {
    this.page = this.store.select(s => s.page);
    this.names = this.page
      .pipe(
        switchMap(page => this.http.get(`https://api.github.com/orgs/ReactiveX/repos?page=${page}&per_page=5`)),
        map(res => res.map(i => i.name))
      );
  }

}
