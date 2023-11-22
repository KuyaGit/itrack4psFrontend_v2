import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildachievementsComponent } from './childachievements.component';

describe('ChildachievementsComponent', () => {
  let component: ChildachievementsComponent;
  let fixture: ComponentFixture<ChildachievementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChildachievementsComponent]
    });
    fixture = TestBed.createComponent(ChildachievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
