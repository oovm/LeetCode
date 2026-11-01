# Valkyrie 四 lane 覆盖报告

- 生成时间：2026-11-02（语料缺陷登记与扩题后复跑）
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}`、managed 合同 digest、真实启动命令与退出码）
- 工具链来源：`../nyar-vm.rs` HEAD `7e10dca6`（managed ABI 合同为 `ef4afe77` / `7e10dca6`），本轮用 nightly 从该 HEAD 重建 napi 二进制；`../valkyrie.v` 使用当时工作树。结果是工作树快照，不是发布依赖复验。

## lane 口径

| lane | 角色 | target 来源 | 计入交付完成度 |
| --- | --- | --- | --- |
| `wasm` | 交付 lane | 各题 `legion.von` 的 `build[].target` | 是 |
| `ovm` | 执行 lane | lane 显式 `ovm` | 否 |
| `jvm` | 对照 lane | lane 显式 `jvm` + `managed-abi.json` | 否 |
| `clr` | 对照 lane | lane 显式 `clr` + `managed-abi.json` | 否 |

矩阵 JSON 的 `summary.*.green` 分母是语料总体（2842 题），单题跑测时显示 `1/2842` 属于口径噪声。本报告只按已执行子集（42 题）统计，各 lane 独立探测、独立计数，互不顶替。

## 已执行子集覆盖率（42 题）

| lane | 绿题 / 执行题 | build 通过 | 通过用例 / 用例总数 | runtime ready/blocked/pending |
| --- | --- | --- | --- | --- |
| `wasm`（交付） | 36 / 42 | 40 / 42 | 2370 / 2520 | 39 / 1 / 2 |
| `ovm`（执行） | 37 / 42 | 39 / 42 | 2431 / 2522 | 39 / 0 / 3 |
| `jvm`（对照） | 37 / 42 | 39 / 42 | 2388 / 2388 | 39 / 0 / 3 |
| `clr`（对照） | 37 / 42 | 39 / 42 | 2388 / 2388 | 39 / 0 / 3 |

四 lane 全绿 36 题：`reverse-integer`、`palindrome-number`、`add-digits`、`add-two-integers`、`base-7`、`climbing-stairs`、`power-of-two`、`number-of-steps-to-reduce-a-number-to-zero`、`subtract-the-product-and-sum-of-digits-of-an-integer`、`fibonacci-number`、`armstrong-number`、`arranging-coins`、`bulb-switcher`、`count-odd-numbers-in-an-interval-range`、`perfect-number`、`power-of-four`、`power-of-three`、`valid-perfect-square`、`ugly-number`、`count-of-matches-in-tournament`、`divisor-game`、`find-the-maximum-achievable-number`、`sum-multiples`、`smallest-even-multiple`、`n-th-tribonacci-number`、`find-the-pivot-integer`、`calculate-money-in-leetcode-bank`、`harshad-number`、`minimum-moves-to-reach-target-score`、`count-total-number-of-colored-cells`、`divisible-and-non-divisible-sums-difference`、`count-square-sum-triples`、`number-of-common-factors`、`count-operations-to-obtain-zero`、`number-of-1-bits`、`count-integers-with-even-digit-sum`。

本轮新增四 lane 绿 11 题：`find-the-pivot-integer`(52)、`calculate-money-in-leetcode-bank`(50)、`harshad-number`(53)、`minimum-moves-to-reach-target-score`(140)、`count-total-number-of-colored-cells`(37)、`divisible-and-non-divisible-sums-difference`(93)、`count-square-sum-triples`(23)、`number-of-common-factors`(107)、`count-operations-to-obtain-zero`(78)、`number-of-1-bits`(139)、`count-integers-with-even-digit-sum`(34)。全部来自真实产物 invoke 全量 `metadata.tests`，未降级断言、未删用例。

## managed lane 真实执行

`jvm` / `clr` 消费 `run-contracts.txt`（真 ExecutionManifest）与 `managed-abi.json`，每个用例单独起进程，退出码必须为 0：

- `jvm`：`java -cp <jar> nyar.invoke.<entry> <args...>`
- `clr`：`dotnet exec <dll> <entry> <args...>`（同目录 `<artifact>.runtimeconfig.json`）

矩阵校验 `schema_version`、`lane`、`artifact` 文件名、`calling_convention`、入口签名，并按规范文本复算 `contract_digest`；缺合同、artifact/lane 不符或 digest 不匹配一律结构化 blocked。行内记录 `managedContractDigest`、`managedInvokeCommand`、`managedInvokeExitStatus` 与用例计数。未用 compile-evidence 冒充 manifest，也未跨 lane 借数。

## 语料缺陷：越界整数

`alternating-digit-sum` 的 `tests[13]` 输入为 `1.1122233344455567e26`，超出 i64 表示范围且存盘时已因 JSON 精度丢失。处理方式是按用户要求**保留原值并显式标注**，不删除、不替换成能通过的值：

```json
{
  "args": { "n": 1.1122233344455567e26 },
  "expected": 5,
  "corpusDefect": {
    "code": "input_beyond_i64_range",
    "detail": "该输入的原始整数超出 i64 表示范围，且存盘时已因 JSON 数值精度丢失；保留原值仅作缺陷记录，不可作为可执行用例，也不得以能通过的值替换。",
    "source": "metadata-generation-precision-loss"
  }
}
```

同类缺陷清扫（扫描 `projects/problems/*/metadata.json` 中字符串之外的数值字面量）：

- 扫描 2842 份 metadata，命中 **100 个 slug、1939 处**（去重后字面量数见 JSON）。
- 分类：`integer_beyond_i64` 338、`integer_beyond_safe_integer` 639、`float_literal_beyond_safe_integer` 962。
- 完整逐 slug 清单（含 `key`、原始 token、原因、出现次数）落盘在 [`unsafe-integer-corpus.json`](../reports/unsafe-integer-corpus.json)。

受影响 slug 与出现次数：

| slug | 出现 | 去重字面量 |
| --- | --- | --- |
| `product-of-array-except-self` | 237 | 138 |
| `find-the-k-th-lucky-number` | 76 | 67 |
| `find-original-array-from-doubled-array` | 73 | 72 |
| `add-strings` | 66 | 40 |
| `maximum-binary-string-after-change` | 65 | 37 |
| `add-binary` | 63 | 48 |
| `smallest-divisible-digit-product-ii` | 61 | 49 |
| `largest-odd-number-in-string` | 60 | 51 |
| `longest-square-streak-in-an-array` | 60 | 30 |
| `paint-fence` | 57 | 57 |
| `find-the-closest-palindrome` | 56 | 41 |
| `form-largest-integer-with-digits-that-add-up-to-target` | 56 | 32 |
| `remove-digit-from-number-to-maximize-result` | 55 | 55 |
| `multiply-strings` | 50 | 44 |
| `encode-number` | 44 | 42 |
| `convert-to-base-2` | 42 | 27 |
| `find-the-maximum-number-of-elements-in-subset` | 41 | 31 |
| `largest-number` | 39 | 37 |
| `largest-number-after-digit-swaps-by-parity` | 34 | 32 |
| `smallest-value-of-the-rearranged-number` | 34 | 22 |
| `shortest-and-lexicographically-smallest-beautiful-string` | 32 | 17 |
| `smallest-good-base` | 32 | 28 |
| `next-palindrome-using-same-digits` | 29 | 28 |
| `combination-sum-iv` | 28 | 27 |
| `split-with-minimum-sum` | 27 | 26 |
| `maximum-difference-by-remapping-a-digit` | 26 | 25 |
| `minimum-addition-to-make-integer-beautiful` | 26 | 18 |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | 25 | 23 |
| `largest-palindromic-number` | 24 | 23 |
| `unique-paths` | 24 | 16 |
| `find-the-k-beauty-of-a-number` | 22 | 18 |
| `largest-number-after-mutating-substring` | 18 | 15 |
| `maximum-odd-binary-number` | 18 | 16 |
| `reverse-bits` | 18 | 17 |
| `next-greater-numerically-balanced-number` | 17 | 17 |
| `largest-multiple-of-three` | 15 | 14 |
| `next-greater-element-iii` | 15 | 15 |
| `minimum-possible-integer-after-at-most-k-adjacent-swaps-on-digits` | 14 | 14 |
| `monotone-increasing-digits` | 14 | 14 |
| `string-transformation` | 14 | 12 |
| `lexicographically-smallest-string-after-a-swap` | 13 | 13 |
| `special-binary-string` | 13 | 13 |
| `sort-the-jumbled-numbers` | 12 | 10 |
| `count-and-say` | 10 | 10 |
| `count-the-number-of-powerful-integers` | 9 | 7 |
| `find-the-kth-largest-integer-in-the-array` | 8 | 6 |
| `add-to-array-form-of-integer` | 7 | 7 |
| `lexicographically-smallest-string-after-applying-operations` | 7 | 7 |
| `minimum-garden-perimeter-to-collect-enough-apples` | 7 | 6 |
| `sqrtx` | 7 | 5 |
| `coin-change-ii` | 6 | 6 |
| `find-xor-beauty-of-array` | 6 | 6 |
| `maximum-sized-array` | 6 | 6 |
| `maximum-swap` | 6 | 6 |
| `maximum-value-after-insertion` | 6 | 6 |
| `minimum-cost-to-make-array-equalindromic` | 6 | 6 |
| `alternating-digit-sum` | 5 | 5 |
| `count-the-digits-that-divide-a-number` | 5 | 5 |
| `maximum-xor-after-operations` | 5 | 2 |
| `thousand-separator` | 5 | 5 |
| `find-the-maximum-factor-score-of-array` | 4 | 4 |
| `powx-n` | 4 | 4 |
| `reconstruct-original-digits-from-english` | 4 | 4 |
| `smallest-number-with-given-digit-product` | 4 | 4 |
| `confusing-number` | 3 | 3 |
| `find-the-largest-palindrome-divisible-by-k` | 3 | 2 |
| `least-operators-to-express-number` | 3 | 3 |
| `longest-nice-subarray` | 3 | 3 |
| `maximum-xor-product` | 3 | 3 |
| `minimizing-array-after-replacing-pairs-with-their-product` | 3 | 1 |
| `sort-characters-by-frequency` | 3 | 2 |
| `sum-of-square-numbers` | 3 | 3 |
| `binary-trees-with-factors` | 2 | 2 |
| `calculate-digit-sum-of-a-string` | 2 | 2 |
| `find-the-array-concatenation-value` | 2 | 2 |
| `find-the-sum-of-encrypted-integers` | 2 | 2 |
| `hamming-distance` | 2 | 2 |
| `largest-divisible-subset` | 2 | 2 |
| `max-difference-you-can-get-from-changing-an-integer` | 2 | 2 |
| `maximum-area-rectangle-with-point-constraints-ii` | 2 | 1 |
| `number-of-subarrays-with-lcm-equal-to-k` | 2 | 1 |
| `numbers-with-repeated-digits` | 2 | 2 |
| `permutations-iv` | 2 | 2 |
| `remove-trailing-zeros-from-a-string` | 2 | 1 |
| `replace-non-coprime-numbers-in-array` | 2 | 2 |
| `sum-of-number-and-its-reverse` | 2 | 2 |
| `ugly-number` | 2 | 1 |
| `arithmetic-slices-ii-subsequence` | 1 | 1 |
| `binary-number-with-alternating-bits` | 1 | 1 |
| `closest-divisors` | 1 | 1 |
| `convert-a-number-to-hexadecimal` | 1 | 1 |
| `count-special-integers` | 1 | 1 |
| `distinct-subsequences` | 1 | 1 |
| `excel-sheet-column-number` | 1 | 1 |
| `find-the-k-th-character-in-string-game-ii` | 1 | 1 |
| `find-unique-binary-string` | 1 | 1 |
| `maximum-product-subarray` | 1 | 1 |
| `minimum-array-end` | 1 | 1 |
| `reordered-power-of-2` | 1 | 1 |
| `separate-the-digits-in-an-array` | 1 | 1 |

其中 `count-the-digits-that-divide-a-number` 的首个越界用例是 `tests[30]`（`2.223334445556668e+23`），四 lane 都因该值无法进入 i64 而失败；该题解法本身正确，按语料缺陷记录，不改用例。

## 结构化 blocked 题目与根因归类

| 题目 | 用例数 | 状态 | 根因类别 | 原始诊断 |
| --- | --- | --- | --- | --- |
| `binary-gap` | 61 | `wasm` blocked，其余三 lane 绿 | wasm codegen / 校验失败 | `CompileError: WebAssembly.Module(): Compiling function #19 failed: i64.shr_s[1] expected type i64, found i32.wrap_i64 of type i32` |
| `alternating-digit-sum` | 57 | 四 lane ready 但用例失败 | 语料缺陷（已标注） | `tests[13]` 超出 i64。`java` 退出码 1（`NumberFormatException`），`dotnet` 退出码 3762504530（`FormatException`），wasm `Cannot convert ... to a BigInt`，ovm `expected i64, got f64` |
| `count-the-digits-that-divide-a-number` | 77 | 四 lane ready 但用例失败 | 语料缺陷（未标注，见扫描清单） | `tests[30]` 为 `2.223334445556668e+23`，超出 i64 且精度已损 |
| `add-two-numbers` | 59 | `wasm` ready 但结果错误，其余 pending | 已知 codegen 缺陷（已转 emitter 会话） | wasm `tests[0]: expected [0,1,1,1], got [1]`；ovm `Nyar backend requires a typed sum representation plan`；jvm/clr 缺 `std.primitive.__usize_sub` provider。保持结构化失败记录，等 emitter 修复后复跑 |
| `valid-parentheses` | 148 | 四 lane pending | 前端：数组/迭代器成员解析 | `unresolved call <computed> in first at source/_.v:1748..1766` |
| `two-sum` | 80 | 四 lane pending | 前端：泛型 binder 身份不一致 | `let` initializer type `[T[GenericBinderId { owner: ItemId(3) }]]` incompatible with `[T[GenericBinderId { owner: ItemId(0) }]]` |
| 字符串/哈希题（`roman-to-integer`、`valid-anagram`、`string-to-integer-atoi`、`longest-common-prefix`、`reverse-vowels-of-a-string`、`ransom-note`、`valid-palindrome`、`happy-number`、`reverse-string`） | — | 四 lane pending（预检） | 前端：字符串/迭代器/集合成员解析 | `<computed> in first`、`infix == in contains`、`infix != in equals_repr` |

## 上游待修（本轮发现）

1. `wasm` 位运算 lowering：`i64.shr_s` 操作数类型错误（`i32.wrap_i64`），生成非法 wasm，`binary-gap` 交付 lane 失败。
2. `else if` 链在 `wasm` / `ovm` 被错误降低为死循环：`minimum-moves-to-reach-target-score` 初版（`else if` 形式）在 target=2 输入上无限循环；改为语义等价的嵌套 `if` 后 140/140 通过。请上游修复 `else if` lowering。
3. `add-two-numbers`：wasm 结果与期望不符；`ovm` 缺 typed sum representation plan；`jvm`/`clr` 缺 `std.primitive.__usize_sub` provider。
4. 前端仍阻断数组/字符串入口：`<computed>` 成员解析与泛型 binder 身份不一致。
5. 语料生成器必须拒绝超过 i64 或 JSON 安全整数范围的数值输入；当前已命中 100 个 slug、1939 处。
