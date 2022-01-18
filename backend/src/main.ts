import 'dotenv/config.js'
import { NestFactory } from '@nestjs/core'
import  cookieParser from 'cookie-parser'
import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  )
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin: [process.env.FE_URL, 'https://grade-book-app-abc.vercel.app'],
  })

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: "header"
        },
        'access-token',
      )
      .setTitle('Grade Book API')
      .setVersion('0.1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(8000)
}

bootstrap()
