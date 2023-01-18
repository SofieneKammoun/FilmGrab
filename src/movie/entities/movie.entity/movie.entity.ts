
import { IsUrl } from 'class-validator';
import { genre } from '../../genre.enum';
import { UserEntity } from 'src/user/entities/use.entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'

@Entity('movie')
export class MovieEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: String;

    @Column({
        type: 'enum',
        enum: genre,
    })
    movieGenre: genre;


    @ManyToOne(
        type => UserEntity,
        (user) => user.uploadedMovies
    )
    director: UserEntity;

    @Column({
        length: 500
    })
    synopsis: String;

    @Column()
    year: number;

    @Column()
    poster: String;

    @Column()
    views: number;

    @Column()
    movieLink: String;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}
