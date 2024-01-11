import { Test, TestingModule } from '@nestjs/testing';
import { MemorialDayService } from './memorial_day.service';

describe('MemorialDayService', () => {
  let service: MemorialDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemorialDayService],
    }).compile();

    service = module.get<MemorialDayService>(MemorialDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
