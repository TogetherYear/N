import { rollup, RollupOptions, OutputOptions, watch } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import { builtinModules } from 'module';
import { join, relative } from 'path';
import { fork, ChildProcess } from 'child_process';
import * as fs from 'fs';
import { copy } from 'fs-extra';

const name = '[Build.ts]';

const boundEnv = process.argv.slice(-1)[0];

const GetInputFiles = (dir: string): Record<string, string> => {
    const files: string[] = fs.readdirSync(dir);
    const inputFiles: Record<string, string> = {};
    files.forEach((file) => {
        const fullPath: string = join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            Object.assign(inputFiles, GetInputFiles(fullPath));
        } else if (file.endsWith('.ts')) {
            const relativePath: string = relative('Src', fullPath);
            inputFiles[relativePath] = fullPath;
        }
    });
    return inputFiles;
};

const options: RollupOptions = {
    input: GetInputFiles(join(__dirname, 'Src')),
    output: {
        dir: join(__dirname, '/Build'),
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
                copy(join(__dirname, './Resources'), join(__dirname, '/Build/Resources'), (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('资源打包完成');
                });
            });
        })
        .catch((error) => {
            console.error(name, 'Error');
        });
}
