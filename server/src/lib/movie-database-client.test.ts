import movieDatabaseClient, { Movie } from "./movie-database-client";

describe("Movie databaseclient", () => {
  test("should return movie list", async () => {
    const mockQuery = "test-query";
    const mockResponse: Array<Movie> = [
      {
        title: "test-title",
        overview: "test-overview",
        poster_path: "test-path",
      },
    ];
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: () => ({ results: mockResponse }),
    } as any);

    const response = await movieDatabaseClient.fetchMovies(mockQuery);

    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/search/movie?query=${mockQuery}&page=1`,
      { method: "GET", headers: { accept: "application/json" } }
    );
    expect(response).toEqual(mockResponse);
  });
});
