import { Injectable } from '@nestjs/common';
import { movieDto } from './dtos/movie.dto';
import { MovieEntity } from './entities/movie.entity/movie.entity';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/use.entity/user.entity';
import { UserService } from 'src/user/user.service';


@Injectable()
export class MovieService {
    constructor(
        
        @InjectRepository(MovieEntity)
        private movieRepository: Repository<MovieEntity>,    
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private userservice:UserService){}


    async addMovie(newMoviedto :movieDto, user,posterImgLink){
        const Movie = this.movieRepository.create(newMoviedto);
        const director =await this.userservice.getUserById(user);
        Movie.director=director;
        Movie.poster=posterImgLink;
    
        return  await this.movieRepository.save(Movie);;
    }
    async watchMovie( movieId , user){
        const movie = await this.movieRepository.createQueryBuilder("movie").where("movie.id = :movieId",  {movieId}).getOne();
        const loggeduser =await this.userservice.getUserById(user);
        const userwl = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.watchHist", "watchHist")
        .where("user.id = :id", { id: loggeduser.id })
        .getOne();
        if(movie){
            if (userwl.watchHist == undefined){
                userwl.watchHist= new Array<MovieEntity>() ; 
            }
            userwl.watchHist.push(movie);
        }
        movie.views++ ;        
        await this.userRepository.save(userwl);
        return await this.movieRepository.save(movie);
    }
    async getWatchHist(user):Promise<MovieEntity[]>{
        const loggeduser =await this.userservice.getUserById(user);
        const userwl = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.watchHist", "watchHist")
        .where("user.id = :id", { id: loggeduser.id })
        .getOne();
        return userwl.watchHist;

    }
     
    async getWatchList(user):Promise<MovieEntity[]>{
        const loggeduser =await this.userservice.getUserById(user);
        const userwl = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.watchList", "watchList")
        .where("user.id = :id", { id: loggeduser.id })
        .getOne();
        return userwl.watchList;


    }
    async getUploadedMovies(user ):Promise<MovieEntity[]>{
        const loggeduser =await this.userservice.getUserById(user);
        
        const director= await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.uploadedMovies", "uploadedMovies")
        .where("user.id = :id", { id: loggeduser.id })
        .getOne();
        return director.uploadedMovies;
    }

    async addMovieToWatchList(movieToWatchId , user){
        const loggeduser =await this.userservice.getUserById(user);
        const movie = await this.movieRepository.findOne(movieToWatchId);
        const userwl = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.watchList", "watchList")
        .where("user.id = :id", { id: loggeduser.id })
        .getOne();
        if(movie){
            if (userwl.watchList == undefined){
                userwl.watchList= new Array<MovieEntity>() ; 
            }
            userwl.watchList.push(movie);
        }
        await this.userRepository.save(userwl);
    }

    async dropMovieFromWatchList(movieId , user){
        const loggeduser =await this.userservice.getUserById(user);
        const movie = await this.movieRepository.findOne(movieId);
        const userwl = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.watchList", "watchList")
        .where("user.id = :id", { id: loggeduser.id })
        .getOne();
        if(movie){
            if (userwl.watchList == undefined){
                return userwl.watchList;
            }
            userwl.watchList=userwl.watchList.filter(element=>element.id!==movie.id);
        }
        
        await this.userRepository.save(user);
    }
}
