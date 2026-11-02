# Valkyrie 四 lane 覆盖报告

- 生成时间：2026-11-02（前置修复复跑 + 二十五题新增覆盖过 50；同日转为探针模式，新增 32 题真实四 lane 证据，全绿累计 56；同日语料精度修根，全绿累计 59；同日四 lane 覆盖重新拉起，全绿累计 72；同日按本地 dev 工具链复跑，全绿累计 80；同日双解对照扩题，全绿累计 81；同日工具链推进至 `0a531be2`+`706ecec`（D15 修复、`char_at` 退役、`⁅ ⁆`/`[ ]` 索引落地），`char_at` 25 调用点统一转索引写法，本批双解新增 11 题，全绿累计 87）
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}`、managed 合同 digest、真实启动命令与退出码）
- 工具链来源（本轮起）：`../nyar-vm.rs` 本地 dev `0a531be2`（含 D15 ovm 导出消歧、`Raise` resume 参数定型、`Cardinal` 索引覆盖、oak `1f766c07`），`../valkyrie.v` 本地 dev `706ecec`（`Utf8Text` 索引重定向码点并退役 `char_at`、`usize`/`isize` 指针宽别名、`char` 的 `==`/`!=`、`std::operator`、`Ordinal`、`[constructor]` 标注）。两者经独立 `git worktree` 检出（不动既有工作树），`valkyrie-napi` 经 `RUSTUP_TOOLCHAIN=nightly` 重建 `.node`；leetcode 经 `VALKYRIE_NATIVE` 指向该 `.node`、`legions.von` 指向 worktree std。结果是工作树快照，不是发布依赖复验。
- **工具链当前状态**：纯 `i64` 标量题四 lane 全绿；`char_at` 已退役，字符串读取改走 `s⁅i⁆`（0 基基数直接取 `char`）/`s[i]`（1 基序数取 `Option<char>`），语法层已落地。阻塞面：数组 `⁅ ⁆`/`push`/HashMap 为 D12''；`loop in` 为 D1（`into_iterator` 构造器）；含 Utf8Text `⁅ ⁆` 的闭包 wasm 受阻 D16（`Raise` 无目标合同）、ovm/jvm/clr 受阻 D17（std `infix !=` 实例）；`counting-bits` managed 缺 `__u64_lt`（D14）。D12'（panic SSA）与 D15（ovm `infix ==` 导出歧义）已修复。详见「按根因聚合的阻塞清单」。

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

### 前置修复复跑（同日，当前 HEAD `5709478e` + 工作树）

四道题的前置缺陷已在上游修复，本轮按原形态解法复跑，结果由真实产物推导，不跨 lane 借数：

| 题目 | wasm | ovm | jvm | clr | 说明 |
| --- | --- | --- | --- | --- | --- |
| `binary-gap` | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 | wasm i64 移位截窄已移除，四 lane 全绿 |
| `minimum-moves-to-reach-target-score` | GREEN 140/140 | GREEN 140/140 | GREEN 140/140 | GREEN 140/140 | oak 侧 `else if` 死循环修复后解法改回原形态，四 lane 全绿 |
| `valid-parentheses` | GREEN 148/148 | build blocked | build blocked | build blocked | wasm `char_at` 码点 0 编组缺陷已修；ovm 缺 typed sum plan，jvm/clr 缺 `[u8]` 载体合同 |
| `add-two-numbers` | GREEN 59/59 | build blocked | build blocked | build blocked | 零字段布局标量拷贝修好后 wasm 全绿；ovm 缺 typed sum plan，jvm/clr 缺 `[i64]` 载体合同 |

`valid-parentheses` 的 jvm/clr 根因为 `JVM/CLR 最小 lowering 不支持类型 \`[u8]\`：缺少该形状的 JVM/CLR 载体合同`（`runtimeStatus=pending`，build 未通过），并非 `Option<char>` 载体；`add-two-numbers` 的 jvm/clr 根因为 `不支持类型 \`[i64]\``，并非 `ArrayList<i64>`。两题 ovm 均为 `Nyar backend requires a typed sum representation plan; semantic sum operation has no target contract`。以上均取自 `matrix-<id>.json` 的 `buildError` 原文。

### 二十五题新增覆盖（同日，当前 HEAD `5709478e` + 工作树）

本轮再增 25 题纯整数标量题（算术 / 循环 / 手工位展开，无 `HashMap`、字符串、`Option`、数组分配），全部四 lane GREEN，合计 1640 个用例：

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `a-number-after-a-double-reversal` | GREEN 66/66 | GREEN 66/66 | GREEN 66/66 | GREEN 66/66 |
| `calculate-delayed-arrival-time` | GREEN 31/31 | GREEN 31/31 | GREEN 31/31 | GREEN 31/31 |
| `account-balance-after-rounded-purchase` | GREEN 54/54 | GREEN 54/54 | GREEN 54/54 | GREEN 54/54 |
| `pass-the-pillow` | GREEN 94/94 | GREEN 94/94 | GREEN 94/94 | GREEN 94/94 |
| `k-items-with-the-maximum-sum` | GREEN 105/105 | GREEN 105/105 | GREEN 105/105 | GREEN 105/105 |
| `distribute-money-to-maximum-children` | GREEN 47/47 | GREEN 47/47 | GREEN 47/47 | GREEN 47/47 |
| `find-the-key-of-the-numbers` | GREEN 96/96 | GREEN 96/96 | GREEN 96/96 | GREEN 96/96 |
| `stone-removal-game` | GREEN 29/29 | GREEN 29/29 | GREEN 29/29 | GREEN 29/29 |
| `smallest-number-with-all-set-bits` | GREEN 56/56 | GREEN 56/56 | GREEN 56/56 | GREEN 56/56 |
| `number-of-days-in-a-month` | GREEN 33/33 | GREEN 33/33 | GREEN 33/33 | GREEN 33/33 |
| `minimum-bit-flips-to-convert-number` | GREEN 85/85 | GREEN 85/85 | GREEN 85/85 | GREEN 85/85 |
| `number-of-bit-changes-to-make-two-integers-equal` | GREEN 91/91 | GREEN 91/91 | GREEN 91/91 | GREEN 91/91 |
| `minimum-flips-to-make-a-or-b-equal-to-c` | GREEN 92/92 | GREEN 92/92 | GREEN 92/92 | GREEN 92/92 |
| `water-bottles` | GREEN 73/73 | GREEN 73/73 | GREEN 73/73 | GREEN 73/73 |
| `nim-game` | GREEN 114/114 | GREEN 114/114 | GREEN 114/114 | GREEN 114/114 |
| `2-keys-keyboard` | GREEN 65/65 | GREEN 65/65 | GREEN 65/65 | GREEN 65/65 |
| `add-two-integers` | GREEN 59/59 | GREEN 59/59 | GREEN 59/59 | GREEN 59/59 |
| `count-total-number-of-colored-cells` | GREEN 37/37 | GREEN 37/37 | GREEN 37/37 | GREEN 37/37 |
| `complement-of-base-10-integer` | GREEN 37/37 | GREEN 37/37 | GREEN 37/37 | GREEN 37/37 |
| `number-complement` | GREEN 44/44 | GREEN 44/44 | GREEN 44/44 | GREEN 44/44 |
| `sum-of-digits-in-base-k` | GREEN 87/87 | GREEN 87/87 | GREEN 87/87 | GREEN 87/87 |
| `count-operations-to-obtain-zero` | GREEN 78/78 | GREEN 78/78 | GREEN 78/78 | GREEN 78/78 |
| `count-integers-with-even-digit-sum` | GREEN 34/34 | GREEN 34/34 | GREEN 34/34 | GREEN 34/34 |
| `ugly-number` | GREEN 74/74 | GREEN 74/74 | GREEN 74/74 | GREEN 74/74 |
| `valid-perfect-square` | GREEN 59/59 | GREEN 59/59 | GREEN 59/59 | GREEN 59/59 |

**四 lane 全绿累计：53 题**（前序 28 题 + 本轮 25 题），已越过 50 题目标。

解题实现要点：每题 `metadata.json` 均补 `invoke.valkyrie` 字段（camelCase 导出函数名），`solution.v` 参数名与 `metadata.tests[].args` 键完全一致。i64 位运算仅有 `bit_and` 与 `bit_shift_right`，XOR / OR 类题逐位比较实现；`array.new` 不可用，`stone-removal-game` 用模拟循环代替数组。

### 探针模式扩题（同日，当前 HEAD `5709478e` + 工作树）

重心从攒绿题数转为用题库压编译器/标准库薄弱面。本轮新增 32 题真实四 lane 证据（13 道既有 `ArrayList` 解法首跑 + 19 道新写字符串/位运算/多分支探针），全绿累计 56 题，有证据题总数达 100。

