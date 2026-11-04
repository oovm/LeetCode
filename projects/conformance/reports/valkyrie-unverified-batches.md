# Valkyrie 待验证批次清单

口径：本清单登记**理想解已写**的批次及其验证状态。只有「构建 `status=0` 且隔离判题
`ok=true`」才计入构建通过数，见 `valkyrie-gap-ledger.md` 的「批次状态」小节与缺口编号。
未验证不等于通过；实测列是本次验证窗口逐题跑出的证据。

复跑方式：按下面的 slug 列表批量跑 `legionBuildProject` + 隔离判题；TS 侧已在
`projects/conformance/scripts/run_ts_solver.ts` 实跑，结果列在每题行内。

## 批次 R18-2026-11-04（理想解滚动批次 18，8 题，写完未构建）

- 范围：**第一批全部避开真缺口**（G2 / G3 / G9 / G10 / G11 / G13 / G16 / G17 / G22 / G25 / G26），
  只落在观察档与既有设计内：哈希计数、原地标记、网格 DFS、滑动窗口、后缀扫描、二分答案。
- 构建 / 判题状态：**未验证**，全部 `authored-unverified`，本轮按口径**不编译、不跑**。
- 新缺口：**0 条**。canonical 657 → **665**。
- 反向验证意义：本批是账本判据的对照组（见 `valkyrie-gap-ledger.md` 同句）——若真评后有题撞到
  新缺口，说明判据仍有漏；若全部干净通过，说明「观察档」可用。
- 纸面 API：**0 个**。全部调用点只使用源码已有签名（`HashMap::new(capacity)` / `contains_key` /
  `get` / `insert`、`ArrayList::new(capacity)` / `push` / `length`、`⁅ ⁆` 下标读写）。
- 比较器数量：**0**；本批没有题传 `micro(T, T) -> i32`，也没有自定义记录排序。
- 入口签名：8/8 导出形参与 `metadata.tests.args` 键同序
  （`nums`+`k` / `nums` / `grid` / `nums`+`k` / `nums` / `nums`+`left`+`right` / `grid` / `piles`+`h`）。

| 题号 | slug | 入口 | 返回 | 考点 / 命中面 |
| --- | --- | --- | --- | --- |
| 560 | `subarray-sum-equals-k` | `subarraySum` | `i64` | 前缀和 + `HashMap<i64,i64>` 频次；分支尾不写 `insert`（避开 G7 形态） |
| 565 | `array-nesting` | `arrayNesting` | `i64` | 原地把已访问位置改 `-1`，按环长取最大 |
| 695 | `max-area-of-island` | `maxAreaOfIsland` | `i64` | 网格 DFS，递归 `sink` 把陆地改 0；行列长度分别取 |
| 713 | `subarray-product-less-than-k` | `numSubarrayProductLessThanK` | `i64` | 滑动窗口，乘积超界时左移并整除回退 |
| 775 | `global-and-local-inversions` | `isIdealPermutation` | `bool` | 后缀最小值扫描；**不假设输入是排列** |
| 795 | `number-of-subarrays-with-bounded-maximum` | `numSubarrayBoundedMax` | `i64` | 两次「上界不超过」的连续段计数差分 |
| 807 | `max-increase-to-keep-city-skyline` | `maxIncreaseKeepingSkyline` | `i64` | 行 / 列最大值分别取，逐格取较小者；入参嵌套 `ArrayList` |
| 875 | `koko-eating-bananas` | `minEatingSpeed` | `i64` | 二分答案；不可行分支按生成器约定返回 `max+1` |

- marshal 面（**待验证**）：695 / 807 入参为 `ArrayList<ArrayList<i64>>`。G3 是真缺口，但 G3 记的是
  返回侧 JS glue 的 `ArrayList` ABI；入参嵌套数组是否走同一条 ABI **不预先判定**，留待真评。
- TS 参考解：8 题新写，算法与 V 解同阶同语义；按本轮口径**未实跑**。
- 数据清洗（先核对「是不是解法假设错了」，再决定删 / 留）：
  - `array-nesting`（565）：**删 3 条**（原 test 6 / 27 / 90）。`nums` 长度为 10 却含值 `10`，
    违反题面「`nums` 是 `[0, n-1]` 的排列」，Python 侧以 `list assignment index out of range`
    兜底；V 侧越界 panic 的消息形态不同，无法作为 `expected` 比对，属平台非法用例。
    删后 100 条 → 97 条。
  - `subarray-product-less-than-k`（713）：**删 1 条**（原 test 98）。`nums` 含 `0.1` / `0.01`
    浮点值，`ArrayList<i64>` 无法承载，属类型非法的生成器用例。删后 128 条 → 127 条。
  - `subarray-sum-equals-k`（560）：**不删**。多条 `nums` 取值超出题面 `-1000..1000`，但前缀和
    在 i64 内良定义，`expected` 自洽。
  - `number-of-subarrays-with-bounded-maximum`（795）：**不删**。`right` 有多条超出 `1e9`，
    i64 内计数仍自洽。
  - `global-and-local-inversions`（775）：**不删，也不改题面假设**。生成器含非排列输入，
    题面「排列」不成立；但「全局逆序数 == 局部逆序数」在任意序列上仍良定义。
    原按 `abs(nums[i] - i) <= 1` 的写法会误判 test 41（`[1,2,4,3,6,5,8,7,10,9]`，
    4 个全局逆序 / 4 个局部逆序，`expected = true`），故改写成后缀最小值扫描。
  - `max-increase-to-keep-city-skyline`（807）：**不删**。1 条 4×3 非方阵违反题面 `n×n`，
    但行 / 列各自取最大值后答案自洽；解法按行列独立长度处理，不假设方阵，已在源码注释标注。
  - `koko-eating-bananas`（875）：**不删**。22 条 `h < piles.length` 违反题面 `h >= piles.length`，
    其 `expected` 统一为 `max(piles)+1`；解法在该情形返回 `max+1`，源码注释已标为按生成器约定的
    有意扩展，不是对题面上界的假设。
  - `max-area-of-island`（695）：无非法用例。

