import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as uiActions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: UntypedFormGroup;
  loading: boolean = false;
  uiSubscription: Subscription = new Subscription;

  constructor(
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo:  ['', [Validators.required, Validators.email]],
      password:  ['', Validators.required],
    });
    //Selector
    this.uiSubscription = this.store.select('ui').subscribe(ui => this.loading = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login(){
    if( this.loginForm.invalid ) { return; }

    this.store.dispatch(uiActions.isLoading());
   /*  Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    }) */

    const { correo, password } = this.loginForm.value;

    this.authService.ingresarUsuario( correo, password )
      .then( credenciales => {
        //Swal.close();
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch( err => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      })
  }

}
