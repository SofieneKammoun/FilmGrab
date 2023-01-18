import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request, request } from 'express';
import { LoginDto } from './dtos/logindto.ts/logindto.dto';
import { SigninDto } from './dtos/logindto.ts/signinDto.dto';
import { UserService } from './user.service';

@Controller('userauth')
export class UserController {
constructor(
    private userService: UserService
  ) {
  }
  @Post('signin')
  Signin(
    @Body() userData: SigninDto
  ) {
    return this.userService.Signin(userData);
  }

  @Post('login')
  login(
    @Body() userlogin: LoginDto
  ) {
    return this.userService.login(userlogin);
  }
 
}