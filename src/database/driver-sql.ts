import { DataSource, QueryRunner } from 'typeorm';

export class DatabaseSql {
  private static _dataSource?: DataSource;
  private static _runner?: QueryRunner;

  public static set dataSource(datasource: DataSource | undefined) {
    if (datasource) {
      this._dataSource = datasource;
    }
  }

  public static get dataSource(): DataSource | undefined {
    return this._dataSource;
  }

  public static get runner(): QueryRunner | undefined {
    if (this._dataSource && !this._runner) {
      this._runner = this._dataSource.createQueryRunner();
    }

    return this._runner;
  }
}
