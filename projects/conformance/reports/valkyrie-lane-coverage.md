# Valkyrie 四 lane 覆盖报告

- 生成时间：2026-11-02 01:10
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}`）
- 工具链来源：`../nyar-vm.rs` HEAD `f5747e56`（并行会话仍在修改编译器），`../valkyrie.v` HEAD `856eda0`；`@nyar/valkyrie` 本地 workspace 版本 `0.0.22`，napi 二进制构建时间 `2026-11-02 00:02`。本轮复跑的是该二进制，不是 HEAD 的即时重建，结果是工作树快照而非发布依赖复验。

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
| `valid-parentheses` | 148 | 全部 pending | 前端语义：数组/迭代器成员解析 | `unresolved call <computed> in first at source/_.v:1748..1766` |
| `two-sum` | 80 | 全部 pending | 前端语义：泛型 binder 身份不一致 | `` `let` initializer type `[T[Some(GenericBinderId { owner: ItemId(3), ordinal: 0 })]]` is incompatible with the declared type `[T[Some(GenericBinderId { owner: ItemId(0), ordinal: 0 })]]` `` |
| `add-two-numbers` | 59 | 全部 pending | 前端语义：泛型 binder 身份不一致 | 同上 |
| `happy-number` | 57 | 全部 pending（预检，未复跑） | 前端语义：`HashSet` 闭包 | 旧诊断 `infix >`，待复跑 |
| `reverse-string` | — | 全部 pending（预检，未复跑） | 前端语义：`ArrayList<utf8>` 闭包 | 旧诊断 `infix >`，待复跑 |
| `roman-to-integer` | — | 全部 pending（预检，未复跑） | 前端语义：`utf8` 闭包 | 旧诊断 `infix >`，待复跑 |

根因归类（2026-11-02 01:10 复跑）：

1. **数组/迭代器成员解析（当前首要阻断）**：`valid-parentheses` 在 std `first` 的调用解析阶段失败，`<computed>` 表示接收者或成员候选未闭合。四条 lane 同源，属前端 HIR，不是 lane 差异。
2. **泛型 binder 身份不一致**：`two-sum`、`add-two-numbers` 的 `[T]` 初始化类型把同一泛型参数解析成不同 `GenericBinderId`（`ItemId(3)` 对 `ItemId(0)`），属泛型身份/实例化合同缺陷。
3. **`infix >` 已被上游推进遮挡**：旧报告的唯一阻断项不再出现在本轮复跑诊断中，说明该解析路径已变；`happy-number`、`reverse-string`、`roman-to-integer` 未复跑，不能沿用旧结论。
4. **jvm/clr 对照 lane**：旧报的 `SMIR007` 整数比较结果类型合同已有回归测试提交（`f5747e56`），但本轮二进制未重建，lane 仍 pending，不能据此宣称 lane 转绿。

## 后续转绿条件

- 前端闭合 `<computed>` 成员解析后，重跑 `valid-parentheses`。
- 泛型 binder 身份修复后，重跑 `two-sum`、`add-two-numbers`。
- 用 HEAD 重建 napi 后复跑 13 题子集，再判定 `wasm`/`ovm`/`jvm`/`clr` 各 lane 的真实绿题数。
- jvm/clr 需真实构建与用例通过，不能以 `SMIR007` 测试提交或其它 lane 结果顶替。
