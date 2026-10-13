import { toRpcException } from "@cinema-platform/common";
import type {
	HasUpcomingScreeningsForMovieRequest,
	ScreeningServiceClient,
} from "@cinema-platform/contracts/gen/ts/screening";
import { Inject, Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ScreeningClientGrpc implements OnModuleInit {
	private readonly logger = new Logger(ScreeningClientGrpc.name);

	private screeningService!: ScreeningServiceClient;

	public constructor(
		@Inject("SCREENING_PACKAGE") private readonly client: ClientGrpc,
	) {}

	public onModuleInit() {
		this.screeningService =
			this.client.getService<ScreeningServiceClient>("ScreeningService");
	}

	public async hasUpcomingForMovie(
		data: HasUpcomingScreeningsForMovieRequest,
	) {
		try {
			return await lastValueFrom(
				this.screeningService.hasUpcomingScreeningsForMovie(data),
			);
		} catch (error) {
			this.logger.error(
				{ err: error as Error, movieId: data.movieId },
				"Failed to check screenings for movie",
			);
			throw toRpcException(error, "Failed to check screenings for movie");
		}
	}
}
