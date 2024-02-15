export type Movie = {
  title: string;
  overview: string;
  poster_path: string;
};

export default {
  async fetchMovies(query: string): Promise<Array<Movie>> {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&page=1`,
      { method: "GET", headers: { accept: "application/json" } }
    );

    return (response.json() as unknown as { results: Array<Movie> }).results;
  },
};
