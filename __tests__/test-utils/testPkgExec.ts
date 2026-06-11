import * as cp from 'child_process'
import * as path from 'path'
import * as os from 'os'
import humanId from 'human-id'
import * as fs from 'fs'

export function createTestPkg() {
  const name = `test-pkg-${humanId({
    separator: '-',
    capitalize: false,
  })}`
  const pkgPath = path.resolve(os.tmpdir(), name)
  fs.mkdirSync(pkgPath)

  return {
    name,
    path: pkgPath,
    exec(command: string) {
      return cp.execSync(command, { cwd: pkgPath })
    },
    readFile(fileName: string) {
      return fs.readFileSync(path.join(pkgPath, fileName), 'utf-8')
    },
    fileExists(fileName: string) {
      return fs.existsSync(path.join(pkgPath, fileName))
    },
  }
}
