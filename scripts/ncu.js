const ncu = require('npm-check-updates')
const packageFiles = [
  './package.json',
  './src/template/project/package.json',
  './src/template/components/app/package.json',
  './src/template/components/auth/package.json',
  './src/template/components/provider/package.json',
  './src/template/components/output/package.json'
]

async function upgrade () {
  for (const file of packageFiles) {
    await ncu.run({
      packageFile: file,
      upgrade: true
    })
  }
}

upgrade()
