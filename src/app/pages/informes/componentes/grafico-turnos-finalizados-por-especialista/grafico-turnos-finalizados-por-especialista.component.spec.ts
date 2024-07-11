import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosFinalizadosPorEspecialistaComponent } from './grafico-turnos-finalizados-por-especialista.component';

describe('GraficoTurnosFinalizadosPorEspecialistaComponent', () => {
  let component: GraficoTurnosFinalizadosPorEspecialistaComponent;
  let fixture: ComponentFixture<GraficoTurnosFinalizadosPorEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTurnosFinalizadosPorEspecialistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoTurnosFinalizadosPorEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
