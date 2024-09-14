import { createClient, RedisClientType } from 'redis';
import { REDIS_URL } from '@/config/index';

/**
 * A singleton service class to handle interactions with a Redis server.
 * It manages the Redis connection and provides methods for setting, getting, and deleting values.
 */
export class RedisService {
  private static instance: RedisService | null = null;
  public client: RedisClientType;

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {
    this.client = createClient({
      url: REDIS_URL, // Adjust the URL based on your Redis server configuration
    });

    this.client.connect()
      .then(() => {
        console.log('Redis client connected');
      })
      .catch((err) => {
        console.error('Redis error:', err);
      });
  }

  /**
   * Gets the singleton instance of the RedisService class.
   * @returns The singleton instance of RedisService.
   */
  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  /**
   * Sets a value in Redis with the given key.
   * @param key - The key under which the value will be stored.
   * @param value - The value to be stored in Redis.
   * @returns A promise that resolves when the value has been set.
   */
  async set(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value);
    } catch (err) {
      console.error('Failed to set value in Redis:', err);
    }
  }

  /**
   * Retrieves a value from Redis by its key.
   * @param key - The key of the value to retrieve.
   * @returns A promise that resolves to the value associated with the key, or null if the key does not exist.
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Failed to get value from Redis:', err);
      return null;
    }
  }

  /**
   * Deletes a value from Redis by its key.
   * @param key - The key of the value to delete.
   * @returns A promise that resolves when the value has been deleted.
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Failed to delete value from Redis:', err);
    }
  }

  /**
   * Closes the Redis connection.
   * @returns A promise that resolves when the Redis client has been closed.
   */
  async quit(): Promise<void> {
    try {
      await this.client.quit();
    } catch (err) {
      console.error('Failed to quit Redis client:', err);
    }
  }
}
