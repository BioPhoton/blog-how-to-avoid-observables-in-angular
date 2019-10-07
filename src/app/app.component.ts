import { Component } from '@angular/core';
import {Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { update } from './app.module';

@Component({
  selector: 'my-app',
  template: `
  <ul>
    <li>
     <a [routerLink]="['ex1-rx', {page: page}]">Ex1-Rx Http Request</a>
    </li>
    <li> 
      <a [routerLink]="['ex1-im', {page: page}]">Ex1-Im Http Request</a>
    </li>
    <li>
     <a [routerLink]="['ex2-rx', {page: page}]">Ex2-Rx Route Param</a>
    </li>
    <li> 
      <a [routerLink]="['ex2-im', {page: page}]">Ex2-Im Route Param</a>
    </li>
    <li>
     <a [routerLink]="['ex3-rx']">Ex3-Rx Store State</a>
    </li>
    <li> 
      <a [routerLink]="['ex3-im']">Ex3-Im Store State</a>
    </li>
    <li>
      <a [routerLink]="['ex4-rx', {page: page}]">Ex4-Rx Store State + Http Request</a>
    </li>
    <li> 
      <a [routerLink]="['ex4-im', {page: page}]">Ex4-Im Store State + Http Request</a>
    </li>
    <li>
      <a [routerLink]="['ex4-pr', {page: page}]">Ex4-Pr Store State + Http Request</a>
    </li>
  </ul>
  <button (click)=update()>update</button>
  <router-outlet></router-outlet>
  `
})
export class AppComponent  {
  page = 0;
  
  constructor(private router: Router, private store: Store<any>) {

  }

  update() {
    this.page = ~~(Math.random()*10);
    this.router.navigate(['./', {page: this.page}]);
    this.store.dispatch(update({page: this.page}))
  }
}
