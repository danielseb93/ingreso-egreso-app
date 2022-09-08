import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private store: Store<AppState>
    ) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser => {
      if( fuser ){
        //Existe el usuario
        this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( firestoreUser => {
            console.log('firestoreUser', firestoreUser)
            const tempUser = new Usuario('123', '123', '132');
            this.store.dispatch(authActions.setUser({ user: tempUser }));
          } )
      } else{
        //this.store.dispatch(authActions.unSetUser());
      }
    })
  }

  crearUsuario( nombre: string, email: string, password: string){
    return this.auth.createUserWithEmailAndPassword( email, password )
      .then( ({user}) =>{
        const newUser = new Usuario(user?.uid, nombre, email);
        return this.firestore.doc(`${ user?.uid }/usuario`).set({...newUser})
      });
  }

  ingresarUsuario( email: string, password: string){
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout(){
    return this.auth.signOut().then(()=>{
      this.router.navigate(['/login']);
    });
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fbuser => fbuser != null)
    )
  }
}
