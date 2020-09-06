import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsDeckComponent } from './materials-deck.component';

describe('MaterialsDeckComponent', () => {
  let component: MaterialsDeckComponent;
  let fixture: ComponentFixture<MaterialsDeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialsDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
