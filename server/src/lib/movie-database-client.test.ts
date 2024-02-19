import config from '../config';
import MovieDatabaseClient, { MovieSearchResponse } from './movie-database-client';

describe('Movie Database Client', () => {
  const mockMovieSearchResponse: MovieSearchResponse = {
    total_pages: 1,
    results: [
      {
        title: 'test-title',
        overview: 'test-overview',
        poster_path: '/test-path',
      },
    ],
  };
  const mockQuery = 'test-query';
  const mockBaseUrl = 'fake-base-url/';

  beforeEach(() => {
    jest.replaceProperty(config.movieDb, 'accessToken', 'fake-token');
    jest.spyOn(global, 'fetch').mockImplementation(async (url: string) => {
      if (url === config.movieDb.configurationUrl) {
        return { json: async () => ({ images: { base_url: mockBaseUrl } }) };
      } else if (url.includes(config.movieDb.movieSearchUrl)) {
        return { json: async () => mockMovieSearchResponse };
      }
    });
  });

  describe('#fetchMovies', () => {
    test('should fetch configuration exactly once', async () => {
      const client = new MovieDatabaseClient();

      await client.fetchMovies(mockQuery, 1);
      await client.fetchMovies(mockQuery, 1);

      expect(global.fetch).toHaveBeenCalledWith(config.movieDb.configurationUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer fake-token',
          accept: 'application/json',
        },
      });
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    test('should fetch movies', async () => {
      const requestedPage = 1;
      await new MovieDatabaseClient().fetchMovies(mockQuery, requestedPage);

      expect(global.fetch).toHaveBeenCalledWith(`${config.movieDb.movieSearchUrl}?query=${mockQuery}&page=${requestedPage}`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer fake-token',
          accept: 'application/json',
        },
      });
    });

    test('should return movie list', async () => {
      const response = await new MovieDatabaseClient().fetchMovies(mockQuery, 1);

      expect(response).toEqual({
        total_pages: 1,
        results: [
          {
            title: 'test-title',
            overview: 'test-overview',
            poster_path: 'fake-base-url/original/test-path',
          },
        ],
      });
    });
  });
});
