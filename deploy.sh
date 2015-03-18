#!/bin/bash

# Prepare deploy
mkdir temp
cp -R backend/ temp/
cp frontend/release/information-anywhere/index.html temp/

# Copy files to IOX server (see SSH config in README)
scp -r temp/* iox:/flash/information-anywhere/

# Cleanup
rm temp/*
rmdir temp
