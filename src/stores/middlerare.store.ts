class MiddlewareStore {
  private collection: Function[] = [];

  public add(middleware: Function): void {
    this.collection.push(middleware);
  }

  public has(middleware: Function): boolean {
    return this.collection.includes(middleware);
  }
}

export const middlewaresStore = new MiddlewareStore();
