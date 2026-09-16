import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { RedisService } from "@/infrastructure/redis/redis.service";

import { MovieCacheKeys } from "./movie.cache.keys";

@Injectable()
export class MovieCacheService {
	private readonly CACHE_TTL: number;

	public constructor(
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
	) {
		this.CACHE_TTL = this.configService.get("CACHE_TTL");
	}

	public get<T = unknown>(key: string): Promise<T | null> {
		return this.redisService.getJson<T>(key);
	}

	public set(key: string, value: unknown): Promise<void> {
		return this.redisService.setJson(key, value, this.CACHE_TTL);
	}

	public async delete(key: string): Promise<void> {
		await this.redisService.del(key);
	}

	public async deleteByPattern(pattern: string): Promise<void> {
		const stream = this.redisService.scanStream({
			match: pattern,
			count: 100,
		});

		const pipeline = this.redisService.pipeline();
		let found = false;

		for await (const keys of stream as AsyncIterable<string[]>) {
			if (keys.length) {
				found = true;
				keys.forEach((key: string) => pipeline.del(key));
			}
		}

		if (found) {
			await pipeline.exec();
		}
	}

	public getAll<T = unknown>(params: {
		category?: string;
		random?: boolean;
		limit?: number;
		page?: number;
	}): Promise<T | null> {
		return this.get(MovieCacheKeys.all(params));
	}

	public setAll(
		params: {
			category?: string;
			random?: boolean;
			limit?: number;
			page?: number;
		},
		value: unknown,
	) {
		return this.set(MovieCacheKeys.all(params), value);
	}

	public invalidateAllLists(): Promise<void> {
		return this.deleteByPattern("movies:list:*");
	}
}
