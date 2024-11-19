import { rollup, RollupOptions, OutputOptions } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import { join } from 'path';

const name = '[Build.ts]';

function Bundle() {
    return new Promise((resolve, reject) => {
        const options: RollupOptions = {
            input: 'Src/index.ts',
            output: {
                file: 'Build/bundle.js',
                format: 'commonjs',
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
            external: []
        };
        rollup(options)
            .then(async (build) => {
                await build.write(options.output as OutputOptions);
                resolve('Finish');
            })
            .catch((error) => {
                console.error(name, 'Error');
                reject('Error');
            });
    });
}

Bundle();
