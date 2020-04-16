import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveGameDisplayComponent } from './active-game-display.component';

describe('ActiveGameDisplayComponent', () => {
  let component: ActiveGameDisplayComponent;
  let fixture: ComponentFixture<ActiveGameDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveGameDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveGameDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