**四 lane 全绿（3 题新增，累计 56）**：

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `sum-of-two-integers` | GREEN 80/80 | GREEN 80/80 | GREEN 80/80 | GREEN 80/80 |
| `bitwise-and-of-numbers-range` | GREEN 97/97 | GREEN 97/97 | GREEN 97/97 | GREEN 97/97 |
| `prime-number-of-set-bits-in-binary-representation` | GREEN 79/79 | GREEN 79/79 | GREEN 79/79 | GREEN 79/79 |

**wasm GREEN，其余 lane 由后端合同受阻（12 题新增）**：ovm 均为 `typed-sum-plan-missing`，jvm/clr 均为载体合同缺失（数组题 `[i64]`、字符串题 `[u8]`），见「按根因聚合的阻塞清单」。

| 题目 | wasm | 类别 |
| --- | --- | --- |
| `concatenation-of-array` | GREEN 71/71 | `ArrayList` 进出参 |
| `move-zeroes` | GREEN 126/126 | `ArrayList` 原地（`expected null`） |
| `missing-number` | GREEN 47/47 | `ArrayList` 入参 |
| `squares-of-a-sorted-array` | GREEN 119/119 | `ArrayList` 进出参 |
| `decode-xored-array` | GREEN 97/97 | `ArrayList` + `bit_xor` |
| `count-asterisks` | GREEN 106/106 | `utf8` 入参逐字符 |
| `split-a-string-in-balanced-strings` | GREEN 118/118 | `utf8` 入参 |
| `student-attendance-record-i` | GREEN 181/181 | `utf8` 入参 |
| `detect-capital` | GREEN 401/401 | `utf8` 入参 |
| `day-of-the-year` | GREEN 119/119 | `utf8` 入参解析 |
| `number-of-steps-to-reduce-a-number-in-binary-representation-to-one` | GREEN 101/101 | `utf8` + `ArrayList` 位模拟 |
| `jewels-and-stones` | GREEN 103/103 | `utf8` 双参（集合语义，去重修复后） |

**`counting-bits`**：wasm 产物经手动 `legion build` + 调用验证正确（`countBits(5) -> [0,1,1,2,1,2]`），但 ovm lane 后端 panic（见缺陷 D8）杀掉矩阵进程，无 JSON 证据行；jvm/clr 手动构建确认为 `[i64]` 载体缺失。语料另有 17 例 `expected` 为 `"Execution timed out"` 占位符，已登记 `corpusDefect`。

**语料缺陷（本轮新登记）**：

| 题目 | 缺陷 | 处置 |
| --- | --- | --- |
| `reverse-bits` | 18 例 `n` 为 ~1e31 浮点字面量（超 i64 与 JSON 安全整数） | 18 例登记 `corpusDefect`，未删改值 |
| `running-sum-of-1d-array` | `tests[19]` 的 `nums` 含 62.5、-31.25 等 11 个浮点元素 | 1 例登记 `corpusDefect` |
| `counting-bits` | 17 例 `expected` 为 `"Execution timed out"` 占位符 | 17 例登记 `corpusDefect` |

## 按根因聚合的阻塞清单

每个根因对应一组题目与最小复现，修复一条即可批量复跑转绿。根因按「前端语义 / 载体与 typed sum / wasm·jvm·clr·ovm codegen / 语料缺陷」归类。除标注外，同一题四 lane 报错文本一致（前端语义在装配前共享）。

### D1. `loop x in ArrayList<T>` 迭代项类型为 `Option<T>` 而非 `T`

- 归属：前端语义（迭代协议/循环变量类型推导）。
- 最小复现（`.cache/probes/loop-item`，wasm 构建即失败）：

```text
micro sum_loop(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    loop x in nums {
        total = total + x
    }
    return total
}
```

原文：`unresolved call `infix +` in sum_loop at solution.v:166..175`。旁证：`find-all-numbers-disappeared-in-an-array` 报 ``let` initializer type `Nominal(ItemId(17))<Nominal(ItemId(20))>` is incompatible with the declared type `Nominal(ItemId(20))``，即迭代项是 `Nominal(17)<i64>`（`Option<i64>`）而非 `i64`。所有四 lane 绿题均不用 `loop in`（全用 `while` + `⁅i⁆.unwrap()`），该路径从未通过。

- 受影响题目（四 lane 同因 build blocked）：

| 题目 | 原文（取首条） |
| --- | --- |
| `single-number` | `unresolved call `<computed>` in single_number at solution.v:174..188`（`ans.bit_xor(x)`） |
| `majority-element` | `unresolved call `infix ==` in majority_element at solution.v:308..322`（`x == candidate`） |
| `find-all-numbers-disappeared-in-an-array` | ``let` initializer ... incompatible`（`let abs_num: i64 = num`） |
| `intersection-of-two-arrays-ii` | `unresolved call `<computed>` in intersect at solution.v:247..266`（`cnt.contains_key(x)`） |

