import { TestBed } from '@angular/core/testing';

import { PDFMakeService } from './pdfmake.service';

describe('PDFMakeService', () => {
  let service: PDFMakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PDFMakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
