import { execSync } from 'child_process';

import fs from 'fs';

import * as core from '@actions/core'

try {
    // Collect changesets stats
    const random = Math.random().toString(36).slice(2, 10);
    const statusPath = `changeset-status-${random}.json`
    execSync(`npx changeset status --output "${statusPath}"`, { stdio: 'inherit' });

    // Read status
    const status = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
    console.log(`[determine-changeset-status] status=${status}`)
    fs.unlinkSync(statusPath);

    let action = 'none';
    if (status.changesets && status.changesets.length > 0) {
        action = 'pr';        // PR will be created
    } else {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
        const currentVersion = pkg.version;
        try {
            execSync(`git fetch --tags`); // fetch tags
            execSync(`git rev-parse --verify --quiet v${currentVersion}`);
        } catch {
            // tag was not found, we can publish
            action = 'publish';
        }
    }

    core.setOutput('action', action); // action = 'pr' | 'publish' | 'none'
    console.log(`[determine-changeset-action] action=${action}`);
} catch (err) {
    if (err instanceof Error) {
        core.setFailed(err.message);
    } else {
        core.setFailed(String(err));
    }
}
