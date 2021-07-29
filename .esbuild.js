const { readFileSync } = require('fs')
const { build } = require('esbuild')
const NODE_ENV = process.env.NODE_ENV || 'local'
const path = `.env.${NODE_ENV}`

require('dotenv').config({ path })

const environmentVariables = readFileSync(path)
  .toString()
  .split('\n')
  .map((c) => c.split('=')[0])
  .filter((c) => c.length)
  .reduce((acc, key) => {
    return { ...acc, [`process.env.${key}`]: `"${process.env[key]}"` }
  }, { 'process.env.NODE_ENV': NODE_ENV })


build({
  entryPoints: ['index.ts'],
  outfile: './public/index.js',
  minify: true,
  bundle: true,
  sourcemap: true,
  define: environmentVariables,
  watch: NODE_ENV === 'local',
})
  .then(() => console.log('Building app...'))
  .catch(() => process.exit(1))
