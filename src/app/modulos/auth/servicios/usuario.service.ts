import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, skip } from 'rxjs';
import { Especialista, Paciente, Usuario } from '../clases/usuario';
import { CollectionReference, DocumentData, Firestore, collection, doc, setDoc, collectionData, Query, deleteDoc, query, orderBy, DocumentReference } from '@angular/fire/firestore';
import { FileHandlerService } from '../../../servicios/file-handler.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  admins: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);
  pacientes: BehaviorSubject<Paciente[]> = new BehaviorSubject<Paciente[]>([]);
  especialistas: BehaviorSubject<Especialista[]> = new BehaviorSubject<Especialista[]>([]);
  firstRun: boolean = true;

  private readonly pathUrl: string = 'usuarios';
  private readonly rootRef: CollectionReference<DocumentData, DocumentData> = collection(this.firestore, this.pathUrl);

  constructor(private firestore: Firestore, public servFile: FileHandlerService) {
    this.TraerUsuarios();
  }

  TraerUsuarios() {
    let _query: Query<Usuario, DocumentData> = query(this.rootRef, orderBy('apellido', 'desc')) as Query<Usuario, DocumentData>;
    collectionData<Usuario>(_query, { idField: 'uid' }).subscribe(
      (usuarios: Usuario[]) => {
        //console.log("usuarios", usuarios);

        let especialistas: Especialista[] = [];
        let pacientes: Paciente[] = [];
        let admins: Usuario[] = [];

        //Eliminar esto si funciona el sort de Firebase
        usuarios.sort(
          (a: Usuario, b: Usuario) => {
            return a.apellido.localeCompare(b.apellido);
          }
        )

        usuarios.forEach(
          (usuario: Usuario) => {
            usuario.fecha_alta = new Date((usuario.fecha_alta as any).seconds * 1000 + (usuario.fecha_alta as any).nanoseconds/1000000);
            
            if (usuario.tipo == 'especialista') {
              if ((usuario as Especialista).disponibilidades == undefined) {
                (usuario as Especialista).disponibilidades = [];
              }

              especialistas.push(usuario as Especialista);
            }

            if (usuario.tipo == 'paciente') {
              pacientes.push(usuario as Paciente);
            }

            if (usuario.tipo == 'admin') {
              admins.push(usuario);
            }
          }
        );

        this.especialistas.next(especialistas);
        this.pacientes.next(pacientes);
        this.admins.next(admins);

        this.usuarios.next(usuarios);

        this.firstRun = false;
      }
    );
  }

  async Nuevo(_usuario: Usuario): Promise<void> {
    _usuario = await this.validarDatosUsuario(_usuario);

    let docRef: DocumentReference<DocumentData, DocumentData> = doc(this.rootRef);
    _usuario.uid = docRef.id;

    return setDoc(docRef, _usuario);
  }

  async Modificar(_usuario: Usuario): Promise<void> {
    _usuario = await this.validarDatosUsuario(_usuario);

    let docRef = doc(this.rootRef, _usuario.uid);
    return setDoc(docRef, _usuario);
  }

  Borrar(uid: string): Promise<void> {
    if (uid == null) {
      return Promise.reject('ID nulo');
    };

    if (uid == "") {
      return Promise.reject('ID vacío');
    };

    let docRef = doc(this.rootRef, uid);
    return deleteDoc(docRef);
  }

  async validarDatosUsuario(_usuario: Usuario): Promise<Usuario> {
    if (_usuario === null) {
      throw new Error("Usuario nulo");
    }

    if (this.usuarios.value.some(usuario => usuario.email === _usuario.email && usuario.uid !== _usuario.uid)) {
      throw new Error("Mail en uso");
    }

    if (this.usuarios.value.some(usuario => usuario.dni === _usuario.dni && usuario.uid !== _usuario.uid)) {
      throw new Error("DNI en uso");
    }

    if (_usuario.tipo == "" || _usuario.tipo == undefined) {
      throw new Error("Tipo de usuario vacío");
    }

    return _usuario;
  }

  async BuscarUsuarioPorUID(uid: string): Promise<Usuario> {
    if (uid === null) {
      return Promise.reject('ID nulo');
    };

    if (uid === "") {
      return Promise.reject('ID vacío');
    };

    let aux_usuarios: Usuario[] = JSON.parse(JSON.stringify(this.usuarios.value));

    for (let i = 0; i < aux_usuarios.length; i++) {
      if (aux_usuarios[i].uid == uid) {
        return aux_usuarios[i];
      }
    }

    throw new Error('Usuario no encontrado');
  }

  async BuscarUsuarioPorMail(email: string): Promise<Usuario> {
    if (email === null) {
      return Promise.reject('E-Mail nulo');
    };

    if (email === "") {
      return Promise.reject('E-Mail vacío');
    };

    let aux_usuarios: Usuario[] = JSON.parse(JSON.stringify(this.usuarios.value));

    for (let i = 0; i < aux_usuarios.length; i++) {
      if (aux_usuarios[i].email == email) {
        return aux_usuarios[i];
      }
    }

    throw new Error('Usuario no encontrado');
  }

  async Ready(): Promise<boolean> {
    if (this.firstRun) {
      console.log("firstRun UsuarioService READY");
      await firstValueFrom(this.usuarios.pipe(skip(1)));
    }

    return !this.firstRun;
  }

}
