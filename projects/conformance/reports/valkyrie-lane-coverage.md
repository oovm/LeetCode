# Valkyrie 四 lane 覆盖报告

> 口径：本报告只记录外部可观测的编译/运行现象（错误文本、通道、用例计数），不含内部缺陷编号。

- 生成时间：2026-11-02（历程：全绿累计 53 → 56 → 59 → 72 → 80 → 81 → 87 → 90 → 91）
- 采集命令（`projects/conformance`）：`node --import tsx src/cli/valkyrie-matrix.ts --id <id> --out ../../.cache/matrix-<id>.json`
- 结果原文：`.cache/matrix-<id>.json`（每题的 `problems[0].rows.{wasm,ovm,jvm,clr}`、managed 合同 digest、真实启动命令与退出码）
- 工具链来源：本地 dev 工具链快照（经独立 worktree 构建的 napi 产物，`VALKYRIE_NATIVE` 指向该产物，`legions.von` 指向工作树 std）。结果为工作树快照，不是发布依赖复验。
- **工具链当前状态**：纯 `i64` 标量题四 lane 全绿；`char_at` 已退役，字符串读取走 `s⁅i⁆`（0 基基数直接取 `char`）/`s[i]`（1 基序数取 `Option<char>`）。阻塞面按现象归类：数组 `⁅ ⁆`/`push`/`HashMap` 调用解析受阻；`loop in` 迭代解析受阻；含 Utf8Text `⁅ ⁆` 的函数在 wasm 通道受阻于 `Raise` 终止符无目标合同、在 managed 通道受阻于 std `infix !=` 实例未解析；`counting-bits` managed 缺 `__u64_lt` host 能力。详见「按现象归类的阻塞清单」。

## lane 口径

| lane | 角色 | target 来源 | 计入交付完成度 |
| --- | --- | --- | --- |
| `wasm` | 交付 lane | 各题 `legion.von` 的 `build[].target` | 是 |
| `ovm` | 执行 lane | lane 显式 `ovm` | 否 |
| `jvm` | 对照 lane | lane 显式 `jvm` + `managed-abi.json` | 否 |
| `clr` | 对照 lane | lane 显式 `clr` + `managed-abi.json` | 否 |

矩阵 JSON 的 `summary.*.green` 分母是语料总体（2842 题），单题跑测时显示 `1/2842` 属于口径噪声。本报告只按**本次复跑子集**统计，各 lane 独立探测、独立计数，互不顶替。

## 全绿题清单（91 题）

以下各题四 lane 均为真实产物全量 `metadata.tests` 通过（`GREEN N/N` 表示通过用例数 / 用例总数）。

### 基础标量组（早期 22 题 wasm + 后续四 lane 转绿）

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `binary-gap` | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 |
| `valid-parentheses` | GREEN 148/148 | build blocked | build blocked | build blocked |
| `add-two-numbers` | GREEN 59/59 | build blocked | build blocked | build blocked |
| `roman-to-integer` | GREEN 94/94 | build blocked | build blocked | build blocked |
| `valid-palindrome` | GREEN 21/21 | build blocked | build blocked | build blocked |
| `string-to-integer-atoi` | GREEN 185/185 | build blocked | build blocked | build blocked |
| `alternating-digit-sum` | GREEN 57/57 | GREEN 57/57 | GREEN 57/57 | GREEN 57/57 |
| `count-the-digits-that-divide-a-number` | GREEN 77/77 | GREEN 77/77 | GREEN 77/77 | GREEN 77/77 |

### 十四题新增（合计 795 用例）

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

这 14 题说明纯数值/整型路径已经不缺 provider 或载体合同。

### 十题新增（纯整数标量，合计 814 用例）

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

### 前置修复复跑转绿（4 题）

| 题目 | wasm | ovm | jvm | clr | 说明 |
| --- | --- | --- | --- | --- | --- |
| `binary-gap` | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 | GREEN 61/61 | wasm i64 移位截窄修复后四 lane 全绿 |
| `minimum-moves-to-reach-target-score` | GREEN 140/140 | GREEN 140/140 | GREEN 140/140 | GREEN 140/140 | 上游 `else if` 死循环修复后解法改回原形态，四 lane 全绿 |
| `valid-parentheses` | GREEN 148/148 | build blocked | build blocked | build blocked | wasm `char_at` 码点 0 编组缺陷已修；managed 受阻于载体与 sum 合同 |
| `add-two-numbers` | GREEN 59/59 | build blocked | build blocked | build blocked | 零字段布局标量拷贝修好后 wasm 全绿；managed 受阻于载体与 sum 合同 |

### 二十五题新增（纯整数标量，合计 1640 用例）

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

