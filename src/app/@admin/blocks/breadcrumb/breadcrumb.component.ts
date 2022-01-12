import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Event, ActivationEnd, NavigationEnd, ActivatedRoute } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { buffer, distinctUntilChanged, filter, map, pluck, take, takeUntil, tap } from 'rxjs/operators';
export interface BreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  breadscrumb$!: Observable<MenuItem[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  items!: MenuItem[];
  home!: MenuItem;

  // Build your breadcrumb starting with the root route of your current activated route

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
   this.breadscrumb$ = this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(event => this.buildBreadCrumb(this.activatedRoute.root).filter(e => e.label != undefined)),
    );

   this.home = {icon: 'pi pi-home'};
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '',
                  breadcrumbs: Array<MenuItem> = []): Array<MenuItem> {
    // If no routeConfig is avalailable we are on the root path
    const label = route.routeConfig ? route.routeConfig.data?.breadcrumb : 'Trang chủ';
    const path = route.routeConfig ? route.routeConfig.path : '';

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = `${url}${path}/`;
    const breadcrumb = {
      label,
      url: nextUrl,
    };
    const newBreadcrumbs = [...breadcrumbs, breadcrumb];
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