## 批次 R17-2026-11-04（理想解滚动批次 17，8 题，写完未构建）

- 范围：继续避开 G26 / G27，优先把 **G25**（`BitSet` 缺 `count` / `length` / 迭代 / `clone` /
  互转 / `Equal`）与 **G12**（`HashSet` 无容量构造）压到真实题解，并把两处调用点收敛成
  「到底需要哪几个签名」的最小集表（见 `valkyrie-gap-ledger.md` 的 G25 / G12
  「本批验证情况（R17）」）。不写 C4 排序（本批无排序题），不写内联比较器。
- 构建 / 判题状态：**未验证**，全部 `authored-unverified`，本轮按口径**不编译、不跑**。
- 新缺口：**0 条**。canonical 649 → **657**。
- 命中面：G25 ×4（2657 / 750 / 2397 / 51）、G12 ×3（2442 / 187 / 2465）、
  控制组 ×1（698，证明「全集 <= 64 且只判占用」不需要 G25 缺失项）。
- 纸面 API：**2 个入口**（`BitSet::clone`、`BitSet::count`），逐处标 `[待补 API]` 并指向 G25 提案签名。
  `HashSet::new()` 是真实签名（G12 现状），按口径**不计入纸面 API**。
- 比较器数量：**0**；本批没有题传 `micro(T, T) -> i32`。
- 预期阻断：`n-queens`（51）返回 `ArrayList<ArrayList<utf8>>`、`repeated-dna-sequences`（187）
  返回 `ArrayList<utf8>`、`find-the-prefix-common-array-of-two-arrays`（2657）返回
  `ArrayList<i64>`，按 G3 在 wasm JS glue 处阻断；其余 5 题返回 `i64` / `bool`。

| 题号 | slug | 入口 | 返回 | 考点 / 命中面 |
| --- | --- | --- | --- | --- |
| 2657 | `find-the-prefix-common-array-of-two-arrays` | `findThePrefixCommonArray` | `ArrayList<i64>` | 两个前缀 `BitSet`；`clone` + `intersect` + `count`（**G25**） |
| 750 | `number-of-corner-rectangles` | `countCornerRectangles` | `i64` | 列数 <= 200 超出 i64 掩码；逐对行 `intersect` + `count`（**G25**） |
| 2397 | `maximum-rows-covered-by-columns` | `maximumRows` | `i64` | 选中列子集逐行判定；`clone` + `difference` + `is_empty`（**G25**） |
| 51 | `n-queens` | `solveNQueens` | `ArrayList<ArrayList<utf8>>` | 列 / 双对角线三个 `BitSet`，回溯 `set` / `clear_bit` |
| 2442 | `count-number-of-distinct-integers-after-reverse-operations` | `countDistinctIntegers` | `i64` | `HashSet<i64>` 去重；`new()` 无容量（**G12**） |
| 187 | `repeated-dna-sequences` | `findRepeatedDnaSequences` | `ArrayList<utf8>` | `HashSet<utf8>` 双集合；`new()` 无容量（**G12**） |
| 2465 | `number-of-distinct-averages` | `distinctAverages` | `i64` | 二元组和去重；`HashSet<i64>` 无容量（**G12**） |
| 698 | `partition-to-k-equal-sum-subsets` | `canPartitionKSubsets` | `bool` | 控制组：i64 掩码 + 占用数组，**不需要** `BitSet` 缺失项 |

- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致
  （`A`+`B` / `grid` / `matrix`+`numSelect` / `n` / `nums` / `s` / `nums` / `nums`+`k`）。
