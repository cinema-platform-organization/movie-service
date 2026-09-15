import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { CategoryRepository } from "./category.repository";

@Injectable()
export class CategoryService {
	public constructor(
		private readonly categoryRepository: CategoryRepository,
	) {}

	public async getAll() {
		const categories = await this.categoryRepository.findAll();

		return { categories };
	}

	public async getOne(id: string) {
		const category = await this.categoryRepository.findById(id);

		if (!category) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Category not found",
			});
		}

		return { category };
	}

	public async create(data: { title: string; slug?: string }) {
		const category = await this.categoryRepository.create(data);

		return { category };
	}

	public async update(id: string, data: { title?: string; slug?: string }) {
		const existing = await this.categoryRepository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Category not found",
			});
		}

		const patch: { title?: string; slug?: string } = {};
		if (data.title !== undefined) patch.title = data.title;
		if (data.slug !== undefined) patch.slug = data.slug;

		const category = await this.categoryRepository.update(id, patch);

		return { category };
	}

	public async delete(id: string) {
		const existing = await this.categoryRepository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Category not found",
			});
		}

		const hasMovies =
			await this.categoryRepository.existsMovieForCategory(id);

		if (hasMovies) {
			throw new RpcException({
				code: RpcStatus.FAILED_PRECONDITION,
				details: "Cannot delete category with existing movies",
			});
		}

		await this.categoryRepository.delete(id);

		return { ok: true };
	}
}
