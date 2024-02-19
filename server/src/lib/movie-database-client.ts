import config from '../config';

export type MovieSearchResponse = {
  total_pages: number;
  results: { title: string; overview: string; poster_path: string | null }[];
};

export type ConfigurationResponse = {
  base_url: string;
};

export type Movie = {
  title: string;
  description: string;
  imageSrc: string | null;
};

export default class MovieDatabaseClient {
  private imagesConfiguration: ConfigurationResponse | undefined;
  private options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${config.movieDb.accessToken}`,
    },
  };

  private async fetchConfiguration() {
    if (!this.imagesConfiguration) {
      this.imagesConfiguration = (
        (await (await fetch(config.movieDb.configurationUrl, this.options)).json()) as unknown as {
          images: ConfigurationResponse;
        }
      ).images;
    }

    return this.imagesConfiguration;
  }

  async fetchMovies(query: string, page: number): Promise<MovieSearchResponse> {
    await this.fetchConfiguration();

    const { total_pages, results } = (await (
      await fetch(`${config.movieDb.movieSearchUrl}?query=${query}&page=${page}`, this.options)
    ).json()) as MovieSearchResponse;

    return {
      total_pages,
      results: results.map(({ title, overview, poster_path }) => ({
        title,
        overview,
        poster_path: poster_path ? `${this.imagesConfiguration?.base_url}original${poster_path}` : null,
      })),
    };
  }
}
