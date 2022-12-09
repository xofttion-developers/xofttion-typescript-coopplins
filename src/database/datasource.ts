import { EntityDataSource, ModelORM } from '@xofttion/clean-architecture';
import { Injectable } from '@xofttion/dependency-injection';
import { QueryRunner } from 'typeorm';
import { DatabaseSql } from './driver-sql';

type CallRunner = (runner: QueryRunner) => Promise<void>;

@Injectable()
export class ServerEntityDataSource implements EntityDataSource {
  public async insert(model: ModelORM): Promise<void> {
    await this._execRunner(async (runner) => {
      await runner.manager.save(model);
    });
  }

  public async update(model: ModelORM): Promise<void> {
    await this._execRunner(async (runner) => {
      await runner.manager.save(model);
    });
  }

  public async delete(model: ModelORM): Promise<void> {
    await this._execRunner(async (runner) => {
      await runner.manager.remove(model);
    });
  }

  private async _execRunner(call: CallRunner): Promise<void> {
    if (DatabaseSql.runner && !DatabaseSql.runner.isReleased) {
      await call(DatabaseSql.runner);
    }
  }
}
