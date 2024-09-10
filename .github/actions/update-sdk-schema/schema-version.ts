import * as fs from 'fs'

const SCHEMA_VERSION_FILE = '.schema-version'

export function getLatestSchemaVersion() {
  try {
    return fs.readFileSync(SCHEMA_VERSION_FILE, 'utf8')
  } catch {
    return null
  }
}

export function writeSchemaVersion(version: string) {
  fs.writeFileSync(SCHEMA_VERSION_FILE, version)
}
