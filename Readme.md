![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/cover-how-to-avoid-observables-in-angular_michael-hladky.png "How to Avoid Observables in Angular - Cover")

# How to Avoid Observables in Angular

Angular, RxJS, observable

Angular is an object-oriented framework. 
Even if there are a lot of things imperative some services, and therefore also some third party libs, are reactive. 
This is great because it provides both approaches in one framework, which is at the moment a more or less unique thing.

As reactive programming is hard for an imperative thinking mind, many people try to avoid reactive programming.

This article will help us to understand how to avoid it and also, we will learn where it makes sense to use observables.

---

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/avoid-observables-intro_michael-hladky.png "How to Avoid Observables in Angular - Intro")

# Table of Content

<!-- toc -->

- [Minimal Information about RxJS](#minimal-information-about-rxjs)
- [Comparing Basic Usecases](#comparing-basic-usecases)
  * [Retrieving values from single-shot observables](#retrieving-values-from-single-shot-observables)
  * [Retrieving values from an on-going observables provided by an Angular service](#retrieving-values-from-an-on-going-observables-provided-by-an-angular-service)
  * [Retrieving values from on-going observables provided by third party libs](#retrieving-values-from-on-going-observables-provided-by-third-party-libs)
- [Patterns to avoid observables](#patterns-to-avoid-observables)
  * [Where to subscribe](#where-to-subscribe)
  * [Make it even easier](#make-it-even-easier)
- [Why do we need in Angular at all?](#why-do-we-need-in-angular-at-all)
  * [Comparing the 2 approaches over composition](#comparing-the-2-approaches-over-composition)
- [My humble 5 cents](#my-humble-5-cents)
- [Summary](#summary)
- [Glossary](#glossary)

<!-- tocstop -->

---

# TL;DR

If you **DON'T** want to use a reactive approach in your component you 
should take the observable you want to get rid of, as soon as possible and do the following things:
- subscribe to a stream and assign incoming values to a component property 
- if necessary, unsubscribe the stream as soon as the component gets destroyed 

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/subscription-time-avoid-observables_michael-hladky.png "How to Avoid Observables in Angular - TL;DR")


# Minimal Information about RxJS 

> **Observables are a unified API for pull and push-based collections 
that can be composed in a functional way**

As this sentence is maybe not trivial to understand let me split it into two pieces, unified API and functional composition. 
 
I'll give a bit more information to both of them and compare them with an imperative approach.

**Unified API:**

Think about all the different APIs in the browser for asynchronous operations: 
- `setInterval` and `clearInterval`
- `addEventListener` and `removeEventListener`
- `new Promise` and [no dispose logic implemented]
- `requestAnimationFrame` and `cancelAnimationFrame`
- `async` and `await`

These are just some of them and we can already see they are all implemented differently.
Some of them, i.e. promises, are not even disposable at all.

RxJS wraps all of them and provides the following API:
- `subscribe` and `unsubscribe`

This is meant by "a unified API".

**Functional Composition:**
To give an example let's combine the items of two arrays into a new one. 
The imperative approach looks like that: 

```typescript
    const arr1 = [1,2,3], arr2 = [4,5,6];
    let arr3 = [];
    for (let i of arr1) {
      arr3.push(i);
    }
    for (let i of arr2) {
      arr3.push(i);
    }
```
We mutate the `arr3` and push all items from `arr1` and `arr2` into `arr3` by using the `for ... of` statement.


The functional approach looks like that:
```typescript
const arr1 = [1,2,3], arr2 = [4,5,6];
const arr3 = arr1.concat(arr2);
```

Here we create a new instance on an array that is a result of the `concat` array first-class function.

This is meant by "functional composition".

---

In the following article, we will learn 
how to work with all the different APIs of the browser instead of the unified API of RxJS.
We will also see how to mutate state and leverage imperative programming instead of functional composition.

To elaborate with some more practical things we start with a part of Angular that provides reactivity and try to avoid it.

## Comparing Basic Usecases

In this section, we will get a good overview of some of the scenarios we get in touch with reactive programming in Angular.

We will take a look at:
- Reactive services provided by Angular
- Cold and Hot Observables
- Subscription handling

And see the reactive and imperative approach in comparison.

### Retrieving values from single-shot observables

Let's solve a very primitive example first. 
Retrieving data over HTTP and render it.

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/ex1-http_michael-hladky.png "Retrieving values from cold observables")


We start with the reactive approach and then try to convert it into an imperative approach.

**Leveraging Reactive Programming ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex1-rx))** 
```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'example1-rx',
  template: `
  <h2>Example1 - Leverage Reactive Programming</h2>
  Http result: {{result | async}}
  `
})
export class Example1RxComponent  {
  result = this.http.get('https://api.github.com/users/ReactiveX')
      .pipe(map((user: any) => user.login));

  constructor(private http: HttpClient) {
  
  }

}
```

Following things happen here:
- subscribing to `http.get` by using the `async` pipe triggers:
  - a HTTP `get` request fires
  - we retrieve the result in the pipe and render it

On the next change detection run, we will see the latest emitted value in the view.

As observables from `HttpClient` are single-shot observables (like promises they complete after the first emission) we don't need care about subscription handling here.

**Avoid Reactive Programming ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex1-im))** 
```typescript
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
```

Following things happen here:
- subscribing to `http.get` in the constructor triggers:
  - a HTTP `get` request fires
  - we retrieve the result in subscribe function

On the next change detection run, we will see the result in the view.

As observables from `HttpClient` are single-shot observables we don't need care about subscription handling.

### Retrieving values from on-going observables provided by an Angular service

Next, let's use an on-going observable provided by Angular service, the `ActivatedRoute` service.

Let's retrieve the route params, plucking out a single key and displaying its value in the view.

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/ex2-router-params_michael-hladky.png "Retrieving values from on-going observables provided by Angular")

Again we start with the reactive approach first.

**Leveraging Reactive Programming ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex2-rx))** 
```typescript
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
  page = this.route.params
      .pipe(map((params: any) => params.page));

  constructor(private route: ActivatedRoute) {
  }

}
```

Following things happen here:
- retrieving the new route params by using the `async` 
- deriving the values from the `page` param from `params` with a transformation operation using the `map` operator
- by using the `async` pipe we:
  - subscribe to the observable on `AfterContentChecked`
  - applying the internal value to the next pipe return value

On the next change detection run, we will see the latest emitted value in the view.

If the component gets destroyed,
the subscription that got set up in the `async` pipe after the first run of `AfterContentChecked` 
gets destroyed on the pipes `ngOnDestroy` [💾 hook](https://github.com/angular/angular/blob/0119f46daf8f1efda00f723c5e329b0c8566fe07/packages/common/src/pipes/async_pipe.ts#L83).

There is no manual subscription handling necessary.

**Avoiding Reactive Programming ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex2-im;page=0))** 
```typescript
import { Component} from '@angular/core';
import { ActivatedRoute} from '@angular/router';

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
```

Following things happen here:
- retrieving the new route params by subscribing in the constructor 
- deriving the values from the `page` param from `params` object directly

On the next change detection run, we will see the latest emitted value in the view.

Even if the `params` observables from `ActivatedRoute` are on-going we don't care about subscription handling here.
Angular internally manages the Observable and it gets closed on `ngOnDestroy` of the `ActivatedRoute`.

### Retrieving values from on-going observables provided by third-party libs

In this section, we take a look at a scenario not managed by the framework.
For this example, I will use the `@ngrx/store` library and it's `Store` service.

Retrieving state from the store and display its value in the view.

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/ex3-store_michael-hladky.png "Retrieving values from on-going observables provided by third parties")

**Leveraging Reactive Programming ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex3-rx))** 
```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';


@Component({
  selector: 'example3-rx',
  template: `
  <h2>Example3 - Leverage Reactive Programming</h2>
  Store value {{page | async}}
  `
})
export class Example3RxComponent  {
  page = this.store.select(s => s.page);

  constructor(private store: Store<any>) {
  }

}
```

