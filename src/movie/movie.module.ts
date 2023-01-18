import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity/movie.entity';
import { UserEntity } from 'src/user/entities/use.entity/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([MovieEntity,UserEntity]), 
          
          UserModule],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule {}
