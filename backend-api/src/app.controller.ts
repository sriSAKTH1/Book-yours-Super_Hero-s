import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'Superhero HQ Submission API',
      timestamp: new Date().toISOString(),
    };
  }
}
