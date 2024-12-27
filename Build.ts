import { rollup, RollupOptions, OutputOptions, watch } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import { builtinModules } from 'module';
import { join } from 'path';
import { fork, ChildProcess } from 'child_process';

const name = '[Build.ts]';

const boundEnv = process.argv.slice(-1)[0];

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
    external: [...builtinModules.filter((x) => !/^_|^(internal|v8|node-inspect)\/|\//.test(x))]
};

if (boundEnv === 'development') {
    const watcher = watch(options);
    let child: ChildProcess;
    watcher.on('change', (filename) => {
        console.info(name, `change -- ${filename}`);
    });
    watcher.on('event', (ev) => {
        if (ev.code === 'END') {
            if (child) child.kill();
            child = fork(join(__dirname, './Build/bundle.js'), [], {
                stdio: 'inherit',
                env: Object.assign(process.env, { NODE_ENV: boundEnv })
            });
        } else if (ev.code === 'ERROR') {
            console.error(ev.error);
        }
    });
} else {
    rollup(options)
        .then(async (build) => {
            build.write(options.output as OutputOptions);
        })
        .catch((error) => {
            console.error(name, 'Error');
        });
}
