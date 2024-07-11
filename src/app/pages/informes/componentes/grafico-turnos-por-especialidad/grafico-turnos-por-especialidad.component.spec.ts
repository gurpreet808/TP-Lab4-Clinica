import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosPorEspecialidadComponent } from './grafico-turnos-por-especialidad.component';

describe('GraficoTurnosPorEspecialidadComponent', () => {
  let component: GraficoTurnosPorEspecialidadComponent;
  let fixture: ComponentFixture<GraficoTurnosPorEspecialidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTurnosPorEspecialidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoTurnosPorEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
