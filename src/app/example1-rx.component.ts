import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'example1-rx',
  template: `
  <h2>Example1 - Leverage Reactive Programming</h2>
  Http result: {{result | async}}
  `
})
export class Example1RxComponent  {
  result;

  constructor(private http: HttpClient) {
    this.result = this.http.get('https://api.github.com/users/ReactiveX')
      .pipe(map((user: any) => user.login));
  }

}
