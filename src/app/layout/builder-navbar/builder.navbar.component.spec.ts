import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderNavbarComponent } from './builder.navbar.component';

describe('BuilderNavbarComponent', () => {
  let component: BuilderNavbarComponent;
  let fixture: ComponentFixture<BuilderNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuilderNavbarComponent]
    });
    fixture = TestBed.createComponent(BuilderNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
