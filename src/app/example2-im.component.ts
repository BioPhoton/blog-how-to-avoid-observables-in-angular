import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'example2-im',
  template: `
  <h2>Example2 - Avoid Reactive Programming</h2>
  URL param: {{page}}
  `
})
export class Example2ImComponent  {
  page;

  constructor(private route: ActivatedRoute) {
    this.route.params
      .subscribe(params => this.page = params.page)
  }

}
