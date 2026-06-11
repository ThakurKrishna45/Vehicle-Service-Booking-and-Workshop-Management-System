import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTimeline } from './service-timeline';

describe('ServiceTimeline', () => {
  let component: ServiceTimeline;
  let fixture: ComponentFixture<ServiceTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTimeline],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
