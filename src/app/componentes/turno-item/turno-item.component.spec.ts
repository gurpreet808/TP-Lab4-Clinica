import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoItemComponent } from './turno-item.component';

describe('TurnoItemComponent', () => {
  let component: TurnoItemComponent;
  let fixture: ComponentFixture<TurnoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TurnoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
