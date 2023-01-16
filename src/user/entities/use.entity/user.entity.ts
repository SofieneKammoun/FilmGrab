import { MovieEntity } from 'src/movie/entities/movie.entity/movie.entity';
import {Entity ,PrimaryGeneratedColumn , Column,OneToMany,ManyToMany,JoinTable, CreateDateColumn, UpdateDateColumn} from 'typeorm'
@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id : number;
    @Column({
        length: 50
    })
    name: string;
    @Column()
    email : string;
    @Column()
    age : number;
    @OneToMany(
        type =>MovieEntity,
        (Movie) => Movie.director
    )
    uploadedMovies : MovieEntity;
    @ManyToMany(
        () => MovieEntity )
    @JoinTable()
    watchList : MovieEntity[];
    @Column()
    password : String;
    @Column()
    salt : string; 
    @CreateDateColumn()
    createdAt : Date;
    @UpdateDateColumn()
    updatedAt : Date ; 
    


}
