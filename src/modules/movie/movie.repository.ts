import type { ListMoviesRequest } from "@cinema-platform/contracts/gen/ts/movie";
import { Inject, Injectable } from "@nestjs/common";
import { and, count, desc, eq, gt, isNull, lte, or, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { DRIZZLE_DB } from "@/infrastructure/database/drizzle/drizzle.provider";
import { categories } from "@/infrastructure/database/drizzle/schema/category.schema";
import { movies } from "@/infrastructure/database/drizzle/schema/movie.schema";

@Injectable()
export class MovieRepository {
	public constructor(
		@Inject(DRIZZLE_DB) private readonly db: NodePgDatabase,
	) {}

	public async findAll(filter: ListMoviesRequest) {
		const where = this.buildWhere(filter);
		const orderBy = this.buildOrder(filter);

		const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
		const page = filter.page && filter.page > 0 ? filter.page : 1;
		const offset = filter.random ? 0 : (page - 1) * limit;

		const [rows, [{ total }]] = await Promise.all([
			this.db
				.select({
					id: movies.id,
					title: movies.title,
					slug: movies.slug,
					poster: movies.poster,
					ratingAge: movies.ratingAge,
					releaseDate: movies.releaseDate,
				})
				.from(movies)
				.leftJoin(categories, eq(movies.categoryId, categories.id))
				.where(where)
				.orderBy(orderBy)
				.limit(limit)
				.offset(offset),
			this.db
				.select({ total: count() })
				.from(movies)
				.leftJoin(categories, eq(movies.categoryId, categories.id))
				.where(where),
		]);

		return { rows, total };
	}

	public async findBySlug(slug: string) {
		return this.db
			.select()
			.from(movies)
			.where(eq(movies.slug, slug))
			.limit(1)
			.then(r => r[0] ?? null);
	}

	public async findById(id: string) {
		return this.db
			.select()
			.from(movies)
			.where(eq(movies.id, id))
			.limit(1)
			.then(r => r[0] ?? null);
	}

	private buildWhere(filter: ListMoviesRequest) {
		const now = new Date();

		const conditions = [];

		if (filter.category === "now") {
			conditions.push(lte(movies.releaseDate, now));
		} else if (filter.category === "soon") {
			conditions.push(
				or(gt(movies.releaseDate, now), isNull(movies.releaseDate)),
			);
		} else if (filter.category && filter.category !== "all") {
			conditions.push(eq(categories.slug, filter.category));
		}

		return conditions.length ? and(...conditions) : undefined;
	}

	private buildOrder(filter: ListMoviesRequest) {
		if (filter.random) {
			return sql`RANDOM()`;
		}

		return desc(movies.releaseDate);
	}
}
