#!/bin/bash

# Use the full path to node from NVM
exec /Users/lawrence/.nvm/versions/node/v25.2.1/bin/node "$(dirname "$0")/dist/index.js"