Following things happen here:
- retrieving the new state by using the `async` pipe
- deriving the values from the `page` param from `this.store` by using the `select` method
- by using the `async` pipe we:
  - subscribe to the observable on `AfterContentChecked`
  - applying the internal value to the next pipe return value

On the next change detection run, we will see the latest emitted value in the view.

If the component gets destroyed Angular manages the subscription over the `async` pipe.

**Avoiding Reactive Programming  ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex3-im))** 
```typescript
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'example3-im',
  template: `
  <h2>Example3 - Avoid Reactive Programming</h2>
  Store value {{page}}
  `
})
export class Example3ImComponent implements OnDestroy  {
  subscription;
  page;

  constructor(private store: Store<any>) {
    this.subscription = this.store.select(s => s.page)
    .subscribe(page => this.page = page);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
```

Following things happen here:
- retrieving the new state by subscribing in the constructor 
- deriving the values from the `page` param from `this.store` by using the `select` method
- we store the returned subscription from the `subscribe` call under `subscription`

On the next change detection run, we will see the latest emitted value in the view.

Here we have to manage the subscription in case the component gets destroyed.

- when the component gets destroyed
  - we call `this.subscription.unsubscribe()` in the `ngOnDestroy` life-cycle hook.

## Patterns to avoid observables

