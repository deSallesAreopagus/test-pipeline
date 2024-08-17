import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private organizationUrl: string = `https://dev.azure.com/${process.env.AZURE_ORGANIZATION}`;
  private project: string = 'treinamento_areopagus';
  private apiVersion: string = '6.0';
  private pat: string = process.env.AZURE_DEVOPS_PAT;

  constructor(private readonly httpService: HttpService) {}

  private getAuthHeader() {
    const token = Buffer.from(`:${this.pat}`).toString('base64');
    return { Authorization: `Basic ${token}` };
  }

  async updateWorkItem(workItemId: number, updateValue: string) {
    const url = `${this.organizationUrl}/${this.project}/_apis/wit/workitems/${workItemId}?api-version=${this.apiVersion}`;

    const fields = [
      {
        op: 'add',
        path: '/fields/System.History',
        value: updateValue,
      },
    ];

    const response = await lastValueFrom(
      this.httpService.patch(url, fields, {
        headers: {
          ...this.getAuthHeader(),
          'Content-Type': 'application/json-patch+json',
        },
      }),
    );

    return response.data;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
