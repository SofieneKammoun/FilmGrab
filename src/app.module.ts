import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [AuthModule, UserModule, MovieModule, TypeOrmModule.forRoot(
    {type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'filmgrabdb',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
