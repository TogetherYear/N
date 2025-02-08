import { LocalServer } from './Manager/LocalServer';
import { Test } from './Route/Test';
import { S } from './type';

const Generate = (): Promise<S.Context> => {
    const target: Partial<S.Context> = {};

    /**
     * 后面可能加东西 先弄一层代理
     */
    const proxy = Proxy.revocable(target as S.Context, {
        get: (target: S.Context, p: keyof S.Context, receiver: any) => {
            return target[p];
        },
        set: (target: S.Context, p: keyof S.Context, newValue: any, receiver: any) => {
            target[p] = newValue;
            return true;
        }
    });

    const ctx = proxy.proxy;

    return new Promise(async (resolve, reject) => {
        ctx.LocalServer = new LocalServer(ctx);

        ctx.LocalServer.MountRoute(new Test(ctx));

        ctx.LocalServer.Run();

        ctx.Destroy = () => {
            ctx.LocalServer.Destroy();

            proxy.revoke();
        };

        resolve(ctx);
    });
};

export { Generate };
