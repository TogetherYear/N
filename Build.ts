import { rollup, RollupOptions, OutputOptions } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import { join } from 'path';
import * as fs from 'fs';

const boundEnv = process.argv.slice(-1)[0];

const name = '[Build.ts]';

const extra = ['hmc-win32'];

function Bundle() {
    return new Promise((resolve, reject) => {
        const options: RollupOptions = {
            input: 'Src/index.ts',
            output: {
                file: 'Build/bundle.js',
                format: 'cjs',
                sourcemap: false
            },
            plugins: [
                nodeResolve(),
                commonjs(),
                json(),
                typescript({ sourceMap: false, module: 'esnext' }),
                esbuild({ minify: true, target: 'node20' }),
                alias({
                    entries: [{ find: '@', replacement: join(__dirname, 'Src') }]
                })
            ],
            external: extra
        };
        console.log(name, 'Start');
        rollup(options)
            .then(async (build) => {
                await build.write(options.output as OutputOptions);
                resolve('Finish');
            })
            .catch((error) => {
                console.log(error);
                console.error(name, 'Error');
                reject('Error');
            });
    });
}

function AppendResource() {
    const end = ['ts', 'json', 'md'];
    for (let e of extra) {
        fs.cpSync(join(__dirname, `node_modules/${e}`), join(__dirname, `Build/node_modules/${e}`), { recursive: true, filter: (e) => end.indexOf(e.split('.').slice(-1)[0]) === -1 });
    }
    console.log(name, 'Success');
}

Bundle().then(() => {
    AppendResource();
});
