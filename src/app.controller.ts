import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AzureBlobService } from './azure/azure-blob.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  @Post('update-board')
  async updateBoard(@Body() body: { workItemId: number; blobName: string }) {
    const { workItemId, blobName } = body;
    const blobUrl = await this.azureBlobService.getBlobUrl(blobName);
    const linkHtml = `<a href='${blobUrl}'>Log File: ${blobName}</a>`;
    const updateValue = `Log uploaded to: ${linkHtml}`;
    const result = await this.appService.updateWorkItem(
      workItemId,
      updateValue,
    );
    return result;
  }
}
