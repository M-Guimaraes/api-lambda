import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Handler, Context, APIGatewayProxyResult } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { Server } from 'http';
import { AppModule } from './app.module';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

function setupSwagger(app: INestApplication) {
  const { STAGE, NODE_ENV } = process.env;
  const serverUrl = `/${STAGE ?? NODE_ENV}`;

  const options = new DocumentBuilder()
    .setTitle('api-lambda-serverless')
    .setVersion('1.0.0')
    .addServer(serverUrl)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap(): Promise<Server> {
  if (!cachedServer) {
    try {
      const expressApp = express();
      const adapter = new ExpressAdapter(expressApp);
      const app = await NestFactory.create(AppModule, adapter);

      app.use(eventContext());
      app.use(express.json({ limit: '50mb' }));
      app.use(express.urlencoded({ limit: '50mb', extended: true }));
      app.useGlobalPipes(new ValidationPipe({ transform: true }));

      if (process.env.STAGE !== 'prd') {
        setupSwagger(app);
      }

      await app.init();
      cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.resolve(cachedServer);
}

export const handler: Handler = async (
  event,
  context: Context,
): Promise<APIGatewayProxyResult | string> => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return 'WarmUP - Lambda is warm!';
  }

  if (event.path === '/api') {
    event.path = '/api/';
  }
  event.path = event.path.includes('swagger-ui')
    ? `/api${event.path}`
    : event.path;

  cachedServer = await bootstrap();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