As these examples are very simple let me summarise the learning in with a broader view.
 

### Where to subscribe

We saw that we subscribe to observables in different places.

Let's get a quick overview of the different options where we could subscribe.

1. constructor
2. ngOnChanges
3. ngOnInit
4. ngAfterContentInit
5. ngAfterContentChecked
6. subscription over `async` pipe with a template binding
7. subscription over `async` pipe with a template expression
8. ngAfterViewInit
9. ngAfterViewChecked
10. ngOnDestroy 

If we take another look at the above code examples we realize that we put our subscription in the constructor to avoid reactive programming.
And we put the subscription in the template when we leveraged reactive programming.

This is the critical thing, the **subscription**. 
The subscription is the place where values "dripping" out of the observable. 
It's the moment we start to mutate the properties of a component in an imperative way.

> **In RxJS `.subscribe()` is where reactive programming ends**

So the worst thing you could do to avoid reactive programming is to use the `async` pipe.
Let me give you a quick illustration of this learning:

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/avoid-leverage-observables_michael-hladky.png "Avoid Reactive Programming")

We learned the following: 
- If we want to **avoid** reactive programming we have to 
**subscribe as early as possible**, i. e. in the `constructor`.
- If we want to **leverage** reactive programming we have to 
**subscribe as late as possible**, i. e. in the template.

As the last thing to mention here is a thing that I discover a lot when I consult projects is mixing the styles.
Until now I saw plenty of them and It was always a mess.

So as a suggestion from my side tries to avoid mixing stales as good as possible.

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/mix-styles_michael-hladky.png "Mixing Styles")


### Make it even easier

We realized that there is a bit of boilerplate to write to get the values out of the observable.
In some cases, we also need to manage the subscription according to the component's lifetime.

As this is annoying or even tricky, if we forget to unsubscribe, we could create some helper functions to do so. 

We could... But let's first look at some solutions out there.

In recent times 2 people presented automation of something that I call "binding an observable to a property", for Angular components.
Both of them created a HOC for it in a different way. (HOC is an acronym and stands for **H**igher **O**rder **C**omponents) 

