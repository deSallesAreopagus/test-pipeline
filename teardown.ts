import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { AzureBlobService } from './src/azure/azure-blob.service';
import { AppService } from './src/app.service';
import { HttpService } from '@nestjs/axios';

dotenv.config();

const azureBlobService = process.env.AZURE_BLOB_STRING
  ? new AzureBlobService()
  : null;
const httpService = new HttpService();

function getLatestFile(dir: string): string | null {
  const files = fs.readdirSync(dir);

  if (files.length === 0) {
    return null;
  }

  files.sort((a, b) => {
    const aTime = fs.statSync(path.join(dir, a)).mtime.getTime();
    const bTime = fs.statSync(path.join(dir, b)).mtime.getTime();
    return bTime - aTime;
  });

  return files[0];
}

export default async () => {
  const reportsDir = path.join(__dirname, 'reports');
  const testType = process.env.TEST_TYPE;
  const ciEnvironment = process.env.TF_BUILD;

  if (!testType) {
    console.error('TEST_TYPE is not defined');
    return;
  }

  if (!azureBlobService || !ciEnvironment) {
    console.log('AZURE_BLOB_STRING is not defined. Skipping upload.');
    return;
  }

  const dirPath = path.join(reportsDir, testType);

  if (fs.existsSync(dirPath)) {
    const latestFile = getLatestFile(dirPath);

    if (latestFile) {
      const filePath = path.join(dirPath, latestFile);
      const data = fs.readFileSync(filePath);
      const branchName = process.env.BRANCH_NAME || 'main';
      const blobName = `${branchName}/${testType}/${latestFile}`;

      try {
        await azureBlobService.uploadBlob(blobName, data);
        console.log(`File ${latestFile} uploaded successfully as ${blobName}`);
        const blobUrl = await azureBlobService.getBlobUrl(blobName);
        const linkHtml = `<a href=${blobUrl}>${testType} test log: ${blobName}`;
        const updateValue = `Log uploaded to: ${linkHtml}`;
        const result = await new AppService(httpService).updateWorkItem(
          7,
          updateValue,
        );
        return result;
      } catch (error) {
        console.error(`Error uploading file: ${error}`);
      }
    } else {
      console.log(`No log files found in ${dirPath}`);
    }
  } else {
    console.log(`Directory ${dirPath} does not exist`);
  }
};
