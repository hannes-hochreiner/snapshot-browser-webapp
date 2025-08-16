#!/usr/bin/env -S nu --stdin
use std/log

def main [] {}

def "main vendor" [
  src: string
] {
  augment_path
  cp $"($src)/package.json" $env.tmp
  cp $"($src)/bun.lock" $env.tmp

  bun install --frozen-lockfile

  let node_modules_cache = $"($env.tmp)/node_modules/.cache"

  if ($node_modules_cache | path exists) {
    rm -r $node_modules_cache
  }

  mkdir $"($env.out)"
  ^tar -cC $env.tmp node_modules | ^tar -xC $"($env.out)"
  print (ls -la $"($env.out)" | to json)
}

def "main build" [
  src: string
  deps: string
] {
  augment_path
  ^tar -cC $deps node_modules | ^tar -xC $env.tmp
  ^tar -cC $src . | ^tar -xC $env.tmp
  bun build index.html --outdir $"($env.out)/dist" --public-path "/"
}

def --env augment_path [] {
  $env.PATH = [
    ...$env.PATH
    ...($env.buildInputs | split row -r '\s+' | each {|item| $"($item)/bin"})
  ]
}
