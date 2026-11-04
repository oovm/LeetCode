# Valkyrie 待验证批次清单

口径：本清单登记**理想解已写**的批次及其验证状态。只有「构建 `status=0` 且隔离判题
`ok=true`」才计入构建通过数，见 `valkyrie-gap-ledger.md` 的「批次状态」小节与缺口编号。
未验证不等于通过；实测列是本次验证窗口逐题跑出的证据。

复跑方式：按下面的 slug 列表批量跑 `legionBuildProject` + 隔离判题；TS 侧已在
`projects/conformance/scripts/run_ts_solver.ts` 实跑，结果列在每题行内。

## 批次 R9-2026-11-04（理想解滚动批次 9，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记的 8 题；只补理想解，不改算法绕 std 缺口。选题偏置压
  「哈希 / 有序容器 / 零拷贝写侧」：`HashMap` 计数与 `keys()`、`BTreeSet` 去重 + `to_list()`
  按秩访问、`ArrayList.view()` 写穿（首次）、嵌套 `ArrayList` 返回、`merge_sort` 就地排序。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 新缺口：**0 条**（G1–G24 不变）。G12 影响题扩为 7、G16 影响题扩为 4（含 `nth` / `range` 核对）。
- 更正：本轮静态核对发现 R4–R8 的 10 个解法使用了不存在的提案 API（`sorted_by` ×9、
  `BTreeSet.floor`/`ceiling`、`utf8.compare`、`HashSet::new(capacity)`），已写入账本观察 4，
  更正计划在验证窗口前完成；本批 8 题**不含** phantom 调用。
- 预期阻断：`top-k-frequent-elements` / `relative-sort-array` / `find-first-and-last-position…` /
  `sort-array-by-parity-ii` 返回 `ArrayList<i64>`，`merge-two-2d-arrays…` / `find-the-difference…`
  返回 `ArrayList<ArrayList<i64>>`，按 G3 在 wasm JS glue 处阻断；`remove-duplicates-from-sorted-array-ii`
  依赖 `ArrayView` 写穿，若 glue 不实现 `[i64]` 写回则按 G3 同族阻断。
- 类型推断风险（非缺口）：`top-k-frequent-elements` 的 `ArrayList<ArrayList<i64>>` 桶需在
  `buckets⁅f⁆` 上取引用后 `push`；`relative-sort-array` 把具名函数 `compare_i64` 作为
  `merge_sort` 的比较器传入。两处都属「能写但未验证」的形态，失败时按编译诊断归类，不改算法。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`nums`+`k` / `nums`+`k` /
  `nums1`+`nums2` / `arr1`+`arr2` / `nums` / `nums`+`target` / `nums` / `nums1`+`nums2`）。
- TS 参考解：8/8 复用既有非空实现，本轮未新写。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `top-k-frequent-elements` | `topKFrequent` | `ArrayList<i64>` | HashMap 频次 + 频次桶（O(n)）+ 首次出现保序；G12 / G3 |
| `k-diff-pairs-in-an-array` | `findPairs` | `i64` | `BTreeSet` 去重 + `to_list()` 按秩访问 + 双指针；G12 / G16 |
| `merge-two-2d-arrays-by-summing-values` | `mergeArrays` | `ArrayList<ArrayList<i64>>` | 嵌套 `ArrayList` 双指针归并；G3 |
| `relative-sort-array` | `relativeSortArray` | `ArrayList<i64>` | HashMap 频次 + 剩余值副本 `merge_sort`；G11 / G12 |
| `remove-duplicates-from-sorted-array-ii` | `removeDuplicates` | `i64` | **`ArrayList.view()` 零拷贝写穿（首次）** |
| `find-first-and-last-position-of-element-in-sorted-array` | `searchRange` | `ArrayList<i64>` | 双下界二分 + 二元组返回；G3 |
| `sort-array-by-parity-ii` | `sortArrayByParityII` | `ArrayList<i64>` | 偶 / 奇两列交错回填；G3 |
| `find-the-difference-of-two-arrays` | `findDifference` | `ArrayList<ArrayList<i64>>` | `HashSet` 差集 + 首次出现保序；G12 / G3 |

## 批次 R8-2026-11-04（理想解滚动批次 8，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记（`# blocked: std.collection 数组参数读取`）的 8 题；
  只补理想解，不改算法绕 std 缺口。选题偏置压「文本构建 + 单端队列 + 插入语义」：
  `Utf8Builder::append_i64`（首次落地）、`slice(k, 1)` 造单字符、`concat` 折叠、
  `Deque` 单调栈（第二面）、`ArrayList.insert(ordinal, value)`、`sorted_by` 多字段比较器、
  `starts_with` / `ends_with` 组合。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 新缺口：**0 条**（G1–G24 不变）。
- 预期阻断：`number-of-lines-to-write-string` 返回 `ArrayList<i64>`、`queue-reconstruction-by-height`
  返回 `ArrayList<ArrayList<i64>>`，按 G3 在 wasm JS glue 处阻断；`string-compression` 的
  `mut chars: [utf8]` 若 glue 未实现写回，按 G3 同族阻断；`queue-reconstruction-by-height` 的
  `sorted_by(ArrayList<ArrayList<i64>>)` 若类型检查只接受一维元素，会在排序入口处报错（G11 边界）；
  其余 5 题预计无缺口阻断，仅受 G3 同族 glue 影响。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`chars` / `widths`+`s` /
  `words` / `words` / `word1`+`word2` / `people` / `preorder` / `words`）。
- TS 参考解：8/8 复用既有非空实现，本轮未新写。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `string-compression` | `compress` | `i64` | `Utf8Builder::append_i64`（首次）+ `slice(k, 1)` 造单字符 + `[utf8]` 写侧 |
| `number-of-lines-to-write-string` | `numberOfLines` | `ArrayList<i64>` | `utf8` Cardinal + `as u32` 码位减；固定二元组走 G3 |
| `unique-morse-code-words` | `uniqueMorseRepresentations` | `i64` | 26 项 `[utf8]` 表 + `concat` 折叠 + `HashSet<utf8>` |
| `find-first-palindromic-string-in-the-array` | `firstPalindrome` | `utf8` | `char` 等值双指针（不进哈希 / 有序） |
| `check-if-two-string-arrays-are-equivalent` | `arrayStringsAreEqual` | `bool` | `utf8.concat` 折叠 + `==` |
| `queue-reconstruction-by-height` | `reconstructQueue` | `ArrayList<ArrayList<i64>>` | **`ArrayList.insert(ordinal, value)` 语义** + `sorted_by` 多字段比较器；G3 |
| `verify-preorder-sequence-in-binary-search-tree` | `verifyPreorder` | `bool` | **`Deque` 第二面**（`push_back` / `peek_back` / `pop_back` 单调栈） |
| `count-prefix-and-suffix-pairs-i` | `countPrefixSuffixPairs` | `i64` | `starts_with` + `ends_with` 组合，无缺口 |

