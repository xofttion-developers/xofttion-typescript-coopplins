import { EntityDatabase } from '@xofttion/clean-architecture';
import { Injectable } from '@xofttion/dependency-injection';
import { QueryRunner } from 'typeorm';
import { databaseSql } from './driver-sql';

type CallRunner = (runner: QueryRunner) => Promise<void>;

@Injectable()
export class CoopplinsEntityDatabase implements EntityDatabase {
  public async connect(): Promise<void> {
    if (databaseSql.dataSource) {
      if (!databaseSql.dataSource.isInitialized) {
        await databaseSql.dataSource.initialize();
      }

      if (databaseSql.runner) {
        await databaseSql.runner.connect();
      }
    }
  }

  public async disconnect(full?: boolean): Promise<void> {
    if (!databaseSql.runner?.isReleased) {
      await databaseSql.runner?.release();
    }

    if (full && databaseSql.dataSource?.isInitialized) {
      await databaseSql.dataSource?.destroy();
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
    if (databaseSql.runner && !databaseSql.runner.isReleased) {
      await call(databaseSql.runner);
    }
  }
}
