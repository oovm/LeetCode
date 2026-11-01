/**
 * `managed-abi.json` 的读取与合同校验（`jvm` / `clr` 对照 lane）。
 *
 * managed pipeline 现在会落盘真 `run-contracts.txt` 与 `managed-abi.json`。
 * 这里只消费已经冻结的入口事实：lane、产物文件名、调用约定、入口签名与 digest。
 * 任何缺字段、artifact 与落盘文件名不一致、lane 不符、digest 不能复算的合同
 * 一律结构化失败，不猜默认值。
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

export type ManagedContrastLane = 'jvm' | 'clr';

export type ManagedAbiEntry = {
    /** 逻辑入口名（wasm export 同名，例如 `reverse`）。 */
    logical_entry: string;
    /** 主类内部名（JVM 形态带 `/`）。 */
    owner: string;
    /** 主类中的静态方法名。 */
    method: string;
    /** managed 方法描述符 / 签名。 */
    signature: string;
    /** 形参的 managed 标量类型名。 */
    parameter_types: string[];
    /** 返回值 managed 标量类型名。 */
    return_type: string;
    /** launcher 类内部名；JVM 用于 `java -cp` 的 main 类，CLR 为 `managed_entry`。 */
    launcher_class: string;
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
const MANAGED_ABI_SCHEMA_VERSION = 1;
const MANAGED_CALLING_CONVENTION = 'static-argv-launcher';

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
                    entry.owner,
                    entry.method,
                    entry.signature,
                    entry.parameter_types.join(','),
                    entry.return_type,
                    entry.launcher_class,
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
    return {
        logical_entry: asString(record.logical_entry, `${path}.logical_entry`),
        owner: asString(record.owner, `${path}.owner`),
        method: asString(record.method, `${path}.method`),
        signature: asString(record.signature, `${path}.signature`),
        parameter_types: asStringArray(record.parameter_types, `${path}.parameter_types`),
        return_type: asString(record.return_type, `${path}.return_type`),
        launcher_class: asString(record.launcher_class, `${path}.launcher_class`),
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
    let source: string;
    try {
        source = readFileSync(join(outputDirectory, MANAGED_ABI_FILE_NAME), 'utf8');
    } catch {
        throw new ManagedAbiError(`缺少 \`${MANAGED_ABI_FILE_NAME}\`（managed 执行合同）`);
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
    if (callingConvention !== MANAGED_CALLING_CONVENTION) {
        throw new ManagedAbiError(`managed-abi calling_convention 必须为 \`${MANAGED_CALLING_CONVENTION}\`（实际 \`${callingConvention}\`）`);
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
