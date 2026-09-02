import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component1 } from './component1';

describe('Component1', () => {
  let component: Component1;
  let fixture: ComponentFixture<Component1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Component1],
    }).compileComponents();

    fixture = TestBed.createComponent(Component1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