- 修复线：前端 `loop in` 迭代项类型应解 `Option<T>` 为 `T`（或明确规定迭代协议）。修复后 4 题可复跑。
- 现状（同日工具链 `0a531be2`+`706ecec` 复跑）：错误面已迁移——`loop x in nums` 现统一报 `unresolved constructor \`_` in into_iterator`（`source/_.v:7:1`），即迭代解析已推进到 `into_iterator`，但 std 迭代器实现内存在未解析构造器。`single-number`、`best-time-to-buy-and-sell-stock`、`majority-element` 三题四 lane 同因复跑确认。能力未通，非修复。

### D2. `match` 对 `Option<T>` 的 `case Some(x)` 绑定不传导 payload 类型

- 归属：前端语义（typed sum 解构绑定）。
- 最小复现（`.cache/probes/match-binding`，wasm 构建即失败）：

```text
micro eq_some(value: Option<i64>, num: i64) -> bool {
    match value {
        case Some(x):
            return x == num
        case None:
            return false
    }
}
```

原文：`unresolved call `infix ==` in eq_some at solution.v:173..181`。对照（`.cache/probes/eq-plain`、`eq-unwrap`）确认：`a == b`（纯 i64）与 `value.unwrap() == num`（绕开 match）均可构建，仅 match 绑定路径失败。

- 受影响题目：`third-maximum-number`（四 lane 同因），原文 `unresolved call `infix ==` in equals_opt at solution.v:158..166`（`x == num`，`x` 来自 `case Some(x)`）。
- 修复线：typed sum `match` 绑定类型传导。修复后 `third-maximum-number` 及后续 Option 解构题可复跑。

### D3. 泛型约束 `where T: Equal` 内 `infix ==` 未解析

- 归属：前端语义（约束未参与运算符解析）。
- 最小复现：标准库 `HashSet<T>::contains` / `Array<T>::contains` 体（`source/_.v` 的 `contains`），任一 `HashSet<i64>`/`ArrayList<i64>` 的 `contains` 调用即触发。
- 受影响题目（四 lane 同因 build blocked）：

| 题目 | 原文 |
| --- | --- |
| `contains-duplicate` | `unresolved call `infix ==` in contains at source/_.v:4845..4858` |
| `happy-number` | `unresolved call `infix ==` in contains at source/_.v:4714..4727` |

- 修复线：泛型约束 `where T: Equal` 向 `infix ==` 解析供给。修复后 2 题可复跑。
- 现状（同日 sweep 复跑）：用户侧 `where T: Equal` + `infix ==` 已随 dev 工具链修复（探针 `generic-eq` 构建通过），但 std 泛型容器内部的 `infix ==` 仍未解析——`contains-duplicate`/`happy-number` 现报 `unresolved call `<computed>` in insert`（22–23 处同源）+ `unresolved call `infix ==` in find_slot`（`source/_.v:7:1`），原 `in contains` 坐标不再复现，表面并入 D12''。能力未通，2 题仍四 lane build blocked。

### D4. `HashMap` 内部 `find_slot`/`find_insert_slot`/`insert` 调用实例未声明

- 归属：载体与容器合同（链接期实例缺失）。
- 最小复现：`HashMap::new(n)` + `insert`/`contains_key`（任一），如 `intersection-of-two-arrays` 的 `set2.insert(...)`。
- 受影响题目（四 lane 同因 build blocked）：

| 题目 | 原文（取首条） |
| --- | --- |
| `intersection-of-two-arrays` | `调用实例 `ItemInstanceId(212)` 没有定义或显式导入合同；callers=["std::find_slot#196", "std::find_insert_slot#197"]` |
| `two-sum` | 同形（`std::find_slot`/`std::find_insert_slot`） |
| `valid-anagram` | 同形（`std::insert` + `std::find_slot`） |
| `ransom-note` | 同形（`std::insert` + `std::find_slot`） |

- 修复线：`HashMap` 内部槽位函数的实例声明/导入合同。修复后 4 题可复跑。
- 现状（同日 sweep 复跑）：原 `调用实例 ItemInstanceId(...) 没有定义或显式导入合同` 错误面在当前 dev 工具链下不再复现；`two-sum`、`valid-anagram`、`ransom-note`、`longest-substring-without-repeating-characters` 现统一报 `unresolved call `<computed>` in get`（26 处同源）+ `unresolved call `infix ==` in rehash`（`source/_.v:7:1`），表面并入 D12''。`intersection-of-two-arrays` 本轮未复跑。能力未通，属错误面迁移而非修复。

### D5. 限定路径 turbofish `std::collection::array::new::<T>` 未解析

- 归属：前端语义（限定路径 + `::<T>` 合同绑定）。
- 最小复现：任一调用 `Utf8Builder.build()` 或 `std::collection::push` 的函数；落在 `source/_.v:867..900`（`push<T>` 体内 `std::collection::array::new::<T>(old_len + 1)`）。
- 受影响题目（四 lane 同因 build blocked）：

| 题目 | 原文 |
| --- | --- |
| `to-lower-case` | `unresolved call `<computed>` in new at source/_.v:867..900` |
| `defanging-an-ip-address` | 同上 |
| `convert-a-number-to-hexadecimal` | 同上 |
| `fizz-buzz` | 同上 |
| `reverse-vowels-of-a-string` | 同上 |
| `integer-to-roman` | 同上 |
| `longest-common-prefix` | 同上 |

- 修复线：限定路径 turbofish 合同绑定。修复后 7 题（含字符串输出链路 `Utf8Builder.build()`）可复跑。
- 现状（同日 sweep 复跑）：原 `unresolved call `<computed>` in new at source/_.v:867..900` 错误面在当前 dev 工具链下不再复现；`integer-to-roman`、`longest-common-prefix`、`defanging-an-ip-address`、`to-lower-case` 现统一报 `unresolved call `infix +` in append`（6 处同源）+ `unresolved call `<computed>` in append`（`source/_.v:7:1`），`reverse-vowels-of-a-string` 另报 `unresolved call `prefix !`` 与 `suffix ⁅ ⁆=`（`solution.v:20` 起，为 `⁅ ⁆` 解析失败的级联），表面并入 D12''。`convert-a-number-to-hexadecimal`、`fizz-buzz` 本轮未复跑。能力未通，属错误面迁移而非修复。

### D6. `Utf8Text::from_bytes` 限定路径调用未解析

- 归属：前端语义（std 类型限定路径绑定）。
- 最小复现（`.cache/probes/from-bytes`，wasm 构建即失败）：

```text
micro make_hi() -> utf8 {
    return Utf8Text::from_bytes([104, 105])
}
```

原文：`unresolved call `Utf8Text.from_bytes` in make_hi at solution.v:94..126`。注意 std 内部测试（`test_utf8_builder.v`）可用 `Utf8Text::from_bytes`，用户代码（非 `std.text` 命名空间）限定路径不可解析。

- 受影响题目：`day-of-the-week`（四 lane 同因），原文 `unresolved call `Utf8Text.from_bytes` in day_of_the_week at solution.v:922..972`。
- 修复线：std 类型构造器的限定路径导出/绑定。修复后 `day-of-the-week` 及依赖 `from_bytes` 的字符串构造题可复跑。

### D7. wasm ABI `ArrayList<utf8>` 入参元素编组丢失

- 归属：wasm codegen / ABI（字符串数组元素 marshalling）。
- 最小复现（`.cache/probes/str-array-param`，wasm 构建成功、调用证据）：

```text
micro count_words(words: ArrayList<utf8>) -> i64 { return words.length() as i64 }
micro first_len(words: ArrayList<utf8>) -> i64 { ... words⁅0⁆.unwrap().length() as i64 }
```

调用：`countWords(['ab','cde']) -> 2`（数组长度正确），`firstLen(['ab','cde']) -> 0`（应为 2，元素字符串内容为空）。

- 受影响题目（wasm build 通过、runtime 失败；ovm/jvm/clr 分别卡 typed sum / `[u8]` 载体）：

| 题目 | wasm 原文 |
| --- | --- |
| `final-value-of-variable-after-performing-operations` | `RuntimeError: illegal cast`（访问空元素 `char_at(1)` 触发） |
| `counting-words-with-a-given-prefix` | `Error: tests[0]: expected 4, got 0`（元素为空致 `starts_with` 全 false） |

- 修复线：wasm ABI 字符串数组元素（`ArrayList<utf8>` 元素）编组。修复后 2 题可复跑。
- **状态：已修（`d5a80074`，回归测试 `74034ca6`）**。元素 schema 只取声明身份的唯一 `generic_arg`，`utf8` 元素经 `hostIntern` / `hostResolve` 编组，不再按 i32 宽度直转。
- 端到端证据（原 wasm 不变，仅替换 glue 模板，`countWords(['ab','cde'])` 均为 2）：

| 调用 | 修复前 glue | 修复后 glue |
| --- | --- | --- |
| `firstLen(['ab','cde'])` | `0`（空字符串句柄） | `2` |
| `firstLen([])` | `-1` | `-1` |

- 两题矩阵复跑仍被外部阻塞：`valkyrie.v` 的 std 工作树正在改（`projects/std/source/text/Utf8Text.v`、`ArrayList.v` dirty），std 自身即报 `unresolved call <computed> in char_width`，矩阵在编译 std 阶段就失败；待 std 稳定后复跑。

### D8. ovm 后端 fixed-array 布局合同缺失并 panic（进程终止）

- 归属：ovm codegen（后端布局）。
- 最小复现（`.cache/probes/ovm-fixedarray`，ovm 构建即 panic）：

```text
micro make_seq(n: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    ...result.push(v)...
    return result
}
```

原文：`panicked at compilers\nyar-emitter\src\lowering\backends\ovm\mir.rs:448:40: Nyar fixed-array 布局身份缺少布局合同: 0`，进程退出 `-1073740791`。

- 关键机制：含 `Option`（`unwrap`/typed sum）的题目先在语义层被 D9 挡住；`counting-bits` 不用 `Option`，越过语义门后在 ovm 后端触发此 panic。panic 杀掉整个矩阵进程，导致该题无 JSON 证据行（wasm 正确性已手动 `legion build` + 调用验证）。
- 受影响题目：`counting-bits`（ovm panic；jvm/clr 为 `[i64]` 载体缺失 D10）。
- 修复线：ovm 后端 fixed-array 布局合同。修复后 `counting-bits` 矩阵可完整跑通并补回 JSON 证据。
- **状态：已修（`da699be0`）**。`ArrayFromElements` 不再依赖前端未冻结的 `layout_id`，按元素个数铸造后端私有 `OdinLayout`；布局/字段身份缺失一律改结构化 `Err`，进程不再 panic，矩阵已产出 JSON。回归 `lowering_ovm_fixed_array` 2 例绿。
- 残留（另一根因，未在本条处理）：`counting-bits` 的 ovm lane 现报 `Nyar 入口 std::infix + 必须对应唯一明确函数导出`；jvm/clr 报 `最小 lowering 尚不支持指令 Cast`。

### D9. ovm typed sum 表示计划缺失

- 归属：ovm codegen（typed sum 规划）。
- 原文：`Nyar backend requires a typed sum representation plan; semantic sum operation has no target contract`。
- 受影响题目（ovm lane build blocked；wasm 均 GREEN）：`valid-parentheses`、`add-two-numbers`、`roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi`、`concatenation-of-array`、`move-zeroes`、`missing-number`、`squares-of-a-sorted-array`、`decode-xored-array`、`count-asterisks`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`detect-capital`、`day-of-the-year`、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`、`jewels-and-stones`、`final-value-of-variable-after-performing-operations`、`counting-words-with-a-given-prefix`。
- 修复线：ovm typed sum（`Option`）表示计划。修复后 19 题 ovm lane 可复跑。
- **状态：合同已补（`5709478e`，回归测试 `8a4f83cd`）**。`SumNew` / `SumPayloadGet` / `SumVariantIs` 只消费计划冻结的 `SumRepresentation`：variant tag 与 payload 类型按 nominal 身份查表，物理载体固定为后端私有 `[i32 tag, payload]` 两槽对象，标量载荷直接入槽不装箱；表示缺失、tag 宽度越界、payload 合同不一致、对无 payload variant 取值均为结构化 `Err`，无按短名 / `Option` / `Result` 特判。`lowering_ovm_typed_sum` 8 例绿。
- 19 题矩阵复跑待 std 稳定后进行（当前 std 编译期失败，见 D7）。

### D10. jvm/clr 定长数组载体合同缺失（`[i64]` / `[u8]`）

