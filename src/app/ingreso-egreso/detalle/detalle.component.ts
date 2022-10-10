import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = []
  ingresosEgresosSubs: Subscription = new Subscription();

  constructor(  private ingresoEgresoService: IngresoEgresoService,
                private store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store.select('ingresoEgreso')
      .subscribe( ({ items }) => this.ingresosEgresos = items );
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  borrar(uid: string | undefined){
    this.ingresoEgresoService.borrarIngresoEgreso(uid)
      .then( () => Swal.fire('Borrado', 'Item borrado.', 'success'))
      .catch( err => Swal.fire('Error', 'Error borrando item.\n' + err.message, 'error'));
  }

}
