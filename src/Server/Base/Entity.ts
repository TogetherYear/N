import { TEntity } from '../Decorators/TEntity';
import { S } from '../type';
import { EventSystem } from '../Utils';

@TEntity.Generate()
class Entity extends EventSystem {
    constructor(ctx: S.Context) {
        super();
        this.ctx = ctx;
    }

    public ctx!: S.Context;
}

export { Entity };
