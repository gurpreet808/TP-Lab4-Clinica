import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosPorEspecialistaComponent } from './grafico-turnos-por-especialista.component';

describe('GraficoTurnosPorEspecialistaComponent', () => {
  let component: GraficoTurnosPorEspecialistaComponent;
  let fixture: ComponentFixture<GraficoTurnosPorEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTurnosPorEspecialistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoTurnosPorEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
