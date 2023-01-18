import { Module ,MiddlewareConsumer} from '@nestjs/common';
import {MulterModule} from '@nestjs/platform-express'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ UserModule, MovieModule, TypeOrmModule.forRoot(
    {type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'filmgrabdb',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true}), 
  MulterModule.register({ 
    dest: './upload',
    preservePath: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
