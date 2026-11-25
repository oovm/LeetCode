/**
 * `managed-abi.json` 的读取与合同校验（`jvm` / `clr` 对照 lane）。
 *
 * managed pipeline 现在会落盘真 `run-contracts.txt` 与 `managed-abi.json`。
 * 这里只消费已经冻结的入口事实：lane、产物文件名、调用约定、入口签名与 digest。
 * 任何缺字段、artifact 与落盘文件名不一致、lane 不符、digest 不能复算的合同
 * 一律结构化失败，不猜默认值。
 *
 * schema 4 起入口携带 `source_name`（语言侧冻结声明名）与 `parameter_names`
 * （按声明顺序的形参名，消费侧按名绑定实参），`launcher_class` 可为 `null`
 * （签名不可由 argv 无损编组是显式事实）。旧 schema 一律拒绝，不兼容读取。
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

export type ManagedContrastLane = 'jvm' | 'clr';

export type ManagedAbiEntry = {
    /** 逻辑入口名（目标公开名，声明身份；例如 `reverse`）。 */
    logical_entry: string;
    /** 语言侧冻结的源码声明名；与 `logical_entry` 是两个独立事实轴。 */
    source_name: string;
    /** 主类内部名（JVM 形态带 `/`）。 */
    owner: string;
    /** 主类中的静态方法名。 */
    method: string;
    /** managed 方法描述符 / 签名。 */
    signature: string;
    /** 形参的 managed 标量类型名。 */
    parameter_types: string[];
    /** 形参声明名，按声明顺序且与 `parameter_types` 等长；实参按此绑定。 */
    parameter_names: string[];
    /** 返回值 managed 标量类型名。 */
    return_type: string;
    /** launcher 类内部名；`null` 是「签名不可由 argv 无损编组」的显式事实。 */
    launcher_class: string | null;
};

export type ManagedAbiContract = {
    schema_version: number;
    lane: ManagedContrastLane;
    artifact: string;
    calling_convention: string;
    entries: ManagedAbiEntry[];
    contract_digest: string;
};

export class ManagedAbiError extends Error {
    readonly reason: string;

    constructor(reason: string) {
        super(reason);
        this.name = 'ManagedAbiError';
        this.reason = reason;
    }
}

const MANAGED_ABI_FILE_NAME = 'managed-abi.json';
const MANAGED_ABI_SCHEMA_VERSION = 4;
/** 合同声明的能力：argv launcher 编组，或只能按静态方法绑定实参。 */
const SUPPORTED_CALLING_CONVENTIONS = new Set(['static-argv-launcher', 'static-method']);

/** 按 Rust `ManagedAbiContract::canonical_digest_input` 的规范文本复算 sha256。 */
export function computeManagedContractDigest(contract: Omit<ManagedAbiContract, 'contract_digest'>): string {
    const lines = [
        `lane=${contract.lane}`,
        `artifact=${contract.artifact}`,
        `calling_convention=${contract.calling_convention}`,
        ...[...contract.entries]
            .sort((left, right) => left.logical_entry.localeCompare(right.logical_entry))
            .map((entry) =>
                [
                    entry.logical_entry,
                    entry.source_name,
                    entry.owner,
                    entry.method,
                    entry.signature,
                    entry.parameter_types.join(','),
                    entry.parameter_names.join(','),
                    entry.return_type,
                    // 无 launcher 是已冻结事实；用显式哨兵参与摘要，禁止与空名字混淆。
                    entry.launcher_class ?? '-',
                ].join('|'),
            ),
    ];
    return createHash('sha256').update(lines.join('\n')).digest('hex');
}

function asString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.length === 0) {
        throw new ManagedAbiError(`managed-abi 字段 \`${field}\` 必须是非空字符串`);
    }
    return value;
}

function asStringArray(value: unknown, field: string): string[] {
    if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
        throw new ManagedAbiError(`managed-abi 字段 \`${field}\` 必须是字符串数组`);
    }
    return value as string[];
}

function parseManagedEntry(raw: unknown, path: string): ManagedAbiEntry {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new ManagedAbiError(`managed-abi ${path} 必须是 object`);
    }
    const record = raw as Record<string, unknown>;
    const parameterTypes = asStringArray(record.parameter_types, `${path}.parameter_types`);
    const parameterNames = asStringArray(record.parameter_names, `${path}.parameter_names`);
    if (parameterNames.length !== parameterTypes.length) {
        throw new ManagedAbiError(
            `managed-abi ${path} 的形参名 (${parameterNames.length}) 与形参类型 (${parameterTypes.length}) 数量不一致`,
        );
    }
    if (parameterNames.some((name) => name.length === 0) || new Set(parameterNames).size !== parameterNames.length) {
        throw new ManagedAbiError(`managed-abi ${path} 的形参名必须非空且唯一`);
    }
    // `null` 是「不经 argv 编组」的显式事实；空字符串不是合法 launcher 名。
    const launcherClass =
        record.launcher_class === null
            ? null
            : asString(record.launcher_class, `${path}.launcher_class`);
    return {
        logical_entry: asString(record.logical_entry, `${path}.logical_entry`),
        source_name: asString(record.source_name, `${path}.source_name`),
        owner: asString(record.owner, `${path}.owner`),
        method: asString(record.method, `${path}.method`),
        signature: asString(record.signature, `${path}.signature`),
        parameter_types: parameterTypes,
        parameter_names: parameterNames,
        return_type: asString(record.return_type, `${path}.return_type`),
        launcher_class: launcherClass,
    };
}