- 归属：jvm/clr codegen（managed 载体）。
- 原文：`JVM/CLR 最小 lowering 不支持类型 `[i64]`（或 `[u8]`）：缺少该形状的 JVM/CLR 载体合同`。
- 受影响题目（jvm/clr lane build blocked；wasm 均 GREEN）：
  - `[u8]`（字符串题）：`valid-parentheses`、`roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi`、`count-asterisks`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`detect-capital`、`day-of-the-year`、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`、`jewels-and-stones`、`final-value-of-variable-after-performing-operations`、`counting-words-with-a-given-prefix`。
  - `[i64]`（数组题）：`add-two-numbers`、`concatenation-of-array`、`move-zeroes`、`missing-number`、`squares-of-a-sorted-array`、`decode-xored-array`、`counting-bits`。
- 修复线：jvm/clr 定长数组载体合同。修复后 20 题 jvm/clr lane 可复跑。

### D11. 语料缺陷（生成器越界/占位符）

- 归属：语料生成器。
- **本轮已按「语料精度修根」全部修复**（见下节）：超范围/非整数值按官方约束重生成、占位符按参考算法重算，`corpusDefect` 标注随之删除。

| 题目 | 原缺陷 | 修复后状态 |
| --- | --- | --- |
| `hamming-distance` | `tests[17]` 超 u64 | 重生成到 `2^32-1` 内，**四 lane GREEN 88/88** |
| `binary-number-with-alternating-bits` | `tests[25]` 浮点超安全整数 | 重生成到 `2^31-1` 内，**四 lane GREEN 72/72** |
| `reverse-bits` | 18 例 ~1e31 浮点 | 逐例重生成到 `2^32-1` 内，**四 lane GREEN 24/24** |
| `running-sum-of-1d-array` | `tests[19]` 非整数浮点元素 | 浮点截断取整并重算；wasm 构建受工具链破损态阻塞，非语料问题 |
| `counting-bits` | 17 例 `"Execution timed out"` 占位符 | 按 `countBits` 重算 `expected`；矩阵受 D8/工具链破损态阻塞，非语料问题 |

- 修复线：语料生成器拒绝越界/占位符用例，越安全整数一律写十进制字符串；`scan --assert` 挂为 `pnpm test:corpus` 断言。存量 `float_literal=939` 处（53 slug）为后续回填清单。

### D12. 字符串/数组题在 `Option`/索引/`unwrap` 路径 build blocked（dev 工具链 `7d4df3c2`+`e25b3bb` 快照）

本地 dev 工具链（`nyar-vm.rs 7d4df3c2` + `valkyrie.v e25b3bb`）下，`Option::Some` 已获 `[constructor]` 标注，`char_at` 路径推进过 HIR，但字符串/数组题仍 build blocked，按子根因分列：

#### D12'. 字符串题（`char_at`+`unwrap`）：Semantic MIR `std.types::panic` SSA 缺型

- 归属：MIR / std `panic`（`unwrap` 内部对 `None` 调用 `std.types::panic`，其 block 参数缺 SSA 类型）。
- 原文（四 lane 同因，wasm 为例）：`compile pipeline rejected module (SMIR001): Semantic MIR 合同失败: function=std.types::panic#186, location=block 1 parameter 0, detail=block parameter has no SSA type`。
- 最小复现：任一调用 `s.char_at(1).unwrap()`（`char_at` 为 **1 基序数**，`char_at(0)` 非法；`⁅ ⁆` 索引为 0 基基数，不受影响）的函数——经 `Option<char>` 的 `unwrap()` 触发 `panic`。
- 受影响题目（四 lane 同因）：`valid-parentheses`、`roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi`、`count-asterisks`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`detect-capital`、`day-of-the-year`、`jewels-and-stones`、`is-subsequence`、`excel-sheet-column-number`、`length-of-last-word`、`counting-bits`（wasm/ovm）。其中 `is-subsequence`、`excel-sheet-column-number`、`length-of-last-word` 经同日 sweep 复跑确认。
- 修复线：std `panic` 的 block 参数补 SSA 类型（`nyar-vm.rs` MIR / `valkyrie.v` std 协同）。
- 现状（同日工具链 `0a531be2`+`706ecec` 复跑）：**已修复**——`Raise` resume 参数定型（`d42b8b4d`）后 SMIR001 不再复现；且 `char_at` 已随 `706ecec` 退役，25 个调用点全部转为 `s⁅i⁆` 索引写法（见「`char_at` 序数 sweep」节）。原 D12' 题组当前落点：纯索引读取题 wasm 受阻 D16（`Raise` 目标合同）、ovm/jvm/clr 受阻 D17（std `infix !=` 实例）；含 builder/push/HashMap 的题 wasm 受阻 D12''。

#### D12''. 数组题（`push`/`⁅ ⁆`/`unwrap`/`==`）：HIR `unresolved call <computed>` / `infix ==`

- 归属：前端语义（`⁅ ⁆` 索引操作、`Option.unwrap()`、`ArrayList::push` 与 `infix ==` 的 `<computed>` 解析未通过 HIR）。
- 原文（wasm 为例，坐标随解法）：
  - `concatenation-of-array`：`unresolved call `<computed>` in get_concatenation --> solution.v:8:9`（`result.push(nums⁅i⁆.unwrap())`），另 3 处同根因。
  - `squares-of-a-sorted-array`：`unresolved call `suffix [ ]``（`⁅ ⁆` 索引）。
  - `number-of-steps-to-reduce-a-number-in-binary-representation-to-one`：`unresolved call `<computed>` in num_steps --> solution.v:17:12`（`bits⁅start⁆.unwrap()`）+ `unresolved call `infix ==``（`== 0`）。
  - `two-sum`（同日 sweep 复跑）：`unresolved call `<computed>` in get`（26 处同源，`source/_.v:7:1`）+ `unresolved call `infix ==` in rehash`——HashMap 题组（原 D4）当前表面。
  - `integer-to-roman`（同日 sweep 复跑）：`unresolved call `infix +` in append`（6 处同源）+ `unresolved call `<computed>` in append`——`Utf8Builder` 输出链路题组（原 D5）当前表面。
  - `reverse-vowels-of-a-string`（同日 sweep 复跑）：`unresolved call `prefix !``、`unresolved call `<computed>``（`solution.v:20` 起 8 处）、`unresolved call `suffix ⁅ ⁆=``（`solution.v:28:13`）——`⁅ ⁆` 解析失败的级联。
  - `contains-duplicate`（双解对照轮）：`unresolved call `<computed>` in insert`（22 处同源）+ `unresolved call `infix ==` in find_slot` + `unresolved constructor `_` in into_iterator`——HashSet 题组（原 D3/D4）当前表面。
- 受影响题目：`add-two-numbers`、`concatenation-of-array`、`move-zeroes`、`missing-number`、`squares-of-a-sorted-array`、`decode-xored-array`、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`、`final-value-of-variable-after-performing-operations`、`counting-words-with-a-given-prefix`、`running-sum-of-1d-array`，以及同日 sweep 复跑确认的 `defanging-an-ip-address`、`to-lower-case`、`zigzag-conversion`、`longest-palindromic-substring`、`longest-common-prefix`、`reverse-vowels-of-a-string`、`integer-to-roman`（D5 迁移）、`two-sum`、`valid-anagram`、`ransom-note`、`longest-substring-without-repeating-characters`（D4 迁移）、`happy-number`、`contains-duplicate`（D3 迁移）。
- 修复线：`⁅ ⁆` 索引与 `Option.unwrap()`/`push` 的 `<computed>` 解析、`infix ==` 绑定（`nyar-vm.rs`/`valkyrie.v` 重构面）。

#### D14. `counting-bits` managed 缺 `__u64_lt` host provider

- 归属：jvm/clr host provider（`counting-bits` wasm 同 D16）。
- 原文（同日工具链 `0a531be2`+`706ecec` 复跑）：`host contract \`std.primitive.__u64_lt\` (instance \`ItemInstanceId(12)\`) has a resolved call but no host provider is bound`。`usize`/`isize` 指针宽别名化（`25ce557`）后，原 `__isize_sub` 缺口已被 `__u64_lt` 取代。
- 受影响题目：`counting-bits`（ovm/jvm/clr lane）。
- 修复线：`std.primitive.__u64_lt` 的 managed host provider 绑定。

### D13. 局部变量名 `position` 与 std prelude `std::iterator::position` 撞名（dev 工具链已修复）

- 结论：**已随 dev 工具链（oak `1f766c07` 解析修复）消除**。`pass-the-pillow`（含 `let position: i64`）在 `7d4df3c2`+`e25b3bb` 下四 lane 复绿（94/94），不再触发对 std `position` 的 `Some` 解析。
- 历史坐标（前工具链 `f502b9ea`/`eeac899` 快照）：std prelude `using! std::iterator::{... position ...}` 把 `std::iterator::position` 引入作用域，用户同名局部变量触发对该 std 函数的 `Some` 解析而失败；改名 `pos` 即规避。当前快照下该撞名不再发生。
- 受影响题目：`pass-the-pillow`（前序转红，本轮复绿）。

