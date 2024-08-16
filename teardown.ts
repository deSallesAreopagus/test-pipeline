import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { AzureBlobService } from './src/azure/azure-blob.service';

dotenv.config();
const azureBlobService = process.env.AZURE_BLOB_STRING
  ? new AzureBlobService()
  : null;

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

  if (!testType) {
    console.error('TEST_TYPE is not defined');
    return;
  }

  if (!azureBlobService) {
    console.log('AZURE_BLOB_STRING is not defined. Skipping upload.');
    return;
  }

  const dirPath = path.join(reportsDir, testType);

  if (fs.existsSync(dirPath)) {
    const latestFile = getLatestFile(dirPath);

    if (latestFile) {
      const filePath = path.join(dirPath, latestFile);
      const data = fs.readFileSync(filePath);

      try {
        await azureBlobService.uploadBlob(latestFile, data);
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
