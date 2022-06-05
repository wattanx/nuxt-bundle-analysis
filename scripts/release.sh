#! /bin/sh

set -ex

CURRENT_VERSION=$(git show HEAD:package.json | jq -r '.version')

if ! git tag | grep --quiet "^$CURRENT_VERSION$"; then
  echo $CURRENT_VERSION
fi