#!/usr/bin/env node
/**
 * 将 valkyrie.rs 产出的 Rust seed `vcc` 复制到本仓 `vendors/`，
 * 供 conformance harness 经 `VCC_BIN` / 默认 staged 路径使用。
 * 铁律：valkyrie.rs 不得产出 `legion.exe`；本脚本只复制 `vcc[.exe]`。
 */
import { copyFileSync, existsSync, mkdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import { LEETCODE_ROOT, VALKYRIE_RS_ROOT, assertValkyrieRsPresent } from './valkyrie-paths.mjs';

assertValkyrieRsPresent();

const base = process.platform === 'win32' ? 'vcc.exe' : 'vcc';
const vendorsDir = join(LEETCODE_ROOT, 'vendors');
const dest = join(vendorsDir, base);
const legacyLegion = join(vendorsDir, process.platform === 'win32' ? 'legion.exe' : 'legion');

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
            `（产出应为 target/*/vcc，绝不是 legion.exe）`,
    );
    process.exit(1);
}

mkdirSync(vendorsDir, { recursive: true });
if (existsSync(legacyLegion)) {
    unlinkSync(legacyLegion);
    console.log(`已删除误放的 legacy ${process.platform === 'win32' ? 'legion.exe' : 'legion'}`);
}
copyFileSync(source, dest);
const bytes = statSync(dest).size;

console.log('已阶段化 Rust seed vcc → leetcode.v/vendors');
console.log(`  源: target/${profile}/${base}`);
console.log(`  目标: vendors/${base} (${bytes} bytes)`);
console.log('  harness 优先：VCC_BIN → vendors/ → VALKYRIE_RS_ROOT/target/{release,debug}/vcc');
