import { PROTO_PATHS } from "@cinema-platform/contracts";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ScreeningClientGrpc } from "@/clients/screening-client.grpc";
import { CategoryModule } from "@/modules/category/category.module";

import { MovieCacheService } from "./movie.cache.service";
import { MovieController } from "./movie.controller";
import { MovieRepository } from "./movie.repository";
import { MovieService } from "./movie.service";

@Module({
	imports: [
		CategoryModule,
		ClientsModule.registerAsync([
			{
				name: "SCREENING_PACKAGE",
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: "screening.v1",
						protoPath: PROTO_PATHS.SCREENING,
						url: configService.get<string>("SCREENING_GRPC_URL"),
					},
				}),
			},
		]),
	],
	controllers: [MovieController],
	providers: [
		MovieService,
		MovieRepository,
		MovieCacheService,
		ScreeningClientGrpc,
	],
})
export class MovieModule {}
