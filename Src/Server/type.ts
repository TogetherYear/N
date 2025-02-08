import { LocalServer } from './Manager/LocalServer';
namespace S {
    export type Context = {
        LocalServer: LocalServer;
        Destroy: () => void;
    };
}

export { S };
