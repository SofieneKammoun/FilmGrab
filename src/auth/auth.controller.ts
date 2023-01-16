import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post('login')
    login(@Body() Body){
        console.log( Body);

    }
    @Get('login')
    loginTest(){
        return 'you are in the login page : this should be a small form with user name and password and a submit btn : Once you login with the post method you should be redirected to the Home page once the authentification is done'
    }

    @Get('signin')
    signinTest(){
        return 'you are in the SIGNIN page : this should be a small form with user name , email , password and a submit btn : Once you login with the post method you should be redirected to the Home page once the authentification is done'
    }
}
