import { Module } from '@nestjs/common';
import { Neo4JModule } from 'src/database/database.module';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { PostsRepository } from './repositories/posts.repository';

@Module({
  imports: [Neo4JModule],
  providers: [PostsRepository, PostsService, PostsResolver],
})
export class PostsModule {}
