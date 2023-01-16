import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './user/Guard/authGuard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(JwtAuthGuard)
  @Get('home')
  HomePage(){
    return 'home Page :  main header , all movie list , login & sign in buttons || if logged in add users watch list , and the upload button  '
  }

}
