import { RedisClientType } from 'redis';
/**
 * A singleton service class to handle interactions with a Redis server.
 * It manages the Redis connection and provides methods for setting, getting, and deleting values.
 */
export declare class RedisService {
    private static instance;
    client: RedisClientType;
    /**
     * Private constructor to prevent direct instantiation.
     */
    private constructor();
    /**
     * Gets the singleton instance of the RedisService class.
     * @returns The singleton instance of RedisService.
     */
    static getInstance(): RedisService;
    /**
     * Sets a value in Redis with the given key.
     * @param key - The key under which the value will be stored.
     * @param value - The value to be stored in Redis.
     * @returns A promise that resolves when the value has been set.
     */
    set(key: string, value: string): Promise<void>;
    /**
     * Retrieves a value from Redis by its key.
     * @param key - The key of the value to retrieve.
     * @returns A promise that resolves to the value associated with the key, or null if the key does not exist.
     */
    get(key: string): Promise<string | null>;
    /**
     * Deletes a value from Redis by its key.
     * @param key - The key of the value to delete.
     * @returns A promise that resolves when the value has been deleted.
     */
    del(key: string): Promise<void>;
    /**
     * Closes the Redis connection.
     * @returns A promise that resolves when the Redis client has been closed.
     */
    quit(): Promise<void>;
}