- TS 参考解：8 题此前均为空文件，本批全部新写；按本轮口径**未实跑**。
- 数据清洗（先核对「是不是解法假设错了」，再决定删 / 留）：
  - `n-queens`（51）：删 1 条（原 test 9，`n = 10`）。题面约束 `1 <= n <= 9`，且该用例
    `expected` 含 724 个棋盘、按生成器顺序排列；超界 + 顺序敏感，属平台非法用例。删后 9 条。
  - `partition-to-k-equal-sum-subsets`（698）：删 1 条（原 test 52，`nums.length = 32`）。
    题面约束 `1 <= nums.length <= 16`，属平台非法用例。删后 86 条。
  - `find-the-prefix-common-array-of-two-arrays`（2657）：**不删**，改解法假设。2 条用例的取值
    超出 `1..n`（如 41..50 配 n=10），但 `expected` 与「按值求交」的语义自洽；解法原按 n 定容
    会越界，故改为按实际最大值定容。这是解法假设问题，不是用例非法。
  - `number-of-corner-rectangles`（750）：**不删**。1 条全 0 网格违反「至少一个 1」，但答案
    自然是 0，不影响语义。
  - `count-number-of-distinct-integers-after-reverse-operations`（2442）：**不删**。6 条取值
    超过 `1e6` 上界，但反转与去重在 i64 域内仍良定义，`expected` 自洽。
  - `number-of-distinct-averages`（2465）：**不删**。6 条长度为奇数（题面要求偶数），但
    「两两和的种数」与奇偶无关，定义仍成立。
  - `repeated-dna-sequences`（187）、`maximum-rows-covered-by-columns`（2397）：无非法用例。

## 批次 R16-2026-11-04（理想解滚动批次 16，8 题，写完未构建）

- 范围：按观察 11 的结论，**避开已撞穿的 G26 / G27 面**（不写自定义记录排序），优先
  字符串、树、图、DP 中不依赖自定义序的方向；同时把 G25 `clone` / `count` 以外的集合缺口
  压到真实题解里（G10 并查集、G12 `HashSet` 容量、G18 `split_whitespace`、G23 `gcd`）。
- 构建 / 判题状态：**未验证**，全部 `authored-unverified`，本轮按口径**不编译、不跑**。
- 新缺口：**0 条**。本批只把已登记缺口落到解法坐标，不新增编号。
  canonical 641 → **649**。
- 命中面：
  - G23（无 `gcd`）：149 手写 `greatest_common` 做斜率归一化，`HashMap<i64, i64>` 计数。
  - G12（`HashSet::new()` 无容量）：127 建词典与访问集，按真实签名写 `HashSet::new()`，
    容量只能摊还增长。
  - G10（`DisjointSet` 规模 / 成员）：305 以「元素为键」建森林，
    `new` / `add` / `contains` / `union` / `group_count` 全部为现有入口，无提案 API。
  - G18（无 `split_whitespace`）：1324 用 `split(" ")` 等价展开（题面保证单词间单个空格）。
- 比较器数量：**0**；本批没有任何题传 `micro(T, T) -> i32`。
- 纸面 API：**0**。8 题全部只调用已存在入口（`ArrayList` / `HashMap` / `HashSet` /
  `Deque` / `DisjointSet` / `Utf8Builder` / `utf8.split` / `character_at` / `byte_at`）。
- 预期阻断：`generate-parentheses`、`text-justification`、`print-words-vertically`
  返回 `ArrayList<utf8>`，`number-of-islands-ii` 返回 `ArrayList<i64>`，按 G3 在 wasm JS glue
  处阻断；其余 4 题返回 `i64`。

| 题号 | slug | 入口 | 返回 | 考点 / 命中面 |
| --- | --- | --- | --- | --- |
| 42 | `trapping-rain-water` | `trap` | `i64` | 双指针 + 前后缀最大；纯数组 |
| 22 | `generate-parentheses` | `generateParenthesis` | `ArrayList<utf8>` | 递归 + `utf8` 拼接 |
| 68 | `text-justification` | `fullJustify` | `ArrayList<utf8>` | 贪心排版 + `Utf8Builder` |
| 149 | `max-points-on-a-line` | `maxPoints` | `i64` | 斜率归一化；**G23 手写 gcd** |
| 127 | `word-ladder` | `ladderLength` | `i64` | BFS + `HashSet` / `Deque`；**G12** |
| 305 | `number-of-islands-ii` | `numIslands2` | `ArrayList<i64>` | 并查集；**G10** |
| 312 | `burst-balloons` | `maxCoins` | `i64` | 区间 DP，二维表 |
| 1324 | `print-words-vertically` | `printVertically` | `ArrayList<utf8>` | 逐列拼接；**G18** |

- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致
  （`height` / `n` / `words`+`maxWidth` / `points` / `beginWord`+`endWord`+`wordList` /
  `m`+`n`+`positions` / `nums` / `s`）。