### D15. ovm `std::infix ==` 多类型共存时无法唯一导出入口

- 归属：ovm 后端导出决议。同一模块内 `std::infix ==` 在多种类型（如 `i64` 与 `bool`）上同时被解析时，ovm 要求入口对应唯一明确函数导出；wasm/jvm/clr 不受影响。
- 原文：`legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): Nyar 入口 \`std::infix ==\` 必须对应唯一明确函数导出`。
- 最小复现：`.cache/probes/ovm-ne`（gitignored，不提交）——`i64 ==` 与 `bool !=` 各自单独构建通过，共存于同一模块即报上文。
- 受影响题目：`largest-number-after-digit-swaps-by-parity`（ovm；wasm/jvm/clr GREEN 78/78）、`divide-two-integers`（ovm；wasm/jvm/clr GREEN 135/135）。
- 修复线：ovm 导出决议对 `infix ==` 按实例类型消歧（`nyar-vm.rs` ovm 后端）。
- 现状（同日工具链 `0a531be2` 复跑）：**已修复**——`0a531be2`（`Disambiguate ovm export names by instance identity`）后，`largest-number-after-digit-swaps-by-parity` 与 `divide-two-integers` 均**四 lane 全绿**（78/78、135/135），两题由 3/4 转为全绿。

### D16. wasm 后端 `Raise` effect terminator 无目标合同

- 归属：wasm 后端私有计划（`nyar-vm.rs` emitter）。D12' 的 MIR SSA 修复后，`panic`/`⁅ ⁆` 边界检查路径推进到 wasm 后端计划层，暴露 `Raise` 无目标合同。
- 原文（wasm）：`legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): 后端私有计划生产失败: canonical effect terminator 尚无目标合同: PerformEffect { effect: Raise, payload: Some(MirValueId(0)), resume_target: CanonicalBlockId(1) }`。
- 最小复现：任一使用 `s⁅i⁆`（Utf8Text 基数索引，其合同实现内含越界 `std::types::panic`）的函数，wasm 构建即失败。
- 受影响题目（wasm lane，同日复跑确认）：`valid-palindrome-ii`、`counting-bits` 及 14 个纯索引读取字符串题（`count-asterisks`、`day-of-the-year`、`detect-capital`、`excel-sheet-column-number`、`is-subsequence`、`jewels-and-stones`、`length-of-last-word`、`roman-to-integer`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`string-to-integer-atoi`、`valid-palindrome`、`valid-parentheses`、`longest-common-prefix` 中 builder 前的读取路径另见 D12''）。
- 修复线：wasm 后端为 `Raise` effect terminator 补目标合同。

### D17. managed lane（ovm/jvm/clr）std `infix !=` 实例 HIR 未解析

- 归属：managed HIR 解析（`nyar-vm.rs`/`valkyrie.v`）。std 文本/容器实现内的 `infix !=`（`char` 经 u32 码点相等实现，内部为 `prefix !` + `infix ==` 复合）在 ovm/jvm/clr 无法解析；纯 `i64` 用户层 `!=`（如 `three-divisors` 的 `r * r != n`）不受影响，四 lane 全绿。
- 原文（ovm 为例）：`error[valkyrie.hir.unresolved_call]: unresolved call \`prefix !\` in infix != --> source/_.v:7:1` + `unresolved call \`infix ==\` in infix !=`（同坐标）。
- 最小复现：任一使用 `s⁅i⁆`（Utf8Text 基数索引）或走到 std `char !=` 的函数，ovm/jvm/clr 构建即失败。
- 受影响题目：全部 25 个索引写法字符串题与 `valid-palindrome-ii`、`first-unique-character-in-a-string`、`largest-number-at-least-twice-of-others` 的 ovm/jvm/clr lane（wasm 侧同闭包分别落 D16/D12''）。
- 修复线：managed 侧 std `infix !=` 实例的 HIR 解析（`char`/文本内部实例）。

## 语料精度修根（同日，字符串表示 + 全量回填）

本轮把「大整数因 JSON 精度丢失被判不可执行」修到根：表示、消费、回填、断言四位一体。

### 表示规则

- 整数/浮点字面量凡越过 `Number.MAX_SAFE_INTEGER`，在 `metadata.json` 一律写成**十进制字符串**（保留原始十进制文本，不做 double 往返）。
- 纯整数字面量分三档：`fits_i64`（合法 i64 输入）、`fits_u64`（需 u64 通道）、`beyond_u64`（生成器 bug，字符串仅保留原文，消费端按范围结构化报错）。
- 浮点字面量超安全整数属生成器 bug，**不**在本轮 codemod 转换（避免把 TS/Python 合法浮点参数字符串化），留作回填清单。

### 生成器侧（断言）

- `projects/conformance/scripts/unsafe-integer-corpus.mjs`：`scan` 文本级扫描全部 `metadata.json` 分类统计；`convert` 把裸整数就地改写为十进制字符串。`scan --assert` 即生成器合同断言——输出里不存在裸数字形态的超安全整数，已挂为 `pnpm test:corpus`（CI 级检查，当前通过）。
- **转换前后统计**：裸整数 `fits_i64=634 / fits_u64=116 / beyond_u64=219`（共 969 处、89 份文件）→ 全部转为十进制字符串（`fits_i64=0 / fits_u64=0 / beyond_u64=0`），断言通过。`float_literal=939` 处留作回填清单（53 个 slug）。重扫报告落盘 `reports/unsafe-integer-corpus.json`。

### 消费侧（四 lane + 参考端）

- 共享入口 `src/domain/integer-literal.ts`：按十进制解析校验 `i64`/`u64` 文本，越界/非法格式结构化报错（不静默截断）；`isUnsafeIntegerLiteralString` 以安全整数界区分「被转换的大整数」与「真实字符串参数」（如 `"11101110111"`）。
- `run_v_solver.ts`（wasm）：字符串整数经既有 `I64` 十进制通道原样交 glue（`BigInt` 精确恢复）；按 ABI 返回类型把整数结果规整为十进制文本再比较。
- `managed-runner.ts`（jvm/clr）：`i64`/`i32` 实参与返回值统一规整为精确十进制文本，argv 直传。
- `run_nyar_solver.ts`（ovm）：ovm `json_bridge.rs` 只按 `as_i64` 解析 JSON 数字，故把超安全整数字符串以**裸数字文本**注入 `argsJson`（绕过包装层 `JSON.stringify`），直接加载平台 `valkyrie-napi` 绑定。
- TS/Python 参考端：超安全整数字符串规整回数值（TS `Number`、Python `int`），与裸数字经 `JSON.parse` 同形，零回归；`assert.ts` 按十进制文本比较字符串期望与数值实得。
- 验证：`ugly-number` 的 `72057594037927940` 转字符串后四 lane 仍全绿；`binary-gap` 裸数字向后兼容；TS 规整与裸数字同值，真字符串参数不受影响。

### 回填已登记 `corpusDefect` 题

按「生成器 bug 重生成 + 参考算法重算 `expected`」回填，`corpusDefect` 标注随之删除（真实用例），四 lane 复跑：

| 题目 | 缺陷 | 处置 | 复跑结果 |
| --- | --- | --- | --- |
| `hamming-distance` | `tests[17]` `x≈2^64`（超 u64） | 派生到语料范围 `2^32-1` 内（`x=1844674407, y=922337203`）并重算 | **四 lane GREEN 88/88** |
| `binary-number-with-alternating-bits` | `tests[25]` `n≈2^100` | 派生到 `2^31-1` 内（`n=1010101010`）并重算 | **四 lane GREEN 72/72** |
| `reverse-bits` | 18 例 `~1e31` 浮点 | 逐例派生到 `2^32-1` 内并重算 | **四 lane GREEN 24/24** |
| `running-sum-of-1d-array` | `tests[19]` 非整数浮点元素 | 浮点元素截断取整并重算 | wasm 构建受工具链破损态阻塞（见头部说明），非语料问题 |
| `counting-bits` | 17 例 `"Execution timed out"` 占位符 | 按 `countBits` 重算 `expected` | wasm 产物经手动验证正确；矩阵受 ovm fixed-array panic（D8）与工具链破损态阻塞，非语料问题 |

**全绿累计：59 题**（前序 56 + 本轮 3 道位运算回填转绿）。`hamming-distance`、`binary-number-with-alternating-bits`、`reverse-bits` 三题由「语料受阻」转为四 lane 全绿，回填算法经全部既有非缺陷用例 100% 校验一致。

