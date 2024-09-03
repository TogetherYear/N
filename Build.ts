import { rollup, RollupOptions, OutputOptions } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import { join } from 'path';

const boundEnv = process.argv.slice(-1)[0];

function ConfigFactory() {
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
        external: ['hmc-win32']
    };
    return options;
}

const opts = ConfigFactory();

const TAG = '[Build.ts]';

if (boundEnv === 'development') {
} else {
    console.log(TAG, 'Start');
    rollup(opts)
        .then((build) => {
            console.log(TAG, 'Success');
            build.write(opts.output as OutputOptions);
        })
        .catch((error) => {
            console.log(error);
            console.error(TAG, 'Error');
        });
}