## 批次 R7-2026-11-04（理想解滚动批次 7，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记（`# blocked: std.collection 数组参数读取`）的 8 题；
  只补理想解，不改算法绕 std 缺口。选题偏置压「`utf8` 子串 / 切片族 + 多重集等价判定」：
  `contains` / `index_of`、`starts_with`、`slice(start, count)` + `concat`、`to_lower`、
  `MultiSet<char>` 规范形、`sorted_by(ArrayList<char>)`、`utf8` Cardinal 视图取 `char`。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 预期阻断：`string-matching-in-an-array` / `find-resultant-array-after-removing-anagrams`
  返回 `ArrayList<utf8>`、`group-anagrams` 返回 `ArrayList<ArrayList<utf8>>`，按 G3 在 wasm JS glue
  处阻断；`group-anagrams` 的 `sorted_by(ArrayList<char>)` 比较器裸调 `<` / `>` 按 G15 阻断；
  `find-resultant-array-after-removing-anagrams` 的 `MultiSet<char>` 按 G17（键无 `Hash`）与
  G24（无 `equals`）双阻断；`shortest-completing-word` 的 `HashMap<char, i64>` 按 G17 阻断；
  其余 3 题（`numOfStrings` / `stringShift` / `isAcronym`）预计无缺口阻断，仅受 G3 同族 glue 影响。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`words` / `patterns`+`word` /
  `s`+`shift` / `words`+`s` / `words` / `strs` / `words`+`s` / `licensePlate`+`words`）。
- TS 参考解：8/8 复用既有非空实现，本轮未新写。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `string-matching-in-an-array` | `stringMatching` | `ArrayList<utf8>` | `utf8.contains`（`index_of` 的 bool 化）+ G3 |
| `number-of-strings-that-appear-as-substrings-in-word` | `numOfStrings` | `i64` | `utf8.contains` 二次确认，无新增缺口 |
| `perform-string-shifts` | `stringShift` | `utf8` | `utf8.slice(start, count)` + `concat`（段长语义坑）；非缺口 |
| `count-prefixes-of-a-given-string` | `countPrefixes` | `i64` | `utf8.starts_with`，无新增缺口 |
| `find-resultant-array-after-removing-anagrams` | `removeAnagrams` | `ArrayList<utf8>` | **G24 首例**（`MultiSet` 无 `equals`）+ G17 叠加；G3 |
| `group-anagrams` | `groupAnagrams` | `ArrayList<ArrayList<utf8>>` | **G15 新实例**（`sorted_by(ArrayList<char>)`）+ G3 |
| `check-if-a-string-is-an-acronym-of-words` | `isAcronym` | `bool` | `utf8` Cardinal 取 `char` 等值比较（不进哈希 / 有序） |
| `shortest-completing-word` | `shortestCompletingWord` | `utf8` | **G17 新实例**（`HashMap<char, i64>` 牌照频次 + `to_lower`） |

## 批次 R6-2026-11-04（理想解滚动批次 6，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记（`# blocked: std.collection 数组参数读取`）或空文件的 8 题；
  只补理想解，不改算法绕 std 缺口。选题偏置压「前五批未压过的面」：`HashMap` 计数三连
  （频次 / `keys()` / `values()`）、`utf8.split` 首次落地、`ArrayView` 写侧（全窗视图）、
  `BTreeMap` 下界查询（G16 新实例）、`Array<T>` 排序入口（G11 第二实例）、整数 gcd（新编号 G23）。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 预期阻断：`split-strings-by-separator` / `find-right-interval` 返回 `ArrayList<utf8>` /
  `ArrayList<i64>` 按 G3 在 wasm JS glue 处阻断；`reverse-words-in-a-string-ii` 的 `mut s: [utf8]`
  若 glue 未实现写回，按 G3 同族阻断；`largest-perimeter-triangle` 的 `sorted_by(Array<T>)`
  按 G11 在类型检查处阻断；`find-right-interval` 的 `BTreeMap.ceiling_key` 按 G16、
  `x-of-a-kind-in-a-deck-of-cards` 的 `gcd` 按 G23 在名字解析处阻断；其余只记能力面（G12）。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`arr` / `words1`+`words2` /
  `arr`+`k` / `words`+`separator` / `s` / `intervals` / `nums` / `deck`）；V 侧按 snake_case 书写，
  `invoke.valkyrie` 逐题登记为类方法 camelCase 名。
- TS 参考解：8/8 复用既有非空实现，本轮未新写。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `unique-number-of-occurrences` | `uniqueOccurrences` | `bool` | `HashMap` 计数 + `HashSet` 去重（G12 第 3 实例） |
| `count-common-words-with-one-occurrence` | `countWords` | `i64` | 双 `HashMap<utf8, i64>` + `keys()` 遍历（`[utf8]` 形参面） |
| `kth-distinct-string-in-an-array` | `kthDistinct` | `utf8` | 计数 + 入参数组保序（不依赖哈希表遍历序） |
| `split-strings-by-separator` | `splitWordsBySeparator` | `ArrayList<utf8>` | `utf8.split` 首次落地 + 空段显式过滤；G3 预计阻断 |
| `reverse-words-in-a-string-ii` | `reverseWords` | `unit` | `ArrayView` 写侧（全窗 `array_view(s)` 写穿）+ `mut [utf8]` |
| `find-right-interval` | `findRightInterval` | `ArrayList<i64>` | **G16 第 3 实例**（`BTreeMap.ceiling_key`）+ 嵌套入参；G3 |
| `largest-perimeter-triangle` | `largestPerimeter` | `i64` | **G11 第 2 实例**（`sorted_by(Array<T>, cmp)` 降序副本） |
| `x-of-a-kind-in-a-deck-of-cards` | `hasGroupsSizeX` | `bool` | **G23 首例**（`std.math` 无整数 `gcd`） |