- TS 参考解：8 题此前均为空文件，本批全部新写；按本轮口径**未实跑**。
- 数据清洗（生成器产出的非法用例，随本批一并删除）：
  - `text-justification`（68）：删 6 条。原 test 73 的 `words` 含空串（题面保证每个单词
    长度 > 0）；原 test 12 / 48 / 93 / 100 / 101 存在单词长度 > `maxWidth`
    （题面保证单词长度不超过 `maxWidth`），其 `expected` 直接给出超宽行，无合法答案。
  - `print-words-vertically`（1324）：删 9 条。`s` 含连续空格或首尾空格
    （题面保证单词间仅一个空格、无首尾空格），`expected` 按空白折叠计算，与题面模型不符。
  - 其余 6 题无 `Error:` / `Execution timed out` 期望，未删用例。

## 批次 R15-2026-11-04（理想解滚动批次 15，8 题，写完未构建）

- 范围：第二次压**已登记但未被解法验证**的缺口，优先撞 G25（`BitSet` 缺 `count` / `length` /
  迭代 / `clone` / 互转 / `Equal`）与 G26（无 `Comparable` 合同、`sort.v` 无单参入口、
  `BTreeSet::insert` 约束未捕获 `<`）。不写纸面 API 当既成事实，不写内联比较器。
- 构建 / 判题状态：**未验证**，全部 `authored-unverified`，本轮按口径**不编译、不跑**。
- 新缺口：**1 条**，G27 = 排序稳定性不是可声明的属性（`sort.v` 的 `quick_sort` / `merge_sort`
  签名相同，稳定性只由实现决定；定稿契约为 `sort` 默认稳定、`sort_unstable` 显式不稳定，
  `quick_sort` / `merge_sort` 降为 `private`）。
  canonical 633 → 641。新增观察 11（G25 / G26 第二次撞面后仍无等价物）。
- 命中面：`BitSet` ×2（1239 直接调用 `clone` ×2 + `count` ×1；847 作 `n * 2^n` 访问表，仅
  `get` / `set`）、自定义记录 `Comparable` ×5（1366 / 2191 / 1691 / 2251 / 1751）、
  `i64` 直接单参排序 ×1（1561）。
- 传给排序的比较器数量：**0**（本批硬口径）。
- 纸面 API 标注：1239 的 `BitSet::clone` / `count` 逐处标 `[待补 API]` 并指向 G25 提案签名；
  其余 7 题只用现有入口 + G26 提案的单参排序（`order_items` 内 `sort(items)`，按 G27 默认稳定）。
- 预期阻断：`sort-the-jumbled-numbers`、`number-of-flowers-in-full-bloom` 返回
  `ArrayList<i64>`，按 G3 在 wasm JS glue 处阻断；其余 6 题返回 `i64` / `utf8`。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致
  （`arr` / `graph` / `votes` / `mapping`+`nums` / `cuboids` / `flowers`+`people` /
  `events`+`k` / `piles`）。
- TS 参考解：8 题此前均为空文件，本批全部新写；按本轮口径**未实跑**。
- 数据清洗（生成器产出的非法用例，随本批一并删除）：
  - `maximum-length-of-a-concatenated-string-with-unique-characters`（1239）：删 6 条
    `expected` 为 `Execution timed out` 的用例（题面数据规模不应超时）。
  - `shortest-path-visiting-all-nodes`（847）：删 8 条非法用例（6 条
    `Error: list index out of range` + 2 条 `Execution timed out`；前者图规模超出 n <= 12 上界）。
  - `rank-teams-by-votes`（1366）：删 6 条 `Error: list index out of range` 的用例。
    逐条回查结论：**全部是平台非法用例，不是解法缺陷**——6 条都违反题面
    「`votes[i].length == votes[j].length`」与「`1 <= votes[i].length <= 26`」，
    其中 4 条还含重复字符（违反「All characters of votes[i] are unique」）。
    逐条长度分布：5×4 + 51×10（`EARTHTONES` 内 `E` / `T` 重复）；23×4 + 1×6（`METE` 内 `E` 重复）；
    3×26 + 1×27（27 字符含重复 `R`，且超过 26 个字母上限）；5×6 + 2×7 + 3×8；
    3×12 + 3×13（`LJKJIHGFEDCBA` 重复 `J`）；1×25 + 9×26 + 2×27（27 字符含重复 `I`）。
    解法按 `votes[0]` 取队名集，恰是题面「`votes[0]` 的字符在每票中都出现」的直接推论，
    合法输入上不会越界，故不改解法，只删用例。
  - 删除后 87 / 63 / 73 条用例，剩余 `expected` 均为合法答案类型。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `maximum-length-of-a-concatenated-string-with-unique-characters` | `maxLength` | `i64` | `BitSet(26)` 每词字母集；分支 `clone` + `union` + `count` 判重叠（G25） |
