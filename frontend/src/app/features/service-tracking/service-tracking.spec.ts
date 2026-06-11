import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTracking } from './service-tracking';

describe('ServiceTracking', () => {
  let component: ServiceTracking;
  let fixture: ComponentFixture<ServiceTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTracking],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceTracking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
