#!/usr/bin/env bash

# Create browser folders
mkdir -p build/{chrome,firefox}

# Process extension JS, JSON and CSS files: output to browser folders
for p in src/gpp/*
do
  f=${p#src/gpp/}
  gpp -DCHROME=1 -o ./build/chrome/"$f" "$p"
  gpp -DFIREFOX=1 -o ./build/firefox/"$f" "$p"
done

# Copy shared extension files to browser folders
for p in src/shared/*
do
  cp "$p" build/chrome/
  cp "$p" build/firefox/
done

# Create archive files
pushd build/firefox
zip -r -FS ../copy-page-link.xpi ./*
popd
