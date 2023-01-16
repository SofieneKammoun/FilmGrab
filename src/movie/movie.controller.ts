import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { movieDto } from './dtos/movie.dto';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
    constructor(private movieServices : MovieService){}
    @Post('add')
    addMovie(
        @Body() mDto : movieDto
    ){
        return this.movieServices.addMovie(mDto);
    }
}
