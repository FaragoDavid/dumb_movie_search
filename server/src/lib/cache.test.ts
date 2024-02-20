import config from '../config';
import Cache from './cache';
import { createClient } from 'redis';

jest.mock('redis');

describe('Cache', () => {
  const mockRedisUrl = 'mock-redis-url';
  const mockRedisClient = {
    on: jest.fn(),
    connect: jest.fn(),
  };

  beforeEach(() => {
    jest.replaceProperty(config.cache, 'redisUrl', mockRedisUrl);
    (createClient as jest.Mock).mockImplementation(() => mockRedisClient);

    delete Cache.instance;
  });

  describe('#getInstance', () => {
    test('should create only one connection', async () => {
      await Cache.getClient();
      await Cache.getClient();

      expect(createClient).toHaveBeenCalledTimes(1);
    });

    test('should set error handler', async () => {
      await Cache.getClient();

      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    test('should return redis client', async () => {
      const cache = await Cache.getClient();

      expect(createClient).toHaveBeenCalledWith({ url: mockRedisUrl });
      expect(cache).toEqual(mockRedisClient);
    });
  });
});
