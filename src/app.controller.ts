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
    const linkHtml = `<a href='${blobUrl}'>Log File</a>`;
    const updateValue = `Log uploaded to: ${linkHtml}`;
    const result = await this.appService.updateWorkItem(
      workItemId,
      updateValue,
    );
    return result;
  }

  @Post('update-blob-disposition')
  async updateBlobDisposition(@Body() body: { blobName: string }) {
    const { blobName } = body;
    const leaseId = process.env.AZURE_LEASE_ID;
    await this.azureBlobService.setBlobContentDisposition(
      blobName,
      'inline',
      leaseId,
    );
    return { message: 'Blob content disposition updated successfully.' };
  }
}
