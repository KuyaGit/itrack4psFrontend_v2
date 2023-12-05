import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangaycountComponent } from './barangaycount.component';

describe('BarangaycountComponent', () => {
  let component: BarangaycountComponent;
  let fixture: ComponentFixture<BarangaycountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarangaycountComponent]
    });
    fixture = TestBed.createComponent(BarangaycountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