[@EliranEliassy](https://twitter.com/EliranEliassy) presented the "@Unsubscriber" decorator in his presentation [📼 Everything you need to know about Ivy](https://youtu.be/AKibI36WNhY?t=2117)

[@MikeRyanDev](https://twitter.com/MikeRyanDev) presented the "ReactiveComponent" and its "connect" method in his presentation [📼 Building with Ivy: rethinking reactive Angular](https://youtu.be/rz-rcaGXhGk?t=859)  

Both of them eliminate the need to assign incoming values to a component property as well as manage the subscription.
The great thing about it is we can solve our problem with a one-liner and can switch to imperative programming without having any troubles.

That functionality could be implemented in various ways.

Eliran Eliassy used class-level decorators to accomplish it.
He uses a concept form functional programming, a closure function, that looks something like this:

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Unsubscriber } from 'unsubscriber.decorator.ts';

@Unsubscriber()
@Component({
  selector: 'example3-im',
  template: `
  <h2>Example3 - Avoid Reactive Programming</h2>
  Store value {{page}}
  `
})
export class Example3ImComponent  {
  page; 
  subscription = this.store.select(s => s.page)
    .subscribe(page => this.page = page);

  constructor(private store: Store<any>) {
  }
}
```

Now let's take a look at Mike Ryan example:

Mike used inheritance as an implementation approach. He also listed the various ways ou implementation in his talk, so definitely watch it!
In addition to Eliran's example here the subscription call is also invisible, which is even better!

This is also the cleanest solution I have found so far.

He used a concept form object oriented programming, inheritance, that looks something like this:

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReactiveComponent } from 'reactive.component.ts';
@Component({
  selector: 'example3-im',
  template: `
  <h2>Example3 - Avoid Reactive Programming</h2>
  Store value {{page}}
  `
})
export class Example3ImComponent extends ReactiveComponent  {
  page = this.connect({page: this.store.select(s => s.page)});

  constructor(private store: Store<any>) {
  }
}
```


As both versions are written for `Ivy` you might think how to use it right now?
I can inform you that there are also several other libs out there for `ViewEngine`.


There is i.e. [📦 ngx-take-until-destroy](https://www.npmjs.com/package/ngx-take-until-destroy) and [📦 ngx-auto-unsubscribe](https://www.npmjs.com/package/ngx-auto-unsubscribe) from [@NetanelBasal](https://twitter.com/NetanelBasal)

---

With this information, we could stop here and start avoiding reactive programming like a pro. ;)

But let's have the last section to give a bit reason for reactive programming.

## Comparing the 2 approaches over the composition

In this section, we will compose values from the `Store` with results from HTTP requests and render it in the template.
As we want to avoid broken UI state we have to handle race-conditions. 
Even if there is no user interaction we refresh the result every 10 seconds automatically.
Also if the component gets destroyed while a request is pending we don't process the result anymore. 

As I mentioned that it probably makes no sense to have the HTTP request as observable I will use the browsers fetch API in the imperative approach to fire the HTTP request instead of `HTTPClient`.

![](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular/raw/master/images/ex4-store-and-http_michael-hladky.png "Comparing composition")

**Leveraging Reactive Programming ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex4-rx))** 
```typescript
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
  names = merge(this.page, interval(10000))
      .pipe(
        withLatestFrom(this.page, (_, page) => page),
        switchMap(page => this.http.get(`https://api.github.com/orgs/ReactiveX/repos?page=${page}&per_page=5`)),
        map(res => res.map(i => i.name))
      );

  constructor(private store: Store<any>, private http: HttpClient) {  
  }

}
```

Following things (roughly) happen here:
- all values are retrieving by using the `async` pipe in the template
- deriving the values from the `page` param from `this.store` by using the `select` method
- deriving the HTTP result by combining the page observable with the HTTP observable
- solving race conditions by using the `switchMap` operator
- as all subscriptions are done by the `async` pipe we:
  - subscribe to all observables on `AfterContentChecked`
  - applying all arriving values to the pipes return value

On the next change detection run, we will see the latest emitted value in the template.

If the component gets destroyed Angular manages the subscription over the `async` pipe.

**Avoiding Reactive Programming ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex4-im))** 
```typescript
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

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

  intervalId;
  
  names;

  constructor(private store: Store<any>) {
    this.pageSub = this.store.select(s => s.page)
      .subscribe(page => {
        this.page = page;
        this.updateList()
    });

    this.intervalId = setInterval(() => {
        this.updateList();
    }, 10000)
  }

  updateList() {
    if(this.page === undefined) {
      return;
    }
     
    fetch(`https://api.github.com/orgs/ReactiveX/repos?page=${this.page}&per_page=5`)
      .then(result => result.json())
      .then((res: any) => this.names =  res.map(i => i.name));
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
    clearInterval(this.intervalId);
  }
}
```

Following things happen here:
- retrieving the new state by subscribing in the constructor 
- deriving the values from the `page` param from `this.store` by using the `select` method call subscribe
- we store the returned subscription from the `subscribe` call under `pageSub`
- in the store subscription we:
  - assign the arriving value to the components `page` property
  - we take the page value and create an HTTP `get` call by using the `fetch` API.
    - a HTTP `get` request fires
    - we retrieve the result in `.then()` call of the returned `Promise`
      - we convert the response to `JSON` format
      - we assign the value to a static class property

Here we have to manage the active processes in case the component gets destroyed.

- when the component gets destroyed
  - we call `this.pageSub.unsubscribe()` in the `ngOnDestroy` life-cycle hook
  - we call `clearInterval(intervalId);` in the `ngOnDestroy` life-cycle hook

---

As I nearly always code reactive in Angular projects I never think about teardown logic and I always solve race-conditions with one of the `switch` operators. 
Therefore I forgot a tiny bit of logic made a critical mistake. **blush**

I forgot to dispose the returned `Promise` from the fetch call. 

Thanks to [Nicholas Jamieson](https://twitter.com/ncjamieson) that spotted the issue I also implemented a solution for the race condition of the HTTP calls.
To solve it I used another API, the `AbortController`'s `signal` and `abort` functions. 

I created a method on my component `disposableFetch` and a property `httpAbortController`. 
The method takes the URL and a callback as a second parameter.
It fires the request provides the signal from the created `AbortController` the the `fetch` call and passes the result to the callback function.
Then it returns the  created `AbortController` to give others the option to dispose the fetch call.

**Avoiding Reactive Programming Fixed ([🎮 demo](https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex4-im-fixed;page=0https://blog-how-to-avoid-observables-in-angular.stackblitz.io/ex4-im-fixed)) 
```typescript
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
```
Following things happen here:
- retrieving the new state by subscribing in the constructor 
- deriving the values from the `page` param from `this.store` by using the `select` method call subscribe
- we store the returned subscription from the `subscribe` call under `pageSub`
- in the store subscription we:
  - assign the arriving value to the components `page` property
  - we take the page value and create an HTTP `get` call over the new `disposableFetch` method`
    - if `httpAbortController` is a `AbortController` we call `AbortController.abort()`
      - we reset `httpAbortController` to `undefined`
    - we create a new `AbortController` and provide its signal to the `fetch` call
    - we use the `fetch` API again
        - a HTTP `get` request fires
        - we retrieve the result in `.then()` call of the returned `Promise`
          - we convert the response to `JSON` format
          - we assign the value to the static class property
    - we store the `AbortController` returned by `disposableFetch` at under a component property 

