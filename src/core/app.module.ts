import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "@/infrastructure/database/database.module";
import { RedisModule } from "@/infrastructure/redis/redis.module";
import { CategoryModule } from "@/modules/category/category.module";
import { MovieModule } from "@/modules/movie/movie.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		RedisModule,
		MovieModule,
		CategoryModule,
	],
})
export class AppModule {}
