import { DataSource, QueryRunner } from 'typeorm';

class DatabaseSql {
  private _dataSource?: DataSource;
  private _runner?: QueryRunner;

  public set dataSource(datasource: DataSource | undefined) {
    if (datasource) {
      this._dataSource = datasource;
    }
  }

  public get dataSource(): DataSource | undefined {
    return this._dataSource;
  }

  public get runner(): QueryRunner | undefined {
    if (this._dataSource && !this._runner) {
      this._runner = this._dataSource.createQueryRunner();
    }

    return this._runner;
  }
}

export const databaseSql = new DatabaseSql();