## 批次 R5-2026-11-04（理想解滚动批次 5，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记（`# blocked: std.collection 数组参数读取`）或空文件的 8 题；
  只补理想解，不改算法绕 std 缺口。选题偏置压「未被压过的面」：矩阵读写、原地写侧、
  `MultiSet` / `BitSet`、单调 `Deque`、`HashMap` 首末位置、`utf8` 字典序比较（G13）。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 预期阻断：`spiral-matrix` / `sort-array-by-parity` 返回 `ArrayList<i64>` 按 G3 在 wasm JS glue
  处阻断；`check-if-all-the-integers-in-a-range-are-covered` 的嵌套数组入参按 G3 marshal 同族；
  `find-smallest-letter-greater-than-target` 对 `utf8` 写 `<=` 按 G13（G15 下游）在类型检查处阻断；
  `duplicate-zeros` 的 `mut` 入参若 glue 未实现写回，按 G3 同族阻断。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`matrix` / `nums` / `arr` /
  `ranges`+`left`+`right` / `nums`+`k` / `letters`+`target`）；V 侧按 snake_case 书写，
  `invoke.valkyrie` 逐题登记为类方法 camelCase 名。
- TS 参考解：7/7 复用既有非空实现；`shortest-subarray-with-sum-at-least-k` 原为空文件，
  本轮补写（与前缀和 + 单调队列同构）。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `spiral-matrix` | `spiralOrder` | `ArrayList<i64>` | 矩阵只读遍历（四条边界收缩）；G3 预计阻断 |
| `sort-array-by-parity` | `sortArrayByParity` | `ArrayList<i64>` | 定长载体写侧（双指针交换）；G3 |
| `duplicate-zeros` | `duplicateZeros` | `unit` | 定长载体写侧（逆序复写，越界丢弃） |
| `count-elements-with-maximum-frequency` | `maxFrequencyElements` | `i64` | `MultiSet` 频次归并（未压面） |
| `check-if-all-the-integers-in-a-range-are-covered` | `isCovered` | `bool` | `BitSet` 位图 + 嵌套数组入参 |
| `shortest-subarray-with-sum-at-least-k` | `shortestSubarray` | `i64` | 单调 `Deque`（前缀和 + 队首收缩） |
| `degree-of-an-array` | `findShortestSubArray` | `i64` | `HashMap` 首末位置 + 频次（三表一次建） |
| `find-smallest-letter-greater-than-target` | `nextGreatestLetter` | `utf8` | **G13 第二实例**（`utf8` 字典序，G15 下游） |

## 批次 R4-2026-11-04（理想解滚动批次 4，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记（`# blocked: std.collection 数组参数读取`）的 8 题；
  只补理想解，不改算法绕 std 缺口。选题偏置压「未被压过的面」：定长载体读写、区间二分、
  迭代器适配器、十进制 limb、位掩码。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 预期阻断：`height-checker` 的 `sorted_by(Array<T>, cmp)` 按 G11 在类型检查处阻断；
  `add-to-array-form-of-integer` 返回值 `ArrayList<i64>` 按 G3 在 wasm JS glue 处阻断；
  `sort-colors` / `rotate-image` / `set-matrix-zeroes` 的 `mut` 入参若 glue 未实现写回，
  按 G3 同族阻断；其余只记能力面（G21 / G22），不阻断。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`matrix` / `num` / `k` /
  `allowed` / `words` / `heights` / `nums`）；V 侧按 snake_case 书写，`invoke.valkyrie`
  逐题登记为类方法 camelCase 名。
- TS 参考解：8/8 复用既有非空实现，本轮未新写。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `sort-colors` | `sortColors` | `unit` | 定长载体写侧（三路划分，`⁅ ⁆=` 写穿） |
| `height-checker` | `heightChecker` | `i64` | **G11**（`Array<T>` 无排序入口，需 `sorted_by(Array<T>)`） |
| `find-minimum-in-rotated-sorted-array` | `findMin` | `i64` | `[i64]` 定长读侧 + 区间二分（ArrayView 非必需） |
| `rotate-image` | `rotate` | `unit` | 嵌套载体写侧；G21（行内反转手写交换） |
| `add-to-array-form-of-integer` | `addToArrayForm` | `ArrayList<i64>` | 十进制 limb 进位；G21（结果需反向）；G3 预计阻断 |
| `count-the-number-of-consistent-strings` | `countConsistentStrings` | `i64` | u32 位掩码（`char` G15/G17 以掩码绕开）；G22 面 |
| `find-numbers-with-even-number-of-digits` | `findNumbers` | `i64` | 迭代器 `filter` + `count`（适配器存在确认）；G20 面无整数 `log10` |
| `set-matrix-zeroes` | `setZeroes` | `unit` | 嵌套载体写侧（首行首列当标记位，O(1) 额外空间） |

## 批次 R3-2026-11-04（理想解滚动批次 3，8 题，写完未构建）

- 范围：此前 `solution.v` 为空或仅阻塞标记的 8 题；只补理想解，不改算法绕 std 缺口。
  批次 2（`median-sliding-window` / `top-k-frequent-words` / `word-subsets` /
  `permutation-in-string` / `maximum-gap` / `minimum-number-of-moves-to-seat-everyone` /
  `maximum-number-of-words-found-in-sentences` /
  `find-words-that-can-be-formed-by-characters`）尚未在本表登记，待补。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 预期阻断：`ArrayList` / `ArrayList<bool>` 返回按 G3 预计在 wasm JS glue 处阻断；
  `rotate-array` 的 `array_view(..., offset, length)` 按 G19、`BinaryHeap::max()` 按 G15
  第二实例预计在类型检查处阻断。G20 只记能力面（以手写 `fold` 表达最大值），不阻断。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序对应；V 侧按 snake_case 书写
  （`extra_candies` ↔ `extraCandies`，其余键本身即单词）。`invoke.valkyrie` 已逐题登记为
  类方法 camelCase 名。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `kids-with-the-greatest-number-of-candies` | `kidsWithCandies` | `ArrayList<bool>` | G20；迭代器 `fold` / `map` / `collect_array_list` |
| `rotate-array` | `rotate` | `unit` | G19；`ArrayView` 写穿 |
| `sliding-window-maximum` | `maxSlidingWindow` | `ArrayList<i64>` | `Deque` 单调队列（未压面） |
| `last-stone-weight` | `lastStoneWeight` | `i64` | G15 第二实例（`BinaryHeap` 只有最小序） |
| `kth-largest-element-in-an-array` | `findKthLargest` | `i64` | 定长载体就地分区（快速选择） |
| `multiply-strings` | `multiply` | `utf8` | 大整数 limbs（未命中面：无强制缺口） |
| `find-the-original-array-of-prefix-xor` | `findArray` | `ArrayList<i64>` | 位异或；`zip` 缺失（未命中面） |
| `first-missing-positive` | `firstMissingPositive` | `i64` | 定长载体写侧（原地置换） |

## 批次 C-2026-11-04（canonical 未构建 214 题）