`corpusDefect` 现状：本轮 5 题的生成器 bug 全部修根，标注已删。该标注今后只保留给「超出语言可表示范围且题目语义本身需要」的用例，不再给生成器写坏的值当遮羞布。

## 四 lane 覆盖重新拉起（同日，当前 HEAD `f502b9ea` + 工作树）

本轮以防过拟合为目的复跑全 lane（不只看 wasm/ovm），纯 `i64` 标量题确认仍全绿，并扩出 14 题四 lane 新增。工具链处于中间破损态，字符串/数组题与 `position` 变量名题被两路根因压住（见「按根因聚合的阻塞清单」D12、D13）。

**纯 `i64` 组复跑**：58/59 题四 lane 全绿，仅 `pass-the-pillow` 因局部变量名 `position` 与 std prelude 的 `std::iterator::position` 撞名转红（D13）。

**本轮 14 题四 lane 新增全绿**（含 11 题既有解法首跑转绿 + 3 题新写解法；用例数取自 `metadata.json`，四 lane 各自真实跑测）：

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `arranging-coins` | GREEN 54/54 | GREEN 54/54 | GREEN 54/54 | GREEN 54/54 |
| `armstrong-number` | GREEN 56/56 | GREEN 56/56 | GREEN 56/56 | GREEN 56/56 |
| `bulb-switcher` | GREEN 85/85 | GREEN 85/85 | GREEN 85/85 | GREEN 85/85 |
| `consecutive-numbers-sum` | GREEN 53/53 | GREEN 53/53 | GREEN 53/53 | GREEN 53/53 |
| `integer-replacement` | GREEN 37/37 | GREEN 37/37 | GREEN 37/37 | GREEN 37/37 |
| `count-numbers-with-unique-digits` | GREEN 11/11 | GREEN 11/11 | GREEN 11/11 | GREEN 11/11 |
| `n-th-tribonacci-number` | GREEN 18/18 | GREEN 18/18 | GREEN 18/18 | GREEN 18/18 |
| `smallest-integer-divisible-by-k` | GREEN 90/90 | GREEN 90/90 | GREEN 90/90 | GREEN 90/90 |
| `number-of-digit-one` | GREEN 76/76 | GREEN 76/76 | GREEN 76/76 | GREEN 76/76 |
| `reach-a-number` | GREEN 70/70 | GREEN 70/70 | GREEN 70/70 | GREEN 70/70 |
| `integer-break` | GREEN 30/30 | GREEN 30/30 | GREEN 30/30 | GREEN 30/30 |
| `nth-digit` | GREEN 50/50 | GREEN 50/50 | GREEN 50/50 | GREEN 50/50 |
| `sum-of-square-numbers` | GREEN 53/53 | GREEN 53/53 | GREEN 53/53 | GREEN 53/53 |
| `monotone-increasing-digits` | GREEN 111/111 | GREEN 111/111 | GREEN 111/111 | GREEN 111/111 |

- `smallest-integer-divisible-by-k`、`number-of-digit-one`、`reach-a-number`、`integer-break` 四题首跑时 jvm/clr 报「缺少 execution manifest」，系旧工具链产出的过期 `.cache/*-bench-{jvm,clr}` 缓存（无 `managed-abi.json`/`run-contracts.txt`）被 `legion build` 按源不变判 fresh 而未重生成；清除过期缓存后四 lane 转绿。非 runner/harness 改动，仅失效构建产物。
- `sum-of-square-numbers` 与 `monotone-increasing-digits` 语料含超官方约束值（`sum-of-square` 官方上限 `2^31-1`、`monotone` 上限 `1e9`），按官方约束重生成并用参考算法重算 `expected` 后写解法转绿；`monotone` 解法为纯算术贪心（不依赖当前被 D12 阻塞的 `⁅ ⁆` 数组索引）。
- `nth-digit` 语料全在约束内，直接写解法转绿。

**全绿累计：72 题**（前序 58 + 本轮 14）。

## 按本地 dev 工具链复跑（同日，`nyar-vm.rs 7d4df3c2` + `valkyrie.v e25b3bb`）

本轮按本地 dev 工具链（worktree 检出 `7d4df3c2` 与 `e25b3bb`，`valkyrie-napi` 经 nightly 重建 `.node`，`VALKYRIE_NATIVE` 指向之）全量复跑，结果如下。

**纯 `i64` 组**：全部四 lane 全绿（抽样复核 `binary-gap`、`arranging-coins`、`armstrong-number`、`bulb-switcher`、`nth-digit`、`sum-of-square-numbers`、`monotone-increasing-digits`、`hamming-distance`、`reverse-bits` 均 4/4）。

**D13（`position` 撞名）**：**已修复**。`pass-the-pillow` 四 lane 复绿（94/94），变量名 `position` 不再触发对 std prelude `std::iterator::position` 的 `Some` 解析，随 oak `1f766c07` 解析修复而消除。

**D12（`Some`/索引/`unwrap`）**：**未完全修复**。`Option::Some` 经 `[constructor]` 标注后 `char_at` 路径推进过 HIR，但字符串/数组题仍 build blocked，按子根因分列（详见 D12'、D12''、D14）：

| 子根因 | 受影响题组 | 原文（取代表） |
| --- | --- | --- |
| D12' Semantic MIR `std.types::panic` SSA 缺型 | 字符串题（`char_at`+`unwrap`）11 题 | `Semantic MIR 合同失败: function=std.types::panic#186, block 1 parameter 0 has no SSA type` |
| D12'' HIR `unresolved call <computed>` / `infix ==` | 数组题（`push`/`⁅ ⁆`/`unwrap`）9 题 | `concatenation-of-array` 于 `solution.v:8:9`（`result.push(nums⁅i⁆.unwrap())`） |
| D14 jvm/clr 缺 `__isize_sub` provider | `counting-bits` | `host contract `std.primitive.__isize_sub` ... no host provider is bound` |

**全绿累计：80 题**（矩阵实证口径：按 `.cache/matrix-*.json` 逐题 recount 四 lane 全绿；原手工累计 73 漏算跨轮次转绿题，以实证为准）。

**剩余阻塞**：字符串题 11 题（D12'）、数组题 9 题（D12''）、`counting-bits`（D12' + D14）。修复线分属 `nyar-vm.rs`/`valkyrie.v`：std `panic` block 参数补 SSA 类型、`⁅ ⁆`/`unwrap`/`push` 的 `<computed>` 解析与 `infix ==` 绑定、`__isize_sub` 的 jvm/clr host provider。

## 双解对照扩题（同日，Valkyrie + TypeScript 双解对照）

本轮起每道新题同时交付 Valkyrie `solution.v` 与 TypeScript 参考解（`solvers/typescript/solution.ts`），两解共用同一套 `metadata.tests`；TypeScript 仅作语义基准与复杂度对照，不用来掩盖 V 侧缺口。V 解四 lane 全跑；TypeScript 基准经 `run_ts_solver.ts` 全量用例通过（6/6）。

| 题目 | 用例数 | V wasm | V ovm | V jvm | V clr | TS 基准 | 根因 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `n-queens-ii` | 9 | GREEN 9/9 | GREEN 9/9 | GREEN 9/9 | GREEN 9/9 | PASS 9/9 | — |
| `largest-number-after-digit-swaps-by-parity` | 78 | GREEN 78/78 | build blocked | GREEN 78/78 | GREEN 78/78 | PASS 78/78 | D15 |
| `excel-sheet-column-number` | 201 | build blocked | build blocked | build blocked | build blocked | PASS 201/201 | D12' |
| `length-of-last-word` | 48 | build blocked | build blocked | build blocked | build blocked | PASS 48/48 | D12' |
| `running-sum-of-1d-array` | 95 | build blocked | build blocked | build blocked | build blocked | PASS 95/95 | D12'' |
| `contains-duplicate` | 94 | build blocked | build blocked | build blocked | build blocked | PASS 94/94 | D3 + D4 |

### 特性缺口 / 复杂度差异（逐题，TS 仅对照不掩盖）

