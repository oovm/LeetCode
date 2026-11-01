# Valkyrie 四 lane 覆盖报告

- 生成时间：2026-11-02
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}`）
- 工具链来源：`../nyar-vm.rs` HEAD `d41a503fc75f451e55191e0ad07e737bed387f1d`（并行会话仍在修改编译器），`../valkyrie.v` HEAD `cb2cd2b3031899039cf31a103ebc59a371fcc81f`；`@nyar/valkyrie` 本地 workspace 版本 `0.0.22`。结果是当前工作树的快照，不是发布依赖的复验。

## lane 口径

| lane | 角色 | target 来源 | 计入交付完成度 |
| --- | --- | --- | --- |
| `wasm` | 交付 lane | 各题 `legion.von` 的 `build[].target` | 是 |
| `ovm` | 执行 lane | lane 显式 `ovm` | 否 |
| `jvm` | 对照 lane | lane 显式 `jvm` | 否 |
| `clr` | 对照 lane | lane 显式 `clr` | 否 |

矩阵 JSON 的 `summary.*.green` 分母是语料总体（2842 题），单题跑测时显示 `1/2842` 属于口径噪声。本报告只按已执行子集统计，各 lane 独立计数、互不顶替。

## 已执行子集覆盖率（13 题）

| lane | 绿题 / 执行题 | 通过用例 / 用例总数 | runtime ready/blocked/pending |
| --- | --- | --- | --- |
| `wasm`（交付） | 10 / 13 | 539 / 539 | 10 / 0 / 3 |
| `ovm`（执行） | 10 / 13 | 539 / 539 | 10 / 0 / 3 |
| `jvm`（对照） | 0 / 13 | 0 / 0 | 0 / 0 / 13 |
| `clr`（对照） | 0 / 13 | 0 / 0 | 0 / 0 / 13 |

## 已转绿题目（wasm + ovm 双绿，jvm/clr 结构化成因见下）

| 题目 | wasm 用例 | ovm 用例 | wasm target | wasm `semanticClosureHash` 前 12 位 | ovm target |
| --- | --- | --- | --- | --- | --- |
| `reverse-integer` | 61/61 | 61/61 | `wasm32-unknown-unknown-wasm` | `ee4a93c360d4` | `ovm-unknown-unknown-managed` |
| `palindrome-number` | 77/77 | 77/77 | `wasm32-unknown-unknown-wasm` | `3ac34b6ed01a` | `ovm-unknown-unknown-managed` |
| `add-digits` | 51/51 | 51/51 | `wasm32-unknown-unknown-wasm` | `bff9db87b7a9` | `ovm-unknown-unknown-managed` |
| `add-two-integers` | 59/59 | 59/59 | `wasm32-unknown-unknown-wasm` | `7417f955c55d` | `ovm-unknown-unknown-managed` |
| `base-7` | 47/47 | 47/47 | `wasm32-unknown-unknown-wasm` | `02bf39aaf059` | `ovm-unknown-unknown-managed` |
| `climbing-stairs` | 16/16 | 16/16 | `wasm32-unknown-unknown-wasm` | `40686604cb4e` | `ovm-unknown-unknown-managed` |
| `power-of-two` | 97/97 | 97/97 | `wasm32-unknown-unknown-wasm` | `b1a834171eb5` | `ovm-unknown-unknown-managed` |
| `number-of-steps-to-reduce-a-number-to-zero` | 59/59 | 59/59 | `wasm32-unknown-unknown-wasm` | `11c25638a9f2` | `ovm-unknown-unknown-managed` |
| `subtract-the-product-and-sum-of-digits-of-an-integer` | 55/55 | 55/55 | `wasm32-unknown-unknown-wasm` | `eb8366eb9f93` | `ovm-unknown-unknown-managed` |
| `fibonacci-number` | 17/17 | 17/17 | `wasm32-unknown-unknown-wasm` | `bfe554ae5da7` | `ovm-unknown-unknown-managed` |

每题 `manifestFresh` 为真，runtime 由真实产物 invoke 全量 `metadata.tests` 取得，未降级断言、未删用例。

## 结构化 blocked 题目与根因归类

| 题目 | 用例数 | 四 lane 状态 | 根因类别 | 原始诊断 |
| --- | --- | --- | --- | --- |
| `valid-parentheses` | 148 | 全部 pending | 前端语义：`utf8`/std `push` 闭包 | `unresolved call 'infix >' in push at source/_.v:3008..3053` |
| `two-sum` | 80 | 全部 pending | 前端语义：`ArrayList`/`HashMap` 闭包 | 同上 |
| `add-two-numbers` | 59 | 全部 pending | 前端语义：`ArrayList` 闭包 | 同上 |
| `happy-number` | 57 | 全部 pending（预检） | 前端语义：`HashSet` 闭包 | 同上 |
| `reverse-string` | — | 全部 pending（预检） | 前端语义：`ArrayList<utf8>` 闭包 | 同上 |
| `roman-to-integer` | — | 全部 pending（预检） | 前端语义：`utf8` 闭包 | 同上 |

根因归类：

1. **前端语义缺陷（当前唯一阻断项）**：任何 `ArrayList<ut8>`/`utf8`/`HashMap`/`HashSet` 入口闭包都会拉入 std 的 `push`，其中 `infix >` 在 `usize` 上无候选，四条 lane 都在 HIR 解析阶段失败。`two-sum`、`add-two-numbers`、`valid-parentheses` 属于这一类。
2. **OVM host provider 缺口（已被上游改动遮挡）**：旧报告记录 `core.primitive.__usize_lt`（`ItemInstanceId(17)`）缺 provider。本次复跑已先命中前端 `infix >`，修好前端后需重跑确认该 provider 是否仍缺。
3. **jvm/clr 对照 lane 结构化成因（标量题）**：`SMIR007`，`function=i64.infix ==` 的 `call result type differs from declared signature`，属 MIR 合同缺陷；在字符串/数组题上更早被前端 `infix >` 拦住。

## 后续转绿条件

- 前端修复 `infix >`（`usize` 比较候选）后，重跑 `valid-parentheses`、`two-sum`、`add-two-numbers`，按真实结果更新本报告。
- OVM 若仍报 `__usize_lt` 缺 provider，需在 host provider 侧补齐后再判定 `ovm` 执行 lane。
- jvm/clr 需等 `SMIR007` 合同缺陷修复；在此之前保持 pending，禁止用其他 lane 结果填充。
