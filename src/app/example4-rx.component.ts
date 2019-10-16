import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { merge, interval } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
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

  page = this.store.select(s => s.page);
  names = merge(this.page, interval(10000).pipe(withLatestFrom(this.page, (_, page) => page)))
      .pipe(
        switchMap(page => this.http.get(`https://api.github.com/orgs/ReactiveX/repos?page=${page}&per_page=5`)),
        map(res => res.map(i => i.name))
      );

  constructor(private store: Store<any>, private http: HttpClient) {
   
  }

}
