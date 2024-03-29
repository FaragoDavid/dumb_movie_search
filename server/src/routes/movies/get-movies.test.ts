import { createSigner } from "fast-jwt";
import app from "../../app";
import config from '../../config';
import Cache from '../../lib/cache';
import MovieDatabaseClient from '../../lib/movie-database-client';

jest.mock('../../lib/movie-database-client');
jest.mock('../../lib/cache');

describe('Get movies route', () => {
  const mockQuery = 'test-query';
  const mockRequestedPage = 1;
  const mockResponse = { response: 'test-response' };
  const mockExpireSeconds = 3;
  const redisClientExistsMock = jest.fn();
  const redisClientGetMock = jest.fn();
  const redisClientSetMock = jest.fn();
  const redisClientExpireMock = jest.fn();
  const signSync = createSigner({ key: config.jwtSecret });

  beforeEach(() => {
    jest.replaceProperty(config.cache, 'expireSeconds', mockExpireSeconds);

    (Cache.getClient as jest.Mock).mockResolvedValue({
      exists: redisClientExistsMock,
      get: redisClientGetMock,
      set: redisClientSetMock,
      expire: redisClientExpireMock,
    });
  });

  test('should respond with 401 if JWT token is missing or invalid', async () => {
    const response = await app().inject({
      method: 'GET',
      url: `/v1/movies?query=${mockQuery}&page=${mockRequestedPage}`,
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    });

    expect(response.statusCode).toEqual(401);
  });

  describe('when query result is not cached', () => {
    beforeEach(async () => {
      redisClientExistsMock.mockResolvedValue(false);
      (MovieDatabaseClient.prototype.fetchMovies as jest.Mock).mockImplementation((query) =>
        query === mockQuery ? mockResponse : undefined,
      );
    });

    test('should respond with 200 API data', async () => {
      const response = await app().inject({
        method: 'GET',
        url: `/v1/movies?query=${mockQuery}&page=${mockRequestedPage}`,
        headers: {
          Authorization: `Bearer ${signSync({})}`,
        },
      });

      expect(response.statusCode).toEqual(200);
      expect(response.json()).toEqual(mockResponse);
    });

    test('should save movie data to cache', async () => {
      await app().inject({
        method: 'GET',
        url: `/v1/movies?query=${mockQuery}&page=${mockRequestedPage}`,
        headers: {
          Authorization: `Bearer ${signSync({})}`,
        },
      });

      expect(redisClientSetMock).toHaveBeenCalledWith(`${mockQuery}_${mockRequestedPage}`, JSON.stringify(mockResponse));
      expect(redisClientExpireMock).toHaveBeenCalledWith(`${mockQuery}_${mockRequestedPage}`, mockExpireSeconds);
    });
  });

  describe('when query result is cached', () => {
    test('should respond with cached data', async () => {
      redisClientExistsMock.mockResolvedValue(true);
      redisClientGetMock.mockImplementation(async (key) =>
        key === `${mockQuery}_${mockRequestedPage}` ? JSON.stringify(mockResponse) : undefined,
      );

      const response = await app().inject({
        method: 'GET',
        url: `/v1/movies?query=${mockQuery}&page=${mockRequestedPage}`,
        headers: {
          Authorization: `Bearer ${signSync({})}`,
        },
      });

      expect(response.statusCode).toEqual(200);
      expect(response.json()).toEqual(mockResponse);
    });
  });
});
