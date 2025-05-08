import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrolearningComponent } from './microlearning.component';

describe('MicrolearningComponent', () => {
  let component: MicrolearningComponent;
  let fixture: ComponentFixture<MicrolearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicrolearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicrolearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
