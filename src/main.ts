require('dotenv').config()

import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { ApplicationModule } from './modules/app.module'

declare const module: any

async function bootstrap () {
  const fastifyAdapter = new FastifyAdapter({
    logger: process.env.NODE_ENV === 'production'
      ? false
      : {
        prettyPrint: true
      }
  })

  const app = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    fastifyAdapter
  )

  if (Boolean(Number(process.env.USE_SWAGGER))) {
    const options = new DocumentBuilder()
      .setTitle('Title')
      .setDescription('Description')
      .setVersion('0.0.1')
      .addBearerAuth('Authorization', 'header')
      .setContactEmail('email@domain.tld')
      .build()
    const documents = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api', app, documents)//
  }

  app.enableCors()
  await app.listen(3000, '0.0.0.0')

  if (module.hot) {
    module.hot.dispose(() => app.close())
  }
}

// tslint:disable-next-line: no-floating-promises
bootstrap()
  .catch((err) => {
    console.error(err)
  })
  .then(() => {
    if (module.hot) {
      module.hot.accept()
    }
  })
