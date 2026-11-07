# TypeScript lane 基线

判题绿只证明「与 `metadata.tests[].expected` 一致」，不证明「与题面一致」。本报告只记录真实执行计数。

## 范围

- 分母：1161 题（V canonical，TS 与 V 取同一集合）。
- Node 与 Bun 各自独立执行；一个通道的通过数不能替代另一个。

## Node

| 指标 | 数量 |
| --- | --- |
| 范围总数（分母） | 1161 |
| 实际尝试 | 1161 |
| 通过（真实执行计数完整） | 973 |
| 失败（已执行但不一致） | 186 |
| blocked（无法执行） | 0 |
| 未验证（超时 / runtime pending / skipped） | 2 |
| 未尝试（runner 未覆盖） | 0 |

### 失败分类

- pass: 973
- empty-solver: 123
- assert-mismatch: 51
- load-error: 5
- validator-required: 4
- order-only-mismatch: 3
- timeout: 2

### 顺序类疑似比较方式缺陷（与 expected 来源无关）

- find-all-duplicates-in-an-array
- sort-array-by-parity
- sort-array-by-parity-ii

### 批次

| 范围 | Attempted | Pass | Fail | Blocked | Unverified | CaseTotal | Executed | Seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0-400 | 400 | 334 | 65 | 0 | 1 | 35705 | 30682 | 296 |
| 400-800 | 400 | 339 | 61 | 0 | 0 | 37010 | 32528 | 551 |
| 800-1161 | 361 | 300 | 60 | 0 | 1 | 35477 | 30910 | 283 |

## Bun

| 指标 | 数量 |
| --- | --- |
| 范围总数（分母） | 1161 |
| 实际尝试 | 1161 |
| 通过（真实执行计数完整） | 972 |
| 失败（已执行但不一致） | 185 |
| blocked（无法执行） | 0 |
| 未验证（超时 / runtime pending / skipped） | 4 |
| 未尝试（runner 未覆盖） | 0 |

### 失败分类

- pass: 972
- empty-solver: 123
- assert-mismatch: 51
- timeout: 4
- validator-required: 4
- load-error: 4
- order-only-mismatch: 3

### 顺序类疑似比较方式缺陷（与 expected 来源无关）

- find-all-duplicates-in-an-array
- sort-array-by-parity
- sort-array-by-parity-ii

### 批次

| 范围 | Attempted | Pass | Fail | Blocked | Unverified | CaseTotal | Executed | Seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0-400 | 400 | 334 | 64 | 0 | 2 | 35705 | 30682 | 167 |
| 400-800 | 400 | 339 | 61 | 0 | 0 | 37010 | 32528 | 242 |
| 800-1161 | 361 | 299 | 60 | 0 | 2 | 35477 | 30815 | 489 |

## 跨通道

- Node 与 Bun 都通过：972
- 仅 Node 通过：1
- 仅 Bun 通过：0
- 两者未通过：188

## 失败原因簇

### node

- 123 × [fail] solution.ts 为空（空跑不判通过）
- 2 × [unverified] 超时 60000ms，未拿到执行计数
- 2 × [fail] TypeError: Cannot mix BigInt and other types, use explicit conversions
- 1 × [fail] Error: tests[1]: expected [0,3], got [-1,-1]
- 1 × [fail] RangeError: Invalid string length
- 1 × [fail] Error: 多解题 gray-code 需要题面语义校验，禁止 JSON/规范化比较（题面允许任意合法 Gray 码序列，相邻只差一位是序列属性，排序会破坏合法性）
- 1 × [fail] Error: tests[95]: expected 14, got 10
- 1 × [fail] Error: tests[2]: expected [], got [null,null]（compareMode=unordered-1d）
- 1 × [fail] Error: tests[21]: expected "a", got "a[b"
- 1 × [fail] Error: tests[5]: expected [5,6,9], got [9,5,6]
- 1 × [fail] Error: 多解题 sort-characters-by-frequency 需要题面语义校验，禁止 JSON/规范化比较（频次相同时字符顺序自由，排序无法判定“按频次降序”这一约束）
- 1 × [fail] Error: tests[0]: expected 475, got 958

### bun

- 123 × [fail] solution.ts 为空（空跑不判通过）
- 4 × [unverified] 超时 60000ms，未拿到执行计数
- 1 × [fail] Error: tests[1]: expected [0,3], got [-1,-1]
- 1 × [fail] Error: 多解题 gray-code 需要题面语义校验，禁止 JSON/规范化比较（题面允许任意合法 Gray 码序列，相邻只差一位是序列属性，排序会破坏合法性）
- 1 × [fail] Error: tests[95]: expected 14, got 10
- 1 × [fail] Error: tests[2]: expected [], got [null,null]（compareMode=unordered-1d）
- 1 × [fail] Error: tests[21]: expected "a", got "a[b"
- 1 × [fail] Error: tests[5]: expected [5,6,9], got [9,5,6]
- 1 × [fail] Error: 多解题 sort-characters-by-frequency 需要题面语义校验，禁止 JSON/规范化比较（频次相同时字符顺序自由，排序无法判定“按频次降序”这一约束）
- 1 × [fail] Error: tests[0]: expected 475, got 958
- 1 × [fail] Error: tests[7]: expected 10, got "10"
- 1 × [fail] Error: tests[0]: expected 34, got 21

