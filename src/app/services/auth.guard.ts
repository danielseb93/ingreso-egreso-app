import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
    ){}

  canActivate(): Observable<boolean> {
    return this.authService.isAuth()
      .pipe(
        tap( estado =>{
          if( !estado ) { this.router.navigate(['/login'])}
        })
      );
  }

  canLoad(): Observable<boolean> {
    return this.authService.isAuth()
      .pipe(
        tap( estado =>{
          if( !estado ) { this.router.navigate(['/login'])}
        }),
        take(1) //Indico que solo lo ejecute una vez y cancele la subscripcion
      );
  }
}
