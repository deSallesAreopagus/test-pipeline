import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('board')
  async updateBorad(@Body() body: { workItemId: number; updateValue: string }) {
    const { workItemId, updateValue } = body;
    const result = await this.appService.updateWorkItem(
      workItemId,
      updateValue,
    );
    return result;
  }
}
