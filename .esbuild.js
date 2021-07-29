const { build } = require('esbuild')

build({
  entryPoints: ['index.js'],
  outfile: './public/index.js',
  minify: true,
  bundle: true,
  sourcemap: true,
})
  .then(() => console.log('Building app...'))
  .catch(() => process.exit(1))
