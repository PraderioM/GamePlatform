import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StealPlayerComponent } from './steal-player.component';

describe('StealPlayerComponent', () => {
  let component: StealPlayerComponent;
  let fixture: ComponentFixture<StealPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StealPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StealPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