Here we have to manage the active processes in case the component gets destroyed.

- when the component gets destroyed
  - we call `this.pageSub.unsubscribe()` in the `ngOnDestroy` life-cycle hook
  - we call `clearInterval(intervalId);` in the `ngOnDestroy` life-cycle hook
  - we call `httpAbortController.abort();` in the `ngOnDestroy` life-cycle hook

## My humble 5 cents

I got told so many times that you have to learn `RxJS` to be able to use Angular even if it was easy for me to avoid it 
  seemed it was not trivial for many other people. This made me create this writing. 
 It hopefully showed that it is very easy to avoid reactive programming in Angular (even if you use reactive third party libs).

Never the less I want to share my personal opinion and experience with you. 

**RxJS gave me a hard time learning it**, but the code I produced with it was (mostly ;P) **more maintainable, stable and elegant** than any other.
Especially in the front-end, it gives me a tool to model and compost complex asynchronous processes in a way that impresses me even today.

If we take the above examples we see that if we don't use observables we:
- produce more lines of code 
- the level of complexity in the code is much higher
- we have to put the logic for one process in multiple places
- very hard to maintain the code
- very hard to add features
- Even the number of indentations in the textual process description as well way deeper 

IMHO it is worth the **headache**, that you will **for sure** get if you try to learn `RxJS`
 and even more worth the money, that the company spends on your learning.

