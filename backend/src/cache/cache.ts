import NodeCache from 'node-cache';

type Key = string | number;

class CacheLocal {
  private static _instance: CacheLocal;

  private cache: NodeCache;

  private constructor() {
    this.cache = new NodeCache();
  }

  public static getInstance(): CacheLocal {
    if (!CacheLocal._instance) {
      CacheLocal._instance = new CacheLocal();
    }
    return CacheLocal._instance;
  }

  public get<T>(key: Key): T | undefined {
    return this.cache.get<T>(key);
  }

  public set<T>(key: Key, value: T, ttl: number): void {
    this.cache.set(key, value, ttl);
  }
  public has(key: Key): boolean {
    return this.cache.has(key);
  }
}

export default CacheLocal;
