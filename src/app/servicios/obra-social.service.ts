import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, skip } from 'rxjs';
import { CollectionReference, DocumentData, DocumentReference, Firestore, Query, collection, collectionData, deleteDoc, doc, orderBy, query, setDoc } from '@angular/fire/firestore';
import { ObraSocial } from '../clases/obra-social';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {

  obras_sociales: BehaviorSubject<ObraSocial[]> = new BehaviorSubject<ObraSocial[]>([]);
  firstRun: boolean = true;

  private readonly pathUrl: string = 'obras_sociales';
  private readonly rootRef: CollectionReference<DocumentData, DocumentData> = collection(this.firestore, this.pathUrl);

  constructor(private firestore: Firestore) {
    this.CargarSubscripcion();
  }

  TraerTodos(): Observable<ObraSocial[]> {
    let _query: Query<ObraSocial, DocumentData> = query(
      this.rootRef,
      orderBy('nombre', 'desc')
    ) as Query<ObraSocial, DocumentData>;
    return collectionData<ObraSocial>(_query, { idField: 'id' });
  }

  CargarSubscripcion(): void {
    this.TraerTodos().subscribe(
      (obras_sociales: ObraSocial[]) => {
        this.obras_sociales.next(obras_sociales);
        this.firstRun = false;
        //console.log("Obras sociales cargadas", "Cant: " + this.obras_sociales.value.length);
      }
    );
  }

  async Nuevo(_obra_social: ObraSocial): Promise<void> {
    _obra_social = await this.validarDatosObraSocial(_obra_social);

    let docRef: DocumentReference<DocumentData, DocumentData> = doc(this.rootRef);
    _obra_social.id = docRef.id;

    return setDoc(docRef, _obra_social);
  }

  async Modificar(_obra_social: ObraSocial): Promise<void> {
    _obra_social = await this.validarDatosObraSocial(_obra_social);

    let docRef = doc(this.rootRef, _obra_social.id);
    return setDoc(docRef, _obra_social);
  }

  Borrar(id: string): Promise<void> {
    if (id == null) {
      return Promise.reject('ID nulo');
    };

    if (id == "") {
      return Promise.reject('ID vacío');
    };

    let docRef = doc(this.rootRef, id);
    return deleteDoc(docRef);
  }

  async validarDatosObraSocial(_obra_social: ObraSocial): Promise<ObraSocial> {
    if (_obra_social === null) {
      throw new Error("ObraSocial nula");
    }

    if (this.obras_sociales.value.some(obra_social => obra_social.nombre === _obra_social.nombre && obra_social.id !== _obra_social.id)) {
      throw new Error("Ya existe una obra_social con el mismo nombre");
    }

    return _obra_social;
  }

  async Ready(): Promise<boolean> {
    if (this.firstRun) {
      //console.log("firstRun ObraSocialService READY");
      await firstValueFrom(this.obras_sociales.pipe(skip(1)));
    }

    return !this.firstRun;
  }
}
