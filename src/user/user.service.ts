import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/logindto.ts/logindto.dto';
import { UserEntity } from './entities/use.entity/user.entity';
import * as bcrypt from  "bcrypt";
import { SigninDto } from './dtos/logindto.ts/signinDto.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
         private userRep : Repository<UserEntity>, 
         private jwtservice : JwtService
    ){}
    async Signin(userSignin: SigninDto): Promise<Partial<UserEntity>> {
        const user = this.userRep.create({
          ...userSignin
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        
        await this.userRep.save(user);
        
        return {
            id: user.id,
            name: user.name,
            email: user.email,
           
          };
        }
    
    async login (userlogin : LoginDto) {
        const {username , password}=userlogin;
        const user = await this.userRep.createQueryBuilder("user").where("user.name = :username",  {username}).getOne();
        const hashedpassword = await bcrypt.hash(user.password, user.salt);
        
    if (!user)
    throw new NotFoundException('wrong credentials');

    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword === user.password) {
      const payload = {
        username: user.name,
        email: user.email,
      };
      const jwt = await this.jwtservice.sign(payload);
      return {
      "access_token" : jwt
      }
    } else {
      throw new NotFoundException('wrong credentials');
    }
    
    
}   
 async getUserById(user) : Promise<UserEntity> {
  const userId= user.id;
  return await this.userRep.createQueryBuilder("user").where("user.id = :userId",  {userId}).getOne();
  
 }

}
