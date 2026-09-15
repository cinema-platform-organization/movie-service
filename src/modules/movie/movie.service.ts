import { RpcStatus } from "@cinema-platform/common";
import {
	CreateMovieRequest,
	GetMovieRequest,
	GetMovieResponse,
	ListMoviesRequest,
	ListMoviesResponse,
	UpdateMovieRequest,
} from "@cinema-platform/contracts/gen/ts/movie";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { ScreeningClientGrpc } from "@/clients/screening-client.grpc";
import { CategoryRepository } from "@/modules/category/category.repository";

import { MovieCacheKeys } from "./movie.cache.keys";
import { MovieCacheService } from "./movie.cache.service";
import { MovieMapper } from "./movie.mapper";
import { MovieRepository } from "./movie.repository";

@Injectable()
export class MovieService {
	public constructor(
		private readonly movieRepository: MovieRepository,
		private readonly movieCacheService: MovieCacheService,
		private readonly categoryRepository: CategoryRepository,
		private readonly screeningClient: ScreeningClientGrpc,
	) {}

	public async getAll(data: ListMoviesRequest): Promise<ListMoviesResponse> {
		const filter = {
			category: data.category ?? undefined,
			random: data.random === true,
			limit: data.limit > 0 ? data.limit : 20,
			page: data.random ? 1 : data.page > 0 ? data.page : 1,
		};

		const cached =
			await this.movieCacheService.getAll<ListMoviesResponse>(filter);

		if (cached) {
			return cached;
		}

		const { rows, total } = await this.movieRepository.findAll(filter);
		const mapped = rows.map(movie => MovieMapper.toMovie(movie));

		const response: ListMoviesResponse = { movies: mapped, total };

		await this.movieCacheService.setAll(filter, response);

		return response;
	}

	public async getOne(data: GetMovieRequest) {
		const cacheKey = data.id
			? MovieCacheKeys.byId(data.id)
			: MovieCacheKeys.bySlug(data.slug);

		const cached =
			await this.movieCacheService.get<GetMovieResponse["movie"]>(
				cacheKey,
			);

		if (cached) {
			return { movie: cached };
		}

		const movie = data.id
			? await this.movieRepository.findById(data.id)
			: await this.movieRepository.findBySlug(data.slug);

		if (!movie) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Movie not found",
			});
		}

		const mapped = MovieMapper.toMovie(movie);

		await this.movieCacheService.set(cacheKey, mapped);

		return { movie: mapped };
	}

	public async create(data: CreateMovieRequest) {
		if (data.categoryId) {
			const category = await this.categoryRepository.findById(
				data.categoryId,
			);

			if (!category) {
				throw new RpcException({
					code: RpcStatus.NOT_FOUND,
					details: "Category not found",
				});
			}
		}

		const movie = await this.movieRepository.create({
			title: data.title,
			slug: data.slug,
			description: data.description,
			poster: data.poster,
			banner: data.banner,
			duration: data.duration,
			releaseYear: data.releaseYear,
			releaseDate: MovieMapper.fromTimestamp(data.releaseDate),
			ratingAge: data.ratingAge,
			country: data.country,
			categoryId: data.categoryId,
		});

		return { movie: MovieMapper.toMovie(movie) };
	}

	public async update(data: UpdateMovieRequest) {
		const existing = await this.movieRepository.findById(data.id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Movie not found",
			});
		}

		if (data.categoryId !== undefined) {
			const category = await this.categoryRepository.findById(
				data.categoryId,
			);

			if (!category) {
				throw new RpcException({
					code: RpcStatus.NOT_FOUND,
					details: "Category not found",
				});
			}
		}

		const patch: Partial<{
			title: string;
			slug: string;
			description: string;
			poster: string;
			banner: string;
			duration: number;
			releaseYear: number;
			releaseDate: Date;
			ratingAge: number;
			country: string;
			categoryId: string;
		}> = {};

		if (data.title !== undefined) {
			patch.title = data.title;
		}
		if (data.slug !== undefined) {
			patch.slug = data.slug;
		}
		if (data.description !== undefined) {
			patch.description = data.description;
		}
		if (data.poster !== undefined) {
			patch.poster = data.poster;
		}
		if (data.banner !== undefined) {
			patch.banner = data.banner;
		}
		if (data.duration !== undefined) {
			patch.duration = data.duration;
		}
		if (data.releaseYear !== undefined) {
			patch.releaseYear = data.releaseYear;
		}
		if (data.releaseDate) {
			patch.releaseDate = MovieMapper.fromTimestamp(data.releaseDate);
		}
		if (data.ratingAge !== undefined) {
			patch.ratingAge = data.ratingAge;
		}
		if (data.country !== undefined) {
			patch.country = data.country;
		}
		if (data.categoryId !== undefined) {
			patch.categoryId = data.categoryId;
		}

		const updated = await this.movieRepository.update(data.id, patch);

		if (!updated) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Movie not found",
			});
		}

		await this.invalidateCache(updated);

		return { movie: MovieMapper.toMovie(updated) };
	}

	public async delete(id: string) {
		const existing = await this.movieRepository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Movie not found",
			});
		}

		const { hasScreenings } =
			await this.screeningClient.hasUpcomingForMovie({ movieId: id });

		if (hasScreenings) {
			throw new RpcException({
				code: RpcStatus.FAILED_PRECONDITION,
				details: "Cannot delete movie with upcoming screenings",
			});
		}

		await this.movieRepository.delete(id);

		await this.invalidateCache(existing);

		return { ok: true };
	}

	private async invalidateCache(movie: { id: string; slug: string | null }) {
		await Promise.all([
			this.movieCacheService.delete(MovieCacheKeys.byId(movie.id)),
			movie.slug
				? this.movieCacheService.delete(
						MovieCacheKeys.bySlug(movie.slug),
					)
				: Promise.resolve(),
		]);
	}
}