| `shortest-path-visiting-all-nodes` | `shortestPathLength` | `i64` | 多源 BFS；`BitSet(n * 2^n)` 访问表，容量外知（G25 使用面） |
| `rank-teams-by-votes` | `rankTeams` | `utf8` | `Team{letter, ranks}` 自定义记录；26 维名次 + 字母兜底序（G26） |
| `sort-the-jumbled-numbers` | `sortJumbled` | `ArrayList<i64>` | `Jumbled{mapped, index}`；映射值序 + 稳定性（G26 / G27） |
| `maximum-height-by-stacking-cuboids` | `maxHeight` | `i64` | `Cuboid{a,b,c}` 归一化 + 字典序；最长上升栈 DP（G26） |
| `number-of-flowers-in-full-bloom` | `fullBloomFlowers` | `ArrayList<i64>` | `Flower{start,end}` 按起点排序 + 结束日单参排序；二分计数（G26） |
| `maximum-number-of-events-that-can-be-attended-ii` | `maxValue` | `i64` | `Event{start,end,value}` 按开始日排序；DP + 二分后继（G26） |
| `maximum-number-of-coins-you-can-get` | `maxCoins` | `i64` | `ArrayList<i64>` 直接单参排序，验证「无单参入口」（G26 ②） |

## 批次 R14-2026-11-04（理想解滚动批次 14，8 题，写完未构建）

- 范围：首次压**自定义类型的序关系**。前 13 批的排序题解全部把比较逻辑写进调用点
  （`merge_sort(x, micro(a, b) -> i32 { ... })` 或具名比较函数），那是绕路写法；本批按理想形态
  直接写 `structure` + `imply ...: std::operator::Comparable`（提案）与
  `where T: Equal & Comparable`（提案），**不传任何比较器**。它们红着是预期结果。
- 构建 / 判题状态：**未验证**，全部 `authored-unverified` 且依赖 **G26**。本轮按口径不跑构建与判题。
- 新缺口：**1 条**，G26 = 自定义类型序关系无可用合同：`Comparable` 缺失、`sort.v` 无按合同取序的
  单参入口、`BTreeSet::insert` 只要求 `T: Equal` 却在体内裸调 `<`。canonical 625 → 633。
  新增观察 10（「内联比较器是绕路写法」）。
- 命中面：自定义记录排序 ×7（56 / 435 / 1235 / 452 / 1710 / 1029 / 1626）、
  自定义类型作 `BTreeSet` 键 ×1（694）。
- 传给排序的比较器数量：**0**（本批唯一硬口径）。
- 预期阻断：`merge-intervals` 返回 `ArrayList<ArrayList<i64>>`，按 G3 在 wasm JS glue 处阻断；
  其余 7 题返回 `i64`，若 G26 修复则可直接判题。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致
  （`intervals` / `intervals` / `startTime`+`endTime`+`profit` / `points` / `boxTypes`+`truckSize` /
  `costs` / `scores`+`ages` / `grid`）。
- TS 参考解：`merge-intervals` / `non-overlapping-intervals` / `minimum-number-of-arrows-to-burst-balloons` /
  `maximum-units-on-a-truck` 复用既有；`maximum-profit-in-job-scheduling` / `two-city-scheduling` /
  `best-team-with-no-conflicts` / `number-of-distinct-islands` 4 题新写。8/8 实跑通过。
- 数据清洗（随本批一并处理，均属生成器产出的非法用例）：
  - `parsing-a-boolean-expression`（1106）：删除 5 条 `expected` 为
    `Error: list index out of range` 的用例（表达式本身非法：`&` / `|` 单操作数、`!` 多操作数、
    括号错配）。此前 R12 小节误记为 3 条。
  - `maximum-profit-of-job-scheduling`（1235）：删除 3 条 `startTime` / `endTime` / `profit`
    长度不一致的用例（Python 参考解在这 3 条上越界，expected 被记成 Error 字符串）。
  - `two-city-scheduling`（1029）：删除 1 条人数为奇数（21）的用例，题面要求 `2n` 偶数。
  - 清洗后 8 题 TS 参考解与 Python 参考解均实跑通过。

| slug | 导出入口 | 返回类型 | 自定义类型 / 序关系用法 |
| --- | --- | --- | --- |
| `merge-intervals` | `merge` | `ArrayList<ArrayList<i64>>` | `Interval{start,end}`，按起点升序合并 |
| `non-overlapping-intervals` | `eraseOverlapIntervals` | `i64` | `Interval{start,end}`，按终点升序贪心 |
| `maximum-profit-in-job-scheduling` | `jobScheduling` | `i64` | `Job{start,end,profit}`，按终点升序 + 二分前驱 |
| `minimum-number-of-arrows-to-burst-balloons` | `findMinArrowShots` | `i64` | `Balloon{start,end}`，按终点升序贪心 |
| `maximum-units-on-a-truck` | `maximumUnits` | `i64` | `BoxType{boxes,units}`，按单位价值升序后反向装载 |
| `two-city-scheduling` | `twoCitySchedCost` | `i64` | `CostRow{city_a,city_b}`，按差价升序、依赖稳定性 |
| `best-team-with-no-conflicts` | `bestTeamScore` | `i64` | `Player{score,age}`，双字段序 + O(n²) DP |
| `number-of-distinct-islands` | `numDistinctIslands` | `i64` | `IslandShape{cells}` 直接作 `BTreeSet` 键（`Equal` + 序关系） |

