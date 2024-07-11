import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTurnosPorFechaComponent } from './grafico-turnos-por-fecha.component';

describe('GraficoTurnosPorFechaComponent', () => {
  let component: GraficoTurnosPorFechaComponent;
  let fixture: ComponentFixture<GraficoTurnosPorFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTurnosPorFechaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraficoTurnosPorFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
