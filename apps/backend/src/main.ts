import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

async function bootstrap() {
  // For development: bypass SSL verification for R2
  if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('⚠️  SSL verification disabled for development');
  }

  const app = await NestFactory.create(AppModule);
  
  // Enable GraphQL file upload (before any other middleware)
  app.use(graphqlUploadExpress({ maxFileSize: 25 * 1024 * 1024, maxFiles: 10 }));
  
  // Enable CORS — allow Vercel frontend + localhost dev
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, health checks)
      if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend API running on: http://localhost:${port}`);
  console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
}

bootstrap();