## 批次 R13-2026-11-04（理想解滚动批次 13，8 题，写完未构建）

- 范围：首次压位运算与专门类型 `BitSet`。前 12 批 `BitSet` 使用次数为 0，本批专挑理想解天然需要
  位集合或位掩码的题；同步顺带看 `ArrayList` 的 `reserve` / 容量增长是否被真实需要。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 新缺口：**1 条**，G25 = `BitSet` 缺 `count` / `length` / 迭代 / `clone` / 互转 / `Equal`。
  canonical 617 → 625。新增观察 9（`BitSet` 真实面只有「按已知下标读写 + 原地结构运算」）。
- 命中面：`BitSet` ×4（36 / 442 / 1461 / 318）、访问表 ×1（864）、裸位掩码 ×3
  （1178 / 2997 / 1310）。
- 未命中：`BitSet.intersect` / `union` / `difference` / `xor` 仍无调用点（318 因无 `clone` 改为逐位
  `get`）；`ArrayList.reserve` 仍无调用点。
- 预期阻断：`find-all-duplicates-in-an-array`、`number-of-valid-words-for-each-puzzle`、
  `xor-queries-of-a-subarray` 返回 `ArrayList<i64>`，按 G3 在 wasm JS glue 处阻断。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`board` / `nums` / `s`+`k` /
  `words` / `words`+`puzzles` / `nums`+`k` / `arr`+`queries` / `grid`）。
- TS 参考解：`valid-sudoku` / `find-all-duplicates-in-an-array` /
  `check-if-a-string-contains-all-binary-codes-of-size-k` / `maximum-product-of-word-lengths` 复用既有；
  `number-of-valid-words-for-each-puzzle` / `minimum-number-of-operations-to-make-array-xor-equal-to-k` /
  `xor-queries-of-a-subarray` / `shortest-path-to-get-all-keys` 4 题新写。
- 入口名对齐：1178 的仓库入口是 `findNumOfValidWords`（不是题面常见的 `numOfValidWords`），
  V 导出与 TS 方法均已按 metadata 对齐。

| slug | 导出入口 | 返回类型 | 位面 |
| --- | --- | --- | --- |
| `valid-sudoku` | `isValidSudoku` | `bool` | 行 / 列 / 宫各一个 `BitSet(9)`，`get` 查重 + `set` 置位 |
| `find-all-duplicates-in-an-array` | `findDuplicates` | `ArrayList<i64>` | `BitSet(n+1)` 出现标记，`get` 判定重复 |
| `check-if-a-string-contains-all-binary-codes-of-size-k` | `hasAllCodes` | `bool` | `BitSet(2^k)` 记录子串码值，置位数外部累计（G25 无 `count`） |
| `maximum-product-of-word-lengths` | `maxProduct` | `i64` | 每词一个 `BitSet(26)`，逐位 `get` 判不相交（无 `clone`） |
| `number-of-valid-words-for-each-puzzle` | `findNumOfValidWords` | `ArrayList<i64>` | 26 位 `i64` 掩码 + 首字母 / 子集判定 |
| `minimum-number-of-operations-to-make-array-xor-equal-to-k` | `minOperations` | `i64` | 全域异或后再 popcount |
| `xor-queries-of-a-subarray` | `xorQueries` | `ArrayList<i64>` | 前缀异或表，区间两次查表 |
| `shortest-path-to-get-all-keys` | `shortestPathAllKeys` | `i64` | BFS 状态 = 格子 + 6 位钥匙掩码，`BitSet` 访问表 |

## 批次 R12-2026-11-04（理想解滚动批次 12，8 题，写完未构建）

- 范围：容器 API 面已连续三批饱和，本批改压**语言构造面**：`unite` 和类型 / `enums` 标记类型、
  递归 + 结果累加、内联 `micro` 闭包作比较器 / 累加器。理想解只用这些构造，不为规避限制退回
  `i64` 魔法值或纯迭代。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 新缺口：**0 条**（G1–G24 不变）。新增观察 7（定长 `Array<T>` 的「有无分配」边界 +
  `sort.v` 7 函数只读核对）、观察 8（语言构造首次进入题解）。canonical 609 → 617。
- 命中面：`unite` ×2（1106 递归和类型、394 聚合载荷和类型）、`enums` ×1（1598）、
  内联闭包 ×2（179 比较器、2161 `fold` 累加器）、递归 ×4（241 分治、39 回溯、1087 展开、
  1106 / 394 递归下降）。
- 未命中：`ArrayList.reserve` 仍无调用点（容量都在构造时给定）；`BitSet` 本批未进入选题（另批核实）。
- 预期阻断：`different-ways-to-add-parentheses` / `partition-array-according-to-given-pivot` 返回
  `ArrayList<i64>`；`combination-sum` 返回 `ArrayList<ArrayList<i64>>`；`brace-expansion` 返回
  `ArrayList<utf8>`；按 G3 在 wasm JS glue 处阻断。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`expression` / `s` / `expression` /
  `candidates`+`target` / `s` / `logs` / `nums` / `nums`+`pivot`）。
