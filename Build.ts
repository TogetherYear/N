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
import { copy } from 'fs-extra';

const name = '[Build.ts]';

const boundEnv = process.argv.slice(-1)[0];

const options: RollupOptions = {
    input: join(__dirname, '/Src/index.ts'),
    output: {
        file: join(__dirname, '/Build/index.js'),
        format: 'commonjs',
        sourcemap: false,
        entryFileNames: (chunkInfo) => {
            const { name } = chunkInfo;
            return `${name.replace('.ts', '.js')}`;
        }
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        json(),
        typescript({ sourceMap: false, module: 'esnext' }),
        esbuild({ minify: true, target: 'node20' }),
        alias({
            entries: [{ find: '@', replacement: join(__dirname, '/Src') }]
        })
    ],
    external: [...builtinModules.filter((x) => !/^_|^(internal|v8|node-inspect)\/|\//.test(x))]
};

if (boundEnv === 'development') {
    const watcher = watch(options);
    let child: ChildProcess;
    watcher.on('change', (filename) => {
        console.info(name, `change -- ${filename.replace(__dirname, '')}`);
    });
    watcher.on('event', (ev) => {
        if (ev.code === 'END') {
            if (child) child.kill();
            child = fork(join(__dirname, './Build/index.js'), [], {
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
            build.write(options.output as OutputOptions).then(() => {
                console.log('代码打包完成');
                copy(join(__dirname, './Static'), join(__dirname, './Build/Static')).then(() => {
                    console.log('资源打包完成');
                });
            });
        })
        .catch((error) => {
            console.error(name, 'Error');
        });
}
