import * as cp from 'child_process'
import * as path from 'path'
import * as os from 'os'
import humanId from 'human-id'

export const TEST_PACKAGE_NAME = `test-pkg-${humanId({
  separator: '-',
  capitalize: false,
})}`

export const TEST_PACKAGE_PATH = path.resolve(os.tmpdir(), TEST_PACKAGE_NAME)

export function testPkgExec(command: string) {
  return cp.execSync(command, { cwd: TEST_PACKAGE_PATH })
}
