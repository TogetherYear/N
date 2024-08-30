import express from 'express';
import * as H from 'http';
import { join } from 'path';
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});
app.get('/Test', (req, res) => {
    res.write('Test');
    res.end();
});
app.use('/Static', express.static(join(__dirname, '')));
app.set('port', 8676);
const server = H.createServer(app);
server.listen(8676, '127.0.0.1');
server.on('listening', () => {
    console.log('Listening');
    // console.log(HMC);
});
//# sourceMappingURL=index.js.map