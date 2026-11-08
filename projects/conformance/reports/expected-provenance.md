# expected 溯源审计（2026-11-08）

- 口径：2026-11-07 宿主异常清理涉及的 **3915** 条异常文本 expected 逐条打标。
- 数据来源：已作废的 3878 条从 `951a53ca8^` 的 metadata 逐条重放；37 条仍在 3 个 dirty
  metadata，按保护规则未动。
- 逐条结果：`reports/expected-provenance.json`（每条含 `problemId` / `caseIndex` / `kind` /
  `provenance` / `disposition`）。

## 分类

| kind | 条数 |
| --- | --- |
| `index` | 1768 |
| `other-error` | 1302 |
| `timeout` | 432 |
| `recursion` | 409 |
| `shift` | 4 |

> 逐条重放按消息内容分类：含 `index out of range` 一律计 `index`。原审计聚合把其中 371 条
> 归入 `other-error`（`index` 1397 / `other-error` 1673），总和仍是 3915；逐条结果以本文为准。

## 溯源

| provenance | 条数 | 处置 | 是否可计入绿 |
| --- | --- | --- | --- |
| `reference-runtime-backfill` | 3878 | 已作废（`951a53ca8`） | 否（用例已删除） |
| `untraced` | 37 | 保留在 dirty metadata | **否** |
| `independent-recompute` | 1131（14 题） | 独立口径重算一致 | 是（证据见 `oracle-independent-recompute.md`） |
| `hand-written` | 0 | 无 | — |

## 未溯源明细（37 条，不得计入绿）

- `all-paths-from-source-to-target` tests[20]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[28]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[29]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[37]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[39]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[50]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[51]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[55]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[57]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[60]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[71]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[82]：`Error: list index out of range`（index）
- `all-paths-from-source-to-target` tests[91]：`Error: list index out of range`（index）
- `circular-permutation-in-binary-representation` tests[23]：`Error: 512 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[27]：`Error: 2048 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[35]：`Error: 4 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[48]：`Error: 16 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[50]：`Error: 8192 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[51]：`Error: 128 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[55]：`Error: 256 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[59]：`Error: 8191 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[62]：`Error: 16384 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[63]：`Error: 8192 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[72]：`Error: 64 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[78]：`Error: 32768 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[79]：`Error: 8 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[88]：`Error: 32 is not in list`（other-error）
- `circular-permutation-in-binary-representation` tests[90]：`Error: 12345 is not in list`（other-error）
- `letter-case-permutation` tests[56]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[68]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[70]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[80]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[82]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[99]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[117]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[119]：`Execution timed out`（timeout）
- `letter-case-permutation` tests[123]：`Execution timed out`（timeout）

## 重算

- 原记账 331 条「参考解生成」已扩为 14 题 1131 条全量重算，0 条不一致。
- 首轮 5 条不一致均归因为重算脚本自身实现错误，未覆盖原期望值。

## 绿口径

- `testCaseTotal > 0 && executed_pass === testCaseTotal && fail/blocked/not_run === 0`。
- `skipped` 是未执行用例，不抵扣分母。
- 未溯源（`untraced`）的 expected 不得计入绿。
