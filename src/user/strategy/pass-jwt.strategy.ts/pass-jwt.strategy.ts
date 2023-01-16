import { Injectable ,UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from "src/user/entities/use.entity/user.entity";
import { LoginDto } from "src/user/dtos/logindto.ts/logindto.dto";

@Injectable()
export class PassJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
       
        @InjectRepository(UserEntity)
        private userRep: Repository<UserEntity>
      ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: true,
          secretOrKey: "SECRETkeyTest",
        });
      }
      
  async validate(payload : LoginDto) {
    const name = payload.username;
    const user = await this.userRep.createQueryBuilder("user").where("user.name = :name",  {name}).getOne();
    if (user) {
      delete user.salt;
      delete user.password;
      return user;
    } else {
    
      throw new UnauthorizedException();
    }
}
}