- 范围与口径：`solution.v` 与非空 `metadata.invoke.valkyrie` 的 canonical 集合（496 题）中，
  扫描起点尚无 `.cache/<slug>-bench-node` 产物的 214 题。
- 构建：176 `status=0` / 38 `status=1`。失败族与题数见 `valkyrie-gap-ledger.md` 的
  「批次状态：canonical 未构建 214 题」，按块级口径不逐题罗列。
- 判题：176 个 `status=0` 题导出签名均为标量 / `utf8`，无 G3 阻断；142 题 `ok=true`，
  四字段合计 `executed_pass 13452` / `executed_fail 31` / `blocked 0` / `not_run 2092`。
  未通过 34 题的分类与示例同账本本节。
- 时点：以上是 **std `from_iterator` 修复前** 的测量，本轮不更新。G4 归族已被 dev tip 复测证伪
  （见账本 G4「疑似失效」），std 修复后这 214 题必须整体重扫重判。

## 批次 A-2026-11-04（Easy 数组返回值补缺，19 题，写完未构建）

- 范围：返回数组 / 矩阵的 Easy 题，此前 `solution.v` 为空或仅阻塞标记、`metadata.invoke` 无
  `valkyrie` 入口，从未进入 canonical。本批补写 19 个理想解并在 `metadata.json` 登记入口。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题（std `from_iterator` 未修复），
  不产生 `status` 与四字段实测值，不计入构建通过数。
- 预期阻断：19 题全部返回 `ArrayList`（`ArrayList<i64>` / `ArrayList<utf8>` /
  `ArrayList<ArrayList<i64>>`），按 G3 现状预计在 wasm JS glue 的 marshal/demarshal 处阻断；
  `convert-the-temperature` 另受 G2 阻断。
- 签名：19/19 导出形参名与 `metadata.tests.args` 键名逐字、同序一致（脚本核对）。
- 题（19）：

| slug | 导出入口 | 返回类型 |
| --- | --- | --- |
| `binary-watch` | `readBinaryWatch` | `ArrayList<utf8>` |
| `cells-in-a-range-on-an-excel-sheet` | `cellsInRange` | `ArrayList<utf8>` |
| `construct-the-rectangle` | `constructRectangle` | `ArrayList<i64>` |
| `convert-integer-to-the-sum-of-two-no-zero-integers` | `getNoZeroIntegers` | `ArrayList<i64>` |
| `convert-the-temperature` | `convertTemperature` | `ArrayList<f64>` |
| `di-string-match` | `diStringMatch` | `ArrayList<i64>` |
| `distribute-candies-to-people` | `distributeCandies` | `ArrayList<i64>` |
| `divide-a-string-into-groups-of-size-k` | `divideString` | `ArrayList<utf8>` |
| `find-n-unique-integers-sum-up-to-zero` | `sumZero` | `ArrayList<i64>` |
| `find-the-losers-of-the-circular-game` | `circularGameLosers` | `ArrayList<i64>` |
| `flip-game` | `generatePossibleNextMoves` | `ArrayList<utf8>` |
| `matrix-cells-in-distance-order` | `allCellsDistOrder` | `ArrayList<ArrayList<i64>>` |
| `number-of-even-and-odd-bits` | `evenOddBit` | `ArrayList<i64>` |
| `occurrences-after-bigram` | `findOcurrences` | `ArrayList<utf8>` |
| `pascals-triangle` | `generate` | `ArrayList<ArrayList<i64>>` |
| `pascals-triangle-ii` | `getRow` | `ArrayList<i64>` |
| `positions-of-large-groups` | `largeGroupPositions` | `ArrayList<ArrayList<i64>>` |
| `shortest-distance-to-a-character` | `shortestToChar` | `ArrayList<i64>` |
| `uncommon-words-from-two-sentences` | `uncommonFromSentences` | `ArrayList<utf8>` |

## 批次 E-2026-11-03（Easy 标量/文本池，133 题）

| 组 | 题数 | 依赖能力 | 解锁前置条件 |
| --- | --- | --- | --- |
| 集合状态（`ArrayList` / `HashMap`） | 48 | `ArrayList<T>` 的 `new/push/下标读写`、`HashMap<K,V>` 的 `contains_key/get/insert`、`utf8` 下标读 | G0 已恢复；待一次批量构建复验缓存与泛型实例化 |
| 单遍文本扫描（`utf8` 下标） | 52 | `utf8::length`、`utf8⁅usize⁆` 取 `char`、`char as u32`、整数比较 | G0 已恢复；无需新能力 |
| 文本重建（`Utf8Builder`） | 32 | `Utf8Builder::new/append/build`、`char::from(u32)`、`utf8` 下标读 | G0 已恢复；待复验 builder 容量增长路径 |
| 纯标量算术 | 1 | `i64` 加减乘除、`while`、整数比较 | 无缺口，可直接复跑 |

TS 实跑：131/133 通过。未通过 2 题：`calculate-digit-sum-of-a-string`（大用例 oracle 与题面规则不符）、`minimum-number-of-pushes-to-type-word-i`（oracle 用「按字符位置分槽」模型，与官方按字母频次计价不符）。两题 V/TS 均保留理想解，不为缺陷改算法。

V 实测（2026-11-04，形态 A 清理块）：本批 40 个含 `⁅ ⁆.unwrap()` 的文件已逐处删除 113 处，
复扫残留 0，形态 B 未动。这 40 题真构建 **20 `status=0` / 20 `status=1`**：20 题失败全部命中
G4（`std::text::Utf8Builder.append(char)`）；`minimum-string-length-after-removing-substrings`
另因 `char` 覆盖 `u8`（写法错，非缺口）改回 `u8` 后 `status=0`。其余 93 题未构建，仍属未验证。

判题实测（2026-11-04）：上述 20 题逐个隔离判题，四字段合计 `executed_pass 2099 / executed_fail 1 /
blocked 0 / not_run 170`（`testCaseTotal 2270`），**19 题 `ok=true`**，构建通过数 19 → 38。
唯一未通过为 `minimum-number-of-pushes-to-type-word-i`（已登记 oracle 模型缺陷）。
`single-row-keyboard` 首判 `RuntimeError: unreachable`，原因是 11 例键盘越官方约束，删除后 84/84 通过。

