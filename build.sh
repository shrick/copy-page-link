#!/usr/bin/env bash

# Create browser folders
mkdir -p dist/{chrome,firefox}

# Process extension JS, JSON and CSS files: output to browser folders
for p in src/gpp/*
do
  f=${p#src/gpp/}
  gpp -DCHROME=1 -o ./dist/chrome/"$f" "$p"
  gpp -DFIREFOX=1 -o ./dist/firefox/"$f" "$p"
done

# Copy shared extension files to browser folders
for p in src/shared/*
do
  cp "$p" dist/chrome/
  cp "$p" dist/firefox/
done

# Create archive files
pushd dist/firefox
zip -r -FS ../copy-page-link.xpi ./*
popd
