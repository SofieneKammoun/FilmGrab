import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('home')
  HomePage(){
    return 'home Page :  main header , all movie list , login & sign in buttons || if logged in add users watch list , and the upload button  '
  }
}
