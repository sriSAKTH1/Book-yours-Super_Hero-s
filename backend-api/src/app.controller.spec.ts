import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('returns the API health status and timestamp', () => {
      const health = appController.getHealth();

      expect(health.status).toBe('ok');
      expect(health.service).toBe('Superhero HQ Submission API');
      expect(new Date(health.timestamp).toISOString()).toBe(health.timestamp);
    });
  });
});
