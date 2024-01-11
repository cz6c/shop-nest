import { Test, TestingModule } from '@nestjs/testing';
import { MemorialDayController } from './memorial_day.controller';
import { MemorialDayService } from './memorial_day.service';

describe('MemorialDayController', () => {
  let controller: MemorialDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemorialDayController],
      providers: [MemorialDayService],
    }).compile();

    controller = module.get<MemorialDayController>(MemorialDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