- TS 参考解：`parsing-a-boolean-expression` / `crawler-log-folder` / `largest-number` 复用既有实现；
  `decode-string` / `different-ways-to-add-parentheses` / `combination-sum` / `brace-expansion` /
  `partition-array-according-to-given-pivot` 5 题新写。
- 题材记账：1106 的 `metadata.json` 原有 5 条 `expected` 为 `Error: list index out of range` 的用例，
  与题面不符（表达式本身非法）；R12 小节最初误记为 3 条。已于批次 R14 一并删除，见 R14 数据清洗小节。

| slug | 导出入口 | 返回类型 | 语言构造 / 覆盖方向 |
| --- | --- | --- | --- |
| `parsing-a-boolean-expression` | `parseBoolExpr` | `bool` | 递归 `unite BoolNode`；`And` / `Or` 载荷为 `ArrayList<BoolNode>` 聚合体 |
| `decode-string` | `decodeString` | `utf8` | 递归下降 + `unite DecodedPart`（`Repeated` 载荷 text+times）+ `Utf8Builder` |
| `different-ways-to-add-parentheses` | `diffWaysToCompute` | `ArrayList<i64>` | 分治递归，左右结果笛卡尔积累加 |
| `combination-sum` | `combinationSum` | `ArrayList<ArrayList<i64>>` | 回溯递归，`path` 压栈 / `remove` 弹栈，命中时复制路径 |
| `brace-expansion` | `expand` | `ArrayList<utf8>` | 递归展开花括号分组，逐层笛卡尔累加 |
| `crawler-log-folder` | `minOperations` | `i64` | `enums FolderOp` 替代 `0/1/2` 魔法值，`match` 分派 |
| `largest-number` | `largestNumber` | `utf8` | 内联 `micro(a, b) -> i32` 作 `merge_sort` 比较器 |
| `partition-array-according-to-given-pivot` | `pivotArray` | `ArrayList<i64>` | `fold` + 捕获 `pivot` 的内联闭包，三桶累加 |

## 批次 R11-2026-11-04（理想解滚动批次 11，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记的 8 题。按新口径**跳过**已确认无自然调用点的四个面
  （`ArrayList.remove(ordinal)` / `to_array()` / `HashMap.iterator` / `BTreeSet.nth`），
  改压写侧与容器构造：`ArrayList` 预分配、嵌套容器、`HashMap` 删除/清空、`Deque` 队首、`Utf8Builder`。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 新缺口：**0 条**（G1–G24 不变）。新增观察 6：`to_array()` 与 `HashMap.iterator` 判为「可疑冗余」，
  只记账、暂不裁剪。canonical 601 → 609。
- 命中面：`ArrayList` 容量/预分配 ×5、嵌套容器 ×3、`HashMap.remove` / `clear` ×2、`Deque` 队首 ×2、
  `Utf8Builder` 多次 append ×2（详见账本「未命中面（第 11 批探测）」）。
- 未命中：`ArrayList` ↔ 定长 `Array<T>` 仍无自然调用点（宿主入参已是 `[T]`，返回一律 `ArrayList`）。
- 预期阻断：`find-all-anagrams-in-a-string` / `restore-ip-addresses` / `letter-combinations-of-a-phone-number`
  返回 `ArrayList`；`diagonal-traverse-ii` / `spiral-matrix-iii` 返回 `ArrayList<ArrayList<i64>>`；
  `substring-with-concatenation-of-all-words` 以 `ArrayList<utf8>` 入参；按 G3 在 wasm JS glue 处阻断。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`grid` / `students`+`sandwiches` /
  `s`+`p` / `s`+`words` / `s` / `digits` / `nums` / `rows`+`cols`+`rStart`+`cStart`）。
- TS 参考解：`letter-combinations-of-a-phone-number` 与 `number-of-students-unable-to-eat-lunch`
  复用既有实现；其余 6 题 TS 文件此前为空，本批新写。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `number-of-closed-islands` | `closedIsland` | `i64` | BFS + `Deque` 队首 `peek_front` / `pop_front`；嵌套网格原地标记 |
| `number-of-students-unable-to-eat-lunch` | `countStudents` | `i64` | 队列模拟 + 队首 `peek_front` / `pop_front` / `push_back` |
| `find-all-anagrams-in-a-string` | `findAnagrams` | `ArrayList<i64>` | 定长滑窗 + `HashMap.remove` 归零删键；`byte_at` 逐字节（G13 附注） |
| `substring-with-concatenation-of-all-words` | `findSubstring` | `ArrayList<i64>` | 分偏移滑窗 + `HashMap.clear` / `remove`；`slice` 切词 |
| `restore-ip-addresses` | `restoreIpAddresses` | `ArrayList<utf8>` | 四段枚举；`Utf8Builder` 11 次 `append(char)`；`ArrayList::new` 预分配 |
| `letter-combinations-of-a-phone-number` | `letterCombinations` | `ArrayList<utf8>` | 逐层 `ArrayList<ArrayList<i64>>` 笛卡尔积 + `Utf8Builder` |
| `diagonal-traverse-ii` | `findDiagonalOrder` | `ArrayList<ArrayList<i64>>` | `r + c` 分桶，桶表与桶双层预分配 |
| `spiral-matrix-iii` | `spiralMatrixIII` | `ArrayList<ArrayList<i64>>` | 步长绕行；结果 `rows * cols` 预分配 + 行容器 `new(2)` |

