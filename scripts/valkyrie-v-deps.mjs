import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
export const LEETCODE_ROOT = join(SCRIPTS_DIR, '..');

export const VALKYRIE_V_GIT = process.env.VALKYRIE_V_GIT ?? 'https://github.com/valkyrie-language/valkyrie.v.git';
export const VALKYRIE_V_REF = process.env.VALKYRIE_V_REF ?? 'main';
export const VALKYRIE_V_ROOT = resolve(process.env.VALKYRIE_V_ROOT ?? join(LEETCODE_ROOT, '..', 'valkyrie.v'));

export function valkyrieVDepsMode() {
    return process.env.VALKYRIE_V_DEPS === 'git' ? 'git' : 'local';
}

export function assertValkyrieVPresent(mode = valkyrieVDepsMode()) {
    if (mode === 'git') {
        return;
    }
    if (!existsSync(VALKYRIE_V_ROOT)) {
        throw new Error(
            `找不到 valkyrie.v：${VALKYRIE_V_ROOT}\n` + '请 clone 到 leetcode.v 同级，或设置 VALKYRIE_V_ROOT / VALKYRIE_V_DEPS=git。',
        );
    }
}

function toPosixPath(path) {
    return path.split('\\').join('/');
}

/** 写入 `leetcode.v/legions.von`，注册 `std` / `std.adaptors._` workspace 成员。 */
export function leetcodeLegionsVon({ leetcodeRoot = LEETCODE_ROOT, valkyrieRoot = VALKYRIE_V_ROOT } = {}) {
    const stdMember = toPosixPath(relative(leetcodeRoot, join(valkyrieRoot, 'projects', 'std')));
    const adaptorsMember = toPosixPath(relative(leetcodeRoot, join(valkyrieRoot, 'projects', 'std.adaptors._')));
    return `{
    name: "leetcode",
    members: [
        "${stdMember}",
        "${adaptorsMember}"
    ],
    workspace: {
        version: "0.1.0"
    }
}
`;
}
