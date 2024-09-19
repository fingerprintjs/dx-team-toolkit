#!/usr/bin/env bash

ncc build .github/actions/update-sdk-schema/update-schema.ts -o .github/actions/update-sdk-schema/dist
ncc build .github/actions/changeset-release-notes/changeset-release-notes.ts -o .github/actions/changeset-release-notes/dist
