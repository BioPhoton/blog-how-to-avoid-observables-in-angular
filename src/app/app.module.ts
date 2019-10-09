import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { StoreModule, createReducer,createAction, on, props  } from '@ngrx/store';

import { AppComponent } from './app.component';
import { Example1ImComponent } from './example1-im.component';
import { Example1RxComponent } from './example1-rx.component';
import { Example2ImComponent } from './example2-im.component';
import { Example2RxComponent } from './example2-rx.component';
import { Example3RxComponent } from './example3-rx.component';
import { Example3ImComponent } from './example3-im.component';
import { Example4RxComponent } from './example4-rx.component';
import { Example4ImComponent } from './example4-im.component';
import { Example4ImFixedComponent } from './example4-im-fixed.component';

  
export const update = createAction(
  '[Counter Component] Increment', 
  props<{page: number}>()
);


const _pageReducer = createReducer(0, on(update, (_, action) => action.page));
const pageReducer = (state, action) => _pageReducer(state, action);

@NgModule({
  imports:      [ BrowserModule, HttpClientModule, 
  StoreModule.forRoot({page: 
    (state: any | undefined, action: any) => pageReducer(state, action)
  }),
  RouterModule.forRoot([
    {
      path:'',
      pathMatch: 'full',
      redirectTo: 'ex1-im'
    },
    {
      path:'ex1-rx',
      component: Example1RxComponent
    },
    {
      path:'ex1-im',
      component: Example1ImComponent
    },
    {
      path:'ex2-rx',
      component: Example2RxComponent
    },
    {
      path:'ex2-im',
      component: Example2ImComponent
    },
    {
      path:'ex3-rx',
      component: Example3RxComponent
    },
    {
      path:'ex3-im',
      component: Example3ImComponent
    },
    {
      path:'ex4-rx',
      component: Example4RxComponent
    },
    {
      path:'ex4-im',
      component: Example4ImComponent
    },
    {
      path:'ex4-im-fixed',
      component: Example4ImFixedComponent
    }
  ]) ],
  declarations: [ AppComponent, 
  Example1ImComponent, Example1RxComponent,
  Example2ImComponent, Example2RxComponent,
  Example3ImComponent, Example3RxComponent,
  Example4ImComponent, Example4RxComponent, Example4ImFixedComponent
   ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
