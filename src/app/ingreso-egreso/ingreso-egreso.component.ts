import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, timeout } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as uiActions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit {

  loading: boolean = false;
  ingresoForm!: FormGroup;
  tipo: string = 'ingreso';
  uiSubscription: Subscription = new Subscription;


  constructor(  private fb: FormBuilder,
                private ingresoEgresoService : IngresoEgresoService,
                private store: Store<AppState>
                ) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: [ '', Validators.required ],
      monto: [ '', Validators.required ]
    });
    this.uiSubscription = this.store.select('ui').subscribe(ui => this.loading = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  guardar(){
    this.store.dispatch(uiActions.isLoading());
    setTimeout(()=>{
      this.store.dispatch(uiActions.stopLoading());
    }, 2500);
    if(this.ingresoForm.invalid){ return }
    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
        .then(()=> {
          Swal.fire('Registro creado', descripcion, 'success');
          this.ingresoForm.reset();
        })
        .catch( err => {
          Swal.fire('Error', err.message , 'error');
          this.uiSubscription.unsubscribe();
        });
  }

}
