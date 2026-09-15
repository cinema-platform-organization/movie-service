import type {
	CreateMovieRequest,
	DeleteMovieRequest,
	GetMovieRequest,
	GetMovieResponse,
	ListMoviesRequest,
	ListMoviesResponse,
	UpdateMovieRequest,
} from "@cinema-platform/contracts/gen/ts/movie";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { MovieService } from "./movie.service";

@Controller()
export class MovieController {
	public constructor(private readonly movieService: MovieService) {}

	@GrpcMethod("MovieService", "ListMovies")
	public async list(data: ListMoviesRequest): Promise<ListMoviesResponse> {
		return await this.movieService.getAll(data);
	}

	@GrpcMethod("MovieService", "GetMovie")
	public async getOne(data: GetMovieRequest): Promise<GetMovieResponse> {
		return await this.movieService.getOne(data);
	}

	@GrpcMethod("MovieService", "CreateMovie")
	public async create(data: CreateMovieRequest) {
		return this.movieService.create(data);
	}

	@GrpcMethod("MovieService", "UpdateMovie")
	public async update(data: UpdateMovieRequest) {
		return this.movieService.update(data);
	}

	@GrpcMethod("MovieService", "DeleteMovie")
	public async delete(data: DeleteMovieRequest) {
		return this.movieService.delete(data.id);
	}
}
