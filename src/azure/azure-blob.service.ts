import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
  BlobHTTPHeaders,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor() {
    const connectionString = process.env.AZURE_BLOB_STRING;
    const containerName = 'teste';

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient =
      this.blobServiceClient.getContainerClient(containerName);
  }

  async uploadBlob(blobName: string, data: Buffer | Blob | string) {
    const blockBlobClient: BlockBlobClient =
      this.containerClient.getBlockBlobClient(blobName);

    const headers: BlobHTTPHeaders = {
      blobContentDisposition: 'inline',
    };

    await blockBlobClient.upload(data, this.getDataLength(data), {
      blobHTTPHeaders: headers,
    });

    return blockBlobClient.url;
  }

  private getDataLength(data: Buffer | Blob | string): number {
    if (typeof data === 'string') {
      return Buffer.byteLength(data);
    } else if (data instanceof Buffer) {
      return data.length;
    } else if (data instanceof Blob) {
      return data.size;
    } else {
      throw new Error('Unsupported data type');
    }
  }

  async getBlobUrl(blobName: string): Promise<string> {
    const blockBlobClient: BlockBlobClient =
      this.containerClient.getBlockBlobClient(blobName);
    return blockBlobClient.url;
  }
}
