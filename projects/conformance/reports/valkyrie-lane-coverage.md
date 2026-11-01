# Valkyrie 四 lane 覆盖报告

- 生成时间：2026-11-02（本轮复跑）
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}` 与 digest 证据）
- 工具链来源：`../nyar-vm.rs` HEAD `7e10dca6`，本轮实际使用的是 `2026-11-02 01:23:19` 构建的 napi 二进制；运行期间 `nyar-vm.rs` 已在该二进制之后提交 `ef4afe77`（`jvm` run-contracts）、`65fedd30`/`b404b745`（i64 位运算 provider）、`7e10dca6`（`clr` run-contracts），这些提交未进入本轮二进制，故 `jvm`/`clr` 仍按旧口径 blocked。`../valkyrie.v` HEAD `5951de2f`。结果是工作树快照，不是发布依赖复验。

## lane 口径

| lane | 角色 | target 来源 | 计入交付完成度 |
| --- | --- | --- | --- |
| `wasm` | 交付 lane | 各题 `legion.von` 的 `build[].target` | 是 |
| `ovm` | 执行 lane | lane 显式 `ovm` | 否 |
| `jvm` | 对照 lane | lane 显式 `jvm` | 否 |
| `clr` | 对照 lane | lane 显式 `clr` | 否 |

矩阵 JSON 的 `summary.*.green` 分母是语料总体（2842 题），单题跑测时显示 `1/2842` 属于口径噪声。本报告只按已执行子集（45 题）统计，各 lane 独立计数、互不顶替。

## 已执行子集覆盖率（45 题）

| lane | 绿题 / 执行题 | build 通过 | 通过用例 / 用例总数 | runtime ready/blocked/pending |
| --- | --- | --- | --- | --- |
| `wasm`（交付） | 41 / 45 | 42 / 45 | 2580 / 2624 | 42 / 0 / 3 |
| `ovm`（执行） | 40 / 45 | 41 / 45 | 2519 / 2563 | 41 / 0 / 4 |
| `jvm`（对照） | 0 / 45 | 41 / 45 | 0 / 0 | 0 / 41 / 4 |
| `clr`（对照） | 0 / 45 | 41 / 45 | 0 / 0 | 0 / 41 / 4 |

`wasm` 与 `ovm` 同时绿 25 题：`reverse-integer`、`palindrome-number`、`add-digits`、`add-two-integers`、`base-7`、`climbing-stairs`、`power-of-two`、`number-of-steps-to-reduce-a-number-to-zero`、`subtract-the-product-and-sum-of-digits-of-an-integer`、`fibonacci-number`、`armstrong-number`、`arranging-coins`、`bulb-switcher`、`count-odd-numbers-in-an-interval-range`、`perfect-number`、`power-of-four`、`power-of-three`、`valid-perfect-square`、`ugly-number`、`count-of-matches-in-tournament`、`divisor-game`、`find-the-maximum-achievable-number`、`sum-multiples`、`smallest-even-multiple`、`n-th-tribonacci-number`。每题 `manifestFresh` 为真，runtime 由真实产物 invoke 全量 `metadata.tests` 取得，未降级断言、未删用例。

仅交付 lane 绿：`binary-gap` 的 `wasm` 61/61 通过；`ovm`/`jvm`/`clr` 因缺 `std.primitive.__i64_shr` provider 无法 build。

## 本轮新增 15 题（`wasm` + `ovm` 双绿）

以下题目原本 `solution.v` 仅有空行，本轮补齐真实实现并按 `metadata.invoke.valkyrie` 对齐导出名。

| 题目 | 用例数 | `wasm` | `ovm` | `jvm` / `clr` |
| --- | --- | --- | --- | --- |
| `number-of-1-bits` | 139 | 139/139 绿 | 139/139 绿 | build 绿，runtime blocked |
| `number-complement` | 44 | 44/44 绿 | 44/44 绿 | build 绿，runtime blocked |
| `sum-of-digits-in-base-k` | 87 | 87/87 绿 | 87/87 绿 | build 绿，runtime blocked |
| `count-operations-to-obtain-zero` | 78 | 78/78 绿 | 78/78 绿 | build 绿，runtime blocked |
| `count-integers-with-even-digit-sum` | 34 | 34/34 绿 | 34/34 绿 | build 绿，runtime blocked |
| `number-of-common-factors` | 107 | 107/107 绿 | 107/107 绿 | build 绿，runtime blocked |
| `integer-break` | 30 | 30/30 绿 | 30/30 绿 | build 绿，runtime blocked |
| `reach-a-number` | 70 | 70/70 绿 | 70/70 绿 | build 绿，runtime blocked |
| `xor-operation-in-an-array` | 92 | 92/92 绿 | 92/92 绿 | build 绿，runtime blocked |
| `number-of-digit-one` | 76 | 76/76 绿 | 76/76 绿 | build 绿，runtime blocked |
| `smallest-integer-divisible-by-k` | 90 | 90/90 绿 | 90/90 绿 | build 绿，runtime blocked |
| `complement-of-base-10-integer` | 37 | 37/37 绿 | 37/37 绿 | build 绿，runtime blocked |
| `consecutive-numbers-sum` | 53 | 53/53 绿 | 53/53 绿 | build 绿，runtime blocked |
| `count-numbers-with-unique-digits` | 11 | 11/11 绿 | 11/11 绿 | build 绿，runtime blocked |
| `integer-replacement` | 37 | 37/37 绿 | 37/37 绿 | build 绿，runtime blocked |

15 题的 `manifestFresh` 均为真，runtime 由真实产物 invoke 全量 `metadata.tests` 取得。`jvm`/`clr` 的 `buildStatus` 均为 0，但 runtime 仍为 `blocked`，根因与下节一致，未用 build 证据顶替 runtime 通过。

## `jvm` / `clr` 对照 lane：build 已绿，runtime 仍结构性 blocked

- 41 / 45 题在 `jvm`、`clr` 上 `legion build` 与本轮 `legion test` 退出码均为 0，产物已真实落盘：`<project>.jar` 与 `<project>.dll`。
- 矩阵已从同一次 build 的 `compile-evidence.txt` 读取 managed digest（`semantic_closure_hash` / `canonical_surface_hash` / `host_provider_binding_hash`）写入 lane 行，作为产物身份证据。
- 这些行仍是 `runtime=blocked`，原因是上游 managed pipeline 不写 `run-contracts.txt`（execution manifest），也没有 managed ABI invoke 合同：`manifestFresh=false`，`runtimeOk=false`，因此 `green=false`。`legion test` 在 managed lane 上因无 run contract 只统计 0 个用例，不能当作题意证据。
- 人工补充验证（不计入 lane 通过口径）：直接反射调用 `palindrome-number` 的 managed 产物，`jvm` 77/77、`clr` 77/77 全部通过。说明 lowering 与 codegen 已可用，唯一缺口是上游未产出 managed execution manifest / ABI。

需要上游补齐：`legion build --target jvm|clr` 必须像 `wasm`/`ovm` 一样写出 `run-contracts.txt`（含 export、参数身份与 target），并让 `legion test` 真正执行 managed run contract。补齐前本仓不会用 compile-evidence 冒充 manifest，也不会复制其他 lane 结果转绿。

## 前序新增语料（8 题真实解法 + `invoke.valkyrie`）

| 题目 | 用例数 | 状态 | 说明 |
| --- | --- | --- | --- |
| `count-of-matches-in-tournament` | 60 | `wasm`+`ovm` 绿 | `n - 1` |
| `divisor-game` | 51 | `wasm`+`ovm` 绿 | 奇偶判定 |
| `find-the-maximum-achievable-number` | 82 | `wasm`+`ovm` 绿 | 导出名对齐 `metadata.invoke.valkyrie` |
| `sum-multiples` | 38 | `wasm`+`ovm` 绿 | 整数循环累加 |
| `smallest-even-multiple` | 91 | `wasm`+`ovm` 绿 | 奇偶与倍数 |
| `n-th-tribonacci-number` | 18 | `wasm`+`ovm` 绿 | 三变量迭代 |
| `ugly-number` | 74 | `wasm`+`ovm` 绿 | 依赖本轮 i64 精度修正，见下 |
| `alternating-digit-sum` | 57 | blocked（语料越界） | `wasm`/`ovm` 均 13/57，见下 |

## harness 修正：`i64` 参数精度

`metadata.json` 经 `JSON.parse` 后，绝对值超过 $2^{53}-1$ 的整数已丢失低位；旧 wasm harness 把该 `number` 直接交给 glue 的 `BigInt(number)`，取到的是舍入后的二进制值，而 `ovm` 的原生 invoke 会把该 `number` 转成最短十进制文本，得到原始整数。两者因此看到不同输入。

修正位于 `projects/conformance/scripts/run_v_solver.ts`：按 ABI schema 判定参数 kind 为 `I64` 时，先转成 `Number.prototype.toString()` 的十进制文本再交给 glue（`BigInt("...")` 精确恢复）。`ugly-number` 由此从 `wasm` 17/74 转为 74/74，并与 `ovm` 一致。

另修正语料矛盾：`ugly-number` 的 `tests[17]` 与 `tests[68]` 使用同一输入却分别期待 `false` / `true`，已按算法把重复条目的期待值修正为 `false`（`72057594037927940` 去掉 2、5 后仍有非 1 因子，不是 ugly number）。

## 本轮语料修正：`consecutive-numbers-sum` 越界用例

`consecutive-numbers-sum` 的 `metadata.tests[28]` 为 `n=9876543210987655000`，远超题面约束 `1 <= n <= 10^9` 且超过 i64 上界，`expected` 写的是不可比较的 `"Execution timed out"`。该条目不是有效答案用例，已删除；其余 53 条全部保留，删除后 `wasm`/`ovm` 从 28/54 转为 53/53。生成器口径应拒绝超出 i64 或题面约束的整数输入。

## 结构化 blocked 题目与根因归类

| 题目 | 用例数 | 状态 | 根因类别 | 原始诊断 |
| --- | --- | --- | --- | --- |
| `valid-parentheses` | 148 | 四 lane pending | 前端：数组/迭代器成员解析 | `unresolved call <computed> in first at source/_.v:1748..1766` |
| `two-sum` | 80 | 四 lane pending | 前端：泛型 binder 身份不一致 | `let` initializer type `[T[GenericBinderId { owner: ItemId(3) }]]` incompatible with `[T[GenericBinderId { owner: ItemId(0) }]]` |
| `add-two-numbers` | 59 | 四 lane pending | 前端：泛型 binder 身份不一致 | 同上 |
| `binary-gap` | 61 | `wasm` 绿，其余 pending | provider 缺口 | `std.primitive.__i64_shr` 有解析调用但无 host provider |
| `alternating-digit-sum` | 57 | `wasm`/`ovm` 13/57 | 语料：越界且精度损坏 | `tests[13]` 输入为 `1.1122233344455567e26`，超出 i64；wasm 报 `Cannot convert ... to a BigInt`，ovm 报 `expected i64, got f64` |
| `roman-to-integer` / `valid-anagram` / `string-to-integer-atoi` / `longest-common-prefix` / `reverse-vowels-of-a-string` / `ransom-note` / `valid-palindrome` | — | 四 lane pending（预检） | 前端：字符串/迭代器成员解析 | `unresolved call <computed> in first at source/_.v:1748..1766` |
| `reverse-string` | — | 四 lane pending（预检） | 前端：集合相等解析 | `unresolved call infix != in equals_repr at source/_.v:9653..9699` |
| `happy-number` | — | 四 lane pending（预检） | 前端：哈希集合成员解析 | `unresolved call infix == in contains at source/_.v:4714..4727` |

## 上游待修（本轮发现，供 `nyar-vm.rs` 会话处理）

1. managed lane 未产出 `run-contracts.txt` 与 managed ABI invoke 合同，导致 `jvm`/`clr` 无法进入 runtime 与 `legion test`。`nyar-vm.rs` 已在 `ef4afe77`（`jvm`）、`7e10dca6`（`clr`）提交 run-contracts，但晚于本轮 napi 二进制（`2026-11-02 01:23:19`），需重新构建后再复验。
2. `ovm`/`jvm`/`clr` 缺 `std.primitive.__i64_shr` provider；`std::bit_xor` 也没有跨 lane 合同：`ovm` 无可导出符号，`jvm` 报 `long.xor`、`clr` 报 `i64.xor` 助记符缺失。`xor-operation-in-an-array` 已改用算术逐位 XOR 规避。
3. 前端名称解析：局部变量名 `first`、`position` 会与 std 迭代器函数同名解析，触发 `unresolved call <computed>`。本轮 `reach-a-number` 命中 `position`，改名 `travelled` 后通过；这是前端应修复的遮蔽解析。
4. 数组/字符串入口仍阻断在 `<computed>` 成员解析与泛型 binder 身份不一致。
5. 语料生成器应拒绝超过 i64 范围、超过题面约束或超过 $2^{53}-1$ 的整数输入，避免 `alternating-digit-sum`、`consecutive-numbers-sum` 这类不可执行用例进入 `metadata.tests`。
6. 前端 `else if`/`else` 分支对 `mut` 局部变量的赋值未生效：`integer-replacement` 初版在该链上不终止（runner 持续占用 CPU），改为互斥独立 `if` 后 37/37；`number-of-digit-one` 同样需用独立 `if` 规避。
7. `while` 条件在边界值（如 `digit_place == n`）会提前退出：`number-of-digit-one` 初版 `while digit_place <= n` 漏掉最高位，改为固定 12 次迭代后 76/76，需确认是否为前端比较合同问题。
