import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardDialogComponent } from './card-dialog.component';

describe('CardDialogComponent', () => {
  let component: CardDialogComponent;
  let fixture: ComponentFixture<CardDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
