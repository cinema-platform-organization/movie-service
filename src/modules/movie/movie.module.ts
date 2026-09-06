import { Module } from "@nestjs/common";

import { MovieCacheService } from "./movie.cache.service";
import { MovieController } from "./movie.controller";
import { MovieRepository } from "./movie.repository";
import { MovieService } from "./movie.service";

@Module({
	controllers: [MovieController],
	providers: [MovieService, MovieRepository, MovieCacheService],
})
export class MovieModule {}
