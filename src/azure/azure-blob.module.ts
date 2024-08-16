import { Module } from '@nestjs/common';
import { AzureBlobService } from './azure-blob.service';
import { AzureBlobController } from './azure-blob.controller';

@Module({
  providers: [AzureBlobService],
  controllers: [AzureBlobController],
  exports: [AzureBlobService],
})
export class AzureBlobModule {}
