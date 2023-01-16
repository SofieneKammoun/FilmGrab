import { Injectable } from '@nestjs/common';
import { movieDto } from './dtos/movie.dto';
import { MovieEntity } from './entities/movie.entity/movie.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(MovieEntity)
        private movieRepository: Repository<MovieEntity>,    ){}
    addMovie(newMoviedto :movieDto){
        const Movie = this.movieRepository.create(newMoviedto);
     // const {name , synopsis, poster , movieLink}=newMoviedto;
        this.movieRepository.save(Movie);
        return Movie;
    }
}
