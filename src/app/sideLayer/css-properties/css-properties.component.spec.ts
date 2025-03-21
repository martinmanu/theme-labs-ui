import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssPropertiesComponent } from './css-properties.component';

describe('CssPropertiesComponent', () => {
  let component: CssPropertiesComponent;
  let fixture: ComponentFixture<CssPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CssPropertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CssPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
