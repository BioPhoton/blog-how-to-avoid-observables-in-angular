import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'example1-im',
  template: `
  <h2>Example1 - Avoid Reactive Programming</h2>
  Http result: {{result}}
  `
})
export class Example1ImComponent {
  result;

  constructor(private http: HttpClient) {
    this.result = this.http.get('https://api.github.com/users/ReactiveX')
      .subscribe((user: any) => this.result = user.login);
  }

}
