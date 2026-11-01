# Valkyrie 四 lane 覆盖报告

- 生成时间：2026-11-02（解析修复 + 位运算补声明 + `jvm`/`clr` provider 修复后复跑；同日八题定向复验；同日两题语料修复复跑 + 十题新增覆盖）
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}`、managed 合同 digest、真实启动命令与退出码）
- 工具链来源：`../nyar-vm.rs` HEAD `a1196dab` 加工作树，nightly 重建 napi 二进制；`../valkyrie.v` HEAD `9eb52f0` 加工作树（`Utf8Text` 签名对齐 + `u32` provider）；oaks 解析前端 `a202114d`（turbofish 修复）。结果是工作树快照，不是发布依赖复验。

## lane 口径

| lane | 角色 | target 来源 | 计入交付完成度 |
| --- | --- | --- | --- |
| `wasm` | 交付 lane | 各题 `legion.von` 的 `build[].target` | 是 |
| `ovm` | 执行 lane | lane 显式 `ovm` | 否 |
| `jvm` | 对照 lane | lane 显式 `jvm` + `managed-abi.json` | 否 |
| `clr` | 对照 lane | lane 显式 `clr` + `managed-abi.json` | 否 |

矩阵 JSON 的 `summary.*.green` 分母是语料总体（2842 题），单题跑测时显示 `1/2842` 属于口径噪声。本报告只按**本次复跑子集**统计，各 lane 独立探测、独立计数，互不顶替。

## 本次复跑子集覆盖率（29 题 + `reverse-string` 崩溃）

| lane | 绿题 / 执行题 | build 通过 | 通过用例 / 用例总数 | runtime ready/blocked/pending |
| --- | --- | --- | --- | --- |
| `wasm`（交付） | 22 / 29 | 22 / 29 | 1497 / 1497 | 22 / 0 / 7 |
| `ovm`（执行） | 17 / 29 | 17 / 29 | 990 / 990 | 17 / 0 / 12 |
| `jvm`（对照） | 17 / 29 | 17 / 29 | 990 / 990 | 17 / 0 / 12 |
| `clr`（对照） | 17 / 29 | 17 / 29 | 990 / 990 | 17 / 0 / 12 |

上一版 42 题统计来自更早的工具链快照，未在当前 HEAD 复验，已由本节取代。历史 36 题四 lane 全绿记录不再作为当前证据。

逐题结果（`GREEN` = build 通过且全量 `metadata.tests` 通过）：

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `binary-gap` | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 |
| `valid-parentheses` | GREEN 148/148 | build blocked | build blocked | build blocked |
| `add-two-numbers` | GREEN 59/59 | build blocked | build blocked | build blocked |
| `roman-to-integer` | GREEN 94/94 | build blocked | build blocked | build blocked |
| `valid-palindrome` | GREEN 21/21 | build blocked | build blocked | build blocked |
| `string-to-integer-atoi` | GREEN 185/185 | build blocked | build blocked | build blocked |
| `two-sum` | build blocked | build blocked | build blocked | build blocked |
| `valid-anagram` | build blocked | build blocked | build blocked | build blocked |
| `ransom-note` | build blocked | build blocked | build blocked | build blocked |
| `reverse-vowels-of-a-string` | build blocked | build blocked | build blocked | build blocked |
| `integer-to-roman` | build blocked | build blocked | build blocked | build blocked |
| `longest-common-prefix` | build blocked | build blocked | build blocked | build blocked |
| `happy-number` | build blocked | build blocked | build blocked | build blocked |
| `alternating-digit-sum` | GREEN 57/57 | GREEN 57/57 | GREEN 57/57 | GREEN 57/57 |
| `count-the-digits-that-divide-a-number` | GREEN 77/77 | GREEN 77/77 | GREEN 77/77 | GREEN 77/77 |
| `reverse-string` | 崩溃（无 JSON 行） | 崩溃 | 崩溃 | 崩溃 |

本轮新增覆盖 14 题，全部四 lane GREEN（当前 napi 重建后真实跑测，非旧缓存）：

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `harshad-number` | GREEN 53/53 | GREEN 53/53 | GREEN 53/53 | GREEN 53/53 |
| `calculate-money-in-leetcode-bank` | GREEN 50/50 | GREEN 50/50 | GREEN 50/50 | GREEN 50/50 |
| `find-the-pivot-integer` | GREEN 52/52 | GREEN 52/52 | GREEN 52/52 | GREEN 52/52 |
| `smallest-even-multiple` | GREEN 91/91 | GREEN 91/91 | GREEN 91/91 | GREEN 91/91 |
| `sum-multiples` | GREEN 38/38 | GREEN 38/38 | GREEN 38/38 | GREEN 38/38 |
| `divisor-game` | GREEN 51/51 | GREEN 51/51 | GREEN 51/51 | GREEN 51/51 |
| `count-of-matches-in-tournament` | GREEN 60/60 | GREEN 60/60 | GREEN 60/60 | GREEN 60/60 |
| `perfect-number` | GREEN 67/67 | GREEN 67/67 | GREEN 67/67 | GREEN 67/67 |
| `base-7` | GREEN 47/47 | GREEN 47/47 | GREEN 47/47 | GREEN 47/47 |
| `number-of-steps-to-reduce-a-number-to-zero` | GREEN 59/59 | GREEN 59/59 | GREEN 59/59 | GREEN 59/59 |
| `subtract-the-product-and-sum-of-digits-of-an-integer` | GREEN 55/55 | GREEN 55/55 | GREEN 55/55 | GREEN 55/55 |
| `fibonacci-number` | GREEN 17/17 | GREEN 17/17 | GREEN 17/17 | GREEN 17/17 |
| `climbing-stairs` | GREEN 16/16 | GREEN 16/16 | GREEN 16/16 | GREEN 16/16 |
| `number-of-1-bits` | GREEN 139/139 | GREEN 139/139 | GREEN 139/139 | GREEN 139/139 |

这 14 题合计 795 个用例，四 lane 各自全量通过，说明纯数值/整型路径已经不缺 provider 或载体合同。剩余阻塞集中在字符串 + `HashMap` + 数组泛型载体三类。

### 十题新增覆盖（同日，当前 HEAD `a1196dab` + 工作树）

本轮再增 10 题纯整数标量题（算术 / 循环 / 手工位展开，无 `HashMap`、字符串、`Option`、数组分配），全部四 lane GREEN，合计 814 个用例：

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `palindrome-number` | GREEN 77/77 | GREEN 77/77 | GREEN 77/77 | GREEN 77/77 |
| `power-of-two` | GREEN 97/97 | GREEN 97/97 | GREEN 97/97 | GREEN 97/97 |
| `power-of-three` | GREEN 99/99 | GREEN 99/99 | GREEN 99/99 | GREEN 99/99 |
| `power-of-four` | GREEN 55/55 | GREEN 55/55 | GREEN 55/55 | GREEN 55/55 |
| `add-digits` | GREEN 51/51 | GREEN 51/51 | GREEN 51/51 | GREEN 51/51 |
| `count-odd-numbers-in-an-interval-range` | GREEN 93/93 | GREEN 93/93 | GREEN 93/93 | GREEN 93/93 |
| `reverse-integer` | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 |
| `xor-operation-in-an-array` | GREEN 92/92 | GREEN 92/92 | GREEN 92/92 | GREEN 92/92 |
| `number-of-common-factors` | GREEN 107/107 | GREEN 107/107 | GREEN 107/107 | GREEN 107/107 |
| `find-the-maximum-achievable-number` | GREEN 82/82 | GREEN 82/82 | GREEN 82/82 | GREEN 82/82 |

### 八题定向复验（同日，当前 HEAD `a1196dab` + 工作树）

对受阻题逐题重跑矩阵，每 lane 结构化诊断保持不变，未出现新的假绿：

| 题目 | wasm | ovm | jvm | clr | 结构化根因 |
| --- | --- | --- | --- | --- | --- |
| `two-sum` | blocked | blocked | blocked | blocked | `hashmap-insert-instance-undeclared` |
| `valid-anagram` | blocked | blocked | blocked | blocked | `hashmap-insert-instance-undeclared` |
| `ransom-note` | blocked | blocked | blocked | blocked | `hashmap-insert-instance-undeclared` |
| `reverse-vowels-of-a-string` | blocked | blocked | blocked | blocked | `qualified-turbofish-call-unresolved` |
| `integer-to-roman` | blocked | blocked | blocked | blocked | `qualified-turbofish-call-unresolved` |
| `longest-common-prefix` | blocked | blocked | blocked | blocked | `qualified-turbofish-call-unresolved` |
| `happy-number` | blocked | blocked | blocked | blocked | `generic-constraint-eq-unresolved` |
| `reverse-string` | 崩溃 | 崩溃 | 崩溃 | 崩溃 | `wasm-plan-encode-slot-conflict` |
| `add-two-numbers` | GREEN 59/59 | blocked | blocked | blocked | `ovm-typed-sum-plan-missing` + `managed-arraylist-i64-unsupported` |

同时用 `../valkyrie.v/examples/array-probe`（`values⁅0⁆.unwrap()`、`values = std::collection::push(values, 4)`、`if first > 0`）以当前 napi 执行 `legion build --target wasm`，成功产出 `main.wasm` / `main.mjs`：数组下标 `⁅ ⁆` 与 `infix >` 在真实 wasm 编译路径上已可用，不再属于前端阻塞。仍卡住的是语义层的限定路径 turbofish 绑定与 `where T: Equal` 内的 `infix ==`。

`reverse-string` 的编译线程 panic 会让矩阵进程直接退出（`-1073740791`），因此该题没有 JSON 行，属于证据缺口，不是通过。

本轮相对上一版的真实跃迁：`binary-gap` 由 wasm blocked 变为四 lane 全绿；`valid-parentheses`、`roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi`、`add-two-numbers` 的 wasm 交付 lane 全部变为真实产物全量用例通过。原因是两项上游修复：

1. oaks `parse_primary_expression` 不再把 `::<` 前的 `::` 当作路径段，`option_none::<T>()` 等 turbofish 调用恢复可解析（oaks `a202114d`）。
2. `valkyrie.v` 的 10 个 primitive 补齐 `&` / `|` / `^` / `<<` / `>>` 的 `infix` 声明，std `Utf8Text.char_at` 的位运算不再报 `unresolved call infix <<`（`valkyrie.v` `07aa313`）。


## managed lane 真实执行

`jvm` / `clr` 消费 `run-contracts.txt`（真 ExecutionManifest）与 `managed-abi.json`，每个用例单独起进程，退出码必须为 0：

- `jvm`：`java -cp <jar> nyar.invoke.<entry> <args...>`
- `clr`：`dotnet exec <dll> <entry> <args...>`（同目录 `<artifact>.runtimeconfig.json`）

矩阵校验 `schema_version`、`lane`、`artifact` 文件名、`calling_convention`、入口签名，并按规范文本复算 `contract_digest`；缺合同、artifact/lane 不符或 digest 不匹配一律结构化 blocked。行内记录 `managedContractDigest`、`managedInvokeCommand`、`managedInvokeExitStatus` 与用例计数。未用 compile-evidence 冒充 manifest，也未跨 lane 借数。

## 语料缺陷：越界整数（本轮已修复两题）

`alternating-digit-sum`（#2544，官方约束 `1 <= n <= 1e9`）与 `count-the-digits-that-divide-a-number`（#2520，官方约束 `1 <= num <= 1e9` 且不含 0 数字）的生成语料混入越界输入，包括超出 i64 与 JSON 安全整数范围的浮点字面量（如 `1.1122233344455567e26`、`2.223334445556668e+23`），四 lane 分别停在 `tests[13]` / `tests[30]`。矩阵原文确认两题实现无缺陷，纯粹是语料越界：wasm `Cannot convert ... to a BigInt`，ovm `type mismatch: expected i64, got f64`，jvm `NumberFormatException`，clr `FormatException`。

本轮按官方约束与语言整数语义修复语料（commit `b1eaf179`）：仅触碰违反约束的用例，合法用例原样保留。替换值由原字面量十进制有效数字派生（取前 9 位有效数字，#2520 额外去除 0 数字），`expected` 用参考算法重算，先前作为缺陷记录的 `corpusDefect` 标注随用例恢复可执行而移除。`alternating-digit-sum` 修复 21 例，`count-the-digits-that-divide-a-number` 修复 14 例（含 3 例 in-range 但含 0 数字、旧期望为 `Error: integer modulo by zero` 的违约束用例）。修复后两题四 lane 全绿：57/57 与 77/77。

早期版本曾按"保留原值并显式标注 `corpusDefect`"处理，该口径已由本轮的约束对齐修复取代。

同类缺陷清扫（扫描 `projects/problems/*/metadata.json` 中字符串之外的数值字面量；下列清单与 JSON 为修复前两题**之前**的快照）：

- 扫描 2842 份 metadata，命中 **100 个 slug、1939 处**（去重后字面量数见 JSON）。其中 `alternating-digit-sum`（5 处）与 `count-the-digits-that-divide-a-number`（5 处）已在本轮修复，重扫应不再命中。
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

其中 `count-the-digits-that-divide-a-number` 的首个越界用例是 `tests[30]`（`2.223334445556668e+23`），四 lane 都因该值无法进入 i64 而失败；该题解法本身正确。本轮已按官方约束修复两题语料（见上节），不再按缺陷保留。

## 结构化 blocked 题目与根因归类

分类口径：`build blocked` = compile/link 结构化失败；`ready N/M` = 已生成真实产物但用例失败；`崩溃` = 编译线程 panic 并终止进程。

| 题目 | 用例数 | 状态 | 根因类别 | 原始诊断 |
| --- | --- | --- | --- | --- |
| `valid-parentheses`、`roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi` | 148 / 94 / 21 / 185 | wasm GREEN，其余三 lane build blocked | `ovm-provider-missing` + `managed-option-char-unsupported` | ovm：`host contract \`std.primitive.__u32_or\` (instance \`ItemInstanceId(27)\`) has a resolved call but no host provider is bound`。jvm/clr：`JVM/CLR 最小 lowering 不支持类型 \`Option<char>\`：缺少该形状的 JVM/CLR 载体合同`。`Utf8Text` provider 签名与 `u32` provider 已修（`valkyrie.v` `6bdf9b8`/`9eb52f0`、`nyar-vm.rs` `a1196dab`），`valid-parentheses` 已越过 `__u32_eq` 与签名不符两道门 |
| `add-two-numbers` | 59 | wasm GREEN，其余三 lane build blocked | `ovm-typed-sum-plan-missing` + `managed-arraylist-i64-unsupported` | ovm：`Nyar backend requires a typed sum representation plan; semantic sum operation has no target contract`。jvm/clr：`JVM/CLR 最小 lowering 不支持类型 \`std::collection::ArrayList<i64>\`：缺少该形状的 JVM/CLR 载体合同` |
| `two-sum`、`valid-anagram`、`ransom-note` | 80 / — / — | 四 lane build blocked | `hashmap-insert-instance-undeclared` | `调用实例 \`ItemInstanceId(...)\` 没有定义或显式导入合同；callers=[\"std::find_slot#...\", \"std::find_insert_slot#...\"]`（`valid-anagram`/`ransom-note` 为 `std::insert#...` + `std::find_slot#...`） |
| `reverse-vowels-of-a-string`、`integer-to-roman`、`longest-common-prefix` | — | 四 lane build blocked | `qualified-turbofish-call-unresolved` | `unresolved call \`<computed>\` in new at source/_.v:867..900`；落在 `Array.v` 的 `push` 体内 `std::collection::array::new::<T>(old_len + 1)`。解析已恢复，语义解析仍未把限定路径 + `::<T>` 绑定到合同实例 |
| `happy-number` | — | 四 lane build blocked | `generic-constraint-eq-unresolved` | `unresolved call \`infix ==\` in contains at source/_.v:4714..4727`；落在 `Array<T>::contains` 的 `where T: Equal` 约束内，约束未参与 `infix ==` 解析 |
| `reverse-string` | — | 四 lane 崩溃（exit `-1073740791`） | `wasm-plan-encode-slot-conflict` | `panicked at compilers\nyar-emitter\src\lowering\backends\wasm\mir\calls.rs:245: WASM 编码结果与预规划槽冲突: %5 in std::at`，`left: 110`（anyref）/ `right: 127`（i32）。规划槽取 `NyarType::Parameter(T)` 的 Reference 表示，编码却按 `ArrayList::at` 实例化返回的 i32 载体发射 |
| ~~`alternating-digit-sum`~~ | 57 | 本轮语料修复后四 lane GREEN 57/57 | 语料缺陷（已修复） | `tests[13]` 曾超出 i64，见「语料缺陷」节 |
| ~~`count-the-digits-that-divide-a-number`~~ | 77 | 本轮语料修复后四 lane GREEN 77/77 | 语料缺陷（已修复） | `tests[30]` 曾为 `2.2233344445556668e+23`，见「语料缺陷」节 |

矩阵 CLI 目前不能在 `reverse-string` 这类编译线程 panic 时写出结构化行，只能得到进程退出码；该题的 lane 证据缺失，需要 emitter 修复后复跑才能补回。

## 上游待修（本轮发现）

1. `std.adaptor.ovm` 的 `std.primitive.__u32_or` 无 provider 绑定，阻塞 `ovm` 执行 lane 的字符串题。Odin 字节码没有位运算/移位 opcode，不能在 adaptor 伪造。
2. `std.adaptor.jvm` / `std.adaptor.clr` 的 `Utf8Text.host_length` 签名不一致已修（`6bdf9b8`），`u32` 位运算 provider 已补（`9eb52f0`、`a1196dab`）。当前阻塞转为 `JVM/CLR 最小 lowering 不支持类型 \`Option<char>\`：缺少该形状的 JVM/CLR 载体合同`，即托管 lane 缺泛型和型 `Option` 载体，不再是 provider 缺失。
3. 语义解析仍不认限定路径 + `::<T>` 合同调用（`std::collection::array::new::<T>`），以及泛型约束 `where T: Equal` 内的 `infix ==`。前端侧 `⁅ ⁆` 与 `infix >` 已在 `array-probe` 真实 wasm 构建中验证可用，卡点在语义绑定而非解析。
4. `HashMap` 的 `insert` / `find_slot` / `find_insert_slot` 调用实例缺少声明或显式导入合同，四 lane 同阻。
5. `ArrayList::at` 的泛型返回槽在 wasm lowering 中规划为 anyref、编码按 i32 发射，触发 `calls.rs` 断言并终止进程（`reverse-string`）。
6. 语料生成器必须拒绝超过官方约束、i64 或 JSON 安全整数范围的数值输入；扫描命中 100 个 slug、1939 处，其中 `alternating-digit-sum` 与 `count-the-digits-that-divide-a-number` 已在本轮按官方约束修复，其余 slug 待逐题处理。
