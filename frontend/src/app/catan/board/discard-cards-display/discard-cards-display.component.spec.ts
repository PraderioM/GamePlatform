import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DiscardCardsDisplayComponent } from './discard-cards-display.component';

describe('DiscardCardsDisplayComponent', () => {
  let component: DiscardCardsDisplayComponent;
  let fixture: ComponentFixture<DiscardCardsDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscardCardsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardCardsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
