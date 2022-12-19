class MiddlewareStore {
  private _collection: Function[] = [];

  public add(middleware: Function): void {
    this._collection.push(middleware);
  }

  public has(middleware: Function): boolean {
    return this._collection.includes(middleware);
  }
}

export const middlewares = new MiddlewareStore();
