import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveGamesBoardComponent } from './active-games-board.component';

describe('ActiveGamesBoardComponent', () => {
  let component: ActiveGamesBoardComponent;
  let fixture: ComponentFixture<ActiveGamesBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveGamesBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveGamesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
