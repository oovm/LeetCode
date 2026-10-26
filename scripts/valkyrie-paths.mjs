import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
export const LEETCODE_ROOT = join(SCRIPTS_DIR, '..');

/** 同级 nyar-vm.rs（leetcode workspace 通过 pnpm-workspace.yaml 引用其 packages）。 */
export const NYAR_VM_ROOT = resolve(process.env.NYAR_VM_ROOT ?? join(LEETCODE_ROOT, '..', 'nyar-vm.rs'));

export const VALKYRIE_EMULATOR = join(NYAR_VM_ROOT, 'projects', 'nyar.ts', 'emulators', 'valkyrie');

export function assertNyarValkyriePresent() {
    if (!existsSync(NYAR_VM_ROOT)) {
        throw new Error(`缺少同级 nyar-vm.rs：${NYAR_VM_ROOT}\nleetcode workspace 需要该路径下的 @nyar/valkyrie 成员。`);
    }
    if (!existsSync(join(VALKYRIE_EMULATOR, 'package.json'))) {
        throw new Error(`缺少 @nyar/valkyrie 包：${VALKYRIE_EMULATOR}`);
    }
}

/** @deprecated 旧名 */
export function assertValkyrieRsPresent() {
    assertNyarValkyriePresent();
}
