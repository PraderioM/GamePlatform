import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResolutionDisplayComponent } from './game-resolution-display.component';

describe('GameResolutionDisplayComponent', () => {
  let component: GameResolutionDisplayComponent;
  let fixture: ComponentFixture<GameResolutionDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameResolutionDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResolutionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
