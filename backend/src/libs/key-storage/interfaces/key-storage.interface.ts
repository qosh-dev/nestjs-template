export interface KeyStorage {
  set(name: string, value: string, expiredAfter?: number): Promise<void>;
  setNX(name: string, value: string, expiredAfter?: number): Promise<boolean>;
  expire(name: string, after: number): Promise<boolean>;
  get(name: string): Promise<string | null>;
  setHash(name: string, field: string, value: string): Promise<void>;
  getHash(name: string, field: string): Promise<string | null>;
  delHash(name: string, field: string): Promise<boolean>;
  getHashAll(name: string): Promise<{ [field: string]: string }>;
  hashLength(name: string): Promise<number>;
  delete(name: string): Promise<void>;
  exists(name: string): Promise<boolean>;
  increment(name: string, expire?: number): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  setHashTable(name: string, data: Record<string, any>): Promise<void>;

  /**
   * Integer value TTL in milliseconds, or a negative value
   * @param name
   * @return TTL in milliseconds | -1, if the key does not have expiry timeout | -2, if the key does not exist
   */
  ttl(name: string): Promise<number>;
}
