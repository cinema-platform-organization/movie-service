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
}
