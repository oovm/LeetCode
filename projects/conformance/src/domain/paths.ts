import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** `leetcode.v` 仓库根目录。 */
export const LEETCODE_ROOT = join(PACKAGE_ROOT, '..', '..');

/** 历史别名，与 `LEETCODE_ROOT` 同值。 */
export const LEETCODE_ROOT_FROM_PACKAGE = LEETCODE_ROOT;

/** `@leetcode/conformance` 包根目录。 */
export const CONFORMANCE_ROOT = PACKAGE_ROOT;

/** 不可变运行记录根目录。 */
export const CONFORMANCE_CACHE_ROOT = join(LEETCODE_ROOT, '.cache', 'conformance');

/** 看板基准 JSON 投影输出目录。 */
export const BENCH_PUBLIC_DIR = join(LEETCODE_ROOT, 'projects', 'dashboard', 'public');

/** `pnpm stage:vcc` 复制到的 Rust seed（gitignore `vendors/`）。铁律：`vcc`，不是 `legion.exe`。 */
export const STAGED_VCC_BIN = join(LEETCODE_ROOT, 'vendors', process.platform === 'win32' ? 'vcc.exe' : 'vcc');

/**
 * 若未设 `VCC_BIN`/`LEGION_BIN` 且已 stage，则写入 `VCC_BIN`，使
 * `@valkyrie-language/vcc/testing` 的 `locateNativeLegionBinary` 优先命中本仓 vendors。
 */
export function preferStagedLegionBin(): void {
    if (process.env.VCC_BIN?.trim() || process.env.LEGION_BIN?.trim()) {
        return;
    }
    if (existsSync(STAGED_VCC_BIN)) {
        process.env.VCC_BIN = STAGED_VCC_BIN;
    }
}
