import type { Timestamp } from "@cinema-platform/contracts/gen/ts/google/protobuf/timestamp";

export class MovieMapper {
	public static toMovie<T extends { releaseDate: Date | null }>(entity: T) {
		if (!entity.releaseDate) {
			return {
				...entity,
				releaseDate: null,
			};
		}

		const ms = entity.releaseDate.getTime();

		return {
			...entity,
			releaseDate: {
				seconds: Math.floor(ms / 1000),
				nanos: (ms % 1000) * 1_000_000,
			},
		};
	}

	public static fromTimestamp(
		timestamp: Timestamp | undefined,
	): Date | undefined {
		if (!timestamp) {
			return undefined;
		}

		return new Date(
			Number(timestamp.seconds) * 1000 +
				Number(timestamp.nanos) / 1_000_000,
		);
	}
}
