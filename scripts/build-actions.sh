#!/usr/bin/env bash

ncc build .github/actions/update-sdk-schema/update-schema.ts -o .github/actions/update-sdk-schema/dist
ncc build .github/actions/changeset-release-notes/main.ts -o .github/actions/changeset-release-notes/dist
ncc build .github/actions/changeset-determine-step/main.ts -o .github/actions/changeset-determine-step/dist
