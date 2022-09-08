import { Action, createReducer, on } from '@ngrx/store';
import { setUser, unSetUser } from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
    user: Usuario | undefined; 
}

export const initialState: State = {
   user: undefined,
}

const _authReducer = createReducer(initialState,

    on(setUser, (state, { user }) => ({ ...state, user: { ...user }})),
    on(unSetUser, state => ({ ...state, user: undefined}))

);

export function authReducer(state: State | undefined, action: Action) {
    return _authReducer(state, action);
}