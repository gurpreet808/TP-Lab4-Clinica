import { Injectable } from '@angular/core';
import { Especialidad } from '../clases/especialidad';
import { BehaviorSubject, Observable, firstValueFrom, skip } from 'rxjs';
import { CollectionReference, DocumentData, DocumentReference, Firestore, Query, collection, collectionData, deleteDoc, doc, orderBy, query, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  especialidades: BehaviorSubject<Especialidad[]> = new BehaviorSubject<Especialidad[]>([]);
  firstRun: boolean = true;

  private readonly pathUrl: string = 'especialidades';
  private readonly rootRef: CollectionReference<DocumentData, DocumentData> = collection(this.firestore, this.pathUrl);

  default_especialidad_img: string = 'assets/logos/especialidad-default.png';

  constructor(private firestore: Firestore) {
    this.CargarSubscripcion();
  }

  TraerTodos(): Observable<Especialidad[]> {
    let _query: Query<Especialidad, DocumentData> = query(
      this.rootRef,
      orderBy('nombre', 'desc')
    ) as Query<Especialidad, DocumentData>;
    return collectionData<Especialidad>(_query, { idField: 'id' });
  }

  CargarSubscripcion(): void {
    this.TraerTodos().subscribe(
      (especialidades: Especialidad[]) => {
        this.especialidades.next(especialidades);
        this.firstRun = false;
        //console.log("Especialidades cargadas", "Cant: " + this.especialidades.value.length);
      }
    );
  }

  async Nuevo(_especialidad: Especialidad): Promise<void> {
    _especialidad = await this.validarDatosEspecialidad(_especialidad);

    let docRef: DocumentReference<DocumentData, DocumentData> = doc(this.rootRef);
    _especialidad.id = docRef.id;

    return setDoc(docRef, _especialidad);
  }

  async Modificar(_especialidad: Especialidad): Promise<void> {
    _especialidad = await this.validarDatosEspecialidad(_especialidad);

    let docRef = doc(this.rootRef, _especialidad.id);
    return setDoc(docRef, _especialidad);
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

  ToogleValidarEspecialidad(_especialidad: Especialidad): Promise<void> {
    if (_especialidad === null) {
      throw new Error("Especialidad nula");
    }

    _especialidad.valida = !_especialidad.valida;

    return this.Modificar(_especialidad);
  }

  async validarDatosEspecialidad(_especialidad: Especialidad): Promise<Especialidad> {
    if (_especialidad === null) {
      throw new Error("Especialidad nula");
    }

    if (this.especialidades.value.some(especialidad => especialidad.nombre === _especialidad.nombre && especialidad.id !== _especialidad.id)) {
      throw new Error("Ya existe una especialidad con el mismo nombre");
    }

    return _especialidad;
  }

  async Ready(): Promise<boolean> {
    if (this.firstRun) {
      //console.log("firstRun EspecialidadService READY");
      await firstValueFrom(this.especialidades.pipe(skip(1)));
    }

    return !this.firstRun;
  }
}
