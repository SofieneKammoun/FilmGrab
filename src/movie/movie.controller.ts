import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post,Get, Req  } from '@nestjs/common';
import { Body, Param, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { movieDto } from './dtos/movie.dto';
import { MovieEntity } from './entities/movie.entity/movie.entity';
import { MovieService } from './movie.service';
import * as cloudinary from 'cloudinary';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/user/Guard/authGuard';
import { ConsoleLogger } from '@nestjs/common/services';
import { Console } from 'console';
import { diskStorage, Multer } from 'multer';

cloudinary.v2.config({
  cloud_name: 'daakvwjhq',
  api_key: '923316843372482',
  api_secret: '3j1HiXhM1P1l0juYJE1_WSIyrBo'
});
@UseGuards(JwtAuthGuard)
@Controller('movie')
export class MovieController {
    constructor(private movieServices : MovieService){}
  

    @Post('add')
    @UseInterceptors(FileInterceptor('poster', {
      storage: diskStorage({
        destination: './upload/posterimage'})
    }))
    async  addMovie(
        @Body() mDto : movieDto , 
        @Req() req:Request,
        @UploadedFile(
           
          )poster ,
    ): Promise<MovieEntity>{
      
      const user = req.user;
      const result = await cloudinary.v2.uploader.upload(poster.path, {
        public_id:`${mDto.name}_poster`,
        width : 297,
        height : 434 ,
        crop : 'fill'
      });
        console.log(result.secure_url)
       
        return this.movieServices.addMovie(mDto,user ,result.secure_url);
    }
    @Get('watch/:id')
    @UsePipes(ValidationPipe)
    WatchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Req() req:Request): Promise<MovieEntity>{
      const user = req.user;
      return this.movieServices.watchMovie(id,user);
    }

    @Get('watchlist')
    userWatchlist(@Req() req:Request):Promise<MovieEntity[]>{
        const user = req.user;
        return this.movieServices.getWatchList(user);
    }
    
    @Get('watchhist')
    userWatchHist(@Req() req:Request):Promise<MovieEntity[]>{
        const user = req.user;
        return this.movieServices.getWatchHist(user);
    }
    
    @Get('uploaded')
    userUploadedMovies(@Req() req:Request):Promise<MovieEntity[]>{
        const user = req.user;
        return this.movieServices.getUploadedMovies(user);
    }
    @Post('WatchListadd/:id')
    @UsePipes(ValidationPipe)
    addMovieToWatchList(
    @Param('id', ParseIntPipe) id: number,
    @Req() req:Request){
      const user = req.user;
      return this.movieServices.addMovieToWatchList(id,user);
    }
  
    @Post('WatchListdrop/:id')
    @UsePipes(ValidationPipe)
    dropMovieFromWatchList(
    @Param('id', ParseIntPipe) id: number,
    @Req() req:Request){
      const user = req.user;
      return this.movieServices.dropMovieFromWatchList(id,user);
    }
  

}
