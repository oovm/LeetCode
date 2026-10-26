#!/usr/bin/env node
/**
 * 在 leetcode.v 根目录：写 legions.von + pnpm install（workspace 解析 @nyar/valkyrie）。
 * 不修改 nyar-vm.rs，不影响其 CI。
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertValkyrieVPresent, leetcodeLegionsVon } from './valkyrie-v-deps.mjs';
import { assertNyarValkyriePresent, LEETCODE_ROOT } from './valkyrie-paths.mjs';

assertNyarValkyriePresent();
assertValkyrieVPresent();

writeFileSync(join(LEETCODE_ROOT, 'legions.von'), leetcodeLegionsVon(), 'utf8');
console.log('wrote legions.von');

const install = spawnSync('pnpm', ['install'], {
    cwd: LEETCODE_ROOT,
    stdio: 'inherit',
    shell: true,
});
process.exit(install.status ?? 1);
