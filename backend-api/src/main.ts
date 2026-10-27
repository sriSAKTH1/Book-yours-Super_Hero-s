import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = (process.env.FRONTEND_ORIGINS ?? 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const port = Number(process.env.PORT ?? 4000)
  await app.listen(port, '127.0.0.1')
  console.log(`NestJS API running at http://127.0.0.1:${port}`)
}

await bootstrap();
