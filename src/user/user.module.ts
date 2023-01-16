import { Module } from '@nestjs/common';
import { UserEntity } from './entities/use.entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PassJwtStrategy } from './strategy/pass-jwt.strategy.ts/pass-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
        secret: "SECRETkeyTest"
      })
  ],
  controllers: [UserController],
  providers: [UserService , PassJwtStrategy] 
})
export class UserModule {}
