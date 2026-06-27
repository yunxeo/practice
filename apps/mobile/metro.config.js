const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 모노레포: 루트 전체를 감시
config.watchFolders = [workspaceRoot];

// 모듈 해석 경로: 앱 node_modules → 루트 node_modules 순서
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 못 찾는 모듈은 루트 node_modules에서 탐색
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (name in target) return target[name];
      return path.join(workspaceRoot, 'node_modules', String(name));
    },
  }
);

module.exports = config;
