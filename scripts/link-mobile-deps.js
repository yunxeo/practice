#!/usr/bin/env node
/**
 * Metro resolves the bundle entry point as a relative file path, so packages
 * hoisted to root node_modules by npm workspaces are not found. This script
 * creates symlinks in apps/mobile/node_modules pointing to root, restoring
 * what npm removes on every install. Run automatically via postinstall.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const rootModules = path.join(root, 'node_modules');
const mobileModules = path.join(root, 'apps', 'mobile', 'node_modules');

const REQUIRED = [
  'expo', 'expo-router', 'react', 'react-dom', 'react-native', 'react-native-web',
  'expo-auth-session', 'expo-constants', 'expo-font', 'expo-haptics', 'expo-image',
  'expo-linear-gradient', 'expo-secure-store', 'expo-splash-screen', 'expo-status-bar',
  'expo-web-browser', 'expo-application', 'expo-crypto', 'expo-linking',
  'expo-modules-core', 'invariant', 'base64-js',
  '@react-navigation/native', '@react-navigation/native-stack',
  '@react-navigation/bottom-tabs', '@react-navigation/core',
  '@react-navigation/elements', '@react-navigation/routers',
  'react-native-reanimated', 'react-native-safe-area-context', 'react-native-screens',
  'axios', 'zustand', '@tanstack/react-query', '@tanstack/react-query-devtools',
  '@expo/vector-icons', '@expo/metro-config',
];

let created = 0;
let missing = 0;

for (const pkg of REQUIRED) {
  const src = path.join(rootModules, pkg);
  const dest = path.join(mobileModules, pkg);
  const destDir = path.dirname(dest);

  try {
    fs.lstatSync(dest);
    continue; // already exists (symlink or real dir)
  } catch {
    // dest does not exist — create it
  }

  if (!fs.existsSync(src)) {
    process.stderr.write(`[link-deps] missing in root: ${pkg}\n`);
    missing++;
    continue;
  }

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.symlinkSync(src, dest);
  created++;
}

if (created > 0) process.stdout.write(`[link-deps] symlinked ${created} packages into apps/mobile/node_modules\n`);
if (missing > 0) process.stderr.write(`[link-deps] ${missing} packages not found in root — run npm install first\n`);