/**
 * 读取并校验 managed ABI 合同。
 *
 * `artifactFileName` 由调用方给出本次落盘产物文件名，用于校验合同没有指向别的产物。
 */
export function readManagedAbiContract(
    outputDirectory: string,
    lane: ManagedContrastLane,
    artifactFileName: string,
): ManagedAbiContract {
    // 新构建按产物名落盘 `<artifact>.managed-abi.json`（多分区不互相覆盖）；
    // 旧构建落 `managed-abi.json`。两者都接受，优先产物专属侧车，避免同目录多产物串号。
    const candidates = [`${artifactFileName}.${MANAGED_ABI_FILE_NAME}`, MANAGED_ABI_FILE_NAME];
    let source: string | null = null;
    for (const fileName of candidates) {
        try {
            source = readFileSync(join(outputDirectory, fileName), 'utf8');
            break;
        } catch {
            /* 尝试下一个候选 */
        }
    }
    if (source === null) {
        throw new ManagedAbiError(`缺少 \`${artifactFileName}.${MANAGED_ABI_FILE_NAME}\`（managed 执行合同）`);
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(source) as unknown;
    } catch (error) {
        throw new ManagedAbiError(`\`${MANAGED_ABI_FILE_NAME}\` 不是合法 JSON: ${String(error)}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new ManagedAbiError(`\`${MANAGED_ABI_FILE_NAME}\` 根必须是 object`);
    }
    const record = parsed as Record<string, unknown>;

    if (record.schema_version !== MANAGED_ABI_SCHEMA_VERSION) {
        throw new ManagedAbiError(
            `managed-abi schema_version 必须为 ${MANAGED_ABI_SCHEMA_VERSION}（实际 ${JSON.stringify(record.schema_version)}）`,
        );
    }
    const contractLane = asString(record.lane, 'lane');
    if (contractLane !== lane) {
        throw new ManagedAbiError(`managed-abi lane 为 \`${contractLane}\`，与本次 lane \`${lane}\` 不一致`);
    }
    const artifact = asString(record.artifact, 'artifact');
    if (artifact !== artifactFileName) {
        throw new ManagedAbiError(`managed-abi artifact 为 \`${artifact}\`，与落盘产物 \`${artifactFileName}\` 不一致`);
    }
    const callingConvention = asString(record.calling_convention, 'calling_convention');
    if (!SUPPORTED_CALLING_CONVENTIONS.has(callingConvention)) {
        throw new ManagedAbiError(
            `managed-abi calling_convention 必须是 ${[...SUPPORTED_CALLING_CONVENTIONS].join(' / ')}（实际 \`${callingConvention}\`）`,
        );
    }
    if (!Array.isArray(record.entries) || record.entries.length === 0) {
        throw new ManagedAbiError('managed-abi entries 必须是非空数组');
    }
    const entries = record.entries.map((entry, index) => parseManagedEntry(entry, `entries[${index}]`));
    const seenEntries = new Set<string>();
    for (const entry of entries) {
        if (seenEntries.has(entry.logical_entry)) {
            throw new ManagedAbiError(`managed-abi 入口 \`${entry.logical_entry}\` 重复`);
        }
        seenEntries.add(entry.logical_entry);
    }

    const digest = asString(record.contract_digest, 'contract_digest');
    const recomputed = computeManagedContractDigest({
        schema_version: MANAGED_ABI_SCHEMA_VERSION,
        lane,
        artifact,
        calling_convention: callingConvention,
        entries,
    });
    if (digest !== recomputed) {
        throw new ManagedAbiError(`managed-abi digest 不匹配（文件 ${digest}，复算 ${recomputed}）`);
    }
    return {
        schema_version: MANAGED_ABI_SCHEMA_VERSION,
        lane,
        artifact,
        calling_convention: callingConvention,
        entries,
        contract_digest: digest,
    };
}

/** 按逻辑入口名查找合同入口；缺失即结构化失败。 */
export function findManagedAbiEntry(contract: ManagedAbiContract, logicalEntry: string): ManagedAbiEntry {
    const entry = contract.entries.find((candidate) => candidate.logical_entry === logicalEntry);
    if (!entry) {
        throw new ManagedAbiError(
            `managed-abi 缺少入口 \`${logicalEntry}\`（已有: ${contract.entries.map((candidate) => candidate.logical_entry).join(', ')}）`,
        );
    }
    return entry;
}

/** 产物文件名（只做一次 basename，便于调用方校验合同）。 */
export function managedArtifactFileName(artifactPath: string): string {
    return basename(artifactPath);
}
