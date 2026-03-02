import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Herramientas } from './herramientas';

describe('Herramientas', () => {
  let component: Herramientas;
  let fixture: ComponentFixture<Herramientas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Herramientas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Herramientas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
