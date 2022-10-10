import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  navBarSubs: Subscription = new Subscription();
  nombre: string | undefined;


  constructor(  private store: Store<AppState> ) { }

  ngOnInit(): void {
    this.navBarSubs = this.store.select('user')
      .subscribe( ({ user }) => this.nombre = user?.nombre);
  }

  ngOnDestroy(): void {
    this.navBarSubs.unsubscribe();
  }

}
