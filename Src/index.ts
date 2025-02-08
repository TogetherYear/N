import { join } from 'path';
import { Generate } from './Server';

global.staticDir = process.env['NODE_ENV'] === 'development' ? join(__dirname, '../Static') : join(__dirname, './Static');

Generate().then((ctx) => {});
