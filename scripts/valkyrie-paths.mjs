import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
export const LEETCODE_ROOT = join(SCRIPTS_DIR, '..');

/** 同级 valkyrie.rs（leetcode workspace 通过 pnpm-workspace.yaml 引用其 @nyar/valkyrie 包）。 */
export const VALKYRIE_RS_ROOT = resolve(process.env.VALKYRIE_RS_ROOT ?? join(LEETCODE_ROOT, '..', 'valkyrie.rs'));

export const VALKYRIE_EMULATOR = join(VALKYRIE_RS_ROOT, 'projects', 'ts', 'emulators', 'valkyrie');

export function assertValkyrieRsPresent() {
    if (!existsSync(VALKYRIE_RS_ROOT)) {
        throw new Error(`缺少同级 valkyrie.rs：${VALKYRIE_RS_ROOT}\nleetcode workspace 需要该路径下的 @nyar/valkyrie 成员。`);
    }
    if (!existsSync(join(VALKYRIE_EMULATOR, 'package.json'))) {
        throw new Error(`缺少 @nyar/valkyrie 包：${VALKYRIE_EMULATOR}`);
    }
}

/** @deprecated 旧名 */
export function assertNyarValkyriePresent() {
    assertValkyrieRsPresent();
}
