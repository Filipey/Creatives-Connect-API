import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Neo4JExceptionFilter } from './common/filters/neo4j-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new Neo4JExceptionFilter());
  await app.listen(process.env.APPLICATION_PORT || '3000');
}
bootstrap();