| slug | testCaseTotal | executed_pass | executed_fail | blocked | not_run | ok |
| --- | --- | --- | --- | --- | --- | --- |
| `buddy-strings` | 126 | 126 | 0 | 0 | 0 | true |
| `check-if-digits-are-equal-in-string-after-operations-i` | 127 | 127 | 0 | 0 | 0 | true |
| `check-if-number-has-equal-digit-count-and-digit-value` | 150 | 150 | 0 | 0 | 0 | true |
| `count-the-number-of-special-characters-i` | 159 | 159 | 0 | 0 | 0 | true |
| `existence-of-a-substring-in-a-string-and-its-reverse` | 122 | 122 | 0 | 0 | 0 | true |
| `find-the-index-of-the-first-occurrence-in-a-string` | 144 | 144 | 0 | 0 | 0 | true |
| `largest-substring-between-two-equal-characters` | 74 | 74 | 0 | 0 | 0 | true |
| `maximum-difference-between-even-and-odd-frequency-i` | 40 | 40 | 0 | 0 | 0 | true |
| `maximum-length-substring-with-two-occurrences` | 78 | 78 | 0 | 0 | 0 | true |
| `maximum-number-of-balloons` | 117 | 117 | 0 | 0 | 0 | true |
| `minimize-string-length` | 112 | 112 | 0 | 0 | 0 | true |
| `minimum-number-of-pushes-to-type-word-i` | 202 | 31 | 1 | 0 | 170 | false |
| `minimum-string-length-after-removing-substrings` | 153 | 153 | 0 | 0 | 0 | true |
| `permutation-difference-between-two-strings` | 80 | 80 | 0 | 0 | 0 | true |
| `rearrange-characters-to-make-target-string` | 129 | 129 | 0 | 0 | 0 | true |
| `remove-letter-to-equalize-frequency` | 74 | 74 | 0 | 0 | 0 | true |
| `repeated-substring-pattern` | 87 | 87 | 0 | 0 | 0 | true |
| `rings-and-rods` | 99 | 99 | 0 | 0 | 0 | true |
| `rotate-string` | 113 | 113 | 0 | 0 | 0 | true |
| `single-row-keyboard` | 84 | 84 | 0 | 0 | 0 | true |

`single-row-keyboard` 的 `testCaseTotal` 是删除 11 条越约束用例后的 84（原 95）。未通过题的
`firstFailure` 为 `tests[31]: expected "64", got "55"`。

### 集合状态（`ArrayList` / `HashMap`）（48 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `find-the-index-of-the-first-occurrence-in-a-string` | `build_failure(pattern: utf8)` → `ArrayList<i64>` | 通过 |
| `isomorphic-strings` | `is_isomorphic(s: utf8, t: utf8)` → `bool` | 通过 |
| `valid-anagram` | `is_anagram(s: utf8, t: utf8)` → `bool` | 通过 |
| `palindrome-permutation` | `can_permute_palindrome(s: utf8)` → `bool` | 通过 |
| `word-pattern` | `word_pattern(pattern: utf8, s: utf8)` → `bool` | 通过 |
| `reverse-vowels-of-a-string` | `is_vowel(code: u32)` → `bool` | 通过 |
| `ransom-note` | `can_construct(ransom_note: utf8, magazine: utf8)` → `bool` | 通过 |
| `longest-palindrome` | `longest_palindrome(s: utf8)` → `i64` | 通过 |
| `repeated-substring-pattern` | `prefix_table(pattern: utf8)` → `ArrayList<i64>` | 通过 |
| `rotate-string` | `build_failure(pattern: utf8)` → `ArrayList<i64>` | 通过 |
| `buddy-strings` | `buddy_strings(s: utf8, goal: utf8)` → `bool` | 通过 |
| `reverse-only-letters` | `is_letter_code(code: u32)` → `bool` | 通过 |
| `remove-all-adjacent-duplicates-in-string` | `remove_duplicates(s: utf8)` → `utf8` | 通过 |
| `single-row-keyboard` | `abs_i64(x: i64)` → `i64` | 通过 |
| `maximum-number-of-balloons` | `max_number_of_balloons(text: utf8)` → `i64` | 通过 |
| `hexspeak` | `to_digits(num: utf8)` → `ArrayList<i64>` | 通过 |
| `increasing-decreasing-string` | `sort_string(s: utf8)` → `utf8` | 通过 |
| `reformat-the-string` | `is_digit_code(code: u32)` → `bool` | 通过 |
| `path-crossing` | `encode_point(x: i64, y: i64)` → `i64` | 通过 |
| `make-the-string-great` | `abss(x: i64)` → `i64` | 通过 |
| `thousand-separator` | `thousand_separator(n: i64)` → `utf8` | 通过 |
| `replace-all-s-to-avoid-consecutive-repeating-characters` | `modify_string(s: utf8)` → `utf8` | 通过 |
| `rearrange-spaces-between-words` | `reorder_spaces(text: utf8)` → `utf8` | 通过 |
| `largest-substring-between-two-equal-characters` | `max_length_between_equal_characters(s: utf8)` → `i64` | 通过 |
| `reformat-phone-number` | `reformat_number(number: utf8)` → `utf8` | 通过 |
| `latest-time-by-replacing-hidden-digits` | `maximum_time(time: utf8)` → `utf8` | 通过 |
| `number-of-different-integers-in-a-string` | `num_different_integers(word: utf8)` → `i64` | 通过 |
| `rings-and-rods` | `count_points(rings: utf8)` → `i64` | 通过 |
| `calculate-digit-sum-of-a-string` | `digit_sum(s: utf8, k: i64)` → `utf8` | 未通过（语料缺陷） |
| `check-if-number-has-equal-digit-count-and-digit-value` | `digit_count(num: utf8)` → `bool` | 通过 |
| `rearrange-characters-to-make-target-string` | `rearrange_characters(s: utf8, target: utf8)` → `i64` | 通过 |
| `greatest-english-letter-in-upper-and-lower-case` | `empty_text()` → `utf8` | 通过 |
| `first-letter-to-appear-twice` | `empty_text()` → `utf8` | 通过 |
| `remove-letter-to-equalize-frequency` | `equal_frequency(word: utf8)` → `bool` | 通过 |
| `minimum-string-length-after-removing-substrings` | `min_length(s: utf8)` → `i64` | 通过 |
| `lexicographically-smallest-palindrome` | `make_smallest_palindrome(s: utf8)` → `utf8` | 通过 |
| `minimize-string-length` | `minimized_string_length(s: utf8)` → `i64` | 通过 |
| `faulty-keyboard` | `final_string(s: utf8)` → `utf8` | 通过 |
| `minimum-number-of-pushes-to-type-word-i` | `minimum_pushes(word: utf8)` → `i64` | 未通过（语料缺陷） |
| `existence-of-a-substring-in-a-string-and-its-reverse` | `pair_slot(first: u32, second: u32)` → `usize` | 通过 |
| `maximum-length-substring-with-two-occurrences` | `maximum_length_substring(s: utf8)` → `i64` | 通过 |
| `count-the-number-of-special-characters-i` | `number_of_special_chars(word: utf8)` → `i64` | 通过 |
| `permutation-difference-between-two-strings` | `find_permutation_difference(s: utf8, t: utf8)` → `i64` | 通过 |
| `clear-digits` | `clear_digits(s: utf8)` → `utf8` | 通过 |
| `convert-date-to-binary` | `digit_at(s: utf8, at: usize)` → `i64` | 通过 |
| `find-valid-pair-of-adjacent-digits-in-string` | `find_valid_pair(s: utf8)` → `utf8` | 通过 |
| `maximum-difference-between-even-and-odd-frequency-i` | `max_difference(s: utf8)` → `i64` | 通过 |
| `check-if-digits-are-equal-in-string-after-operations-i` | `has_same_digits(s: utf8)` → `bool` | 通过 |

