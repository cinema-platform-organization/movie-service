export const MovieCacheKeys = {
	all(params: { category?: string; random?: boolean; limit?: number }) {
		return [
			"movies",
			"list",
			params.category ?? "all",
			params.random ? "random" : "ordered",
			params.limit ?? "nolimit",
		].join(":");
	},
	bySlug(slug: string) {
		return `movies:slug:${slug}`;
	},
	byId(id: string) {
		return `movies:id:${id}`;
	},
};