- `n-queens-ii`（V 四 lane 全绿）：V `i64` 无 `bit_or`/`bit_not`/左移，位掩码回溯写法明显更绕——TS 用 `mask & ~(cols|d1|d2)`、`(d1|bit)<<1`、`(d2|bit)>>1` 直表达；V 以 `bitor(a, b) = a + b - a.bit_and(b)` 求位并（cols/d1/d2 在皇后列重叠，直接相加会重复计入）、`mask.bit_xor(banned)` 代 mask 内位反、`*2`/`/2` 代左右移。算法与复杂度同阶（$O(N!)$ 回溯），差异仅在表达。最小复现（写法差异，非缺陷）：`a.bit_or(b)` 未定义 → `a + b - a.bit_and(b)`。
- `largest-number-after-digit-swaps-by-parity`（V 3/4）：V 数组路径受阻（D12''），无法写 TS 的「按奇偶 filter/sort 分组」数组表达，改用 nibble 打包计数排序——`evens`/`odds` 两个 `i64` 把各数字值计数压进 4-bit 槽位（`+= pow16(d)`），逐位按原数字奇偶取该奇偶剩余最大者重建。代码量约为 TS 数组版两倍，复杂度同阶 $O(d)$。ovm lane 另受阻 D15。语料侧：65 例越出官方约束（$8 \le num \le 10^8$，原含约 $10^{99}$ 的垃圾值）已按约束派生并用参考算法重算 `expected`，78 例全一致。
- `excel-sheet-column-number`、`length-of-last-word`（V 0/4，D12'）：TS 的 `for (const ch of s)` / `charCodeAt` 在 V 需走 `s.char_at(i).unwrap()`（`char_at` 为 1 基序数），`unwrap()` 内部调 `std.types::panic` 触发 SMIR001 而四 lane build blocked——既有根因 D12'，非新缺陷。本轮已把解法内 `char_at` 调用统一修正为 1 基序数（`char_at(0)` 非法；`detect-capital`、`final-value-of-variable-after-performing-operations` 同步修正），`⁅ ⁆` 索引维持 0 基基数不变。
- `running-sum-of-1d-array`（V 0/4，D12''）：TS 的 `out.push(acc)` 与下标读在 V 为 `result.push(sum)` / `nums⁅i⁆.unwrap()`（`⁅ ⁆` 为 0 基基数），`⁅ ⁆` 索引与 `push` 的 `<computed>` 解析未过 HIR——既有根因 D12''，非新缺陷。
- `contains-duplicate`（V 0/4，D3 + D4）：TS 的 `Set.has`/`Set.add` 在 V 走 `HashSet.contains`/`insert`，dev 工具链下报 `unresolved call `<computed>` in insert`（22 处同源）、`unresolved call `infix ==` in find_slot`、`unresolved constructor `_` in into_iterator`（均位于 `source/_.v:7:1`）——既有根因 D3（泛型 `==`）与 D4（HashMap 实例），非新缺陷。

**全绿累计：81 题**（矩阵实证 80 + 本轮 `n-queens-ii` 四 lane 全绿）。

### 第二批（同日，工具链 `0a531be2`+`706ecec`）

按语言特性分批：布尔/位运算（标量）4 题、数组/容器 4 题、字符串 1 题、map/hash 1 题、泛型/约束 1 题。TypeScript 基准 11/11 全过（`prime-arrangements` 修复参考侧 double 精度缺陷后）。

| 题目 | 批次 | 用例数 | V wasm | V ovm | V jvm | V clr | TS 基准 | 根因 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `check-if-number-is-a-sum-of-powers-of-three` | 标量 | 110 | GREEN 110/110 | GREEN 110/110 | GREEN 110/110 | GREEN 110/110 | PASS | — |
| `three-divisors` | 标量 | 144 | GREEN 144/144 | GREEN 144/144 | GREEN 144/144 | GREEN 144/144 | PASS | — |
| `minimum-cuts-to-divide-a-circle` | 标量 | 44 | GREEN 44/44 | GREEN 44/44 | GREEN 44/44 | GREEN 44/44 | PASS | — |
| `prime-arrangements` | 标量 | 27 | GREEN 27/27 | GREEN 27/27 | GREEN 27/27 | GREEN 27/27 | PASS | — |
| `max-consecutive-ones` | 数组 | 97 | build blocked | build blocked | build blocked | build blocked | PASS | D12'' |
| `monotonic-array` | 数组 | 151 | build blocked | build blocked | build blocked | build blocked | PASS | D12'' |
| `search-insert-position` | 数组 | 119 | build blocked | build blocked | build blocked | build blocked | PASS | D12'' |
| `largest-number-at-least-twice-of-others` | 数组 | 143 | build blocked | build blocked | build blocked | build blocked | PASS | D12''（wasm）+ D17（managed） |
| `valid-palindrome-ii` | 字符串 | 108 | build blocked | build blocked | build blocked | build blocked | PASS | D16（wasm）+ D17（managed） |
| `first-unique-character-in-a-string` | hash | 91 | build blocked | build blocked | build blocked | build blocked | PASS | D12''（wasm）+ D17（managed） |
| `number-of-good-pairs` | 泛型 | 102 | build blocked | build blocked | build blocked | build blocked | PASS | D12'' |

特性缺口 / 复杂度差异（逐题，TS 仅对照不掩盖）：

- `prime-arrangements`（V 四 lane 全绿）：TS 末步 `(a * b) % m` 在 `a`、`b` 接近 $10^9+7$ 时乘积约 $10^{18}$ 超出 double $2^{53}$，首版 TS 得 75763862（期望 75763854）；V `i64` 直接精确。TS 末步改 `BigInt` 后对齐——双解对照首次在参考侧暴露精度缺口，V 侧无 fallback。
- `largest-number-at-least-twice-of-others`：语料 `tests[7]`（`nums=[1]`，合法输入）期望值为生成器 Python 解包错误占位符，按参考算法修为 0（同 `confusing-number` 先例）；解法内 `v != best` 的 `!=` 使 managed 三 lane 落 D17。
- `valid-palindrome-ii`：首个按新索引写法（`s⁅i⁆` 0 基基数直接取 `char`，不再经 `char_at`/`unwrap`）的字符串解；语法层已落地，wasm 落 D16、managed 落 D17。
- `first-unique-character-in-a-string`：`HashMap` 计数 + `s⁅i⁆` 读取，wasm 落 D12''（HashMap `get`/`rehash`），managed 落 D17。
- `number-of-good-pairs`：自定义 `eq_count<T>(a: T, b: T) -> i64 where T: Equal` 泛型约束 helper；构建受阻于 `⁅ ⁆`（D12''），未观察到泛型约束本身的新错误。
- 数组 4 题（`max-consecutive-ones`、`monotonic-array`、`search-insert-position`、`largest-number-at-least-twice-of-others`）：单趟扫描/二分仅需 `⁅ ⁆` 读，仍统一受阻 D12''。

**全绿累计：87 题**（81 + 本批 4 题标量全绿 + D15 修复转绿 2 题：`largest-number-after-digit-swaps-by-parity`、`divide-two-integers`）。

## `char_at` 序数 sweep（同日，1 基序数统一）

按更正后的合同（`char_at` 为 **1 基序数**，`char_at(0)` 非法；`⁅ ⁆` 索引维持 0 基基数）把全库 `solution.v` 的 `char_at` 调用点统一改为 1 基：调用点 `+1`（如 `char_at(i)` → `char_at(i + 1)`），循环游标数学保持 0 基不动；`roman-to-integer` 的末位 `char_at(len - 1)` → `char_at(len)`、邻位 `char_at(i + 1)` → `char_at(i + 2)`，`zigzag-conversion` 的算术位置 `(idx + 1) as usize`；`day-of-the-year` 的自建 helper `digit_at` 在 helper 内部 `+1`，调用点字面量不动；`length-of-last-word` 的倒序游标 `i` 本就跑在 `n..1`，直接 `char_at(i)`。TypeScript 参考解未动。

