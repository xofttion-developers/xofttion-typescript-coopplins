import { EntityDatabase } from '@xofttion/clean-architecture';
import { Injectable } from '@xofttion/dependency-injection';
import { QueryRunner } from 'typeorm';
import { DatabaseSql } from './driver-sql';

type CallRunner = (runner: QueryRunner) => Promise<void>;

@Injectable()
export class ServerEntityDatabase implements EntityDatabase {
  public async connect(): Promise<void> {
    if (DatabaseSql.dataSource) {
      if (!DatabaseSql.dataSource.isInitialized) {
        await DatabaseSql.dataSource.initialize();
      }

      if (DatabaseSql.runner) {
        await DatabaseSql.runner.connect();
      }
    }
  }

  public async disconnect(full?: boolean): Promise<void> {
    if (!DatabaseSql.runner?.isReleased) {
      await DatabaseSql.runner?.release();
    }

    if (full && DatabaseSql.dataSource?.isInitialized) {
      await DatabaseSql.dataSource?.destroy();
    }
  }

  public async transaction(): Promise<void> {
    await this._execRunner(async (runner) => {
      await runner.startTransaction();
    });
  }

  public async commit(): Promise<void> {
    await this._execRunner(async (runner) => {
      await runner.commitTransaction();
    });
  }

  public async rollback(): Promise<void> {
    await this._execRunner(async (runner) => {
      await runner.rollbackTransaction();
    });
  }

  private async _execRunner(call: CallRunner): Promise<void> {
    if (DatabaseSql.runner && !DatabaseSql.runner.isReleased) {
      await call(DatabaseSql.runner);
    }
  }
}
