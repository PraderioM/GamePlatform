import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoardDisplayComponent } from './board-display.component';

describe('BoardDisplayComponent', () => {
  let component: BoardDisplayComponent;
  let fixture: ComponentFixture<BoardDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