- sweep 文件：**25 个**（本轮 21 个 + 双解对照轮 4 个：`detect-capital`、`excel-sheet-column-number`、`length-of-last-word`、`final-value-of-variable-after-performing-operations`）。std 公共面无其它 `*_at` 序数 API 调用点；`merge-sorted-array` 的 `write_at` 为自建 `⁅ ⁆` 基数 helper，不在 sweep 范围。
- 验证口径：21 题逐一四 lane 矩阵复跑（`.cache/matrix-<id>.json`，当前 dev 工具链）。
- **已验证：0 题**——21 题全部仍 build blocked，按合同标「未验证」，不计已修。
- **未验证：21 题**——D12' 10 题（`count-asterisks`、`day-of-the-year`、`is-subsequence`、`jewels-and-stones`、`valid-parentheses`、`valid-palindrome`、`roman-to-integer`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`string-to-integer-atoi`），D12'' 11 题（`counting-words-with-a-given-prefix`、`defanging-an-ip-address`、`longest-common-prefix`、`longest-palindromic-substring`、`longest-substring-without-repeating-characters`、`zigzag-conversion`、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`、`valid-anagram`、`ransom-note`、`reverse-vowels-of-a-string`、`to-lower-case`）。
- 新增 D 根因：无。
- 变化的 D 根因（错误面迁移，非修复）：D3（std 容器内 `infix ==`）、D4（HashMap 实例未声明）、D5（限定路径 turbofish）的原始错误文本在当前 dev 工具链下全部不再复现，统一迁移为 std 泛型容器内部的 `unresolved call `<computed>`` / `infix +`` / `infix ==``（`source/_.v:7:1`），表面并入 D12''；对应题组（`two-sum`、`valid-anagram`、`ransom-note`、`longest-substring-without-repeating-characters`、`contains-duplicate`、`happy-number`、`integer-to-roman`、`longest-common-prefix`、`reverse-vowels-of-a-string`、`defanging-an-ip-address`、`to-lower-case`）能力仍未通，四 lane build blocked 不变。另抽查 `intersection-of-two-arrays`（D4）、`convert-a-number-to-hexadecimal`、`fizz-buzz`（D5）本轮未复跑，保留原归类待复跑确认。
- 后续（同日工具链 `706ecec`）：`char_at` 退役、`Utf8Text` 索引重定向码点落地后，25 个调用点已全部从 `s.char_at(x).unwrap()`（1 基序数）转为索引写法——`s⁅x - 1⁆`（0 基基数直接取 `char`，不再经 `unwrap`）。逐点映射：`char_at(i + 1)` → `⁅i⁆`，`char_at(len)` → `⁅len - 1⁆`，`char_at(1)` → `⁅0⁆`，`char_at(2)` → `⁅1⁆`，`roman-to-integer` 邻位 `char_at(i + 2)` → `⁅i + 1⁆`，`length-of-last-word` 倒序 `char_at(i)` → `⁅i - 1⁆`。全库 `solution.v` 已零 `char_at`。复跑验证（工具链 `0a531be2`+`706ecec`）：纯索引读取题 wasm 受阻 D16、ovm/jvm/clr 受阻 D17；含 builder/push/HashMap 的题 wasm 受阻 D12''。**已验证数仍为 0，25 题全部维持 build blocked，不计已修。**

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
| `valid-parentheses` | 148 | wasm GREEN，其余三 lane build blocked | `ovm-typed-sum-plan-missing` + `managed-array-u8-unsupported` | ovm：`Nyar backend requires a typed sum representation plan; semantic sum operation has no target contract`。jvm/clr：`JVM/CLR 最小 lowering 不支持类型 \`[u8]\`：缺少该形状的 JVM/CLR 载体合同`。`__u32_or` provider 与 `char_at` 码点 0 编组缺陷已修，wasm 148/148 全绿 |
| `roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi` | 94 / 21 / 185 | wasm GREEN，其余三 lane build blocked（本轮未复跑） | 上轮为 `ovm-provider-missing` + `managed-option-char-unsupported` | 上轮诊断：ovm `__u32_or` 无 provider、jvm/clr `Option<char>` 无载体。`__u32_or` provider 已随 `valid-parentheses` 复跑确认修复，三题未在本轮重跑，根因可能已推进至 typed sum / `[u8]` 载体，待复跑确认 |
| `add-two-numbers` | 59 | wasm GREEN，其余三 lane build blocked | `ovm-typed-sum-plan-missing` + `managed-array-i64-unsupported` | ovm：`Nyar backend requires a typed sum representation plan; semantic sum operation has no target contract`。jvm/clr：`JVM/CLR 最小 lowering 不支持类型 \`[i64]\`：缺少该形状的 JVM/CLR 载体合同`（非 `ArrayList<i64>`） |
| `two-sum`、`valid-anagram`、`ransom-note` | 80 / — / — | 四 lane build blocked | `hashmap-insert-instance-undeclared`（同日 sweep 复跑：表面已迁移至 D12''） | 原文已变为 `unresolved call `<computed>` in get`（26 处同源）+ `unresolved call `infix ==` in rehash`（`source/_.v:7:1`），原 `ItemInstanceId(...) 没有定义或显式导入合同` 不再复现，能力未通 |
| `reverse-vowels-of-a-string`、`integer-to-roman`、`longest-common-prefix` | — | 四 lane build blocked | `qualified-turbofish-call-unresolved`（同日 sweep 复跑：表面已迁移至 D12''） | 原文已变为 `unresolved call `infix +` in append`（6 处同源）+ `unresolved call `<computed>` in append`（`source/_.v:7:1`）；`reverse-vowels-of-a-string` 另报 `prefix !` / `suffix ⁅ ⁆=` 级联。原 `array::new::<T>` turbofish 错误不再复现，能力未通 |
| `happy-number` | — | 四 lane build blocked | `generic-constraint-eq-unresolved`（同日 sweep 复跑：表面已迁移至 D12''） | 原文已变为 `unresolved call `<computed>` in insert`（23 处同源）+ `unresolved call `infix ==` in find_slot`（`source/_.v:7:1`），原 `in contains` 坐标不再复现，能力未通 |
| `reverse-string` | — | 四 lane 崩溃（exit `-1073740791`） | `wasm-plan-encode-slot-conflict` | `panicked at compilers\nyar-emitter\src\lowering\backends\wasm\mir\calls.rs:245: WASM 编码结果与预规划槽冲突: %5 in std::at`，`left: 110`（anyref）/ `right: 127`（i32）。规划槽取 `NyarType::Parameter(T)` 的 Reference 表示，编码却按 `ArrayList::at` 实例化返回的 i32 载体发射 |
| `hamming-distance` | 88 | wasm 17/88、ovm 17/88、jvm/clr 0/0（`runtimeStatus=ready`，非全绿） | 语料缺陷 `integer_beyond_i64` | `tests[17]` 输入 `x=18446744073709552000, y=9223372036854776000` 超出 i64 上限。wasm 以 BigInt 执行得 2，metadata 期望 1（i64 语义）；ovm `type mismatch: expected i64, got f64`；jvm `NumberFormatException`；clr `OverflowException`。已在该用例标注 `corpusDefect`，未删改值 |
| `binary-number-with-alternating-bits` | 72 | wasm 25/72、ovm 25/72、jvm/clr 0/0（`runtimeStatus=ready`，非全绿） | 语料缺陷 `float_literal_beyond_safe_integer` | `tests[25]` 输入 `n=1.0101010101010101e+30` 为超出 safe integer 的浮点字面量。wasm `SyntaxError: Cannot convert ... to a BigInt`；ovm `type mismatch: expected i64, got f64`；jvm `NumberFormatException`；clr `FormatException`。已在该用例标注 `corpusDefect`，未删改值 |
| ~~`alternating-digit-sum`~~ | 57 | 本轮语料修复后四 lane GREEN 57/57 | 语料缺陷（已修复） | `tests[13]` 曾超出 i64，见「语料缺陷」节 |
| ~~`count-the-digits-that-divide-a-number`~~ | 77 | 本轮语料修复后四 lane GREEN 77/77 | 语料缺陷（已修复） | `tests[30]` 曾为 `2.2233344445556668e+23`，见「语料缺陷」节 |

矩阵 CLI 目前不能在 `reverse-string` 这类编译线程 panic 时写出结构化行，只能得到进程退出码；该题的 lane 证据缺失，需要 emitter 修复后复跑才能补回。

## 上游待修（本轮发现）

1. ~~`std.adaptor.ovm` 的 `std.primitive.__u32_or` 无 provider 绑定~~ 已修复（`valid-parentheses` 复跑确认 ovm 越过此门），当前 ovm 阻塞转为 `typed-sum-plan-missing`：`Nyar backend requires a typed sum representation plan; semantic sum operation has no target contract`，命中 `valid-parentheses` 与 `add-two-numbers`。
2. ~~`std.adaptor.jvm` / `std.adaptor.clr` 的 `Option<char>` 载体缺失~~ 已推进至数组载体：当前 jvm/clr 阻塞为 `JVM/CLR 最小 lowering 不支持类型 \`[u8]\``（`valid-parentheses`）与 `\`[i64]\``（`add-two-numbers`），即托管 lane 缺定长数组载体合同，不再是 `Option<char>`。
3. 语义解析仍不认限定路径 + `::<T>` 合同调用（`std::collection::array::new::<T>`），以及泛型约束 `where T: Equal` 内的 `infix ==`。前端侧 `⁅ ⁆` 与 `infix >` 已在 `array-probe` 真实 wasm 构建中验证可用，卡点在语义绑定而非解析。
4. `HashMap` 的 `insert` / `find_slot` / `find_insert_slot` 调用实例缺少声明或显式导入合同，四 lane 同阻。
5. `ArrayList::at` 的泛型返回槽在 wasm lowering 中规划为 anyref、编码按 i32 发射，触发 `calls.rs` 断言并终止进程（`reverse-string`）。
6. 语料生成器必须拒绝超过官方约束、i64 或 JSON 安全整数范围的数值输入；扫描命中 100 个 slug、1939 处，其中 `alternating-digit-sum` 与 `count-the-digits-that-divide-a-number` 已在上轮按官方约束修复，`hamming-distance` 与 `binary-number-with-alternating-bits` 本轮以 `corpusDefect` 标注保留（未删改值），其余 slug 待逐题处理。
