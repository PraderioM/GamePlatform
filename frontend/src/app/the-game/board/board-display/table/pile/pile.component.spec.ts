import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PileComponent } from './pile.component';

describe('PileComponent', () => {
  let component: PileComponent;
  let fixture: ComponentFixture<PileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
