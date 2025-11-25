import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

let app: NestExpressApplication;

async function bootstrap() {
  try {
    console.log('🔄 Starting bootstrap...');

    console.log('🔄 Creating NestJS application...');
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    console.log('✅ NestJS application created');

    // Enable CORS for frontend
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      exposedHeaders: ['Content-Type', 'Content-Length'],
    });
    console.log('✅ CORS enabled');

    // Enable validation (skip for multipart/form-data routes)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: false,
        skipNullProperties: false,
        skipUndefinedProperties: false,
      }),
    );
    console.log('✅ Validation pipes configured');

    const port = process.env.PORT ?? 3001;
    console.log(`🔄 Starting server on port ${port}...`);
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);

    return app;
  } catch (error) {
    console.error('❌ Error in bootstrap:', error);
    throw error;
  }
}

// For Vercel serverless
export const handler = async (req: any, res: any) => {
  if (!app) {
    // For serverless, we need to init but not listen
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      exposedHeaders: ['Content-Type', 'Content-Length'],
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        skipMissingProperties: false,
        skipNullProperties: false,
        skipUndefinedProperties: false,
      }),
    );
    await app.init();
  }
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};

// Start the application
bootstrap()
  .then((app) => {
    console.log('✅ Server started successfully');
  })
  .catch((error) => {
    console.error('❌ Error starting server:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  });
