import { Test, TestingModule } from '@nestjs/testing';
import { MapRecordController } from './map_record.controller';
import { MapRecordService } from './map_record.service';

describe('MapRecordController', () => {
  let controller: MapRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapRecordController],
      providers: [MapRecordService],
    }).compile();

    controller = module.get<MapRecordController>(MapRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
