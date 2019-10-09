import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import {
    terser
} from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/index.tsx',
    output: [{
        file: 'lib/index.js',
        format: 'es',
        sourcemap: false,
    }, ],
    external: ['react', 'react-dom', 'echarts-for-react','echarts','ramda'],
    plugins: [
        external(),
        typescript({
            tsconfigDefaults: {
                compilerOptions: {
                    declaration: true,
                    jsx: 'react',
                    target: "ES5",
                    allowSyntheticDefaultImports: true
                },
            },
            clean: true
        }),
        postcss({
            minimize: true, 
            modules: false,
            extensions: ['.css', '.scss', '.sass'],
        }),

        resolve(),

        terser(),

        filesize(),

        progress({
            clearLine: false
        }),

        visualizer({
            filename: './statistics.html',
            title: 'react-echarts-draw-mark Bundle',
        }),
    ],
};