解题实现要点：每题 `metadata.json` 均补 `invoke.valkyrie` 字段（camelCase 导出函数名），`solution.v` 参数名与 `metadata.tests[].args` 键完全一致。i64 位运算仅有 `bit_and` 与 `bit_shift_right`，XOR / OR 类题逐位比较实现；`array.new` 不可用，`stone-removal-game` 用模拟循环代替数组。

### 探针模式新增（3 题）

| 题目 | wasm | ovm | jvm | clr |
| --- | --- | --- | --- | --- |
| `sum-of-two-integers` | GREEN 80/80 | GREEN 80/80 | GREEN 80/80 | GREEN 80/80 |
| `bitwise-and-of-numbers-range` | GREEN 97/97 | GREEN 97/97 | GREEN 97/97 | GREEN 97/97 |
| `prime-number-of-set-bits-in-binary-representation` | GREEN 79/79 | GREEN 79/79 | GREEN 79/79 | GREEN 79/79 |

**wasm GREEN、managed 受阻的既有 12 题**：`concatenation-of-array`（71/71）、`move-zeroes`（126/126）、`missing-number`（47/47）、`squares-of-a-sorted-array`（119/119）、`decode-xored-array`（97/97）、`count-asterisks`（106/106）、`split-a-string-in-balanced-strings`（118/118）、`student-attendance-record-i`（181/181）、`detect-capital`（401/401）、`day-of-the-year`（119/119）、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`（101/101）、`jewels-and-stones`（103/103）。managed 侧根因见「按现象归类的阻塞清单」。

### 语料回填转绿（3 题）

| 题目 | 缺陷 | 处置 | 复跑结果 |
| --- | --- | --- | --- |
| `hamming-distance` | `tests[17]` `x≈2^64`（超 u64） | 派生到语料范围 `2^32-1` 内（`x=1844674407, y=922337203`）并重算 | **四 lane GREEN 88/88** |
| `binary-number-with-alternating-bits` | `tests[25]` `n≈2^100` | 派生到 `2^31-1` 内（`n=1010101010`）并重算 | **四 lane GREEN 72/72** |
| `reverse-bits` | 18 例 `~1e31` 浮点 | 逐例派生到 `2^32-1` 内并重算 | **四 lane GREEN 24/24** |

### 四 lane 覆盖重新拉起新增（14 题）

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

- `smallest-integer-divisible-by-k`、`number-of-digit-one`、`reach-a-number`、`integer-break` 四题首跑时 jvm/clr 报「缺少 execution manifest」，系旧工具链产出的过期 `.cache/*-bench-{jvm,clr}` 缓存被按源不变判 fresh 而未重生成；清除过期缓存后四 lane 转绿。非 runner/harness 改动，仅失效构建产物。
- `sum-of-square-numbers` 与 `monotone-increasing-digits` 语料含超官方约束值（`sum-of-square` 官方上限 `2^31-1`、`monotone` 上限 `1e9`），按官方约束重生成并用参考算法重算 `expected` 后写解法转绿；`monotone` 解法为纯算术贪心（不依赖数组索引）。
- `nth-digit` 语料全在约束内，直接写解法转绿。

### 双解对照第一批（V + TypeScript）

| 题目 | 用例数 | V wasm | V ovm | V jvm | V clr | TS 基准 | 现象 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `n-queens-ii` | 9 | GREEN 9/9 | GREEN 9/9 | GREEN 9/9 | GREEN 9/9 | PASS 9/9 | — |
| `largest-number-after-digit-swaps-by-parity` | 78 | GREEN 78/78 | build blocked | GREEN 78/78 | GREEN 78/78 | PASS 78/78 | ovm 导出歧义（后已修复转绿） |
| `excel-sheet-column-number` | 201 | build blocked | build blocked | build blocked | build blocked | PASS 201/201 | `unwrap` panic SSA |
| `length-of-last-word` | 48 | build blocked | build blocked | build blocked | build blocked | PASS 48/48 | `unwrap` panic SSA |
| `running-sum-of-1d-array` | 95 | build blocked | build blocked | build blocked | build blocked | PASS 95/95 | 容器解析受阻 |
| `contains-duplicate` | 94 | build blocked | build blocked | build blocked | build blocked | PASS 94/94 | 容器解析受阻 |

- `n-queens-ii`（V 四 lane 全绿）：V `i64` 无 `bit_or`/`bit_not`/左移，位掩码回溯写法明显更绕——TS 用 `mask & ~(cols|d1|d2)`、`(d1|bit)<<1`、`(d2|bit)>>1` 直表达；V 以 `bitor(a, b) = a + b - a.bit_and(b)` 求位并、`mask.bit_xor(banned)` 代 mask 内位反、`*2`/`/2` 代左右移。算法与复杂度同阶 $O(N!)$ 回溯。
- `largest-number-after-digit-swaps-by-parity`：V 数组路径受阻，改用 nibble 打包计数排序——`evens`/`odds` 两个 `i64` 把各数字值计数压进 4-bit 槽位，逐位按原数字奇偶取该奇偶剩余最大者重建。代码量约为 TS 数组版两倍，复杂度同阶 $O(d)$。语料侧：65 例越出官方约束（$8 \le num \le 10^8$）已按约束派生并用参考算法重算 `expected`，78 例全一致。

### 双解对照第二批（11 题）

| 题目 | 批次 | 用例数 | V wasm | V ovm | V jvm | V clr | TS 基准 | 现象 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `check-if-number-is-a-sum-of-powers-of-three` | 标量 | 110 | GREEN 110/110 | GREEN 110/110 | GREEN 110/110 | GREEN 110/110 | PASS | — |
| `three-divisors` | 标量 | 144 | GREEN 144/144 | GREEN 144/144 | GREEN 144/144 | GREEN 144/144 | PASS | — |
| `minimum-cuts-to-divide-a-circle` | 标量 | 44 | GREEN 44/44 | GREEN 44/44 | GREEN 44/44 | GREEN 44/44 | PASS | — |
| `prime-arrangements` | 标量 | 27 | GREEN 27/27 | GREEN 27/27 | GREEN 27/27 | GREEN 27/27 | PASS | — |
| `max-consecutive-ones` | 数组 | 97 | build blocked | build blocked | build blocked | build blocked | PASS | 容器解析受阻 |
| `monotonic-array` | 数组 | 151 | build blocked | build blocked | build blocked | build blocked | PASS | 容器解析受阻 |
| `search-insert-position` | 数组 | 119 | build blocked | build blocked | build blocked | build blocked | PASS | 容器解析受阻 |
| `largest-number-at-least-twice-of-others` | 数组 | 143 | build blocked | build blocked | build blocked | build blocked | PASS | 容器解析受阻（wasm）+ managed `infix !=` 受阻 |
| `valid-palindrome-ii` | 字符串 | 108 | build blocked | build blocked | build blocked | build blocked | PASS | wasm `Raise` 受阻 + managed `infix !=` 受阻 |
| `first-unique-character-in-a-string` | hash | 91 | build blocked | build blocked | build blocked | build blocked | PASS | 容器解析受阻（wasm）+ managed `infix !=` 受阻 |
| `number-of-good-pairs` | 泛型 | 102 | build blocked | build blocked | build blocked | build blocked | PASS | 容器解析受阻 |

- `prime-arrangements`（V 四 lane 全绿）：TS 末步 `(a * b) % m` 在 `a`、`b` 接近 $10^9+7$ 时乘积约 $10^{18}$ 超出 double $2^{53}$，首版 TS 得 75763862（期望 75763854）；V `i64` 直接精确。TS 末步改 `BigInt` 后对齐——双解对照首次在参考侧暴露精度缺口，V 侧无 fallback。
- `largest-number-after-digit-swaps-by-parity` 与 `divide-two-integers` 随 ovm 导出消歧修复转为**四 lane 全绿**（78/78、135/135）。

### 第三批（14 题，V + TypeScript + Python 三参考）

| 题目 | 专题 | 用例数 | V wasm | V ovm | V jvm | V clr | 三参考 | 现象 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `unique-paths` | DP | 55 | GREEN 55/55 | GREEN 55/55 | GREEN 55/55 | GREEN 55/55 | TS+PY 对齐 | — |
| `count-sorted-vowel-strings` | DP | 24 | GREEN 24/24 | GREEN 24/24 | GREEN 24/24 | GREEN 24/24 | TS+PY 对齐 | — |
| `sqrtx` | 位运算/数学 | 67 | GREEN 67/67 | GREEN 67/67 | GREEN 67/67 | GREEN 67/67 | TS+PY 对齐 | — |
| `goal-parser-interpretation` | 字符串 | 95 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 + managed `infix !=` 受阻 |
| `add-binary` | 字符串/位 | 86 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 + managed `infix !=` 受阻 |
| `backspace-string-compare` | 栈队列 | 109 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | wasm `Raise` 受阻 + managed `infix !=` 受阻 |
| `remove-outermost-parentheses` | 栈队列 | 103 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 + managed `infix !=` 受阻 |
| `find-the-highest-altitude` | 数组 | 110 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `minimum-value-to-get-positive-step-by-step-sum` | 数组 | 95 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `palindromic-substrings` | DP/字符串 | 140 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | wasm `Raise` 受阻 + managed `infix !=` 受阻 |
| `island-perimeter` | 图与搜索 | 72 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `find-the-town-judge` | 图与搜索 | 87 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `excel-sheet-column-title` | 数学/字符串 | 38 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 + managed `infix !=` 受阻 |
| `valid-boomerang` | 数学 | 116 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 + managed `infix !=` 受阻 |

- `unique-paths`（V 四 lane 全绿）：组合数乘法公式逐步整除，V `i64` 中间量 ~$4\times10^{11}$ 无溢出；TS double 同式精确（< $2^{53}$）；Python 任意精度。三参考同算法同阶 $O(\min(m,n))$。语料 31 例越官方约束（答案 $\le 2\times10^9$）已派生回 $m,n \in [1,100]$ 并按 BigInt 精确重算。
- `sqrtx`（V 四 lane 全绿）：二分出 $mid^2 \approx 10^{18}$ 的用例（`x=2147483647`），V `i64` 精确。语料 11 例越出官方约束已派生回约束内并重算。
- `backspace-string-compare`：V 无 `break`，用 `done`/`result` 标志展平反向双指针的提前退出；算法同阶 $O(n)$ 时间 $O(1)$ 空间。
- `goal-parser-interpretation`：语料 14 例输入含文法外嵌套，按「剥掉以 `(G` 开头的非法外层括号」派生回合法文法并按参考算法重算 `expected`。
- `add-binary`：语料 83 例 `expected` 为裸数值/精度损失值，全部按 BigInt 参考重算为二进制字符串；另暴露 TS/Python 消费端把 31 位二进制串误判为超安全整数十进制串的缺陷（后按题推断实参键类型修复）。
- `remove-outermost-parentheses`：语料 6 例 `expected` 误写为空数组，按参考算法重算。
- `find-the-town-judge`：`tests[26]` 的 `trust` 引用 $n$ 外之人（越约束），`n` 派生为 8 并按参考算法重算（期望 $-1$）。
- `valid-boomerang`：嵌套数组入参（`ArrayList<ArrayList<i64>>`），wasm 落容器解析受阻；`!=` 使 managed 落 `infix !=` 受阻。

### 第四批（7 题，V + TypeScript + Python 三参考）

| 题目 | 专题 | 用例数 | V wasm | V ovm | V jvm | V clr | 三参考 | 现象 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `minimum-sum-of-four-digit-number-after-splitting-digits` | 数学 | 83 | GREEN 83/83 | GREEN 83/83 | GREEN 83/83 | GREEN 83/83 | TS+PY 对齐 | — |
| `count-primes` | 数学 | 33 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `min-cost-climbing-stairs` | DP | 102 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `utf-8-validation` | 位运算 | 135 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `sort-integers-by-the-number-of-1-bits` | 数组 | 96 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | 容器解析受阻 |
| `percentage-of-letter-in-string` | 字符串 | 107 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | wasm `Raise` 受阻 + managed `infix !=` 受阻 |
| `self-dividing-numbers` | 数组 | 82 | build blocked | build blocked | build blocked | build blocked | TS+PY 对齐 | wasm `Raise` 受阻 + managed `infix !=` 受阻 |

- `minimum-sum-of-four-digit-number-after-splitting-digits`（V 四 lane 全绿）：TS 用数组 + `sort`，V 无数组排序原语，用 5 比较器排序网络直排 4 个数字位；算法同阶 $O(1)$。
- `sort-integers-by-the-number-of-1-bits`：TS 用内建稳定排序，V 无排序原语，用选择排序按 `(popcount, value)` 字典序 $O(n^2)$（官方 $n \le 500$ 可接受）。
- `utf-8-validation`：i64 无 `>>` 位移惯用形态，用 `/ 64`、`/ 32`、`/ 16`、`/ 8` 等价替换（非负整数下与右移同义）。
- `self-dividing-numbers`：`ArrayList::new(0)` + `push` 路径 wasm 落 `Raise` 受阻，managed 落 `infix !=` 受阻。
- 新发现：V 源文件不支持 `//` 行注释（编译报 `此处需要表达式`），全库 `solution.v` 无一行注释用例；valkyrie 注释语法为 `#` 行注释、`<$ $>` 块注释、`#?` 文档注释。

**全绿累计：91 题**。

## 按现象归类的阻塞清单

每个现象对应一组题目与最小复现，修复一条即可批量复跑转绿。归类维度：现象（编译报什么、在哪个通道）、影响题数、是否可绕行、当前处置状态。

### 现象 A：容器操作调用解析受阻（四通道同阻）

- **现象**：`ArrayList` 的 `⁅i⁆` 下标读、`push`、`unwrap` 链路与 `HashMap`/`HashSet`/`Utf8Builder` 内部调用在 HIR 阶段报 `unresolved call `<computed>``（位于 `source/_.v:7:1`，即 std 容器实现内部），四 lane 同因 build blocked。
- **影响题目（31+）**：`two-sum`、`valid-anagram`、`ransom-note`、`longest-substring-without-repeating-characters`、`contains-duplicate`、`happy-number`、`intersection-of-two-arrays`、`integer-to-roman`、`longest-common-prefix`、`reverse-vowels-of-a-string`、`defanging-an-ip-address`、`to-lower-case`、`zigzag-conversion`、`longest-palindromic-substring`、`add-two-numbers`、`concatenation-of-array`、`move-zeroes`、`missing-number`、`squares-of-a-sorted-array`、`decode-xored-array`、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`、`final-value-of-variable-after-performing-operations`、`counting-words-with-a-given-prefix`、`running-sum-of-1d-array`、`max-consecutive-ones`、`monotonic-array`、`search-insert-position`、`largest-number-at-least-twice-of-others`、`first-unique-character-in-a-string`、`number-of-good-pairs`，以及本批 `count-primes`、`min-cost-climbing-stairs`、`utf-8-validation`、`sort-integers-by-the-number-of-1-bits`。
- **可绕行**：是——纯 `i64` 标量写法（不用数组/容器）可四 lane 全绿，全部 91 题绿题均为该形态。
- **处置状态**：受阻，待前端语义层修复容器内部调用的实例解析。

### 现象 B：wasm 通道 `Raise` 终止符无目标合同

- **现象**：含 Utf8Text `⁅i⁆`（基数索引，合同实现内含越界 `std::types::panic`）或经 `push` 增长的函数，wasm 构建报 `后端私有计划生产失败: canonical effect terminator 尚无目标合同: PerformEffect { effect: Raise, payload: Some(MirValueId(0)), resume_target: CanonicalBlockId(1) }`。
- **影响题目（16+）**：`count-asterisks`、`day-of-the-year`、`detect-capital`、`excel-sheet-column-number`、`is-subsequence`、`jewels-and-stones`、`length-of-last-word`、`roman-to-integer`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`string-to-integer-atoi`、`valid-palindrome`、`valid-parentheses`、`valid-palindrome-ii`、`backspace-string-compare`、`palindromic-substrings`、`counting-bits`，以及本批 `percentage-of-letter-in-string`、`self-dividing-numbers`（后者无字符串索引，`ArrayList::new(0)` + `push` 路径同样触发）。
- **可绕行**：部分——wasm 侧避免 `⁅ ⁆`/`push` 的写法可过（如 `backspace-string-compare` 展平后不落容器仍受阻，说明边界在 `panic` 路径）。
- **处置状态**：受阻，待 wasm 后端为 `Raise` effect terminator 补目标合同。

### 现象 C：managed 通道 std `infix !=` 实例未解析

- **现象**：ovm/jvm/clr 通道，std 文本/容器实现内的 `infix !=`（`char` 经 u32 码点相等实现，内部为 `prefix !` + `infix ==` 复合）报 `unresolved call `prefix !` in infix !=` 与 `unresolved call `infix ==` in infix !=`（`source/_.v:7:1`）。纯 `i64` 用户层 `!=`（如 `three-divisors` 的 `r * r != n`）不受影响，四 lane 全绿。
- **影响题目**：全部 25 个索引写法字符串题与 `valid-palindrome-ii`、`first-unique-character-in-a-string`、`largest-number-at-least-twice-of-others` 的 ovm/jvm/clr lane，以及本批 `percentage-of-letter-in-string`、`self-dividing-numbers`。
- **可绕行**：用户层避免 `!=`（改写为 `==` 取反）可避开部分触发点，但 std 内部实例无法由用户侧规避。
- **处置状态**：受阻，待 managed 侧 std `infix !=` 实例的 HIR 解析修复。

### 现象 D：`loop in` 迭代解析受阻（四通道同阻）

- **现象**：`loop x in ArrayList<T>` 报 `unresolved constructor `_` in into_iterator`（`source/_.v:7:1`）。早前形态为迭代项类型推导为 `Option<T>` 而非 `T`，当前已推进到 `into_iterator` 构造器未解析。
- **影响题目**：`single-number`、`best-time-to-buy-and-sell-stock`、`majority-element`、`find-all-numbers-disappeared-in-an-array`、`intersection-of-two-arrays-ii`。
- **可绕行**：是——`while` + 下标（或标量状态机）等价；但下标读取本身落现象 A，故数组题实质双阻。
- **处置状态**：受阻，待迭代协议/构造器解析修复。

### 现象 E：`match` 对 `Option<T>` 绑定不传导 payload 类型

- **现象**：`match value { case Some(x): ... }` 内对 `x` 的运算报 `unresolved call `infix ==``；同函数用 `value.unwrap()` 则通过。
- **影响题目**：`third-maximum-number`（四通道同阻）。
- **可绕行**：是——以 `unwrap()` 替代 `match` 解构（但 `unwrap` 链路在 wasm 落现象 B）。
- **处置状态**：受阻，待 typed sum `match` 绑定类型传导修复。

### 现象 F：限定路径构造器调用未解析

- **现象**：用户代码（非 `std.text` 命名空间）调用 `Utf8Text::from_bytes` 报 `unresolved call `Utf8Text.from_bytes``；std 内部测试可用。
- **影响题目**：`day-of-the-week`（四通道同阻）。
- **可绕行**：部分——用 `Utf8Builder` 逐码点拼接（但 builder 输出链落落现象 A）。
- **处置状态**：受阻，待 std 类型构造器的限定路径导出/绑定修复。

### 现象 G：jvm/clr 定长数组载体缺失

- **现象**：`JVM/CLR 最小 lowering 不支持类型 `[i64]`（或 `[u8]`）：缺少该形状的 JVM/CLR 载体合同`。
- **影响题目（20）**：字符串题组（`valid-parentheses`、`roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi`、`count-asterisks`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`detect-capital`、`day-of-the-year`、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`、`jewels-and-stones`、`final-value-of-variable-after-performing-operations`、`counting-words-with-a-given-prefix`）与数组题组（`add-two-numbers`、`concatenation-of-array`、`move-zeroes`、`missing-number`、`squares-of-a-sorted-array`、`decode-xored-array`、`counting-bits`）。
- **可绕行**：无（后端载体能力缺口）。
- **处置状态**：受阻，待 jvm/clr 定长数组载体合同。

### 现象 H：ovm typed sum 表示计划缺失（合同已补，待复跑）

- **现象**：`Nyar backend requires a typed sum representation plan; semantic sum operation has no target contract`。
- **影响题目（19）**：`valid-parentheses`、`add-two-numbers`、`roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi`、`concatenation-of-array`、`move-zeroes`、`missing-number`、`squares-of-a-sorted-array`、`decode-xored-array`、`count-asterisks`、`split-a-string-in-balanced-strings`、`student-attendance-record-i`、`detect-capital`、`day-of-the-year`、`number-of-steps-to-reduce-a-number-in-binary-representation-to-one`、`jewels-and-stones`、`final-value-of-variable-after-performing-operations`、`counting-words-with-a-given-prefix`。
- **可绕行**：无（后端计划能力缺口）。
- **处置状态**：合同已在上游补齐（`SumNew`/`SumPayloadGet`/`SumVariantIs` 只消费计划冻结的表示，回归用例绿），19 题矩阵复跑待进行。

### 现象 I：managed 缺 `__u64_lt` host 能力

- **现象**：`host contract `std.primitive.__u64_lt` (instance `ItemInstanceId(12)`) has a resolved call but no host provider is bound`。
- **影响题目**：`counting-bits`（ovm/jvm/clr lane）。
- **可绕行**：无。
- **处置状态**：受阻，待 `std.primitive.__u64_lt` 的 managed host provider 绑定。

### 现象 J：wasm 编译线程 panic（`reverse-string`）

- **现象**：`panicked at ... WASM 编码结果与预规划槽冲突`，进程退出 `-1073740791`，矩阵进程被带走，该题无 JSON 证据行。
- **影响题目**：`reverse-string`（四 lane）。
- **可绕行**：无。
- **处置状态**：受阻，待 wasm  lowering 对泛型返回槽的规划/编码一致性修复。

### 已修复现象（历史归档）

| 现象 | 处置 | 验证 |
| --- | --- | --- |
| std `panic` block 参数缺 SSA 类型（Semantic MIR 合同失败） | `Raise` resume 参数定型修复 | 原 11 题组推进到现象 B/C |
| ovm `std::infix ==` 多类型共存导出歧义 | 按实例身份消歧 | `largest-number-after-digit-swaps-by-parity`、`divide-two-integers` 四 lane 全绿 |
| 局部变量名 `position` 与 std prelude 撞名 | 解析修复 | `pass-the-pillow` 四 lane 复绿 94/94 |
| wasm ABI `ArrayList<utf8>` 入参元素编组丢失 | 元素 schema 取声明身份唯一 `generic_arg`，`utf8` 元素经宿主编组 | `countWords(['ab','cde'])` 与 `firstLen` 均返回 2 |
| ovm fixed-array 布局缺失并 panic | 按元素个数铸造后端私有布局，缺合同改结构化错误 | 矩阵恢复产出 JSON，`counting-bits` 推进到现象 I |
| ovm typed sum 表示计划缺失 | 见现象 H | 待复跑 |
| wasm i64 移位截窄 | 修复 | `binary-gap` 四 lane 全绿 61/61 |
| `char_at` 码点 0 编组缺陷 | 修复 | `valid-parentheses` wasm GREEN 148/148 |
| 限定路径 turbofish `std::collection::array::new::<T>` 未解析 | 解析修复后并入现象 A | 见现象 A |

## `char_at` 序数 sweep（归档）

按更正后的合同（`char_at` 为 **1 基序数**，`char_at(0)` 非法；`⁅ ⁆` 索引维持 0 基基数）把全库 `solution.v` 的 `char_at` 调用点统一改为 1 基，随后 `char_at` 退役、`Utf8Text` 索引重定向码点落地，25 个调用点已全部转为索引写法 `s⁅x - 1⁆`（0 基基数直接取 `char`，不再经 `unwrap`）。全库 `solution.v` 已零 `char_at`。复跑验证：纯索引读取题 wasm 受阻于现象 B、ovm/jvm/clr 受阻于现象 C；含 builder/push/HashMap 的题四通道受阻于现象 A。**25 题全部维持 build blocked，不计已修。**

## 语料精度修根（归档 + 本轮收尾）

### 表示规则与生成器断言

- 整数/浮点字面量凡越过 `Number.MAX_SAFE_INTEGER`，在 `metadata.json` 一律写成**十进制字符串**（保留原始十进制文本，不做 double 往返）；仅真浮点题（当前仅 `powx-n`）允许保留浮点期望。
- `projects/conformance/scripts/unsafe-integer-corpus.mjs`：`scan` 文本级扫描全部 `metadata.json` 分类统计；`scan --assert` 挂为 `pnpm test:corpus`，当前断言口径为「不存在裸数字形态的超安全整数，也不存在真浮点题之外的浮点字面量」，**当前通过**（重扫 2842 份：`fits_i64=0 / fits_u64=0 / beyond_u64=0 / float_literal=3`，均为 `powx-n` 合法 f64 期望）。
- **本轮 48 题全量回填**：852 处浮点字面量按各题自带 Python 参考解精确重算；越官方约束的 args 按官方约束确定性派生（取模、幂/平方根下降、截断、保号映射、去前导零），答案超 i64 的整数题（`paint-fence`、`coin-change-ii`、`combination-sum-iv`、`product-of-array-except-self`、`find-the-maximum-factor-score-of-array`、`replace-non-coprime-numbers-in-array`）按单调性收缩或映射后重算落入 i64；字符串输出题期望写成裸数值的改回字符串；`"Execution timed out"`/`null` 占位符按参考解回填。48/48 `run_python_solver.py` 通过，零语义级不一致遗留。
- 边界用例补入：`add-strings` +3（`2^53-1`+1、`2^53`+`2^53`、`2^64-1`+1）、`multiply-strings` +1（`(2^53+1)×3`）、`smallest-value-of-the-rearranged-number` +2（`-2^53`、`2^53-1`）。

### 消费侧（四 lane + 参考端）

- 共享入口 `src/domain/integer-literal.ts`：按十进制解析校验 `i64`/`u64` 文本，越界/非法格式结构化报错（不静默截断）；`isUnsafeIntegerLiteralString` 以安全整数界区分「被转换的大整数」与「真实字符串参数」。
- 新增 `src/domain/integer-args.ts`：按题推断实参键类型（任一同键出现裸数值即整数型），整数型键的超安全整数字符串经 `BigInt(value)` 精确还原，**禁止 `Number(...)` 先行转 float**；字符串型键（二进制串等）一律原样保留。TS Node 与 Bun 两端共用（Bun 侧此前完全缺失按键规整，且 adapter 自引用 import 导致运行时无法加载，已修复并复跑通过）。
- `assert.ts`：`bigint` 实得按精确十进制文本深比较（含数组递归）。
- `run_python_solver.py`：`sys.set_int_max_str_digits(200000)`，大整数字符串按原生 `int` 精确还原。
- `run_v_solver.ts`（wasm）：字符串整数经既有 `I64` 十进制通道原样交 glue；按 ABI 返回类型把整数结果规整为十进制文本再比较。
- `managed-runner.ts`（jvm/clr）：`i64`/`i32` 实参与返回值统一规整为精确十进制文本，argv 直传。
- `run_nyar_solver.ts`（ovm）：超安全整数字符串以裸数字文本注入 `argsJson`，serde 按 `as_i64` 精确还原。
- 单测 `tests/integer-literal.test.ts`（12 例）覆盖 `2^53-1`、`2^53`、`2^64-1`、负 `-2^63`、前导零、i64/u64 范围校验、`BigInt` 规整与断言路径。

### 早期语料修复（归档）

`alternating-digit-sum`（#2544）与 `count-the-digits-that-divide-a-number`（#2520）的生成语料曾混入越界输入，按官方约束与语言整数语义修复：替换值由原字面量十进制有效数字派生，`expected` 用参考算法重算。修复后两题四 lane 全绿：57/57 与 77/77。`hamming-distance`、`binary-number-with-alternating-bits`、`reverse-bits` 同法转绿（见「语料回填转绿」）。`running-sum-of-1d-array` 的 `tests[19]` 非整数浮点元素已截断取整并重算；`counting-bits` 的 17 例 `"Execution timed out"` 占位符已按 `countBits` 重算 `expected`。

## managed lane 真实执行

`jvm` / `clr` 消费 `run-contracts.txt`（真 ExecutionManifest）与 `managed-abi.json`，每个用例单独起进程，退出码必须为 0：

- `jvm`：`java -cp <jar> nyar.invoke.<entry> <args...>`
- `clr`：`dotnet exec <dll> <entry> <args...>`（同目录 `<artifact>.runtimeconfig.json`）

矩阵校验 `schema_version`、`lane`、`artifact` 文件名、`calling_convention`、入口签名，并按规范文本复算 `contract_digest`；缺合同、artifact/lane 不符或 digest 不匹配一律结构化 blocked。行内记录 `managedContractDigest`、`managedInvokeCommand`、`managedInvokeExitStatus` 与用例计数。未用 compile-evidence 冒充 manifest，也未跨 lane 借数。

## 结构化 blocked 题目与现象归类（归档快照）

分类口径：`build blocked` = compile/link 结构化失败；`ready N/M` = 已生成真实产物但用例失败；`崩溃` = 编译线程 panic 并终止进程。

| 题目 | 用例数 | 状态 | 现象 | 原始诊断 |
| --- | --- | --- | --- | --- |
| `valid-parentheses` | 148 | wasm GREEN，其余三 lane build blocked | ovm 见现象 H + managed 见现象 G | ovm：typed sum 无目标合同。jvm/clr：`[u8]` 载体缺失。wasm 148/148 全绿 |
| `roman-to-integer`、`valid-palindrome`、`string-to-integer-atoi` | 94 / 21 / 185 | wasm GREEN，其余三 lane build blocked | 同上形态 | 待复跑确认 |
| `add-two-numbers` | 59 | wasm GREEN，其余三 lane build blocked | ovm 见现象 H + managed 见现象 G（`[i64]`） | — |
| `two-sum`、`valid-anagram`、`ransom-note` | 80 / — / — | 四 lane build blocked | 现象 A | `unresolved call `<computed>` in get`（26 处同源）+ `infix ==` in rehash |
| `reverse-vowels-of-a-string`、`integer-to-roman`、`longest-common-prefix` | — | 四 lane build blocked | 现象 A | `unresolved call `infix +` in append`（6 处同源）等 |
| `happy-number` | — | 四 lane build blocked | 现象 A | `unresolved call `<computed>` in insert`（23 处同源） |
| `reverse-string` | — | 四 lane 崩溃（exit `-1073740791`） | 现象 J | 编码结果与预规划槽冲突 |

矩阵 CLI 目前不能在 `reverse-string` 这类编译线程 panic 时写出结构化行，只能得到进程退出码；该题的 lane 证据缺失，需要修复后复跑才能补回。

## 上游待修（按现象汇总）

1. 现象 A：std 泛型容器内部调用（`get`/`insert`/`append`/`push`/`⁅ ⁆`）的实例解析。
2. 现象 B：wasm 后端 `Raise` effect terminator 目标合同。
3. 现象 C：managed 侧 std `infix !=` 实例的 HIR 解析。
4. 现象 D：`loop in` 迭代协议（`into_iterator` 构造器）。
5. 现象 E：typed sum `match` 绑定类型传导。
6. 现象 F：std 类型构造器的限定路径导出/绑定。
7. 现象 G：jvm/clr 定长数组载体合同（`[i64]`/`[u8]`）。
8. 现象 H：ovm typed sum 表示计划（合同已补，待复跑确认）。
9. 现象 I：`std.primitive.__u64_lt` 的 managed host provider。
10. 现象 J：wasm lowering 泛型返回槽的规划/编码一致性。
