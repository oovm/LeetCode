# Valkyrie 四 lane 覆盖报告

- 生成时间：2026-11-02（managed 执行合同落地后复跑）
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}`、managed 合同 digest、真实启动命令与退出码）
- 工具链来源：`../nyar-vm.rs` HEAD `7e10dca6`，managed ABI 合同提交为 `ef4afe77`（`jvm`）与 `7e10dca6`（`clr`）；本轮用 nightly 从该 HEAD 重建 napi 二进制（隔离目录 `.target-managed-lane`），`../valkyrie.v` 使用当时工作树。结果是工作树快照，不是发布依赖复验。

## lane 口径

| lane | 角色 | target 来源 | 计入交付完成度 |
| --- | --- | --- | --- |
| `wasm` | 交付 lane | 各题 `legion.von` 的 `build[].target` | 是 |
| `ovm` | 执行 lane | lane 显式 `ovm` | 否 |
| `jvm` | 对照 lane | lane 显式 `jvm`，managed ABI 入口 | 否 |
| `clr` | 对照 lane | lane 显式 `clr`，managed ABI 入口 | 否 |

矩阵 JSON 的 `summary.*.green` 分母是语料总体（2842 题），单题跑测时显示 `1/2842` 属于口径噪声。本报告只按已执行子集（30 题）统计，各 lane 独立探测、独立计数，互不顶替。

## 已执行子集覆盖率（30 题）

| lane | 绿题 / 执行题 | build 通过 | 通过用例 / 用例总数 | runtime ready/blocked/pending |
| --- | --- | --- | --- | --- |
| `wasm`（交付） | 25 / 30 | 28 / 30 | 1534 / 1637 | 27 / 1 / 2 |
| `ovm`（执行） | 26 / 30 | 27 / 30 | 1595 / 1639 | 27 / 0 / 3 |
| `jvm`（对照） | 26 / 30 | 27 / 30 | 1582 / 1582 | 27 / 0 / 3 |
| `clr`（对照） | 26 / 30 | 27 / 30 | 1582 / 1582 | 27 / 0 / 3 |

四 lane 全绿 25 题：`reverse-integer`、`palindrome-number`、`add-digits`、`add-two-integers`、`base-7`、`climbing-stairs`、`power-of-two`、`number-of-steps-to-reduce-a-number-to-zero`、`subtract-the-product-and-sum-of-digits-of-an-integer`、`fibonacci-number`、`armstrong-number`、`arranging-coins`、`bulb-switcher`、`count-odd-numbers-in-an-interval-range`、`perfect-number`、`power-of-four`、`power-of-three`、`valid-perfect-square`、`ugly-number`、`count-of-matches-in-tournament`、`divisor-game`、`find-the-maximum-achievable-number`、`sum-multiples`、`smallest-even-multiple`、`n-th-tribonacci-number`。每题 `manifestFresh` 为真，runtime 由真实产物 invoke 全量 `metadata.tests` 取得，未降级断言、未删用例。

## managed lane 真实执行

`jvm` / `clr` 现在消费三件套：

- `run-contracts.txt`：真 `ExecutionManifest`，矩阵从它判定 `manifestFresh`；
- `managed-abi.json`：矩阵校验 `schema_version`、`lane`、`artifact` 文件名、`calling_convention`、入口签名，并按规范文本复算 `contract_digest`，不匹配即结构化 blocked；
- 执行命令：
  - `jvm`：`java -cp <jar> nyar.invoke.<entry> <args...>`
  - `clr`：`dotnet exec <dll> <entry> <args...>`（同目录 `<artifact>.runtimeconfig.json`）

每个 `metadata.tests` 用例单独起进程，退出码必须为 0，stdout 最后一行为返回值；`managedInvokeCommand` 记录首个用例的真实命令，`managedInvokeExitStatus` 记录全量用例的统一退出码，`managedContractDigest` 记录合同摘要。缺合同、缺入口、形参个数/类型不符、进程非零退出都不会被计为通过。

代表性证据：

- `reverse-integer`：`java -cp "...\reverse-integer-bench-jvm\leetcode-reverse-integer.jar" nyar.invoke.reverse -2147483412`，61/61，exit 0；`dotnet exec "...\leetcode-reverse-integer.dll" reverse -2147483412`，61/61，exit 0。
- `palindrome-number`：`java ... nyar.invoke.isPalindrome 1221`，77/77，exit 0；`dotnet exec ... isPalindrome 1221`，77/77，exit 0。

## 结构化 blocked 题目与根因归类

| 题目 | 用例数 | 状态 | 根因类别 | 原始诊断 |
| --- | --- | --- | --- | --- |
| `binary-gap` | 61 | `wasm` blocked，`ovm`/`jvm`/`clr` 绿 | wasm codegen / 校验失败 | `CompileError: WebAssembly.Module(): Compiling function #19 failed: i64.shr_s[1] expected type i64, found i32.wrap_i64 of type i32` |
| `alternating-digit-sum` | 57 | 四 lane ready 但用例失败 | 语料：越界且精度损坏 | `tests[13]` 输入 `1.1122233344455567e26` 超出 i64。`java` 退出码 1（`NumberFormatException`），`dotnet` 退出码 3762504530（`FormatException`），wasm 报 `Cannot convert ... to a BigInt`，ovm 报 `expected i64, got f64` |
| `add-two-numbers` | 59 | `wasm` ready 但结果错误，其余 pending | 编译器/后端缺口 | wasm：`tests[0]: expected [0,1,1,1], got [1]`；ovm：`Nyar backend requires a typed sum representation plan`；jvm/clr：`std.primitive.__usize_sub` 有解析调用但无 host provider |
| `valid-parentheses` | 148 | 四 lane pending | 前端：数组/迭代器成员解析 | `unresolved call <computed> in first at source/_.v:1748..1766` |
| `two-sum` | 80 | 四 lane pending | 前端：泛型 binder 身份不一致 | `let` initializer type `[T[GenericBinderId { owner: ItemId(3) }]]` incompatible with `[T[GenericBinderId { owner: ItemId(0) }]]` |
| 字符串/哈希题（`roman-to-integer`、`valid-anagram`、`string-to-integer-atoi`、`longest-common-prefix`、`reverse-vowels-of-a-string`、`ransom-note`、`valid-palindrome`、`happy-number`、`reverse-string`） | — | 四 lane pending（预检） | 前端：字符串/迭代器/集合成员解析 | `<computed> in first`、`infix == in contains`、`infix != in equals_repr` |

`alternating-digit-sum` 的 managed 失败是**真实执行结果**：命令、退出码与异常栈都来自本次产物，没有用其他 lane 的结果顶替。

## 上游待修（本轮发现）

1. `wasm` 位运算 lowering：`i64.shr_s` 操作数类型错误（`i32.wrap_i64`），生成非法 wasm，`binary-gap` 的交付 lane 因此失败。
2. `add-two-numbers`：wasm 运行结果与期望不符；`ovm` 缺 typed sum representation plan；`jvm`/`clr` 缺 `std.primitive.__usize_sub` host provider。
3. 前端仍阻断数组/字符串入口：`<computed>` 成员解析与泛型 binder 身份不一致。
4. 语料生成器应拒绝超过 i64 范围或超过 $2^{53}-1$ 的整数输入，避免 `alternating-digit-sum` 这类不可执行用例进入 `metadata.tests`。
