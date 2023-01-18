import { BadRequestException, Injectable } from '@nestjs/common';
import { movieDto } from './dtos/movie.dto';
import { MovieEntity } from './entities/movie.entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/use.entity/user.entity';
import { UserService } from 'src/user/user.service';
import * as cloudinary from 'cloudinary';
import { ConflictException } from '@nestjs/common/exceptions';

cloudinary.v2.config({
    cloud_name: 'daakvwjhq',
    api_key: '923316843372482',
    api_secret: '3j1HiXhM1P1l0juYJE1_WSIyrBo'
});
@Injectable()
export class MovieService {
    constructor(

        @InjectRepository(MovieEntity)
        private movieRepository: Repository<MovieEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private userservice: UserService) { }




    async addMovie(newMoviedto: movieDto, user, posterPath) {

        const samemovie = await this.movieRepository
            .createQueryBuilder("movie")
            .where("movie.name = :movieName", { movieName: newMoviedto.name })
            .andWhere("movie.year = :movieYear", { movieYear: newMoviedto.year }).getOne();
        if (samemovie) {
            throw new ConflictException('this movie already exist , you can not have two movies with the same name and year')
        } else {
            const Movie = this.movieRepository.create(newMoviedto);
            const result = await cloudinary.v2.uploader.upload(posterPath, {
                public_id: `${Movie.name}_${Movie.id}_poster`,
                width: 297,
                height: 434,
                crop: 'fill'
            });
            const director = await this.userservice.getUserById(user);
            Movie.director = director;
            Movie.poster = result.secure_url;

            return await this.movieRepository.save(Movie);
        }
    }
    async watchMovie(movieId, user) {
        const movie = await this.movieRepository.createQueryBuilder("movie").where("movie.id = :movieId", { movieId }).getOne();
        const loggeduser = await this.userservice.getUserById(user);
        const userwh = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.watchHist", "watchHist")
            .where("user.id = :id", { id: loggeduser.id })
            .getOne();
        const userwl = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.watchList", "watchList")
            .where("user.id = :id", { id: loggeduser.id })
            .getOne();
        if (movie) {
            if (userwh.watchHist == undefined) {
                userwh.watchHist = new Array<MovieEntity>();
            }
            if (userwl.watchList.find(m => m.id === movie.id)) {
                this.dropMovieFromWatchList(movie.id, user);
            }
            if (!userwh.watchHist.find(m => m.id === movie.id)) {
                userwh.watchHist.push(movie)
            }
            movie.views++;

        }
        
        await this.userRepository.save(userwh);

        return await this.movieRepository.save(movie);
    }
    async getWatchHist(user): Promise<MovieEntity[]> {
        const loggeduser = await this.userservice.getUserById(user);
        const userwl = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.watchHist", "watchHist")
            .where("user.id = :id", { id: loggeduser.id })
            .getOne();
        return userwl.watchHist;

    }

    async getWatchList(user): Promise<MovieEntity[]> {
        const loggeduser = await this.userservice.getUserById(user);
        const userwl = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.watchList", "watchList")
            .where("user.id = :id", { id: loggeduser.id })
            .getOne();
        return userwl.watchList;


    }
    async getUploadedMovies(user): Promise<MovieEntity[]> {
        const loggeduser = await this.userservice.getUserById(user);

        const director = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.uploadedMovies", "uploadedMovies")
            .where("user.id = :id", { id: loggeduser.id })
            .getOne();
        return director.uploadedMovies;
    }

    async addMovieToWatchList(movieToWatchId, user) {
        const loggeduser = await this.userservice.getUserById(user);
        const movie = await this.movieRepository.createQueryBuilder("movie").where("movie.id = :movieId", { movieId: movieToWatchId }).getOne();
        const userwl = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.watchList", "watchList")
            .where("user.id = :id", { id: loggeduser.id })
            .getOne();
        if (movie) {
            if (userwl.watchList == undefined) {
                userwl.watchList = new Array<MovieEntity>();
            }
            if (userwl.watchList.find(m => m.id === movie.id)) {
                throw new BadRequestException('movie already in watch List ')
            } else {
                userwl.watchList.push(movie);
            }
        }
        await this.userRepository.save(userwl);
    }

    async dropMovieFromWatchList(movieId, user) {
        const loggeduser = await this.userservice.getUserById(user);
        const movie = await this.movieRepository.createQueryBuilder("movie").where("movie.id = :movieId", { movieId: movieId }).getOne();
        const userwl = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.watchList", "watchList")
            .where("user.id = :id", { id: loggeduser.id })
            .getOne();
        if (movie) {
            if (userwl.watchList == undefined) {
                return userwl.watchList;
            }
            userwl.watchList = userwl.watchList.filter(element => element.id !== movie.id);
        }

        await this.userRepository.save(userwl);
    }
    async getAllMovies(): Promise<MovieEntity[]> {
        const movies = await this.movieRepository
            .createQueryBuilder('movie')
            .orderBy('movie.views', 'DESC')
            .getMany();
        return movies

    }
}
