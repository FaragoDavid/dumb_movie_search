import config from '../config';

export type MovieSearchResponse = {
  title: string;
  overview: string;
  poster_path: string;
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

  async fetchMovies(query: string): Promise<Array<Movie>> {
    await this.fetchConfiguration();
    const apiResponse = (
      (await (await fetch(`${config.movieDb.movieSearchUrl}?query=${query}&page=1`, this.options)).json()) as unknown as {
        results: Array<MovieSearchResponse>;
      }
    ).results;

    return apiResponse.map(({ title, overview, poster_path }) => ({
      title,
      description: overview,
      imageSrc: poster_path ? `${this.imagesConfiguration?.base_url}original${poster_path}` : null,
    }));
  }
}
