#!/usr/bin/env node
/**
 * 将 valkyrie.rs 产出的 Rust seed `legion` 复制到本仓 `vendors/`，
 * 供 conformance harness 经 `LEGION_BIN` / 默认 staged 路径使用。
 * 不走 valkyrie.v 自举产物。
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { LEETCODE_ROOT, VALKYRIE_RS_ROOT, assertValkyrieRsPresent } from './valkyrie-paths.mjs';

assertValkyrieRsPresent();

const base = process.platform === 'win32' ? 'legion.exe' : 'legion';
const vendorsDir = join(LEETCODE_ROOT, 'vendors');
const dest = join(vendorsDir, base);

let source = null;
let profile = null;
for (const candidate of ['release', 'debug']) {
    const path = join(VALKYRIE_RS_ROOT, 'target', candidate, base);
    if (existsSync(path)) {
        source = path;
        profile = candidate;
        break;
    }
}

if (!source) {
    console.error(
        `未找到 ${base}（查过 target/release 与 target/debug）。\n` +
            `请先在 valkyrie.rs 执行：cargo build -p legion --release\n` +
            `（或 debug：cargo build -p legion）`,
    );
    process.exit(1);
}

mkdirSync(vendorsDir, { recursive: true });
copyFileSync(source, dest);
const bytes = statSync(dest).size;

console.log('已阶段化 Rust seed legion → leetcode.v/vendors');
console.log(`  源: target/${profile}/${base}`);
console.log(`  目标: vendors/${base} (${bytes} bytes)`);
console.log('  harness 优先：LEGION_BIN，其次 vendors/，再次 VALKYRIE_RS_ROOT/target/{release,debug}');
