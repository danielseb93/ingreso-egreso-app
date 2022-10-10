import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  sideBarSubs: Subscription = new Subscription();
  nombre: string | undefined;


  constructor(
    private authService: AuthService,
    private store: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.sideBarSubs = this.store.select('user')
      .subscribe( ({ user }) => this.nombre = user?.nombre);
  }

  logout(){
    this.authService.logout();
  }
  
  ngOnDestroy(): void {
    this.sideBarSubs.unsubscribe();
  }

}
