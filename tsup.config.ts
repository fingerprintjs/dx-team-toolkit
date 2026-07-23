import { defineConfig } from 'tsup'
import * as path from 'node:path'

const entries = [
  '.github/actions/update-sdk-schema/update-schema.ts',
  '.github/actions/changeset-determine-step/main.ts',
  '.github/actions/changeset-release-notes/main.ts',
]

export default defineConfig(
  entries.map((entry) => {
    const dir = path.dirname(entry)
    return {
      entry: {
        index: entry,
      },
      outDir: path.join(dir, 'dist'),
      // @aws-sdk/client-s3 comes as dev-dependency from unzipper, but tsup tries to resolve it anyway - and fails, since it's not installed
      // marking it as external solves the issue
      external: ['@aws-sdk/client-s3'],
    }
  })
)
