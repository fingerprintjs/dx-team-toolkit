import { includeIgnoreFile } from 'eslint/config'
import path from 'path'
import { fileURLToPath } from 'url'
import cfg from '@fingerprintjs/eslint-config-dx-team'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default [includeIgnoreFile(path.resolve(__dirname, '.gitignore')), ...cfg]
