import { TestBed } from '@angular/core/testing';

import { ServicePackage } from './service-package';

describe('ServicePackage', () => {
  let service: ServicePackage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicePackage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
