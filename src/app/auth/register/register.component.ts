import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as uiActions from '../../shared/ui.actions';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registerForm!: UntypedFormGroup;
  loading: boolean = false;
  uiSubscription: Subscription = new Subscription;

  constructor( 
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre:  ['', Validators.required],
      correo:  ['', [Validators.required, Validators.email]],
      password:  ['', Validators.required],
    });
    //Selector
    this.uiSubscription = this.store.select('ui')
                          .subscribe( ui =>  this.loading = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if( this.registerForm.invalid ) { return; }
    const { nombre, correo, password } = this.registerForm.value;
    
    /* Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading();
      }
    }) */

    this.authService.crearUsuario( nombre, correo, password )
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