## Summary

We used different APIs for the imperative approach:
- `addEventListener` and `removeEventListener`
- `new Promise` and `no dispose logic implemented`
- `new AbortController` and `AbortController.abort` 
- `setInterval` as `clearInterval`
instead of the reactive (functional reactive) approach:
- `subscribe` and `unsubscribe`

And we maintained the state in a mutable instead of an immutable way.
 
**Learning to avoiding reactive programming with observables:**
- Calling **`.subscribe()`** ends reactive programming. Do it **as early as possible**!
- You can use helpers to hide away the subscription handling
- **Don't mix it!**
- Reactive programming is **a lot of headaches** and a **steep learning curve**
- IMHO **It pays of** quickly if you need to **compose asynchronous processes** 

---

**Resources**  
You can find the source code of the examples   
as well as all resources in the repository [How to Avoid Observables in Angular](https://github.com/BioPhoton/blog-how-to-avoid-observables-in-angular) on GitHub.

For Ivy (Angular >= 9):

[@MikeRyanDev](https://twitter.com/MikeRyanDev)
- [📼 Building with Ivy: rethinking reactive Angular](https://youtu.be/rz-rcaGXhGk?t=859)  
- [💾 ReactiveComponent](https://github.com/MikeRyanDev/rethinking-reactivity-angularconnect2019)

[@EliranEliassy](https://twitter.com/EliranEliassy)
- [📼 Everything you need to know about Ivy](https://youtu.be/AKibI36WNhY?t=2117)
- [💾 @Unsubscriber Decorator](https://github.com/eliraneliassy/bye-bye-ngmodules/blob/master/src/app/timer-example/unsubsribce.hoc.ts)  

For ViewEngine (Angular <= 8):

[@NetanelBasal](https://twitter.com/NetanelBasal)
- [📦 ngx-take-until-destroy](https://github.com/ngneat/until-destroy) 
- [📦 ngx-auto-unsubscribe](https://github.com/NetanelBasal/ngx-auto-unsubscribe)

## Glossary
- **functional programming:** Using functions and immutable state
- **reactive programming:** A style of functional programming where we process incoming events as we would do with lists (JavaScript Arrays)
- **imperative programming:** Using objects and mutable state
- **single-shot observable:** As a Promise completes after the value it emitted, these observables emit a single value and then complete. 
- **on-going observable:** like an interval fires multiple values over time these are observables that need to get completed manually.
- **functional composition:** Therm in functional programming that is a mechanism to combine simple functions to build more complicated ones.
- **closure:** Therm in functional programming that is a function storing a value together with another function scope.
- **HOC:** Acronym for **H**igher **O**rder **C**omponent
- **inheritance**: Is the mechanism of basing a class instance upon another one, to retaining similar implementation 
- **class-level decorators**: [TypeScript Documantation](https://www.typescriptlang.org/docs/handbook/decorators.html) 
- **broken UI state:** A inconsistency in rendered state and stored state
- **race-condition:** Problem of asynchronous programming where two or more operations are accidentally done in the wrong sequence.
