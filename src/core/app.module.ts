import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";

import { DatabaseModule } from "@/infrastructure/database/database.module";
import { RedisModule } from "@/infrastructure/redis/redis.module";
import { CategoryModule } from "@/modules/category/category.module";
import { MovieModule } from "@/modules/movie/movie.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				".env",
			],
		}),
		LoggerModule.forRoot(),
		DatabaseModule,
		RedisModule,
		MovieModule,
		CategoryModule,
	],
})
export class AppModule {}
