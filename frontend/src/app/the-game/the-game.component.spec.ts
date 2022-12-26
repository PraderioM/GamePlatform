import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TheGameComponent } from './the-game.component';

describe('TheGameComponent', () => {
  let component: TheGameComponent;
  let fixture: ComponentFixture<TheGameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TheGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
