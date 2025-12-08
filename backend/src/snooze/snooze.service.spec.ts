import { Test, TestingModule } from '@nestjs/testing';
import { SnoozeService } from './snooze.service';

describe('SnoozeService', () => {
  let service: SnoozeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnoozeService],
    }).compile();

    service = module.get<SnoozeService>(SnoozeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
