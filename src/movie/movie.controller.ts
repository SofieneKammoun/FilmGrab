import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, Get, Req } from '@nestjs/common';
import { Body, Param, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { movieDto } from './dtos/movie.dto';
import { MovieEntity } from './entities/movie.entity/movie.entity';
import { MovieService } from './movie.service';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/user/Guard/authGuard';
import { diskStorage, Multer } from 'multer';
import { DriveLinkPipePipe } from 'src/pipes/drive-link-pipe/drive-link-pipe.pipe';

@UseGuards(JwtAuthGuard)
@Controller('movie')
export class MovieController {
  constructor(private movieServices: MovieService) { }


  @Post('add')
  @UseInterceptors(FileInterceptor('poster', {
    storage: diskStorage({
      destination: './upload/posterimage'
    })
  }))
  async addMovie(
    @Body(DriveLinkPipePipe) mDto: movieDto,
    @Req() req: Request,
    @UploadedFile(

    ) poster,
  ): Promise<MovieEntity> {

    const user = req.user;
   
    return this.movieServices.addMovie(mDto, user, poster.path);
  }
  @Get('watch/:id')
  @UsePipes(ValidationPipe)
  WatchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request): Promise<MovieEntity> {
    const user = req.user;
    return this.movieServices.watchMovie(id, user);
  }

  @Get('watchlist')
  userWatchlist(@Req() req: Request): Promise<MovieEntity[]> {
    const user = req.user;
    return this.movieServices.getWatchList(user);
  }

  @Get('watchhist')
  userWatchHist(@Req() req: Request): Promise<MovieEntity[]> {
    const user = req.user;
    return this.movieServices.getWatchHist(user);
  }

  @Get('uploaded')
  userUploadedMovies(@Req() req: Request): Promise<MovieEntity[]> {
    const user = req.user;
    return this.movieServices.getUploadedMovies(user);
  }
  @Post('WatchListadd/:id')
  @UsePipes(ValidationPipe)
  addMovieToWatchList(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request) {
    const user = req.user;
    return this.movieServices.addMovieToWatchList(id, user);
  }

  @Post('WatchListdrop/:id')
  @UsePipes(ValidationPipe)
  dropMovieFromWatchList(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request) {
    const user = req.user;
    return this.movieServices.dropMovieFromWatchList(id, user);
  }
  @Get('all')
  getallmovies(): Promise<MovieEntity[]> {
    return this.movieServices.getAllMovies();
  }


}
