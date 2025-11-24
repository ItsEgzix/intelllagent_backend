import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

let app: NestExpressApplication;

async function bootstrap() {
  try {
    console.log('🔄 Starting bootstrap...');

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'uploads', 'avatars');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
    console.log('✅ Uploads directory ready');

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

    // Serve static files from uploads directory
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
      setHeaders: (res) => {
        res.set(
          'Access-Control-Allow-Origin',
          process.env.FRONTEND_URL || 'http://localhost:3000',
        );
        res.set('Access-Control-Allow-Credentials', 'true');
      },
    });
    console.log('✅ Static assets configured');

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
    const uploadsDir = join(process.cwd(), 'uploads', 'avatars');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      exposedHeaders: ['Content-Type', 'Content-Length'],
    });
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
      setHeaders: (res) => {
        res.set(
          'Access-Control-Allow-Origin',
          process.env.FRONTEND_URL || 'http://localhost:3000',
        );
        res.set('Access-Control-Allow-Credentials', 'true');
      },
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
