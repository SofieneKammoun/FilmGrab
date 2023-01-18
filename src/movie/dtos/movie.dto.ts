import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsUrl } from "class-validator";
import { Unique } from "typeorm";
import { genre } from "../genre.enum";

export class movieDto {
  @IsNotEmpty()
  @Unique(['name','year'])
  name: String;
  @IsNotEmpty()
  synopsis: String;
  @IsNotEmpty()
  @IsUrl(undefined, {
    message:
      'movie url should be a google drive link.',
  })
  movieLink: string;
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Unique(['name','year'])
  year: number;
  @IsNotEmpty()
  movieGenre: genre;


}