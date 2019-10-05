import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'example2-rx',
  template: `
  <h2>Example2 - Leverage Reactive Programming</h2>
  URL param: {{page | async}}
  `
})
export class Example2RxComponent  {
  page;

  constructor(private route: ActivatedRoute) {
    this.page = this.route.params
      .pipe(map((params: any) => params.page));
  }

}
