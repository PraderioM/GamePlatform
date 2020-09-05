import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingGameSearchComponent } from './existing-game-search.component';

describe('ExistingGameSearchComponent', () => {
  let component: ExistingGameSearchComponent;
  let fixture: ComponentFixture<ExistingGameSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingGameSearchComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingGameSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
