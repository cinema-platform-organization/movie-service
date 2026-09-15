import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { DRIZZLE_DB } from "@/infrastructure/database/drizzle/drizzle.provider";
import { categories } from "@/infrastructure/database/drizzle/schema/category.schema";
import { movies } from "@/infrastructure/database/drizzle/schema/movie.schema";

@Injectable()
export class CategoryRepository {
	public constructor(
		@Inject(DRIZZLE_DB) private readonly db: NodePgDatabase,
	) {}

	public async findAll() {
		return await this.db
			.select({
				id: categories.id,
				title: categories.title,
				slug: categories.slug,
			})
			.from(categories)
			.orderBy(desc(categories.createdAt));
	}

	public async findById(id: string) {
		const rows = await this.db
			.select({
				id: categories.id,
				title: categories.title,
				slug: categories.slug,
			})
			.from(categories)
			.where(eq(categories.id, id))
			.limit(1);

		return rows[0] ?? null;
	}

	public async create(data: { title: string; slug?: string }) {
		const rows = await this.db.insert(categories).values(data).returning({
			id: categories.id,
			title: categories.title,
			slug: categories.slug,
		});

		return rows[0];
	}

	public async update(id: string, data: { title?: string; slug?: string }) {
		const rows = await this.db
			.update(categories)
			.set(data)
			.where(eq(categories.id, id))
			.returning({
				id: categories.id,
				title: categories.title,
				slug: categories.slug,
			});

		return rows[0] ?? null;
	}

	public async delete(id: string): Promise<void> {
		await this.db.delete(categories).where(eq(categories.id, id));
	}

	public async existsMovieForCategory(categoryId: string): Promise<boolean> {
		const rows = await this.db
			.select({ id: movies.id })
			.from(movies)
			.where(eq(movies.categoryId, categoryId))
			.limit(1);

		return rows.length > 0;
	}
}
