import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArhivedchildComponent } from './arhivedchild.component';

describe('ArhivedchildComponent', () => {
  let component: ArhivedchildComponent;
  let fixture: ComponentFixture<ArhivedchildComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArhivedchildComponent]
    });
    fixture = TestBed.createComponent(ArhivedchildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
