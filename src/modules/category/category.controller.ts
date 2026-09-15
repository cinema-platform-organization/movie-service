import type {
	CreateCategoryRequest,
	DeleteCategoryRequest,
	GetAllCategoriesResponse,
	GetCategoryRequest,
	UpdateCategoryRequest,
} from "@cinema-platform/contracts/gen/ts/category";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { CategoryService } from "./category.service";

@Controller()
export class CategoryController {
	public constructor(private readonly categoryService: CategoryService) {}

	@GrpcMethod("CategoryService", "GetAllCategories")
	public async getAll(): Promise<GetAllCategoriesResponse> {
		return await this.categoryService.getAll();
	}

	@GrpcMethod("CategoryService", "GetCategory")
	public async getOne(data: GetCategoryRequest) {
		return this.categoryService.getOne(data.id);
	}

	@GrpcMethod("CategoryService", "CreateCategory")
	public async create(data: CreateCategoryRequest) {
		return this.categoryService.create(data);
	}

	@GrpcMethod("CategoryService", "UpdateCategory")
	public async update(data: UpdateCategoryRequest) {
		return this.categoryService.update(data.id, {
			title: data.title,
			slug: data.slug,
		});
	}

	@GrpcMethod("CategoryService", "DeleteCategory")
	public async delete(data: DeleteCategoryRequest) {
		return this.categoryService.delete(data.id);
	}
}
