import { Pipe, PipeTransform } from '@angular/core';
import { UsuarioService } from '../modulos/auth/servicios/usuario.service';
import { Observable, filter, map } from 'rxjs';
import { Usuario } from '../modulos/auth/clases/usuario';

@Pipe({
  name: 'nombreApellidoUsuario',
  standalone: true
})
export class NombreApellidoUsuarioPipe implements PipeTransform {

  constructor(private servUsuario: UsuarioService) { }

  transform(value: string): Observable<string> {
    return this.servUsuario.usuarios.pipe(
      // Filtra el valor inicial para evitar procesarlo
      filter(usuarios => usuarios.length > 0),
      map((usuarios: Usuario[]) => {
        const usuario = usuarios.find((u: Usuario) => u.uid === value);
        return usuario ? usuario.nombre + ", " + usuario.apellido : 'No encontrado';
      })
    );
  }

}