### 单遍文本扫描（`utf8` 下标）（52 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `strobogrammatic-number` | `mirror_digit(code: u32)` → `i64` | 通过 |
| `valid-word-abbreviation` | `valid_word_abbreviation(word: utf8, abbr: utf8)` → `bool` | 通过 |
| `number-of-segments-in-a-string` | `is_blank(code: u32)` → `bool` | 通过 |
| `longest-uncommon-subsequence-i` | `find_l_u_slength(a: utf8, b: utf8)` → `i64` | 通过 |
| `robot-return-to-origin` | `judge_circle(moves: utf8)` → `bool` | 通过 |
| `count-binary-substrings` | `count_binary_substrings(s: utf8)` → `i64` | 通过 |
| `long-pressed-name` | `is_long_pressed_name(name: utf8, typed: utf8)` → `bool` | 通过 |
| `count-substrings-with-only-one-distinct-letter` | `count_letters(s: utf8)` → `i64` | 通过 |
| `remove-palindromic-subsequences` | `remove_palindrome_sub(s: utf8)` → `i64` | 通过 |
| `maximum-score-after-splitting-a-string` | `max_score(s: utf8)` → `i64` | 通过 |
| `consecutive-characters` | `max_power(s: utf8)` → `i64` | 通过 |
| `check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence` | `is_prefix_of_word(sentence: utf8, search_word: utf8)` → `i64` | 通过 |
| `maximum-nesting-depth-of-the-parentheses` | `max_depth(s: utf8)` → `i64` | 通过 |
| `determine-if-string-halves-are-alike` | `is_vowel_code(code: u32)` → `bool` | 通过 |
| `minimum-changes-to-make-alternating-binary-string` | `min_operations(s: utf8)` → `i64` | 通过 |
| `check-if-binary-string-has-at-most-one-segment-of-ones` | `check_ones_segment(s: utf8)` → `bool` | 通过 |
| `check-if-one-string-swap-can-make-strings-equal` | `are_almost_equal(s1: utf8, s2: utf8)` → `bool` | 通过 |
| `second-largest-digit-in-a-string` | `second_highest(s: utf8)` → `i64` | 通过 |
| `determine-color-of-a-chessboard-square` | `square_is_white(coordinates: utf8)` → `bool` | 通过 |
| `check-if-the-sentence-is-pangram` | `check_if_pangram(sentence: utf8)` → `bool` | 通过 |
| `longer-contiguous-segments-of-ones-than-zeros` | `check_zero_ones(s: utf8)` → `bool` | 通过 |
| `substrings-of-size-three-with-distinct-characters` | `count_good_substrings(s: utf8)` → `i64` | 通过 |
| `check-if-word-equals-summation-of-two-words` | `word_value(word: utf8)` → `i64` | 通过 |
| `check-if-string-is-decomposable-into-value-equal-substrings` | `is_decomposable(s: utf8)` → `bool` | 通过 |
| `check-if-all-characters-have-equal-number-of-occurrences` | `are_occurrences_equal(s: utf8)` → `bool` | 通过 |
| `sum-of-digits-of-string-after-convert` | `get_lucky(s: utf8, k: i64)` → `i64` | 通过 |
| `minimum-time-to-type-word-using-special-typewriter` | `min_time_to_type(word: utf8)` → `i64` | 通过 |
| `minimum-moves-to-convert-string` | `minimum_moves(s: utf8)` → `i64` | 通过 |
| `check-if-numbers-are-ascending-in-a-sentence` | `are_numbers_ascending(s: utf8)` → `bool` | 通过 |
| `number-of-valid-words-in-a-sentence` | `is_letter(code: i64)` → `bool` | 通过 |
| `count-vowel-substrings-of-a-string` | `vowel_bit(code: i64)` → `i64` | 通过 |
| `check-whether-two-strings-are-almost-equivalent` | `check_almost_equivalent(word1: utf8, word2: utf8)` → `bool` | 通过 |
| `check-if-all-as-appears-before-all-bs` | `check_string(s: utf8)` → `bool` | 通过 |
| `minimum-number-of-operations-to-convert-time` | `to_minutes(t: utf8)` → `i64` | 通过 |
| `strong-password-checker-ii` | `strong_password_checker_i_i(password: utf8)` → `bool` | 通过 |
| `minimum-recolors-to-get-k-consecutive-black-blocks` | `minimum_recolors(blocks: utf8, k: i64)` → `i64` | 通过 |
| `number-of-valid-clock-times` | `count_time(time: utf8)` → `i64` | 通过 |
| `find-the-longest-balanced-substring-of-a-binary-string` | `find_the_longest_balanced_substring(s: utf8)` → `i64` | 通过 |
| `furthest-point-from-origin` | `furthest_distance_from_origin(moves: utf8)` → `i64` | 通过 |
| `check-if-strings-can-be-made-equal-with-operations-i` | `can_be_equal(s1: utf8, s2: utf8)` → `bool` | 通过 |
| `make-three-strings-equal` | `find_minimum_operations(s1: utf8, s2: utf8, s3: utf8)` → `i64` | 通过 |
| `number-of-changing-keys` | `normalize(code: u32)` → `u32` | 通过 |
| `score-of-a-string` | `score_of_string(s: utf8)` → `i64` | 通过 |
| `valid-word` | `is_vowel(code: u32)` → `bool` | 通过 |
| `minimum-number-of-chairs-in-a-waiting-room` | `minimum_chairs(s: utf8)` → `i64` | 通过 |
| `count-substrings-that-satisfy-k-constraint-i` | `count_k_constraint_substrings(s: utf8, k: i64)` → `i64` | 通过 |
| `check-if-two-chessboard-squares-have-the-same-color` | `square_parity(coordinate: utf8)` → `i64` | 通过 |
| `find-the-original-typed-string-i` | `possible_string_count(word: utf8)` → `i64` | 通过 |
| `check-balanced-string` | `is_balanced(num: utf8)` → `bool` | 通过 |
| `substring-matching-pattern` | `segment_from(s: utf8, p: utf8, begin: usize, end: usize, from: usize)` → `i64` | 通过 |
| `find-special-substring-of-length-k` | `has_special_substring(s: utf8, k: i64)` → `bool` | 通过 |
| `reverse-degree-of-a-string` | `reverse_degree(s: utf8)` → `i64` | 通过 |

