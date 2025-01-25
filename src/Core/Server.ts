import express from 'express';
import * as H from 'http';
import * as core from 'express-serve-static-core';
import * as P from 'path';

/**
 * 本地服务器
 */
class Server {
    constructor() {
        this.CreateServer();
    }

    public port = 34243;

    private app!: core.Express;

    private server!: H.Server<typeof H.IncomingMessage, typeof H.ServerResponse>;

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

        this.SetHttpServer();

        this.SetStaticFile();

        this.app.set('port', this.port);
        this.server = H.createServer(this.app);
        this.server.listen(this.port, '127.0.0.1');

        this.server.on('listening', () => {
            console.log('Listening:', this.port);
        });
    }

    private SetHttpServer() {
        this.app.get('/', (req, res) => {
            res.write('Empty');
            res.end();
        });
        this.app.get('/test', (req, res) => {
            res.write('test');
            res.end();
        });
    }

    private SetStaticFile() {
        this.app.use('/static', express.static(P.join(__dirname, `${process.env.NODE_ENV === 'development' ? '../../Resources' : '../Resources'}`)));
    }
}

const LocalServerInstance = new Server();

export { LocalServerInstance as LocalServer };
