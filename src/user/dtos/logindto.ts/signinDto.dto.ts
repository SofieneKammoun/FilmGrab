import { IsEmail, isIn, IsNotEmpty } from 'class-validator';
export class SigninDto {
    @IsNotEmpty()
    name : string;
     
    @IsNotEmpty()
    @IsEmail()
    email : string; 

    @IsNotEmpty()
    password : string;

    @IsNotEmpty()
    age : number;





}