### 文本重建（`Utf8Builder`）（32 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `find-the-difference` | `find_the_difference(s: utf8, t: utf8)` → `utf8` | 通过 |
| `add-strings` | `add_strings(num1: utf8, num2: utf8)` → `utf8` | 通过 |
| `license-key-formatting` | `license_key_formatting(s: utf8, k: i64)` → `utf8` | 通过 |
| `reverse-string-ii` | `reverse_str(s: utf8, k: i64)` → `utf8` | 通过 |
| `reverse-words-in-a-string-iii` | `reverse_words(s: utf8)` → `utf8` | 通过 |
| `similar-rgb-color` | `hex_digit_value(code: u32)` → `i64` | 通过 |
| `goat-latin` | `is_vowel_code(code: u32)` → `bool` | 通过 |
| `greatest-common-divisor-of-strings` | `same_text(a: utf8, b: utf8)` → `bool` | 通过 |
| `remove-vowels-from-a-string` | `is_vowel(code: u32)` → `bool` | 通过 |
| `decrypt-string-from-alphabet-to-integer-mapping` | `freq_alphabets(s: utf8)` → `utf8` | 通过 |
| `generate-a-string-with-characters-that-have-odd-counts` | `generate_the_string(n: i64)` → `utf8` | 通过 |
| `reformat-date` | `month_number(code0: u32, code1: u32, code2: u32)` → `i64` | 通过 |
| `maximum-repeating-substring` | `contains_text(hay: utf8, needle: utf8)` → `bool` | 通过 |
| `longest-nice-substring` | `longest_nice_substring(s: utf8)` → `utf8` | 通过 |
| `merge-strings-alternately` | `merge_alternately(word1: utf8, word2: utf8)` → `utf8` | 通过 |
| `truncate-sentence` | `truncate_sentence(s: utf8, k: i64)` → `utf8` | 通过 |
| `replace-all-digits-with-characters` | `replace_digits(s: utf8)` → `utf8` | 通过 |
| `sorting-the-sentence` | `sort_sentence(s: utf8)` → `utf8` | 通过 |
| `largest-odd-number-in-string` | `largest_odd_number(num: utf8)` → `utf8` | 通过 |
| `delete-characters-to-make-fancy-string` | `make_fancy_string(s: utf8)` → `utf8` | 通过 |
| `reverse-prefix-of-word` | `reverse_prefix(word: utf8, ch: utf8)` → `utf8` | 通过 |
| `capitalize-the-title` | `capitalize_title(title: utf8)` → `utf8` | 通过 |
| `remove-digit-from-number-to-maximize-result` | `remove_digit(number: utf8, digit: utf8)` → `utf8` | 通过 |
| `largest-3-same-digit-number-in-string` | `empty_text()` → `utf8` | 通过 |
| `categorize-box-according-to-criteria` | `word_both()` → `utf8` | 通过 |
| `remove-trailing-zeros-from-a-string` | `remove_trailing_zeros(num: utf8)` → `utf8` | 通过 |
| `maximum-odd-binary-number` | `maximum_odd_binary_number(s: utf8)` → `utf8` | 通过 |
| `latest-time-you-can-obtain-after-replacing-characters` | `find_latest_time(s: utf8)` → `utf8` | 通过 |
| `find-the-encrypted-string` | `get_encrypted_string(s: utf8, k: i64)` → `utf8` | 通过 |
| `lexicographically-smallest-string-after-a-swap` | `get_smallest_string(s: utf8)` → `utf8` | 通过 |
| `find-the-winning-player-in-coin-game` | `alice_text()` → `utf8` | 通过 |
| `find-the-k-th-character-in-string-game-i` | `kth_character(k: i64)` → `utf8` | 通过 |

### 纯标量算术（1 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `first-bad-version` | `first_bad_version(n: i64, bad: i64)` → `i64` | 通过 |

## 未登记批次（56 题，2026-11-04 构建实测）

未进入上方 Easy / Medium 批次表的历史题，含形态 A 的文件共 56 个。

- 形态 A 清理：56 文件 / 176 处 `⁅…⁆.unwrap()` 逐处校验后删除，复扫残留 0；形态 B 未动。
- 构建：**51/56 `status=0`**，5 题失败：
  - G4（`std::text::Utf8Builder.append`）4 题：`convert-a-number-to-hexadecimal`、
    `longest-common-prefix`、`sort-characters-by-frequency`、`summary-ranges`（`file:line:col`
    同 Easy 块的 `source/text/Utf8Builder.v:46:29`）；
  - G5（分支内丢弃 `Option<T>` 返回值触发 SMIR007）1 题：`baseball-game`，
    `cal_points` 的 `block 4 terminator`。
- 写法错（非缺口）1 题：`shuffle-the-array` 的 `let limit` 未声明 `mut` 却被赋值，改 `let mut`
  后 `status=0`（不计入上面 5 个失败）。
- 判题：本块未跑，四字段无实测值。

## 批次 M-2026-11-03（Medium 三组，37 题，已实测）

构建口径：`resolveCompileTargetPlan` → `legionBuildProject`，canonical target
`wasm32-unknown-unknown-wasm`，逐题 `build=0`。判题口径：`run_v_solver.ts` 对全量
`metadata.tests` 实跑，用例四分类独立计数：`executed_pass` / `executed_fail` / `blocked` /
`not_run`，四者之和恒等于 `testCaseTotal`。基础设施阻断不计入 `executed_fail`。

| 组 | 题数 | 编译 | 判题 | 阻断 |
| --- | --- | --- | --- | --- |
| ArrayList 表（DP / 背包 / 区间） | 12 | 12/12 `build=0` | 0 通过 | G3 入参 marshal 12 题 |
| 位运算 | 13 | 13/13 `build=0` | 0 通过 | G3 入参 marshal 13 题 |
| 纯递推 / 序列生成 | 12 | 12/12 `build=0` | 1 通过 | 1 通过 + G3 返回值 demarshal 11 题 |

