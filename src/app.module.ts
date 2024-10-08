import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestesModule } from './testes/testes.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AzureBlobModule } from './azure/azure-blob.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TestesModule,
    AzureBlobModule,
    HttpModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
