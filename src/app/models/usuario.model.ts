export class Usuario{

    static fromFirebase( { email, nombre, uid } : any ) {
        return new Usuario( uid, nombre, email);
    }

    constructor(
        public uid: string | undefined,
        public nombre: string,
        public email: string
    ){}
}