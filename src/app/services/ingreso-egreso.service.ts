import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(  private fs: AngularFirestore,
                private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    delete ingresoEgreso.uid;
    return this.fs.doc(`${ this.authService.user.uid }/ingreso-egreso`)
        .collection('items')
        .add({...ingresoEgreso})
        .then((ref)=> console.log('ref :>> ', ref))
        .catch(err=> console.warn('err :>> ', err));
  }

  initIngresosEgresosListener( uid: string | undefined ){
    return this.fs.collection(`${ uid }/ingreso-egreso/items`)
      .snapshotChanges()
      .pipe(
        map( snapshot => 
          snapshot.map( doc => ({
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            })
          )
        )
      )
  }

  borrarIngresoEgreso( uidItem: string | undefined){
    return this.fs.doc(`${ this.authService.user.uid }/ingreso-egreso/items/${ uidItem }`).delete()
  }
}