合计：编译 37/37，判题 1/37 通过（`number-of-dice-rolls-with-target-sum` 108/108）。
用例总量 3283：`executed_pass` **108**，`executed_fail` **0**，`blocked` **3175**，
`not_run` **0**。下行每道受阻题的「0/N … 阻断」即 `executed_pass=0`、`blocked=N`、
`executed_fail=0`、`not_run=0`。构建通过数 18 → 19。

TS 实跑：37/37 通过（提交前逐题 `run_ts_solver.ts`）。本批 8 题含语料缺陷（错误签名串、
越官方约束输入），已按 `valkyrie-gap-ledger.md` 的「语料缺陷」小节处理，未改动期望值语义。

### ArrayList 表（12 题）

| slug | V 入口签名 | TS 实跑 | V 实测 |
| --- | --- | --- | --- |
| `house-robber` | `rob(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/117，marshal 阻断 |
| `house-robber-ii` | `rob(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/122，marshal 阻断 |
| `jump-game` | `can_jump(nums: ArrayList<i64>)` → `bool` | 通过 | `build=0`；判题 0/66，marshal 阻断 |
| `jump-game-ii` | `jump(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/44，marshal 阻断 |
| `maximum-product-subarray` | `max_product(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/91，marshal 阻断 |
| `longest-increasing-subsequence` | `length_of_l_i_s(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/134，marshal 阻断 |
| `coin-change` | `coin_change(coins: ArrayList<i64>, amount: i64)` → `i64` | 通过 | `build=0`；判题 0/127，marshal 阻断 |
| `minimum-path-sum` | `min_path_sum(grid: ArrayList<ArrayList<i64>>)` → `i64` | 通过 | `build=0`；判题 0/77，marshal 阻断（嵌套 `ArrayList`） |
| `triangle` | `minimum_total(triangle: ArrayList<ArrayList<i64>>)` → `i64` | 通过 | `build=0`；判题 0/88，marshal 阻断（嵌套 `ArrayList`） |
| `last-stone-weight-ii` | `last_stone_weight_i_i(stones: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/100，marshal 阻断 |
| `delete-and-earn` | `delete_and_earn(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/115，marshal 阻断 |
| `arithmetic-slices` | `number_of_arithmetic_slices(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/171，marshal 阻断 |

### 位运算（13 题）

| slug | V 入口签名 | TS 实跑 | V 实测 |
| --- | --- | --- | --- |
| `single-number-ii` | `single_number(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/86，marshal 阻断 |
| `single-number-iii` | `single_number(nums: ArrayList<i64>)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/50，marshal 阻断 |
| `total-hamming-distance` | `total_hamming_distance(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/98，marshal 阻断 |
| `maximum-xor-of-two-numbers-in-an-array` | `find_maximum_x_o_r(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/102，marshal 阻断 |
| `bitwise-ors-of-subarrays` | `subarray_bitwise_o_rs(arr: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/93，marshal 阻断 |
| `bitwise-xor-of-all-pairings` | `xor_all_nums(nums1: ArrayList<i64>, nums2: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/96，marshal 阻断 |
| `maximum-xor-for-each-query` | `get_maximum_xor(nums: ArrayList<i64>, maximumBit: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/79，marshal 阻断 |
| `count-triplets-that-can-form-two-arrays-of-equal-xor` | `count_triplets(arr: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/93，marshal 阻断 |
| `score-after-flipping-matrix` | `matrix_score(grid: ArrayList<ArrayList<i64>>)` → `i64` | 通过 | `build=0`；判题 0/80，marshal 阻断（嵌套 `ArrayList`） |
| `maximum-possible-number-by-binary-concatenation` | `max_good_number(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/91，marshal 阻断 |
| `minimum-impossible-or` | `min_impossible_o_r(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/108，marshal 阻断 |
| `maximum-xor-after-operations` | `maximum_x_o_r(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/101，marshal 阻断 |
| `find-xor-beauty-of-array` | `xor_beauty(nums: ArrayList<i64>)` → `i64` | 通过 | `build=0`；判题 0/81，marshal 阻断 |

### 纯递推 / 序列生成（12 题）

| slug | V 入口签名 | TS 实跑 | V 实测 |
| --- | --- | --- | --- |
| `number-of-dice-rolls-with-target-sum` | `num_rolls_to_target(n: i64, k: i64, target: i64)` → `i64` | 通过 | `build=0`；判题 **108/108 通过** |
| `sequential-digits` | `sequential_digits(low: i64, high: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/88，demarshal 阻断 |
| `stepping-numbers` | `count_stepping_numbers(low: i64, high: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/98，demarshal 阻断 |
| `numbers-with-same-consecutive-differences` | `nums_same_consec_diff(n: i64, k: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/61，demarshal 阻断 |
| `generate-binary-strings-without-adjacent-zeros` | `valid_strings(n: i64)` → `ArrayList<utf8>` | 通过 | `build=0`；判题 0/14，demarshal 阻断（`ArrayList<utf8>`） |
| `prime-pairs-with-target-sum` | `find_prime_pairs(n: i64)` → `ArrayList<ArrayList<i64>>` | 通过 | `build=0`；判题 0/60，demarshal 阻断（嵌套 `ArrayList`） |
| `closest-prime-numbers-in-range` | `closest_primes(left: i64, right: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/95，demarshal 阻断 |
| `maximum-split-of-positive-even-integers` | `maximum_even_split(finalSum: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/66，demarshal 阻断 |
| `moving-stones-until-consecutive` | `num_moves_stones(a: i64, b: i64, c: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/130，demarshal 阻断 |
| `spiral-matrix-ii` | `generate_matrix(n: i64)` → `ArrayList<ArrayList<i64>>` | 通过 | `build=0`；判题 0/20，demarshal 阻断（嵌套 `ArrayList`） |
| `find-three-consecutive-integers-that-sum-to-a-given-number` | `sum_of_three(num: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/52，demarshal 阻断 |
| `incremental-memory-leak` | `mem_leak(memory1: i64, memory2: i64)` → `ArrayList<i64>` | 通过 | `build=0`；判题 0/81，demarshal 阻断 |

## 复跑命令

```powershell
node --import tsx projects/conformance/scripts/run_ts_solver.ts projects/problems/<slug>
```

V 侧复跑：在 `projects/conformance` 下执行 `node --import tsx scripts/run_v_solver.ts ../problems/<slug>`，
内部先 `resolveCompileTargetPlan` 再 `ensureVBuild`（`legion build`）并跑全量 `metadata.tests`。
批量编译口径：`resolveCompileTargetPlan(solverDir)` → `legionBuildProject(solverDir, plan.canonicalTarget, outDir)`。
