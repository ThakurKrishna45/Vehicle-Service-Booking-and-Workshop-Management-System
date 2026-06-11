import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStatus } from './manage-status';

describe('ManageStatus', () => {
  let component: ManageStatus;
  let fixture: ComponentFixture<ManageStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
