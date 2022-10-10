import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  doughnutChartData: ChartData<'doughnut'> = { datasets: [] };
  doughnutChartType: ChartType = 'doughnut';

  estadisticaSubs: Subscription = new Subscription();


  constructor(  private store:Store<AppState>) { }

  ngOnInit(): void {
    this.estadisticaSubs = this.store.select('ingresoEgreso')
      .subscribe( ({ items }) => this.generarEstadistica( items ));
  }

  generarEstadistica( items: IngresoEgreso[] ) {
    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;
    for (const item of items) {
      if( item.tipo === 'ingreso' ){
        this.totalIngresos += Number(item.monto);
        this.ingresos ++;
      } else {
        this.totalEgresos += Number(item.monto);
        this.egresos ++;
      }
    }

    this.doughnutChartData = {
      labels: [ 'Egresos', 'Ingresos' ],
      datasets: [
        { data: [this.totalEgresos, this.totalIngresos] }
      ]
    };
  }

  ngOnDestroy(): void {
    this.estadisticaSubs.unsubscribe();
  }

}
