import express from 'express';
import * as H from 'http';
import * as core from 'express-serve-static-core';
import { S } from '../type';
import { Manager } from '../Base/Manager';
import { Route } from '../Base/Route';
import { join } from 'path';

/**
 * 本地服务器
 */
class LocalServer extends Manager {
    constructor(ctx: S.Context) {
        super(ctx);
        this.CreateServer();
    }

    public port = 34243;

    public app!: core.Express;

    public server!: H.Server<typeof H.IncomingMessage, typeof H.ServerResponse>;

    public routes = new Set<Route>();

    public Run() {
        this.server.listen(this.port, '127.0.0.1');

        this.server.on('listening', () => {
            console.log('Listening:', this.port);
        });
    }

    private CreateServer() {
        this.app = express();

        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,POST');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Cross-Origin-Embedder-Policy', 'require-corp');
            res.header('Cross-Origin-Opener-Policy', 'same-origin');
            next();
        });

        this.app.set('port', this.port);

        this.app.use((err, req, res, next) => {
            res.status(500).json({ error: err.message });
        });

        this.app.use('/', express.static(join(global.staticDir)));

        this.server = H.createServer(this.app);
    }

    public MountRoute(route: Route) {
        this.routes.add(route);
    }

    public Destroy() {}
}

export { LocalServer };
