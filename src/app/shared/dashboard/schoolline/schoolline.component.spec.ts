import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoollineComponent } from './schoolline.component';

describe('SchoollineComponent', () => {
  let component: SchoollineComponent;
  let fixture: ComponentFixture<SchoollineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoollineComponent]
    });
    fixture = TestBed.createComponent(SchoollineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
