import { Test, TestingModule } from '@nestjs/testing';
import { MapRecordService } from './map_record.service';

describe('MapRecordService', () => {
  let service: MapRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapRecordService],
    }).compile();

    service = module.get<MapRecordService>(MapRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
