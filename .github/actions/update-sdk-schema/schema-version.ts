import * as fs from 'fs'
import * as path from 'path'

const SCHEMA_VERSION_FILE = '.schema-version'

export function getLatestSchemaVersion() {
  try {
    return fs.readFileSync(SCHEMA_VERSION_FILE, 'utf8')
  } catch {
    return null
  }
}

export function writeSchemaVersion(version: string, cwd: string) {
  fs.writeFileSync(path.join(cwd, SCHEMA_VERSION_FILE), version)
}