## 批次 R10-2026-11-04（理想解滚动批次 10，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记的 8 题；只补理想解，不改算法绕 std 缺口。选题压「排序副本 /
  有序容器按秩 / 哈希物化」，并再次探测点名的四个 API 面：`ArrayList.remove(ordinal)` 的
  `Option<T>` 返回、`ArrayList.to_array()`、`HashMap.iterator` 无捕获回调、`BTreeSet.nth` / `rank`。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 新缺口：**0 条**（G1–G24 不变）。G11 影响题扩为 18（本批 7 题「副本 + `merge_sort`」）、
  G12 影响题扩为 9（`rank-transform-of-an-array` 的 `BTreeSet::new()`）、G16 影响题扩为 5
  （`rank-transform-of-an-array`）。
- 四个点名面：`remove(ordinal)` / `to_array()` / `HashMap.iterator` / `BTreeSet.nth` 在 8 题理想解里
  **仍无自然调用点**，逐条理由记在账本「未命中面（第 10 批探测）」；未硬造调用，也未新增编号。
- 预期阻断：`sort-even-and-odd-indices-independently` / `sort-array-by-increasing-frequency` /
  `relative-ranks` / `rank-transform-of-an-array` / `sort-the-people` 返回 `ArrayList`，
  `merge-similar-items` 返回 `ArrayList<ArrayList<i64>>`，按 G3 在 wasm JS glue 处阻断。
- 签名：8/8 导出形参与 `metadata.tests.args` 键同序、逐字一致（`intervals` / `nums` / `nums` /
  `score` / `arr` / `names`+`heights` / `items1`+`items2` / `nums`）。
- TS 参考解：7/7 复用既有非空实现；`remove-covered-intervals` 的 TS 文件此前为空，本批新写。

| slug | 导出入口 | 返回类型 | 缺口 / 覆盖方向 |
| --- | --- | --- | --- |
| `remove-covered-intervals` | `removeCoveredIntervals` | `i64` | 起点升序 / 同起点终点降序后单次扫描；副本 + `merge_sort`；G11 |
| `sort-even-and-odd-indices-independently` | `sortEvenOdd` | `ArrayList<i64>` | 偶升 / 奇降双列 + 交错回填；G11 / G3 |
| `sort-array-by-increasing-frequency` | `frequencySort` | `ArrayList<i64>` | 频次编码进 `i64`（比较器不能捕获）+ `keys()` 物化；`HashMap.iterator` 边界；G11 |
| `relative-ranks` | `findRelativeRanks` | `ArrayList<utf8>` | `Utf8Builder::append_i64` + 分数/下标编码降序；G3 |
| `rank-transform-of-an-array` | `arrayRankTransform` | `ArrayList<i64>` | `BTreeSet.to_list()` 按秩建表 + HashMap 回填；G12 / G16 / G3 |
| `sort-the-people` | `sortPeople` | `ArrayList<utf8>` | 身高 + 下标编码降序回填人名；G11 / G3 |
| `merge-similar-items` | `mergeSimilarItems` | `ArrayList<ArrayList<i64>>` | HashMap 累加 + `keys()` + 升序物化；G12 / G3 |
| `minimum-moves-to-equal-array-elements-ii` | `minMoves2` | `i64` | 副本 `merge_sort` 取中位数 + 绝对差求和；G11 |

## 批次 R9-2026-11-04（理想解滚动批次 9，8 题，写完未构建）

- 范围：此前 `solution.v` 为阻塞标记的 8 题；只补理想解，不改算法绕 std 缺口。选题偏置压
  「哈希 / 有序容器 / 零拷贝写侧」：`HashMap` 计数与 `keys()`、`BTreeSet` 去重 + `to_list()`
  按秩访问、`ArrayList.view()` 写穿（首次）、嵌套 `ArrayList` 返回、`merge_sort` 就地排序。
- 构建 / 判题状态：**未验证**。本轮按口径不跑构建与判题。
- 新缺口：**0 条**（G1–G24 不变）。G12 影响题扩为 7、G16 影响题扩为 4（含 `nth` / `range` 核对）。
- 更正：本轮静态核对发现 R4–R8 的 10 个解法使用了不存在的提案 API（`sorted_by` ×9、
  `BTreeSet.floor`/`ceiling`、`utf8.compare`、`HashSet::new(capacity)`），已写入账本观察 4，
  更正计划在验证窗口前完成；本批 8 题**不含**纸面 API 调用。
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
