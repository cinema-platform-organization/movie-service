import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "@/infrastructure/database/database.module";
import { CategoryModule } from "@/modules/category/category.module";
import { MovieModule } from "@/modules/movie/movie.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		MovieModule,
		CategoryModule,
	],
})
export class AppModule {}