## 逐题失败清单

### node

- divide-two-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-first-and-last-position-of-element-in-sorted-array [fail/assert-mismatch] Error: tests[1]: expected [0,3], got [-1,-1]
- combination-sum [fail/load-error] RangeError: Invalid string length
- gray-code [fail/validator-required] Error: 多解题 gray-code 需要题面语义校验，禁止 JSON/规范化比较（题面允许任意合法 Gray 码序列，相邻只差一位是序列属性，排序会破坏合法性）
- pascals-triangle [fail/empty-solver] solution.ts 为空（空跑不判通过）
- pascals-triangle-ii [fail/empty-solver] solution.ts 为空（空跑不判通过）
- max-points-on-a-line [fail/assert-mismatch] Error: tests[95]: expected 14, got 10
- factorial-trailing-zeroes [fail/empty-solver] solution.ts 为空（空跑不判通过）
- reverse-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-1-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- bitwise-and-of-numbers-range [fail/empty-solver] solution.ts 为空（空跑不判通过）
- power-of-two [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-digit-one [fail/empty-solver] solution.ts 为空（空跑不判通过）
- different-ways-to-add-parentheses [fail/assert-mismatch] Error: tests[2]: expected [], got [null,null]（compareMode=unordered-1d）
- add-digits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- ugly-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- nim-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- flip-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- bulb-switcher [fail/empty-solver] solution.ts 为空（空跑不判通过）
- power-of-three [fail/empty-solver] solution.ts 为空（空跑不判通过）
- counting-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- power-of-four [fail/empty-solver] solution.ts 为空（空跑不判通过）
- integer-break [fail/empty-solver] solution.ts 为空（空跑不判通过）
- intersection-of-two-arrays [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-numbers-with-unique-digits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- sum-of-two-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- decode-string [fail/assert-mismatch] Error: tests[21]: expected "a", got "a[b"
- integer-replacement [fail/empty-solver] solution.ts 为空（空跑不判通过）
- nth-digit [fail/empty-solver] solution.ts 为空（空跑不判通过）
- binary-watch [fail/empty-solver] solution.ts 为空（空跑不判通过）
- convert-a-number-to-hexadecimal [fail/empty-solver] solution.ts 为空（空跑不判通过）
- fizz-buzz [fail/empty-solver] solution.ts 为空（空跑不判通过）
- arranging-coins [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-all-duplicates-in-an-array [fail/order-only-mismatch] Error: tests[5]: expected [5,6,9], got [9,5,6]
- sort-characters-by-frequency [fail/validator-required] Error: 多解题 sort-characters-by-frequency 需要题面语义校验，禁止 JSON/规范化比较（频次相同时字符顺序自由，排序无法判定“按频次降序”这一约束）
- hamming-distance [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-complement [fail/empty-solver] solution.ts 为空（空跑不判通过）
- largest-palindrome-product [fail/assert-mismatch] Error: tests[0]: expected 475, got 958
- construct-the-rectangle [fail/empty-solver] solution.ts 为空（空跑不判通过）
- base-7 [fail/empty-solver] solution.ts 为空（空跑不判通过）
- perfect-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- fibonacci-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- detect-capital [fail/empty-solver] solution.ts 为空（空跑不判通过）
- student-attendance-record-i [fail/empty-solver] solution.ts 为空（空跑不判通过）
- optimal-division [fail/assert-mismatch] Error: tests[7]: expected 10, got "10"
- non-negative-integers-without-consecutive-ones [fail/assert-mismatch] Error: tests[0]: expected 34, got 21
- construct-string-from-binary-tree [fail/assert-mismatch] Error: tests[3]: expected 1, got "1"
- minimum-factorization [fail/assert-mismatch] Error: tests[1]: expected 25, got 52
- sum-of-square-numbers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- 2-keys-keyboard [fail/empty-solver] solution.ts 为空（空跑不判通过）
- binary-number-with-alternating-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- to-lower-case [fail/empty-solver] solution.ts 为空（空跑不判通过）
- accounts-merge [fail/assert-mismatch] Error: tests[55]: expected [["Alice","alice1@example.com","alice2@example.com","bob1@example.com"],["Bob","bob2@example.com","bob3@example.com","charlie1@example.com"],["Alice","alice3@example.com"]], got [["Alice","alice1@example.com","alice2@example.com","bob1@example.com"],["Charlie","bob2@example.com","bob3@example.com","charlie1@example.com"],["Alice","alice3@example.com"]]（compareMode=outer-only）
- monotone-increasing-digits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- open-the-lock [fail/assert-mismatch] Error: tests[37]: expected 6, got -1
- reach-a-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- prime-number-of-set-bits-in-binary-representation [fail/empty-solver] solution.ts 为空（空跑不判通过）
- jewels-and-stones [fail/empty-solver] solution.ts 为空（空跑不判通过）
- letter-case-permutation [unverified/timeout] 超时 60000ms，未拿到执行计数
- escape-the-ghosts [fail/assert-mismatch] Error: tests[4]: expected true, got false
- domino-and-tromino-tiling [fail/assert-mismatch] Error: tests[0]: expected 5, got 2
- shortest-distance-to-a-character [fail/empty-solver] solution.ts 为空（空跑不判通过）
- consecutive-numbers-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- positions-of-large-groups [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-and-replace-in-string [fail/assert-mismatch] Error: tests[15]: expected 12345, got "12345"
- mirror-reflection [fail/empty-solver] solution.ts 为空（空跑不判通过）
- shortest-path-to-get-all-keys [fail/assert-mismatch] Error: tests[16]: expected -1, got 8
- binary-gap [fail/empty-solver] solution.ts 为空（空跑不判通过）
- advantage-shuffle [fail/validator-required] Error: 多解题 advantage-shuffle 需要题面语义校验，禁止 JSON/规范化比较（题面允许返回任意合法重排）
- uncommon-words-from-two-sentences [fail/empty-solver] solution.ts 为空（空跑不判通过）
- surface-area-of-3d-shapes [fail/assert-mismatch] Error: tests[9]: expected 204, got null
- sort-array-by-parity [fail/order-only-mismatch] Error: tests[0]: expected [0,8,6,4,2,9,7,5,3,1], got [2,4,6,8,0,1,3,5,7,9]
- word-subsets [fail/assert-mismatch] Error: tests[0]: expected ["cccbb"], got []（compareMode=unordered-1d）
- sort-array-by-parity-ii [fail/order-only-mismatch] Error: tests[14]: expected [4,3,2,1,6,5], got [2,1,4,3,6,5]
- minimum-falling-path-sum [fail/assert-mismatch] Error: tests[10]: expected 0, got 101
- di-string-match [fail/empty-solver] solution.ts 为空（空跑不判通过）
- satisfiability-of-equality-equations [fail/assert-mismatch] Error: tests[52]: expected true, got false
- clumsy-factorial [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-domino-rotations-for-equal-row [fail/assert-mismatch] Error: tests[87]: expected 1, got 0
- complement-of-base-10-integer [fail/empty-solver] solution.ts 为空（空跑不判通过）
- numbers-with-repeated-digits [fail/load-error] TypeError: Cannot mix BigInt and other types, use explicit conversions
- smallest-integer-divisible-by-k [fail/empty-solver] solution.ts 为空（空跑不判通过）
- divisor-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- matrix-cells-in-distance-order [fail/empty-solver] solution.ts 为空（空跑不判通过）
- occurrences-after-bigram [fail/empty-solver] solution.ts 为空（空跑不判通过）
- brace-expansion [fail/assert-mismatch] Error: tests[3]: expected ["ab{c","ab{ce}","ad","ade}"], got ["abc","abd","ae"]
- duplicate-zeros [fail/assert-mismatch] Error: tests[0]: expected null, got [8,4,5,0,0,0,0,0]
- distribute-candies-to-people [fail/empty-solver] solution.ts 为空（空跑不判通过）
- parsing-a-boolean-expression [fail/load-error] RangeError: Maximum call stack size exceeded
- defanging-an-ip-address [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-days-in-a-month [fail/empty-solver] solution.ts 为空（空跑不判通过）
- armstrong-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- n-th-tribonacci-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- day-of-the-year [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-words-that-can-be-formed-by-characters [fail/assert-mismatch] Error: tests[14]: expected 4, got 7
- day-of-the-week [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-smallest-common-element-in-all-rows [fail/empty-solver] solution.ts 为空（空跑不判通过）
- split-a-string-in-balanced-strings [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-square-submatrices-with-all-ones [fail/empty-solver] solution.ts 为空（空跑不判通过）
- subtract-the-product-and-sum-of-digits-of-an-integer [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-n-unique-integers-sum-up-to-zero [fail/empty-solver] solution.ts 为空（空跑不判通过）
- xor-queries-of-a-subarray [fail/assert-mismatch] Error: tests[49]: expected [592308591,3569715250,1518674357,720695493,410388572,2036495916,1513070403,123456789,4040404040,1616595204,585955217,381688791,992719227,3904238684,405970720,517479555,1291834588], got [592308591,-725252046,1518674357,720695493,410388572,2036495916,1513070403,123456789,-254563256,1616595204,585955217,381688791,992719227,-390728612,405970720,517479555,1291834588]
- convert-integer-to-the-sum-of-two-no-zero-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-flips-to-make-a-or-b-equal-to-c [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-steps-to-reduce-a-number-to-zero [fail/empty-solver] solution.ts 为空（空跑不判通过）
- rank-teams-by-votes [fail/load-error] TypeError: Cannot read properties of undefined (reading '0')
- number-of-steps-to-reduce-a-number-in-binary-representation-to-one [fail/empty-solver] solution.ts 为空（空跑不判通过）
- diagonal-traverse-ii [fail/assert-mismatch] Error: tests[0]: expected [1], got [[1]]
- make-two-arrays-equal-by-reversing-subarrays [fail/assert-mismatch] Error: tests[112]: expected false, got true
- xor-operation-in-an-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-submatrices-with-all-ones [fail/empty-solver] solution.ts 为空（空跑不判通过）
- water-bottles [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-odd-numbers-in-an-interval-range [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-number-of-coins-you-can-get [fail/assert-mismatch] Error: tests[0]: expected 32, got 36
- sum-of-all-odd-length-subarrays [fail/assert-mismatch] Error: tests[0]: expected 8760, got 5460
- crawler-log-folder [fail/assert-mismatch] Error: tests[5]: expected 4, got 5
- count-of-matches-in-tournament [fail/empty-solver] solution.ts 为空（空跑不判通过）
- calculate-money-in-leetcode-bank [fail/empty-solver] solution.ts 为空（空跑不判通过）
- decode-xored-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-kth-largest-xor-coordinate-value [fail/assert-mismatch] Error: tests[61]: expected 0, got null
- maximum-number-of-events-that-can-be-attended-ii [fail/assert-mismatch] Error: tests[45]: expected 50, got 250
- sum-of-digits-in-base-k [fail/empty-solver] solution.ts 为空（空跑不判通过）
- distinct-numbers-in-each-subarray [fail/empty-solver] solution.ts 为空（空跑不判通过）
- largest-magic-square [fail/empty-solver] solution.ts 为空（空跑不判通过）
- kth-smallest-subarray-sum [fail/assert-mismatch] Error: tests[12]: expected 16, got 15
- count-square-sum-triples [fail/empty-solver] solution.ts 为空（空跑不判通过）
- concatenation-of-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-greatest-common-divisor-of-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-number-of-pairs-with-absolute-difference-k [fail/assert-mismatch] Error: tests[2]: expected 6, got 12
- final-value-of-variable-after-performing-operations [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-difference-between-increasing-elements [fail/empty-solver] solution.ts 为空（空跑不判通过）
- k-radius-subarray-averages [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-first-palindromic-string-in-the-array [fail/assert-mismatch] Error: tests[74]: expected 12321, got "12321"
- a-number-after-a-double-reversal [fail/empty-solver] solution.ts 为空（空跑不判通过）
- divide-a-string-into-groups-of-size-k [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-moves-to-reach-target-score [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-cost-to-set-cooking-time [fail/assert-mismatch] Error: tests[7]: expected 3, got 6
- count-operations-to-obtain-zero [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-integers-with-even-digit-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- counting-words-with-a-given-prefix [fail/empty-solver] solution.ts 为空（空跑不判通过）
- sort-the-jumbled-numbers [fail/load-error] TypeError: Cannot mix BigInt and other types, use explicit conversions
- cells-in-a-range-on-an-excel-sheet [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-bit-flips-to-convert-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- add-two-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- calculate-digit-sum-of-a-string [fail/assert-mismatch] Error: tests[90]: expected "25252525252525253000", got "25252525252525252521"
- count-asterisks [fail/empty-solver] solution.ts 为空（空跑不判通过）
- smallest-even-multiple [fail/empty-solver] solution.ts 为空（空跑不判通过）
- closest-fair-integer [unverified/timeout] 超时 60000ms，未拿到执行计数
- number-of-common-factors [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-original-array-of-prefix-xor [fail/assert-mismatch] Error: tests[34]: expected [42,126,252,504,1008,2016,4032,8064,16128,32256,64512,129024,258048,516096,1032192,2064384,4128768,8257536,16515072,33030144,66060288,132120576,264241152,528482304,1056964608,2113929216,4227858432,8455716864,16911433728,33822867456,67645734912,135291469824,270582939648,541165879296,1082331758592,2164663517184,4329327034368], got [42,126,252,504,1008,2016,4032,8064,16128,32256,64512,129024,2
- minimum-addition-to-make-integer-beautiful [fail/assert-mismatch] Error: tests[32]: expected 6543211, got 6543200
- number-of-distinct-averages [fail/assert-mismatch] Error: tests[0]: expected 1, got 9
- convert-the-temperature [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-pivot-integer [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-the-digits-that-divide-a-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- alternating-digit-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-total-number-of-colored-cells [fail/empty-solver] solution.ts 为空（空跑不判通过）
- pass-the-pillow [fail/empty-solver] solution.ts 为空（空跑不判通过）
- distribute-money-to-maximum-children [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-even-and-odd-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- k-items-with-the-maximum-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- calculate-delayed-arrival-time [fail/empty-solver] solution.ts 为空（空跑不判通过）
- sum-multiples [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-prefix-common-array-of-two-arrays [fail/assert-mismatch] Error: tests[42]: expected [0,0,0,1,2,2,2,3,3,5,5,7,8,8,9,10,11,12,14,16,18,19,19,20,22,24,25,26,27,29], got [0,0,0,1,2,2,2,3,3,5,5,7,8,8,9,10,11,12,14,16,18,19,19,20,22,24,25,26,27,29,30,30]
- find-the-losers-of-the-circular-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- difference-of-number-of-distinct-values-on-diagonals [fail/empty-solver] solution.ts 为空（空跑不判通过）
- neither-minimum-nor-maximum [fail/assert-mismatch] Error: tests[7]: expected 3, got 4
- find-the-maximum-achievable-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- account-balance-after-rounded-purchase [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-minimum-possible-sum-of-a-beautiful-array [fail/assert-mismatch] Error: tests[1]: expected 7500, got 7600
- smallest-number-with-given-digit-product [fail/assert-mismatch] Error: tests[1]: expected -1, got 0
- divisible-and-non-divisible-sums-difference [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-indices-with-index-and-value-difference-i [fail/validator-required] Error: 多解题 find-indices-with-index-and-value-difference-i 需要题面语义校验，禁止 JSON/规范化比较（题面允许返回任意满足条件的下标对）
- construct-product-matrix [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-xor-product [fail/assert-mismatch] Error: tests[58]: expected 532600269, got 27435821
- minimum-number-of-operations-to-make-array-xor-equal-to-k [fail/assert-mismatch] Error: tests[75]: expected 28, got 0
- harshad-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-number-that-makes-result-of-bitwise-and-zero [fail/assert-mismatch] Error: tests[20]: expected "576460752303423487", got 576460752303423500
- minimum-array-end [fail/assert-mismatch] Error: tests[28]: expected "107374182399999999", got 107374182400000000
- number-of-bit-changes-to-make-two-integers-equal [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-key-of-the-numbers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- the-two-sneaky-numbers-of-digitville [fail/assert-mismatch] Error: tests[19]: expected [10,9,8,7,6,5,4,3,2,0], got [1,2,3,4,5,6,7,8,9,10,0,1]（compareMode=unordered-1d）
- maximum-sized-array [fail/assert-mismatch] Error: tests[19]: expected 1330, got 7513
- stone-removal-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- smallest-number-with-all-set-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- zigzag-grid-traversal-with-skip [fail/assert-mismatch] Error: tests[3]: expected [5,7,12,10,13,15], got [5,7,11,9,13,15]
- manhattan-distances-of-all-arrangements-of-pieces [fail/assert-mismatch] TransformError: Transform failed with 1 error: | E:\victory 胜利女神\leetcode.v\projects\problems\manhattan-distances-of-all-arrangements-of-pieces\solvers\typescript\solution.ts:19:96: ERROR: Expected ";" but found ")"
- sort-matrix-by-diagonals [fail/empty-solver] solution.ts 为空（空跑不判通过）

### bun

- divide-two-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-first-and-last-position-of-element-in-sorted-array [fail/assert-mismatch] Error: tests[1]: expected [0,3], got [-1,-1]
- combination-sum [unverified/timeout] 超时 60000ms，未拿到执行计数
- gray-code [fail/validator-required] Error: 多解题 gray-code 需要题面语义校验，禁止 JSON/规范化比较（题面允许任意合法 Gray 码序列，相邻只差一位是序列属性，排序会破坏合法性）
- pascals-triangle [fail/empty-solver] solution.ts 为空（空跑不判通过）
- pascals-triangle-ii [fail/empty-solver] solution.ts 为空（空跑不判通过）
- max-points-on-a-line [fail/assert-mismatch] Error: tests[95]: expected 14, got 10
- factorial-trailing-zeroes [fail/empty-solver] solution.ts 为空（空跑不判通过）
- reverse-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-1-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- bitwise-and-of-numbers-range [fail/empty-solver] solution.ts 为空（空跑不判通过）
- power-of-two [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-digit-one [fail/empty-solver] solution.ts 为空（空跑不判通过）
- different-ways-to-add-parentheses [fail/assert-mismatch] Error: tests[2]: expected [], got [null,null]（compareMode=unordered-1d）
- add-digits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- ugly-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- nim-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- flip-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- bulb-switcher [fail/empty-solver] solution.ts 为空（空跑不判通过）
- power-of-three [fail/empty-solver] solution.ts 为空（空跑不判通过）
- counting-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- power-of-four [fail/empty-solver] solution.ts 为空（空跑不判通过）
- integer-break [fail/empty-solver] solution.ts 为空（空跑不判通过）
- intersection-of-two-arrays [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-numbers-with-unique-digits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- sum-of-two-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- decode-string [fail/assert-mismatch] Error: tests[21]: expected "a", got "a[b"
- integer-replacement [fail/empty-solver] solution.ts 为空（空跑不判通过）
- nth-digit [fail/empty-solver] solution.ts 为空（空跑不判通过）
- binary-watch [fail/empty-solver] solution.ts 为空（空跑不判通过）
- convert-a-number-to-hexadecimal [fail/empty-solver] solution.ts 为空（空跑不判通过）
- fizz-buzz [fail/empty-solver] solution.ts 为空（空跑不判通过）
- arranging-coins [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-all-duplicates-in-an-array [fail/order-only-mismatch] Error: tests[5]: expected [5,6,9], got [9,5,6]
- sort-characters-by-frequency [fail/validator-required] Error: 多解题 sort-characters-by-frequency 需要题面语义校验，禁止 JSON/规范化比较（频次相同时字符顺序自由，排序无法判定“按频次降序”这一约束）
- hamming-distance [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-complement [fail/empty-solver] solution.ts 为空（空跑不判通过）
- largest-palindrome-product [fail/assert-mismatch] Error: tests[0]: expected 475, got 958
- construct-the-rectangle [fail/empty-solver] solution.ts 为空（空跑不判通过）
- base-7 [fail/empty-solver] solution.ts 为空（空跑不判通过）
- perfect-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- fibonacci-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- detect-capital [fail/empty-solver] solution.ts 为空（空跑不判通过）
- student-attendance-record-i [fail/empty-solver] solution.ts 为空（空跑不判通过）
- optimal-division [fail/assert-mismatch] Error: tests[7]: expected 10, got "10"
- non-negative-integers-without-consecutive-ones [fail/assert-mismatch] Error: tests[0]: expected 34, got 21
- construct-string-from-binary-tree [fail/assert-mismatch] Error: tests[3]: expected 1, got "1"
- minimum-factorization [fail/assert-mismatch] Error: tests[1]: expected 25, got 52
- sum-of-square-numbers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- 2-keys-keyboard [fail/empty-solver] solution.ts 为空（空跑不判通过）
- binary-number-with-alternating-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- to-lower-case [fail/empty-solver] solution.ts 为空（空跑不判通过）
- accounts-merge [fail/assert-mismatch] Error: tests[55]: expected [["Alice","alice1@example.com","alice2@example.com","bob1@example.com"],["Bob","bob2@example.com","bob3@example.com","charlie1@example.com"],["Alice","alice3@example.com"]], got [["Alice","alice1@example.com","alice2@example.com","bob1@example.com"],["Charlie","bob2@example.com","bob3@example.com","charlie1@example.com"],["Alice","alice3@example.com"]]（compareMode=outer-only）
- monotone-increasing-digits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- open-the-lock [fail/assert-mismatch] Error: tests[37]: expected 6, got -1
- reach-a-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- prime-number-of-set-bits-in-binary-representation [fail/empty-solver] solution.ts 为空（空跑不判通过）
- jewels-and-stones [fail/empty-solver] solution.ts 为空（空跑不判通过）
- letter-case-permutation [unverified/timeout] 超时 60000ms，未拿到执行计数
- escape-the-ghosts [fail/assert-mismatch] Error: tests[4]: expected true, got false
- domino-and-tromino-tiling [fail/assert-mismatch] Error: tests[0]: expected 5, got 2
- shortest-distance-to-a-character [fail/empty-solver] solution.ts 为空（空跑不判通过）
- consecutive-numbers-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- positions-of-large-groups [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-and-replace-in-string [fail/assert-mismatch] Error: tests[15]: expected 12345, got "12345"
- mirror-reflection [fail/empty-solver] solution.ts 为空（空跑不判通过）
- shortest-path-to-get-all-keys [fail/assert-mismatch] Error: tests[16]: expected -1, got 8
- binary-gap [fail/empty-solver] solution.ts 为空（空跑不判通过）
- advantage-shuffle [fail/validator-required] Error: 多解题 advantage-shuffle 需要题面语义校验，禁止 JSON/规范化比较（题面允许返回任意合法重排）
- uncommon-words-from-two-sentences [fail/empty-solver] solution.ts 为空（空跑不判通过）
- surface-area-of-3d-shapes [fail/assert-mismatch] Error: tests[9]: expected 204, got null
- sort-array-by-parity [fail/order-only-mismatch] Error: tests[0]: expected [0,8,6,4,2,9,7,5,3,1], got [2,4,6,8,0,1,3,5,7,9]
- word-subsets [fail/assert-mismatch] Error: tests[0]: expected ["cccbb"], got []（compareMode=unordered-1d）
- sort-array-by-parity-ii [fail/order-only-mismatch] Error: tests[14]: expected [4,3,2,1,6,5], got [2,1,4,3,6,5]
- minimum-falling-path-sum [fail/assert-mismatch] Error: tests[10]: expected 0, got 101
- di-string-match [fail/empty-solver] solution.ts 为空（空跑不判通过）
- satisfiability-of-equality-equations [fail/assert-mismatch] Error: tests[52]: expected true, got false
- clumsy-factorial [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-domino-rotations-for-equal-row [fail/assert-mismatch] Error: tests[87]: expected 1, got 0
- complement-of-base-10-integer [fail/empty-solver] solution.ts 为空（空跑不判通过）
- numbers-with-repeated-digits [fail/load-error] TypeError: Invalid mix of BigInt and other type in subtraction.
- smallest-integer-divisible-by-k [fail/empty-solver] solution.ts 为空（空跑不判通过）
- divisor-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- matrix-cells-in-distance-order [fail/empty-solver] solution.ts 为空（空跑不判通过）
- occurrences-after-bigram [fail/empty-solver] solution.ts 为空（空跑不判通过）
- brace-expansion [fail/assert-mismatch] Error: tests[3]: expected ["ab{c","ab{ce}","ad","ade}"], got ["abc","abd","ae"]
- duplicate-zeros [fail/assert-mismatch] Error: tests[0]: expected null, got [8,4,5,0,0,0,0,0]
- distribute-candies-to-people [fail/empty-solver] solution.ts 为空（空跑不判通过）
- parsing-a-boolean-expression [fail/load-error] RangeError: Maximum call stack size exceeded.
- defanging-an-ip-address [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-days-in-a-month [fail/empty-solver] solution.ts 为空（空跑不判通过）
- armstrong-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- n-th-tribonacci-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- day-of-the-year [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-words-that-can-be-formed-by-characters [fail/assert-mismatch] Error: tests[14]: expected 4, got 7
- day-of-the-week [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-smallest-common-element-in-all-rows [fail/empty-solver] solution.ts 为空（空跑不判通过）
- split-a-string-in-balanced-strings [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-square-submatrices-with-all-ones [fail/empty-solver] solution.ts 为空（空跑不判通过）
- subtract-the-product-and-sum-of-digits-of-an-integer [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-n-unique-integers-sum-up-to-zero [fail/empty-solver] solution.ts 为空（空跑不判通过）
- xor-queries-of-a-subarray [fail/assert-mismatch] Error: tests[49]: expected [592308591,3569715250,1518674357,720695493,410388572,2036495916,1513070403,123456789,4040404040,1616595204,585955217,381688791,992719227,3904238684,405970720,517479555,1291834588], got [592308591,-725252046,1518674357,720695493,410388572,2036495916,1513070403,123456789,-254563256,1616595204,585955217,381688791,992719227,-390728612,405970720,517479555,1291834588]
- convert-integer-to-the-sum-of-two-no-zero-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-flips-to-make-a-or-b-equal-to-c [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-steps-to-reduce-a-number-to-zero [fail/empty-solver] solution.ts 为空（空跑不判通过）
- rank-teams-by-votes [fail/load-error] TypeError: Cannot access property of undefined or null
- number-of-steps-to-reduce-a-number-in-binary-representation-to-one [fail/empty-solver] solution.ts 为空（空跑不判通过）
- diagonal-traverse-ii [fail/assert-mismatch] Error: tests[0]: expected [1], got [[1]]
- make-two-arrays-equal-by-reversing-subarrays [fail/assert-mismatch] Error: tests[112]: expected false, got true
- xor-operation-in-an-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-submatrices-with-all-ones [fail/empty-solver] solution.ts 为空（空跑不判通过）
- water-bottles [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-odd-numbers-in-an-interval-range [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-number-of-coins-you-can-get [fail/assert-mismatch] Error: tests[0]: expected 32, got 36
- sum-of-all-odd-length-subarrays [fail/assert-mismatch] Error: tests[0]: expected 8760, got 5460
- crawler-log-folder [fail/assert-mismatch] Error: tests[5]: expected 4, got 5
- count-of-matches-in-tournament [fail/empty-solver] solution.ts 为空（空跑不判通过）
- calculate-money-in-leetcode-bank [fail/empty-solver] solution.ts 为空（空跑不判通过）
- decode-xored-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-kth-largest-xor-coordinate-value [fail/assert-mismatch] Error: tests[61]: expected 0, got null
- maximum-number-of-events-that-can-be-attended-ii [fail/assert-mismatch] Error: tests[45]: expected 50, got 250
- sum-of-digits-in-base-k [fail/empty-solver] solution.ts 为空（空跑不判通过）
- distinct-numbers-in-each-subarray [fail/empty-solver] solution.ts 为空（空跑不判通过）
- largest-magic-square [fail/empty-solver] solution.ts 为空（空跑不判通过）
- kth-smallest-subarray-sum [fail/assert-mismatch] Error: tests[12]: expected 16, got 15
- count-square-sum-triples [fail/empty-solver] solution.ts 为空（空跑不判通过）
- concatenation-of-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-greatest-common-divisor-of-array [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-number-of-pairs-with-absolute-difference-k [fail/assert-mismatch] Error: tests[2]: expected 6, got 12
- final-value-of-variable-after-performing-operations [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-difference-between-increasing-elements [fail/empty-solver] solution.ts 为空（空跑不判通过）
- next-greater-numerically-balanced-number [unverified/timeout] 超时 60000ms，未拿到执行计数
- k-radius-subarray-averages [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-first-palindromic-string-in-the-array [fail/assert-mismatch] Error: tests[74]: expected 12321, got "12321"
- a-number-after-a-double-reversal [fail/empty-solver] solution.ts 为空（空跑不判通过）
- divide-a-string-into-groups-of-size-k [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-moves-to-reach-target-score [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-cost-to-set-cooking-time [fail/assert-mismatch] Error: tests[7]: expected 3, got 6
- count-operations-to-obtain-zero [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-integers-with-even-digit-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- counting-words-with-a-given-prefix [fail/empty-solver] solution.ts 为空（空跑不判通过）
- sort-the-jumbled-numbers [fail/load-error] TypeError: Invalid mix of BigInt and other type in remainder.
- cells-in-a-range-on-an-excel-sheet [fail/empty-solver] solution.ts 为空（空跑不判通过）
- minimum-bit-flips-to-convert-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- add-two-integers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- calculate-digit-sum-of-a-string [fail/assert-mismatch] Error: tests[90]: expected "25252525252525253000", got "25252525252525252521"
- count-asterisks [fail/empty-solver] solution.ts 为空（空跑不判通过）
- smallest-even-multiple [fail/empty-solver] solution.ts 为空（空跑不判通过）
- closest-fair-integer [unverified/timeout] 超时 60000ms，未拿到执行计数
- number-of-common-factors [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-original-array-of-prefix-xor [fail/assert-mismatch] Error: tests[34]: expected [42,126,252,504,1008,2016,4032,8064,16128,32256,64512,129024,258048,516096,1032192,2064384,4128768,8257536,16515072,33030144,66060288,132120576,264241152,528482304,1056964608,2113929216,4227858432,8455716864,16911433728,33822867456,67645734912,135291469824,270582939648,541165879296,1082331758592,2164663517184,4329327034368], got [42,126,252,504,1008,2016,4032,8064,16128,32256,64512,129024,2
- minimum-addition-to-make-integer-beautiful [fail/assert-mismatch] Error: tests[32]: expected 6543211, got 6543200
- number-of-distinct-averages [fail/assert-mismatch] Error: tests[0]: expected 1, got 9
- convert-the-temperature [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-pivot-integer [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-the-digits-that-divide-a-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- alternating-digit-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- count-total-number-of-colored-cells [fail/empty-solver] solution.ts 为空（空跑不判通过）
- pass-the-pillow [fail/empty-solver] solution.ts 为空（空跑不判通过）
- distribute-money-to-maximum-children [fail/empty-solver] solution.ts 为空（空跑不判通过）
- number-of-even-and-odd-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- k-items-with-the-maximum-sum [fail/empty-solver] solution.ts 为空（空跑不判通过）
- calculate-delayed-arrival-time [fail/empty-solver] solution.ts 为空（空跑不判通过）
- sum-multiples [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-prefix-common-array-of-two-arrays [fail/assert-mismatch] Error: tests[42]: expected [0,0,0,1,2,2,2,3,3,5,5,7,8,8,9,10,11,12,14,16,18,19,19,20,22,24,25,26,27,29], got [0,0,0,1,2,2,2,3,3,5,5,7,8,8,9,10,11,12,14,16,18,19,19,20,22,24,25,26,27,29,30,30]
- find-the-losers-of-the-circular-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- difference-of-number-of-distinct-values-on-diagonals [fail/empty-solver] solution.ts 为空（空跑不判通过）
- neither-minimum-nor-maximum [fail/assert-mismatch] Error: tests[7]: expected 3, got 4
- find-the-maximum-achievable-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- account-balance-after-rounded-purchase [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-minimum-possible-sum-of-a-beautiful-array [fail/assert-mismatch] Error: tests[1]: expected 7500, got 7600
- smallest-number-with-given-digit-product [fail/assert-mismatch] Error: tests[1]: expected -1, got 0
- divisible-and-non-divisible-sums-difference [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-indices-with-index-and-value-difference-i [fail/validator-required] Error: 多解题 find-indices-with-index-and-value-difference-i 需要题面语义校验，禁止 JSON/规范化比较（题面允许返回任意满足条件的下标对）
- construct-product-matrix [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-xor-product [fail/assert-mismatch] Error: tests[58]: expected 532600269, got 27435821
- minimum-number-of-operations-to-make-array-xor-equal-to-k [fail/assert-mismatch] Error: tests[75]: expected 28, got 0
- harshad-number [fail/empty-solver] solution.ts 为空（空跑不判通过）
- maximum-number-that-makes-result-of-bitwise-and-zero [fail/assert-mismatch] Error: tests[20]: expected "576460752303423487", got 576460752303423500
- minimum-array-end [fail/assert-mismatch] Error: tests[28]: expected "107374182399999999", got 107374182400000000
- number-of-bit-changes-to-make-two-integers-equal [fail/empty-solver] solution.ts 为空（空跑不判通过）
- find-the-key-of-the-numbers [fail/empty-solver] solution.ts 为空（空跑不判通过）
- the-two-sneaky-numbers-of-digitville [fail/assert-mismatch] Error: tests[19]: expected [10,9,8,7,6,5,4,3,2,0], got [1,2,3,4,5,6,7,8,9,10,0,1]（compareMode=unordered-1d）
- maximum-sized-array [fail/assert-mismatch] Error: tests[19]: expected 1330, got 7513
- stone-removal-game [fail/empty-solver] solution.ts 为空（空跑不判通过）
- smallest-number-with-all-set-bits [fail/empty-solver] solution.ts 为空（空跑不判通过）
- zigzag-grid-traversal-with-skip [fail/assert-mismatch] Error: tests[3]: expected [5,7,12,10,13,15], got [5,7,11,9,13,15]
- manhattan-distances-of-all-arrangements-of-pieces [fail/assert-mismatch] AggregateError: 2 errors building "E:\victory 胜利女神\leetcode.v\projects\problems\manhattan-distances-of-all-arrangements-of-pieces\solvers\typescript\solution.ts"
- sort-matrix-by-diagonals [fail/empty-solver] solution.ts 为空（空跑不判通过）

