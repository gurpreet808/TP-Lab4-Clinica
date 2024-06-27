import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { SpinnerComponent } from './modulos/spinner/componentes/spinner/spinner.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './modulos/auth/servicios/auth.service';
import { SpinnerService } from './modulos/spinner/servicios/spinner.service';
import { PrimeNGConfig, Translation } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    SpinnerComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TPLab4Clinica';

  constructor(public servAuth: AuthService, public servSpinner: SpinnerService, private primengConfig: PrimeNGConfig, private http: HttpClient) {
    this.servSpinner.showWithMessage("app-init", "Cargando...");
  }

  ngOnInit(): void {
    firstValueFrom(this.http.get<{ [key: string]: Translation }>('assets/archivos/es-AR.json')).then(
      (translation: { [key: string]: Translation }) => {
        //console.log(translation["es-AR"]);
        this.primengConfig.setTranslation(translation["es-AR"]);
      }
    ).catch(
      (error: any) => {
        console.error(error);
      }
    );

    this.servAuth.IsLoggedIn().then(
      (logueado: boolean) => {
        this.servSpinner.hideWithMessage("app-init");
      }
    );
  }
}
