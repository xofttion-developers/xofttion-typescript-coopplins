class MiddlewareStore {
  private collection: Function[] = [];

  public push(middleware: Function): void {
    this.collection.push(middleware);
  }

  public has(middleware: Function): boolean {
    return this.collection.includes(middleware);
  }
}

export const middlewares = new MiddlewareStore();
