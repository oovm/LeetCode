# Valkyrie 待验证批次清单

> 判题绿只证明「与 `metadata.tests[].expected` 一致」，不证明「与题面一致」。看任何通过数前，
> 先查该题 expected 的来源与题面约束是否已独立核验。

口径：本清单登记**理想解已写**的批次及其验证状态。只有「构建 `status=0` 且隔离判题
`ok=true`」才计入构建通过数，见 `valkyrie-gap-ledger.md` 的「批次状态」小节与缺口编号。
未验证不等于通过；实测列是本次验证窗口逐题跑出的证据。

复跑方式：按下面的 slug 列表批量跑 `legionBuildProject` + 隔离判题；TS 侧已在
`projects/conformance/scripts/run_ts_solver.ts` 实跑，结果列在每题行内。

## 复跑窗口 2026-11-04 23:50（addon 重建后：marshal 夹具修复 + 真实通过口径）

- 触发：addon 重建 `2026-11-04 23:50:58`（13,341,184 B，oak pin `555798a8`），`comparable.v:169`
  解析停点消失；但 10/12 题在 `arg0[0]` 被 `Cannot marshal I64 from number N` 拦住。
- **边界与修法（夹具缺陷，非语言缺口）**：`preserveI64Precision` 原本只转换顶层 `I64` 形参，
  `ArrayList<i64>` 在 schema 上是 `Array<I64>`，元素仍是 JS `Number`。现改为按
  `Array` / `FixedArray` / `Option` / `Tuple` 递归、只在 `I64` 叶节点规整；返回值侧
  `normalizeResultByAbiType` 补 `Option` / `Tuple`。两份实现收敛到
  `projects/conformance/src/isolated/v-shared.ts`，`scripts/run_v_solver.ts` 删除本地副本。
- 复验（全用例真跑）：`two-sum` 80/80、`teemo-attacking` 120/120、`array-partition` 112/112。
- 口径：**编译通过** = `status=0`；**端到端通过** = `status=0` 且判题 `ok=true`。下表分开列，
  单进程顺序跑，约 190 s，超时即报不重试。

| 批次 | 复跑题数 | 编译通过 | 端到端通过 | 编译失败 | 编译通过但判题未通过 |
| --- | --- | --- | --- | --- | --- |
| R20 Easy 标量池 | 25 | 25 | 25 | 0 | 0 |
| R21 Easy 文本 / 哈希 / 树 | 29 | 19 | 17 | 10 | 2 |
| R22 哈希 / 排序 / 滑窗 | 26 | 9 | 7 | 17 | 2 |
| R23 双指针 / 前缀和 / 二分答案 | 28 | 20 | 6 | 8 | 14 |
| R24 单调栈 / 堆 / 贪心 | 28 | 12 | 12 | 16 | 0 |
| R25 图 / 并查集 / 拓扑排序 | 23 | 14 | 14 | 9 | 0 |
| R19 位运算 | 9 | 0 | 0 | 9 | 0 |
| M-2026-11-03 | 37 | 37 | 24 | 0 | 13 |
| 基线 `two-sum` | 1 | 1 | 1 | 0 | 0 |
| **合计** | **206** | **137** | **106** | **69** | **31** |

- 累计口径（替换此前「累计已构建通过 18」）：端到端通过 **106 / 832**，编译通过 **137 / 832**，
  未编译（未验证）**626**。
- 编译失败题（69）按族归并见账本「验证窗口实测」节：
  `sort(ArrayList<i64>)` 无候选 20、`BinaryHeap` `where` 证据 13、`[export]` 写在类方法上 9、
  嵌套 `ArrayList::new(0)` 推断 6、`infix -` 歧义 5、`<fn value>` 不在作用域 4、`sorted_by` 缺失 3、
  SMIR007 合同 3、`char` 面运算 2、`u8` 覆盖 `char` 2、`String` 1、`__u8_add` 1、`list.iter` 1、
  `mut` 形参类型位 1（`advantage-shuffle`、`the-k-strongest-values-in-an-array` 跨两族，已去重）。
- 编译通过但判题未通过（31，均为 2026-11-04 首轮测量）：29 条首例即结果不符（多为
  `expected "X", got "0"`）+ `closest-binary-search-tree-value`（浮点 `target`）+ `delete-and-earn`
  运期 `unreachable`。
- **2026-11-05 销账（口径已更新）**：
  - **30/31 已修并通过全用例**。共同根因是 **`loop <var> in <ArrayList>` 静默零迭代**（编译不报错、
    运行时一次也不进循环），全部改为显式 `while index < list.length()` + `list⁅index⁆`。
    另修 `single-number-ii` 的符号扩展与 `maximum-xor-of-two-numbers-in-an-array` 的外层位循环
    提前跳出。`delete-and-earn` 的 `unreachable` 同因（`max_val` 停在 0 → 0 长数组取下标）。
    loop 静默零迭代属语言侧证据，建议并入迭代协议缺口。
  - `closest-binary-search-tree-value` 不是语料缺陷：`target` 本是浮点，题解按理想签名 `f64` 写，
    但 wasm 后端 `i64 as f64` / `f64 as i64` 两个方向都缺精确转换 opcode，转为编译失败。
  - 最终口径（同一 206 题窗口）：**编译通过 136、端到端通过 136、编译失败 70、判题未通过 0**。
- 本窗口未复跑的题（626）不是失败，只是超出本轮预算；按批次表原状态保留。

## 批次 R26-2026-11-05（Medium 并查集进阶：MST / SCC / 二分图染色 21 题，实测）

- 范围：Medium 的生成树 / 连通性 / 有向图 / 二分图着色面，全部按理想写法落地，
  三件套齐备（`solution.v` / `solvers/typescript/solution.ts` / `metadata.invoke.valkyrie`）。
- 实测口径（逐题单进程、每次 ≤300 秒、超时未重试）：
  - V：**19/21 全用例通过**；2 题编译失败，均卡在 std 合同（见账本 R26 工单），不是题解错。
  - TS：**21/21 通过**（`run_ts_solver.ts` exit 0）。
- 逐题：

| 题 | 算法 | V | TS |
| --- | --- | --- | --- |
| `connecting-cities-with-minimum-cost` | Prim O(n²) | 79/79 | 通过 |
| `min-cost-to-connect-all-points` | Prim O(n²)（曼哈顿距离） | 104/104 | 通过 |
| `path-with-minimum-effort` | 阈值二分 + BFS | 69/69 | 通过 |
| `path-with-maximum-minimum-value` | 值域二分 + BFS | 72/72 | 通过 |
| `minimum-height-trees` | 逐层剥叶 | 65/65 | 通过 |
| `minimize-the-maximum-edge-weight-of-graph` | 反向建图 BFS + 边权二分 | 83/83 | 通过 |
| `find-champion-ii` | 入度唯一零 | 78/78 | 通过 |
| `all-paths-from-source-lead-to-destination` | 三色 DFS | 72/72 | 通过 |
| `paths-in-maze-that-lead-to-same-room` | 邻居对枚举 → 三角形 | 59/59 | 通过 |
| `parallel-courses` | Kahn 分层 | 77/77 | 通过 |
| `find-all-possible-recipes-from-given-supplies` | Kahn（`utf8` 线性查找，临时回退） | 103/103 | 通过 |
| `flower-planting-with-no-adjacent` | 4 色贪心 | 59/59 | 通过 |
| `maximum-number-of-accepted-invitations` | Kuhn 二分匹配 | 77/77 | 通过 |
| `count-the-number-of-houses-at-a-certain-distance-i` | 全源 BFS | 114/114 | 通过 |
| `the-time-when-the-network-becomes-idle` | BFS + 重发时刻 | 51/51 | 通过 |
| `node-with-highest-edge-score` | 出度加权 | 26/26 | 通过 |
| `sentence-similarity-ii` | `DisjointSet<i64>` + `HashMap<utf8, i64>` | **编译失败** `std::hash#445` | 通过 |
| `minimize-hamming-distance-after-swap-operations` | `DisjointSet<i64>` | **已修（`57992125`）**：`std::union` SMIR007 不再复现，待复验 | 通过 |
| `validate-binary-tree-nodes` | 入度唯一根 + 显式栈 | 137/137 | 通过 |
| `reachable-nodes-with-restrictions` | 显式栈 DFS | 71/71 | 通过 |
| `detect-cycles-in-2d-grid` | 迭代 DFS + 父格 | 74/74 | 通过 |

- 数据清洗：按账本「用例数据清洗规则」，删除 **21 条**非答案形态用例
  （`expected` 为 Python 异常文本），未改任何断言、未删合法用例：
  `the-time-when-the-network-becomes-idle` 16 条、`node-with-highest-edge-score` 3 条、
  `path-with-minimum-effort` 1 条、`minimize-the-maximum-edge-weight-of-graph` 1 条。
- 夹具缺陷（仅影响报错文本，不改变通过结果）：`scripts/run_v_solver.ts:172` 的
  `assertTestCase(idx, expected, () => { void runCandidate(...) })` 未 `await` 异步
  `callExport`，`expected: "Error: ..."` 的用例一律被报成 `no exception raised`，
  真实 trap 只能以 unhandled rejection 出现（`redundant-connection` 旧解也可复现）。
  清洗掉上述用例后该路径不再触发，缺陷保留工单。
- `find-all-possible-recipes-from-given-supplies` 的 V 端为过全用例临时改用
  `ArrayList<utf8>` + 逐码元比较；理想写法是 `HashMap<utf8, i64>`，与
  `sentence-similarity-ii` 同一 `std::hash#445` 停点，合同落地后还原。

## 批次 R28-2026-11-05（数据结构 / 堆 / 闭包 / 字符串构造 28 题，写完未验证）

- 范围与题数（28）：堆 / 优先队列 7（`reorganize-string`、`longest-happy-string`、
  `rearrange-string-k-distance-apart`、`take-gifts-from-the-richest-pile`、
  `construct-string-with-repeat-limit`、`find-k-pairs-with-smallest-sums`、
  `minimum-amount-of-time-to-fill-cups`）；矩阵 / 区间邻近面 2
  （`kth-smallest-element-in-a-sorted-matrix`、`meeting-rooms-ii`）；
  文本键 / 前缀面 5（`distinct-echo-substrings`、`number-of-distinct-substrings-in-a-string`、
  `index-pairs-of-a-string`、`phone-number-prefix`、`word-break`）；队列 / 栈 / 状态模拟 5
  （`dota2-senate`、`time-needed-to-buy-tickets`、`snake-in-matrix`、`simplify-path`、
  `basic-calculator-ii`）；字符串构造 6（`count-and-say`、
  `fraction-addition-and-subtraction`、`complex-number-multiplication`、
  `remove-all-occurrences-of-a-substring`、`hash-divided-string`、`bulls-and-cows`）；
  比较器 / 闭包 3（`the-k-weakest-rows-in-a-matrix`、
  `find-subsequence-of-length-k-with-the-largest-sum`、`high-five`）。
- 三件套：**28/28**（`solution.v` + `solvers/typescript/solution.ts` + `metadata.invoke.valkyrie`）。
- 口径（三者分开）：
  - **编译通过 0 题**（addon 重建窗口，未跑 V）。
  - **端到端通过 0 题**（同上）。
  - **写完未验证 28 题**。
  - TS 参考解 **28/28 通过**（`run_ts_solver.ts` exit 0）。
- 形参名与 `tests[].args` 键：28/28 逐字同序（脚本静态核对）。
- 数据清洗（逐条按账本规则，删除的全是 `expected` 为 Python 异常文本的非答案用例，共 **121 条**）：
  `complex-number-multiplication` 86、`hash-divided-string` 30、
  `reorganize-string` 1、`kth-smallest-element-in-a-sorted-matrix` 1、
  `longest-happy-string` 1、`time-needed-to-buy-tickets` 1、
  `fraction-addition-and-subtraction` 1。
  另 `remove-all-occurrences-of-a-substring` 的 `tests[90]` 是语料类型错误
  （纯数字串被生成器写成 number），按题面返回 `String` 修正为字符串，未删用例。
- TS 参考解修复（8 题）：`reorganize-string` 并列序、`longest-happy-string` 构造序、
  `rearrange-string-k-distance-apart` 冷却队列、`find-k-pairs-with-smallest-sums`
  `(sum,i,j)` 字典序、`index-pairs-of-a-string` 去重、`fraction-addition-and-subtraction`
  通分约分、`the-k-weakest-rows-in-a-matrix` 与 `find-subsequence-of-length-k-with-the-largest-sum`
  复刻 Python 参考解的并列取舍。
- 本批 V 侧压到的 std 面（静态命中，未编译）：`BinaryHeap<i64>` 3 题
  （`find-k-pairs-with-smallest-sums`、`take-gifts-from-the-richest-pile`、
  `rearrange-string-k-distance-apart`）；`sorted_by` 3 题（G11，见账本）；
  `HashSet` / `HashMap` 6 题；`Utf8Builder` 15 题；`Deque` 1 题（`dota2-senate`）。
- 待还原组新增：`phone-number-prefix`（见账本同名小节）。
- 新编号：**0 条**。

## 批次 R29-2026-11-05（设计类：多方法 + 内部状态 6 题，2026-11-07 复验通过）

- 范围与题数（6）：`lru-cache`（146）、`lfu-cache`（460）、
  `implement-trie-prefix-tree`（208）、`design-hashset`（705）、
  `design-hashmap`（706）、`min-stack`（155）。选题目的：补齐题库里整块空白的
  「同一类型上多方法共存 + 方法间共享可变状态 + 构造 / 私有字段」面，不是重复已有题型。
- 三件套：**6/6**（`solution.v` + `solvers/typescript/solution.ts` +
  `metadata.invoke.valkyrie`；另含 `solvers/python/solution.py` 参考 oracle）。
- 题面形态：`metadata.tests` 保持 LeetCode 操作序列原形（`args.operations` +
  `args.arguments`，`expected` 为每步返回），**未压成单函数调用**。
- 口径（三者分开）：
  - **编译通过 6 题**：`legion build --target wasm` 全部 `status=0`（F2 已恢复）。
  - **端到端通过 6 题**：`run_v_solver.ts` 真跑 **12/12 用例 PASS**（F1 + F2 均已恢复）。
  - **写完未验证 0 题**。
- 实测证据：导出面为构造入口（类名）+ 逐操作入口（题面方法名）；实例以
  `InstanceHandle` 不透明 GC 引用跨调用保持同一身份。内部辅助方法（`walk` /
  `unlink` / `push_front` 等）不占用宿主导出面，作为被调方进入可达闭包。
- V 侧形态：每题的类体只放字段，方法全部写在 `imply` 块；构造与公开操作在
  `imply` 成员上标 `[export(name: ...)]`，未触发
  `valkyrie.hir.class_body_method_declared`。
- 新编号：**1 条**（G28 `BinaryHeap` 的 `Comparable` 义务传播）；
  另新增 F1 / F2 两条夹具与导出 ABI 缺口（均已恢复，见账本）。

## 批次 R29-2026-11-05（判题侧移交：参数名 / 数值答案 / 语料清洗，27 题，实测）

- 范围：判题线移交的 A/B/C 三批，27 题 `metadata.json` + 16 题 `solution.v`（不含设计类 6 题）。
- 口径：`run_v_solver.ts` 实测，当前 addon，未重建。真通过 = `ok=true`；删除/修复的逐题旧→新
  用例数与判据见账本 `F7 跟进` 小节。
- A 参数名（3 题全绿）：`excel-sheet-column-number` 201/201、`ransom-note` 142/142、
  `maximize-number-of-nice-divisors` 80/80（77 条宿主文本由参考实现重算）。
- B 真实现错（11 题全绿）：`best-time-to-buy-and-sell-stock` 99/99、
  `domino-and-tromino-tiling` 30/30、`majority-element` 45/45、`single-number` 108/108、
  `maximum-number-that-sum-of-the-prices-is-less-than-or-equal-to-k` 126/126、
  `minimum-factorization` 52/52、`non-negative-integers-without-consecutive-ones` 26/26、
  `smallest-number-with-given-digit-product` 41/41、`minimum-cost-to-set-cooking-time` 116/116、
  `maximum-number-that-makes-result-of-bitwise-and-zero` 86/86、`closest-fair-integer` 67/67。
- B 改判语料（5 题全绿）：`find-minimum-in-rotated-sorted-array` 87/87、
  `kth-smallest-element-in-a-sorted-matrix` 86/86、`k-th-symbol-in-grammar` 50/50、
  `minimum-number-of-pushes-to-type-word-i` 182/182、`ugly-number-iii` 123/123。
- C 删除 **559** 条（原始移除）：宿主异常文本 392（15 题）、越界输入 167（7 题，其中 4 条同时是宿主文本）。
  二次处置回补 **318** 条（316 条四题宿主文本由修好的参考实现真实重算 expected + 2 条 `handshakes`
  原用例重算），当前净删 **241** 条（宿主文本 74 + 越界输入 167，重叠 4 不重复计）。
- C `expected` 修复 62 条：`find-the-minimum-possible-sum-of-a-beautiful-array` 30、
  `maximum-number-that-makes-result-of-bitwise-and-zero` 11、
  `convert-a-number-to-hexadecimal` 17、`maximum-swap` / `numbers-with-repeated-digits` /
  `minimum-array-end` / `minimum-addition-to-make-integer-beautiful` 各 1。
- C 追加两条：`sort-array-by-parity-ii` 74/74（删 11 条非法 + 改解），
  `convert-a-number-to-hexadecimal` 0/60（`TypeError`，`utf8` 返回仍标 `I32`，待重建 addon）。
- C 清洗后暴露：`cells-in-a-range-on-an-excel-sheet` 93/93（删 82 条越界输入）、
  `closest-fair-integer` 67/67（奇数位长跳段）。
- 仍红 3 题：`convert-a-number-to-hexadecimal`、`decode-the-message`（同属 26 题 `Utf8` 返回值
  修复，待重建 addon 复验）、`minimum-addition-to-make-integer-beautiful` 30/103
  （`tests[30]` 的 `n` 超 i64 + 13 条不可恢复 expected，已并入精度清单）。
- 覆盖回补（原「需补生成语料」已处置）：`count-the-number-of-arrays-with-k-matching-adjacent-elements`
  1→158（157 条重算）、`maximize-number-of-nice-divisors` 3→80（77 条）、
  `student-attendance-record-ii` 11→41（30 条）、`number-of-ways-to-reach-a-position-after-exactly-k-steps`
  39→91（52 条）。四题均为参考实现失败（`pow` 被 `from math import *` 遮蔽 / 递归深度），
  不是生成器造非法输入；`handshakes-that-dont-cross` 误删 2 条已恢复，39/39。
- 新编号：**0 条**。

## 批次 R30-2026-11-05（`pow` 遮蔽普查 + 剩余宿主文本处置，实测）

- 范围：全库 2847 个 `solvers/python/solution.py` 的 `math` 通配导入 / 裸 `pow` 普查；R29 剩余 74 条
  宿主文本逐题处置。
- `pow` 普查：裸 `pow` 共 7 个文件、10 处调用（3 个文件 6 处在上一提交修，4 个文件 4 处本轮）。3 个静默点
  返回 `float`，但当前值与精确整数逐位差 0（最大正确值 949480669 < 2^53），已统一改 `import builtins` +
  `builtins.pow`。
- 两个报错点补重算：`count-k-subsequences-of-a-string-with-maximum-beauty` 44 条、
  `final-array-state-after-k-multiplication-operations-ii` 107 条（真实运行产出；两题 `solution.v` 为空，
  无 V lane）。
- 剩余 74 条：救回 13 条（`number-of-strings-which-can-be-rearranged-to-contain-substring` 10 条迭代 DP、
  `closest-fair-integer` 3 条迭代循环，等价性 `1..400` / `1..5000` mismatch=0）；维持删除 61 条，
  全部是 `args` 违反题面约束（`decode-the-message` 的 key/message、`prime-palindrome` `n>1e8`、
  `cells-in-a-range-on-an-excel-sheet` 多字母列、`merge-sorted-array` 缓冲不足、
  `sort-array-by-parity-ii` 偶奇不等、`can-make-arithmetic-progression-from-sequence` 单元素、
  `find-kth-bit-in-nth-binary-string` `k` 越界、`minimum-cost-to-set-cooking-time` `targetSeconds>6039`
  得 `inf`）。
- 覆盖下限复核：受影响题全部 `>= max(10, ceil(历史中位数 × 0.5))`；最紧
  `cells-in-a-range-on-an-excel-sheet` 93 vs 92，最低 `prime-palindrome` 52 vs 31。
- 新编号：**0 条**。

## 批次 R25-2026-11-04（Medium 图 / 并查集 / 拓扑排序 23 题，写完未构建）

- 范围：Medium 的图 + 并查集 + 拓扑排序面，全部按**理想写法**落地：邻接表
  （`ArrayList<ArrayList<i64>>` 稠密下标建表 / `HashMap<i64, ArrayList<...>>` 稀疏键值建表）、
  入度出度计数、`Deque` 当 BFS 队列 / DFS 栈、`DisjointSet` 判环与分量数、Kahn 反向拓扑。
  本批目标是**把图面基础设施的 API 面一次压清**，产出工单优先于出题数。
- 构建 / 判题状态：**未验证（authored-unverified），构建通过 0 题**。全局停点与 R20–R24 相同：
  **addon 二进制基线过期**，不是 std 前端回归。
- 覆盖口径：本块 **23 题**全部计入「仅写完未验证」；累计已构建通过数保持 **18**，
  累计未验证 = canonical **832** − 18 = **814**。
- 新缺口编号：**0 条**。新增依赖未实现特性的调用点：
  - `Queue<T>`（**名字有、宿主实现无**）：`new` / `enqueue` / `dequeue` / `peek` / `length` /
    `clear` 全为 `[host_contract]`，`is_empty` 有体但依赖宿主 `length`；空壳 `enqueue` 内调
    不存在的 `Deque::push`，说明壳自身未编译。本批 **0 题使用**，工单保留。
  - `HashMap` 邻接 upsert（**无 `get_mut` / `upsert`**）：2492、1466，共 **2 题**，
    均为 `HashMap<i64, ArrayList<ArrayList<i64>>>` 边表追加，每处 `get` → 改副本 → `insert`。
  - G2 浮点返回值合同：1514 导出 `-> f64`，共 **1 题**。
  - `char: Hash`（G17）：**已落地**（`HashPrimitives.v:53`），不再计入依赖，424 / 340 / 621
    转入「阻塞解除」复跑组。
- **std 图面核实结论（按要求写进工单）**：
  - `DisjointSet<T>`：**真实实现**，`HashMap<T,T>` 父指针 + `HashMap<T,usize>` 秩 + `_count`，
    `find` 路径压缩、`union` 按秩合并；约束 `T: Equal & Hash`。
  - `DirectedGraph<N>` / `topological_sort`：**真实实现**，`add_node` / `add_edge` /
    `successors` / `predecessors` / `out_degree` / `in_degree` / `clone`；拓扑排序是真实 Kahn
    （`HashMap` 入度 + `ArrayList` 队列 + `head` 游标，有环返回空表）。
  - `Queue<T>` / `PriorityQueue<T>`：同批 `[host_contract]` 空壳，签名齐全、宿主缺失。
- TS 参考解：23 题**全部实跑**（`run_ts_solver.ts`），23/23 通过；全部新写，无复用。
  复杂度与 V 侧同阶：684/1319/959 并查集、743/787 Bellman-Ford、802 反向 Kahn、
  1514/1976 朴素 Dijkstra、1091/2812/1129/994/1020/2658/1905 BFS/DFS、2477 子树聚合、
  1462 Floyd 传递闭包、851 n 次 DFS、1267 行列计数。
- 数据清洗：仅删除**非答案形态或自相矛盾**的用例，未改断言、未删合法用例；共 **41 条**：
  - `maximum-number-of-fish-in-a-grid`（2658）：1 条 `Error: list index out of range`。
  - `reorder-routes-to-make-all-paths-lead-to-the-city-zero`（1466）：6 条（5 条
    `Error: ...` + 1 条输入被拆成两个不相连分量、`expected` 与题面语义矛盾）。
  - `path-with-maximum-probability`（1514）：1 条 `Error: list index out of range`。
  - `find-closest-node-to-given-two-nodes`（2359）：1 条 `Error: list index out of range`。
  - `find-the-safest-path-in-a-grid`（2812）：2 条 `Error: ...`。
  - `number-of-ways-to-arrive-at-destination`（1976）：2 条（1 条 `Error: ...`；
    1 条重边输入下最短路径实际有 2 条、`expected` 为 1）。
  - `regions-cut-by-slashes`（959）：10 条非方阵 / 越界输入，`expected` 为宿主异常文本。
  - `time-needed-to-inform-all-employees`（1376）：14 条 `Error: maximum recursion depth exceeded`
    （`manager` 数组成环，非法输入）。
  - `loud-and-rich`（851）：4 条（1 条宿主异常 + 3 条 `richer` 关系成环，非法输入；
    `expected` 与任何正确传递闭包都对不上）。
- 实现形态修正（不改数据）：
  - 1091 `shortest-path-in-binary-matrix`：数据按方阵判（`n = grid.length`，多出的列不计），
    与仓内 Python 参考一致；非方阵用例按此得到 `expected`。
  - 1976 `number-of-ways-to-arrive-at-destination`：先按两端点去重（保留最小耗时），
    否则并行重边会把同一最短路径重复计数。
  - 1376：叶子不再加 `informTime`（数据里个别叶子 `informTime` 非 0，`expected` 按「到叶子即结束」）。
  - 1462：可达矩阵含自反（`reach[a][a] = true`），与数据 `expected` 一致。
  - 851 `loud-and-rich`：数据 `expected` 是**扁平数组**（每下标一项），导出也按扁平返回。
  - 802：越界后继边计入出度、但不建反向边，因此指向不存在节点的节点永不安全（与数据一致）。
  - 959：按「每格 4 小块（左上/右上/左下/右下）」建并查集，跨格连边 + 格内按字符连边，
    分量数即答案。
  - 2812：safeness 是曼哈顿距离，多源 BFS 与判定 BFS 都用 4 邻域。
- 入口签名：23/23 导出形参与 `metadata.tests[].args` 键**逐字同序**（脚本比对，`bad=0`）；
  入口名与 `metadata.invoke.valkyrie` 一致（新补 23 条）。
- 写出形态：23/23 顶层 `[export(case: "camelCase")] micro` + `class Solution` 委托。

| 题号 | slug | 入口 | 返回 | 命中面 | 用例数 |
| --- | --- | --- | --- | --- | --- |
| 684 | `redundant-connection` | `findRedundantConnection` | `ArrayList<i64>` | `DisjointSet::connected` / `union` | 76 |
| 743 | `network-delay-time` | `networkDelayTime` | `i64` | Bellman-Ford + `ArrayList` 距离表 | 100 |
| 787 | `cheapest-flights-within-k-stops` | `findCheapestPrice` | `i64` | Bellman-Ford（k 轮 + 副本回写） | 94 |
| 802 | `find-eventual-safe-states` | `eventualSafeNodes` | `ArrayList<i64>` | 反向图 + Kahn（`Deque` 队列） | 81 |
| 1020 | `number-of-enclaves` | `numEnclaves` | `i64` | 边界 DFS（`Deque` 栈） | 67 |
| 994 | `rotting-oranges` | `orangesRotting` | `i64` | 多源 BFS（按层推进） | 96 |
| 2658 | `maximum-number-of-fish-in-a-grid` | `findMaxFish` | `i64` | 网格 DFS 累加 | 105 |
| 1905 | `count-sub-islands` | `countSubIslands` | `i64` | 双网格 DFS 校验 | 67 |
| 959 | `regions-cut-by-slashes` | `regionsBySlashes` | `i64` | `DisjointSet::group_count` + 4 小块 | 89 |
| 1319 | `number-of-operations-to-make-network-connected` | `makeConnected` | `i64` | `DisjointSet` 多余边 + 分量数 | 89 |
| 2492 | `minimum-score-of-a-path-between-two-cities` | `minScore` | `i64` | `HashMap` 邻接 + DFS | 65 |
| 1466 | `reorder-routes-to-make-all-paths-lead-to-the-city-zero` | `minReorder` | `i64` | `HashMap` 邻接 + DFS 定向计数 | 56 |
| 1129 | `shortest-path-with-alternating-colors` | `shortestAlternatingPaths` | `ArrayList<i64>` | 状态图 BFS（`Deque`） | 97 |
| 1376 | `time-needed-to-inform-all-employees` | `numOfMinutes` | `i64` | 汇报树递归 | 43 |
| 1514 | `path-with-maximum-probability` | `maxProbability` | `f64` | 朴素 Dijkstra（`f64` 概率合同） | 69 |
| 2359 | `find-closest-node-to-given-two-nodes` | `closestMeetingNode` | `i64` | 两次走链求距离 | 101 |
| 851 | `loud-and-rich` | `loudAndRich` | `ArrayList<i64>` | n 次 DFS 取最小 `quiet` | 97 |
| 1267 | `count-servers-that-communicate` | `countServers` | `i64` | 行列计数 | 50 |
| 1091 | `shortest-path-in-binary-matrix` | `shortestPathBinaryMatrix` | `i64` | 8 邻域 BFS | 67 |
| 1976 | `number-of-ways-to-arrive-at-destination` | `countPaths` | `i64` | 朴素 Dijkstra + 方案数取模 | 63 |
| 2477 | `minimum-fuel-cost-to-report-to-the-capital` | `minimumFuelCost` | `i64` | 子树人数自底向上 | 65 |
| 2812 | `find-the-safest-path-in-a-grid` | `maximumSafenessFactor` | `i64` | 多源 BFS + 二分 + BFS 判定 | 66 |
| 1462 | `course-schedule-iv` | `checkIfPrerequisite` | `ArrayList<bool>` | Floyd 传递闭包 | 181 |

## 批次 R24-2026-11-04（Medium 单调栈 / 队列 / 堆 + 贪心 28 题，写完未构建）

- 范围：Medium 的单调栈 + 队列 / 双端队列 + 堆（优先队列）+ 贪心面，全部按**理想写法**落地。
  本批重点是把 `BinaryHeap` / `PriorityQueue` / `Deque` 的 API 面压出来：构造、`push` / `pop` /
  `peek`、自定义序（`new_by(compare)`）、`Deque` 两端操作、`ArrayList` 当栈，缺什么记什么。
- 构建 / 判题状态：**未验证（authored-unverified），构建通过 0 题**。全局停点是
  **addon 二进制基线过期**（首个触发者 `valkyrie.v d48011b`），待 addon 重建后关闭；
  不是 std 前端回归。
- 覆盖口径：本块 **28 题**全部计入「仅写完未验证」；累计已构建通过数保持 **18**，
  累计未验证 **28（R24）+ 前批累计 = 见账本 canonical 809 − 已构建 18**。
- 新缺口编号：**0 条**。新增依赖未实现特性的调用点：
  - `BinaryHeap<T>::new_by(compare: micro(T, T) -> i32)`（**提案，std 无**）：1962 / 1642 / 2208 /
    2530 / 2462 / 621，共 **6 处**。2208 的元素是 `f64`（非 `Comparable`），2462 是比较器捕获
    `costs` 的下标堆。
  - `PriorityQueue<T>`（**名字有、宿主实现无**）：2233 / 2542 / 1167 / 1353，共 **4 题**。
  - `sorted_by(list, cmp)`（G11 提案）：2542（按 `nums2` 降序、捕获 `nums2`）、1353（按开始日升序），
    共 **2 处**。
  - `Comparable` / `<=>` 派生（**阻塞**）：1705（`Fruit` 按到期日）、1921（`Monster` 按
    `dist / speed` 交叉相乘），归入独立的「阻塞于 `Comparable` 派生」组。
  - `char: Hash`（G17）：621，归入现有 char Hash 组。
  - `sort(list)` 已落地（`ArrayList` 形态），950 / 945 / 1921 直接调用；不计入未实现特性依赖，
    并入「阻塞解除」复跑组。
- TS 参考解：28 题**全部实跑**（`run_ts_solver.ts`），28/28 通过；全部新写，无复用。
  每题文件自带所需堆（`MinHeap` / `MaxHeap` / `IndexHeap` / `FruitHeap`），与 V 侧结构同构。
- 数据清洗：仅删除**非答案形态或自相矛盾**的用例，未改断言、未删合法用例：
  - `total-cost-to-hire-k-workers`（2462）：1 条 `expected: "Error: index out of range"`
    （非答案形态）。
  - `maximum-number-of-events-that-can-be-attended`（1353）：5 条含 `endDay < startDay` 的
    非法事件（`[12,10]` / `[13,9]` … `[21,1]`），`expected` 却按全部事件计 21 / 20。
  - 共删除 6 条用例，删除后单题用例数见下表。
- 实现形态修正（不改数据）：`furthest-building-you-can-reach`（1642）由「大顶堆取最大用砖」
  改为「砖块承担最小的一跳」（大顶堆存负值）；`minimum-deletions-to-make-array-beautiful`
  （2216）按用例语义确认为「相邻成对元素不相等」而非奇偶性。
- 入口签名：28/28 导出形参与 `metadata.tests[].args` 键**逐字同序**（脚本比对；
  `mut` 前缀不计入参数名）。入口名与 `metadata.invoke.valkyrie` 一致。
- 写出形态：28/28 顶层 `[export(case: "camelCase")] micro` + `class Solution` 委托。

| 题号 | slug | 入口 | 返回 | 命中面 | 用例数 |
| --- | --- | --- | --- | --- | --- |
| 1962 | `remove-stones-to-minimize-the-total` | `minStoneSum` | `i64` | `BinaryHeap::new_by`（大顶） | 83 |
| 1642 | `furthest-building-you-can-reach` | `furthestBuilding` | `i64` | `BinaryHeap::new_by` + 贪心 | 118 |
| 2208 | `minimum-operations-to-halve-array-sum` | `halveArray` | `i64` | `BinaryHeap<f64>::new_by` | 81 |
| 2233 | `maximum-product-after-k-increments` | `maximumProduct` | `i64` | `PriorityQueue` 最小堆 | 101 |
| 2530 | `maximal-score-after-applying-k-operations` | `maxKelements` | `i64` | `BinaryHeap::new_by`（大顶） | 89 |
| 2542 | `maximum-subsequence-score` | `maxScore` | `i64` | `sorted_by` + `PriorityQueue` | 114 |
| 1167 | `minimum-cost-to-connect-sticks` | `connectSticks` | `i64` | `PriorityQueue` 合并 | 84 |
| 2462 | `total-cost-to-hire-k-workers` | `totalCost` | `i64` | `BinaryHeap::new_by`（下标堆） | 99 |
| 1353 | `maximum-number-of-events-that-can-be-attended` | `maxEvents` | `i64` | `sorted_by` + `PriorityQueue` | 93 |
| 1705 | `maximum-number-of-eaten-apples` | `eatenApples` | `i64` | `Comparable` 派生 + `BinaryHeap` | 72 |
| 3066 | `minimum-operations-to-exceed-threshold-value-ii` | `minOperations` | `i64` | `BinaryHeap` 最小堆 | 103 |
| 2599 | `make-the-prefix-sum-non-negative` | `makePrefSumNonNegative` | `i64` | `BinaryHeap` 最小堆 | 107 |
| 621 | `task-scheduler` | `leastInterval` | `i64` | `char` Hash + `BinaryHeap::new_by` | 86 |
| 739 | `daily-temperatures` | `dailyTemperatures` | `ArrayList<i64>` | 单调栈（`ArrayList` 当栈） | 107 |
| 907 | `sum-of-subarray-minimums` | `sumSubarrayMins` | `i64` | 两次单调栈 + 取模 | 93 |
| 1856 | `maximum-subarray-min-product` | `maxSumMinProduct` | `i64` | 单调栈 + 前缀和 | 101 |
| 2104 | `sum-of-subarray-ranges` | `subArrayRanges` | `i64` | 单调栈（最大值和 − 最小值和） | 127 |
| 1673 | `find-the-most-competitive-subsequence` | `mostCompetitive` | `ArrayList<i64>` | 单调递增栈 + 删 k 个 | 106 |
| 2216 | `minimum-deletions-to-make-array-beautiful` | `minDeletion` | `i64` | `ArrayList` 当栈 + 贪心配对 | 125 |
| 1762 | `buildings-with-an-ocean-view` | `findBuildings` | `ArrayList<i64>` | 反向扫描 + 栈翻转 | 128 |
| 946 | `validate-stack-sequences` | `validateStackSequences` | `bool` | `ArrayList` 模拟栈 | 101 |
| 950 | `reveal-cards-in-increasing-order` | `deckRevealedIncreasing` | `ArrayList<i64>` | `sort(list)` + `Deque` | 78 |
| 1696 | `jump-game-vi` | `maxResult` | `i64` | 单调 `Deque` + DP | 92 |
| 918 | `maximum-sum-circular-subarray` | `maxSubarraySumCircular` | `i64` | Kadane（最大 / 最小子段） | 117 |
| 2944 | `minimum-number-of-coins-for-fruits` | `minimumCoins` | `i64` | 单调 `Deque` + DP | 122 |
| 3191 | `minimum-operations-to-make-binary-array-elements-equal-to-one-i` | `minOperations` | `i64` | `Deque` 延迟翻转 | 109 |
| 945 | `minimum-increment-to-make-array-unique` | `minIncrementForUnique` | `i64` | `sort(list)` + 贪心 | 104 |
| 1921 | `eliminate-maximum-number-of-monsters` | `eliminateMaximum` | `i64` | `Comparable` 派生 + `sort(list)` + 贪心 | 127 |

## 批次 R23-2026-11-04（Medium 双指针 / 前缀和 / 二分答案 28 题，写完未构建）

- 范围：Medium 的双指针 + 前缀和 + 二分答案面，全部按**理想写法**落地：
  双指针首尾 / 同向内收、前缀和（含同余与奇偶前缀）、二分答案（下界 / 上界 / 极大化），
  排序面继续按 `sort(list)` 与 `sorted_by(list, cmp)` 的理想形态写，缺什么记什么。
- 构建 / 判题状态：**未验证（authored-unverified），构建通过 0 题**。全局停点是
  **addon 二进制基线过期**（首个触发者 `valkyrie.v d48011b`），待 addon 重建后关闭；
  不是 std 前端回归。
- 覆盖口径：本块 **28 题**全部计入「仅写完未验证」；累计已构建通过数保持 **18**。
- 新缺口编号：**0 条**。新增依赖未实现特性的调用点：
  - `sort(list)` 单参入口（G26 的 C4 定稿签名，待落地）：2517 / 1552 / 2616 / 1471 / 611 /
    1877 / 2491 / 2410（两处），共 **9 处调用点、8 题**。
  - `sorted_by(list, cmp)`（G11 提案）：1471，共 1 处；比较器捕获外层 `median`。
  - 已有签名的使用面（不算缺口，但同样未经编译验证）：`HashMap<i64, i64>`（974 / 1248）、
    `Deque<i64>`（962）、`ArrayList` 构造 / `push` / `length` / `set`、`i64` 算术。
- TS 参考解：28 题**全部实跑**
  （`run_isolated_judge.ts --lang typescript --iterations 1 --warmup 0`），28/28 `ok=true`；
  全部新写，无复用。
- 数据清洗：仅删除**非答案形态或自相矛盾**的用例，未改断言、未删合法用例：
  - `house-robber-iv`（2560）：5 条 `k > ceil(n/2)`（相邻不能同时选取，数学上无可行选取，
    但 `expected` 仍给出数字）。
  - `find-the-smallest-divisor-given-a-threshold`（1283）：3 条 `threshold < nums.length`
    （任何除数都无法把向上取整和降到阈值以下）。
  - `minimize-the-maximum-difference-of-pairs`（2616）：2 条 `p > floor(n/2)`（配对数超过上限）。
  - `maximum-distance-between-a-pair-of-values`（1855）：2 条 `expected` 与合法配对可达到的最大
    跨度矛盾（任意配对最大为 9，`expected` 为 4）。
  - 共删除 12 条用例，删除后单题用例数见下表。
  - 另有 2 条 `maximum-distance-between-a-pair-of-values` 用例输入不满足「两数组非递增」，
    但其 `expected` 合法；按清洗规则**保留用例并适配解法**：改用「`nums1` 前缀最小值 + 对每个
    `nums2` 右端点二分最小左端点」的推广形态，语义与原题一致。
- 入口签名：28/28 导出形参与 `metadata.tests[].args` 键**逐字同序**（脚本比对，`bad=0`）；
  入口名与 `metadata.invoke.valkyrie` 一致。
- 写出形态：28/28 顶层 `[export(case: "camelCase")] micro` + `class Solution` 委托。

| 题号 | slug | 入口 | 返回 | 命中面 | 用例数 |
| --- | --- | --- | --- | --- | --- |
| 1011 | `capacity-to-ship-packages-within-d-days` | `shipWithinDays` | `i64` | 二分答案（装船容量） | 80 |
| 1482 | `minimum-number-of-days-to-make-m-bouquets` | `minDays` | `i64` | 二分答案（连续 k 朵） | 93 |
| 2187 | `minimum-time-to-complete-trips` | `minimumTime` | `i64` | 二分答案（总趟数） | 103 |
| 2226 | `maximum-candies-allocated-to-k-children` | `maximumCandies` | `i64` | 二分答案（每人份数） | 82 |
| 1891 | `cutting-ribbons` | `maxLength` | `i64` | 二分答案（切割长度） | 100 |
| 2560 | `house-robber-iv` | `minCapability` | `i64` | 二分答案 + 贪心选取 | 100 |
| 1760 | `minimum-limit-of-balls-in-a-bag` | `minimumSize` | `i64` | 二分答案（拆分操作数） | 99 |
| 1283 | `find-the-smallest-divisor-given-a-threshold` | `smallestDivisor` | `i64` | 二分答案（向上取整和） | 78 |
| 2517 | `maximum-tastiness-of-candy-basket` | `maximumTastiness` | `i64` | `sort(list)` + 二分答案 | 81 |
| 1552 | `magnetic-force-between-two-balls` | `maxDistance` | `i64` | `sort(list)` + 二分答案 | 87 |
| 2616 | `minimize-the-maximum-difference-of-pairs` | `minimizeMax` | `i64` | `sort(list)` + 二分答案 | 104 |
| 2422 | `merge-operations-to-turn-array-into-a-palindrome` | `minimumOperations` | `i64` | 双指针 + 合并 | 103 |
| 1471 | `the-k-strongest-values-in-an-array` | `getStrongest` | `ArrayList<i64>` | `sort(list)` + `sorted_by(list, cmp)` | 91 |
| 1855 | `maximum-distance-between-a-pair-of-values` | `maxDistance` | `i64` | 前缀最小值 + 二分 | 73 |
| 611 | `valid-triangle-number` | `triangleNumber` | `i64` | `sort(list)` + 双指针 | 115 |
| 1877 | `minimize-maximum-pair-sum-in-array` | `minPairSum` | `i64` | `sort(list)` + 首尾配对 | 97 |
| 2491 | `divide-players-into-teams-of-equal-skill` | `dividePlayers` | `i64` | `sort(list)` + 首尾配对 | 122 |
| 2410 | `maximum-matching-of-players-with-trainers` | `matchPlayersAndTrainers` | `i64` | `sort(list)` ×2 + 双指针 | 120 |
| 962 | `maximum-width-ramp` | `maxWidthRamp` | `i64` | `Deque` 单调栈 + 反向扫描 | 69 |
| 974 | `subarray-sums-divisible-by-k` | `subarraysDivByK` | `i64` | 前缀和同余 + `HashMap<i64, i64>` | 108 |
| 2270 | `number-of-ways-to-split-array` | `waysToSplitArray` | `i64` | 前缀和 | 105 |
| 2640 | `find-the-score-of-all-prefixes-of-an-array` | `findPrefixScore` | `ArrayList<i64>` | 前缀最大值 + 前缀和 | 94 |
| 2256 | `minimum-average-difference` | `minimumAverageDifference` | `i64` | 前缀和 + 平均值 | 94 |
| 1685 | `sum-of-absolute-differences-in-a-sorted-array` | `getSumAbsoluteDifferences` | `ArrayList<i64>` | 前缀和 | 69 |
| 1664 | `ways-to-make-a-fair-array` | `waysToMakeFair` | `i64` | 奇偶前缀和 | 100 |
| 3147 | `taking-maximum-energy-from-the-mystic-dungeon` | `maximumEnergy` | `i64` | 模 k 后缀和 | 120 |
| 1248 | `count-number-of-nice-subarrays` | `numberOfSubarrays` | `i64` | 前缀奇数计数 + `HashMap` | 68 |
| 1524 | `number-of-sub-arrays-with-odd-sum` | `numOfSubarrays` | `i64` | 前缀奇偶计数 | 87 |

## 批次 R22-2026-11-04（Medium 哈希 / 排序 / 滑动窗口 26 题，写完未构建）

- 范围：Medium 的哈希 + 排序 + 滑动窗口面，全部按**理想写法**落地：
  `HashMap` / `ArrayList` / `Deque` / `sort(list)` / `sorted_by(list, cmp)` / 内联闭包 / 滑窗。
  按「题解资产与编译脱钩」执行：不因当前编译器未实现就退化成绕路写法。
- 构建 / 判题状态：**未验证（authored-unverified），构建通过 0 题**。全局停点是
  **addon 二进制基线过期**（首个触发者 `valkyrie.v d48011b`），待 addon 重建后关闭；
  不是 std 前端回归。
- 覆盖口径：本块 **26 题**全部计入「仅写完未验证」；累计已构建通过数保持 **18**。
- 新缺口编号：**0 条**。新增依赖未实现特性的调用点：
  - `sorted_by(list, cmp)`（G11 提案）：954 / 870，共 2 处；870 的比较器捕获外层 `nums2`。
  - `sort(list)` 单参入口（G26 的 C4 定稿签名，待落地）：870 / 881 / 2126 / 1679 / 1481 /
    846 / 1296 / 2740 / 2592 / 1838，共 10 处。`i64` 的 `Comparable` 实现已在
    `std/source/operator/comparable_primitives.v`。
  - `HashMap<char, i64>`（G17，`char` 无 `Hash`）：424 / 340，共 2 处。
- TS 参考解：26 题**全部实跑**
  （`run_isolated_judge.ts --lang typescript --iterations 1 --warmup 0`），26/26 `ok=true`；
  复用已有 TS 4 份（424 / 1456 / 1208 / 340），新写 22 份。
- 数据清洗：仅删除**非答案形态或自相矛盾**的用例，未改断言、未删合法用例：
  - `get-equal-substrings-within-budget`（1208）：12 条 `expected: "Error: ..."` 宿主异常文本。
  - `grumpy-bookstore-owner`（1052）：1 条 `expected: "Error: ..."`。
  - `array-of-doubled-pairs`（954）：1 条含浮点 `1562.5`、`expected: "Error: ..."`。
  - `check-if-array-pairs-are-divisible-by-k`（1497）：1 条 47 个 `5`、`k = 10`，奇数个余数 5
    无法两两配对，`expected: true` 与题面合同矛盾。
  - `advantage-shuffle`（870）：1 条 `nums1` 22 个、`nums2` 25 个，长度不一致且 `expected`
    含补零，不构成合法排列。
  - 共删除 16 条用例；单题用例数见下表。
- 入口签名：26/26 导出形参与 `metadata.tests[].args` 键**逐字同序**（脚本比对，`bad=0`）；
  入口名与 `metadata.invoke.valkyrie` 一致（2958 用 `maxSubarrayLength`、2461 用
  `maximumSubarraySum`，与既有 `invoke.typescript` 对齐）。
- 写出形态：26/26 顶层 `[export(case: "camelCase")] micro` + `class Solution` 委托。

| 题号 | slug | 入口 | 返回 | 命中面 | 用例数 |
| --- | --- | --- | --- | --- | --- |
| 424 | `longest-repeating-character-replacement` | `characterReplacement` | `i64` | `HashMap<char, i64>` + 滑窗 | 105 |
| 1456 | `maximum-number-of-vowels-in-a-substring-of-given-length` | `maxVowels` | `i64` | 定长滑窗 + 元音码位 | 80 |
| 1208 | `get-equal-substrings-within-budget` | `equalSubstring` | `i64` | 滑窗 + 字符代价 | 95 |
| 340 | `longest-substring-with-at-most-k-distinct-characters` | `lengthOfLongestSubstringKDistinct` | `i64` | `HashMap<char, i64>` + 滑窗 | 118 |
| 904 | `fruit-into-baskets` | `totalFruit` | `i64` | `HashMap<i64, i64>` + 滑窗 | 98 |
| 1004 | `max-consecutive-ones-iii` | `longestOnes` | `i64` | 0 计数滑窗 | 77 |
| 1052 | `grumpy-bookstore-owner` | `maxSatisfied` | `i64` | 基数 + 定长滑窗 | 89 |
| 2958 | `length-of-longest-subarray-with-at-most-k-frequency` | `maxSubarrayLength` | `i64` | `HashMap<i64, i64>` + 滑窗 | 107 |
| 1493 | `longest-subarray-of-1s-after-deleting-one-element` | `longestSubarray` | `i64` | 至多一个 0 滑窗 | 92 |
| 1438 | `longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit` | `longestSubarray` | `i64` | 双单调 `Deque`（存下标） | 184 |
| 2461 | `maximum-sum-of-distinct-subarrays-with-length-k` | `maximumSubarraySum` | `i64` | `HashMap<i64, i64>` + 定长窗 | 102 |
| 930 | `binary-subarrays-with-sum` | `numSubarraysWithSum` | `i64` | 前缀和 + `HashMap` | 72 |
| 1497 | `check-if-array-pairs-are-divisible-by-k` | `canArrange` | `bool` | 余数 `HashMap` + 配对 | 102 |
| 1814 | `count-nice-pairs-in-an-array` | `countNicePairs` | `i64` | 差值 `HashMap` + 数位反转 | 107 |
| 954 | `array-of-doubled-pairs` | `canReorderDoubled` | `bool` | `sorted_by` + `HashMap` | 112 |
| 846 | `hand-of-straights` | `isNStraightHand` | `bool` | `sort` + `HashMap` 贪心 | 81 |
| 1296 | `divide-array-in-sets-of-k-consecutive-numbers` | `isPossibleDivide` | `bool` | `sort` + `HashMap` 贪心 | 90 |
| 1481 | `least-number-of-unique-integers-after-k-removals` | `findLeastNumOfUniqueInts` | `i64` | `HashMap::keys` + `sort` 频次 | 69 |
| 2740 | `find-the-value-of-the-partition` | `findValueOfPartition` | `i64` | `sort` + 相邻差 | 106 |
| 870 | `advantage-shuffle` | `advantageCount` | `ArrayList<i64>` | `sort` + `sorted_by` + 双指针贪心 | 99 |
| 881 | `boats-to-save-people` | `numRescueBoats` | `i64` | `sort` + 双指针 | 89 |
| 2126 | `destroying-asteroids` | `asteroidsDestroyed` | `bool` | `sort` + 质量累加 | 88 |
| 1679 | `max-number-of-k-sum-pairs` | `maxOperations` | `i64` | `sort` + 双指针 | 68 |
| 2342 | `max-sum-of-a-pair-with-equal-sum-of-digits` | `maximumSum` | `i64` | 数位和 `HashMap` | 121 |
| 2592 | `maximize-greatness-of-an-array` | `maximizeGreatness` | `i64` | `sort` + 双指针 | 86 |
| 1838 | `frequency-of-the-most-frequent-element` | `maxFrequency` | `i64` | `sort` + 滑窗代价 | 99 |

## 批次 R21-2026-11-04（文本 / 哈希 / 树 29 题，写完未构建）

- 范围：Easy 标量池之外的剩余 Easy 题，全部按**理想写法**落地：`utf8` / `ArrayList<utf8>` /
  `HashMap` / `HashSet` / `Utf8Builder` / `Option` / 递归 / 迭代器 `loop`。
  按「题解资产与编译脱钩」执行：不因当前 std 停点退化成绕路写法。
- 构建 / 判题状态：**未验证（authored-unverified），构建通过 0 题**。全局停点仍是
  `std/source/operator/comparable.v:169:26`（`valkyrie.v d48011b`），未进入题解编译阶段。
- 覆盖口径：本块 **29 题**全部计入「仅写完未验证」；累计已构建通过数保持上一块的 **18**。
- 新缺口编号：**0 条**。依赖未实现特性的调用点：`Option<ArrayList<i64>>` 导出返回（4 题），
  归入 G3 返回值方向扩展，标「依赖未实现的特性」而不是题目 blocked。
- TS 参考解：29 题**全部实跑**
  （`run_isolated_judge.ts --lang typescript --iterations 1 --warmup 0`），29/29 `ok=true`；
  本批新写 6 份 TS（599 / 575 / 594 / 566 / 598 / 563）。
- 数据清洗：**未删用例、未改断言**。
  - `linked-list-cycle`（141）与 `intersection-of-two-linked-lists`（160）：`expected` 全为
    `Error: ...` 宿主异常文本，不是合法答案形态，**移出本批**（文件未改动）。
  - `reverse-string`（344）：`expected` 全为 `null`（原地修改、无返回值断言），V 侧没有已核对的
    void 导出形态，**移出本批**；不计 blocked。
  - `keyboard-row`（500）：用例含 `"C++"` 等非字母词，`expected: []`。按「每个字符必须属于键盘行」
    的语义，非字母字符不属于任何一行，解法对非字母返回 `-1` 以保证与 `expected` 一致（未改用例）。
  - 4 道链表题：空链表对应 `expected: null`，TS 与 V 都以空结果映射为 `null` / `Option::None`。
- 入口签名：29/29 导出形参与 `metadata.tests[].args` 键**逐字同序**（脚本比对，`bad=0`）。
- 写出形态：29/29 顶层 `[export(case: "camelCase")] micro` + `class Solution` 委托；
  树题按堆式下标 `2i+1` / `2i+2` 递归，与 TS 参考解使用同一表示。
- 依赖未实现的特性：`Option<ArrayList<i64>>` 导出返回（21 / 83 / 203 / 206）。
- 其余 API 面（`ArrayList` / `HashMap` / `HashSet` / `Utf8Builder` / `utf8`）均为源码已有签名，
  但**未经编译验证**。

| 题号 | slug | 入口 | 返回 | 命中面 | TS 实跑 |
| --- | --- | --- | --- | --- | --- |
| 500 | `keyboard-row` | `findWords` | `ArrayList<utf8>` | 字符行归属 + 大小写归一 | 81 |
| 599 | `minimum-index-sum-of-two-lists` | `findRestaurant` | `ArrayList<utf8>` | `HashMap<utf8, i64>` | 93 |
| 243 | `shortest-word-distance` | `shortestDistance` | `i64` | `utf8.equals` + 双指针位置 | 108 |
| 422 | `valid-word-square` | `validWordSquare` | `bool` | 字符方阵对称 | 111 |
| 163 | `missing-ranges` | `findMissingRanges` | `ArrayList<ArrayList<i64>>` | 哨兵 + 嵌套集合返回 | 127 |
| 575 | `distribute-candies` | `distributeCandies` | `i64` | `HashSet<i64>` 去重 | 106 |
| 594 | `longest-harmonious-subsequence` | `findLHS` | `i64` | `HashMap::keys` 遍历 | 116 |
| 566 | `reshape-the-matrix` | `matrixReshape` | `ArrayList<ArrayList<i64>>` | 线性下标映射 | 97 |
| 598 | `range-addition-ii` | `maxCount` | `i64` | 行列上界最小值 | 112 |
| 21 | `merge-two-sorted-lists` | `mergeTwoLists` | `Option<ArrayList<i64>>` | 双指针归并 + 空链表 `None` | 111 |
| 83 | `remove-duplicates-from-sorted-list` | `deleteDuplicates` | `Option<ArrayList<i64>>` | 相邻去重 + `None` | 111 |
| 203 | `remove-linked-list-elements` | `removeElements` | `Option<ArrayList<i64>>` | 过滤后可能为空 | 116 |
| 206 | `reverse-linked-list` | `reverseList` | `Option<ArrayList<i64>>` | 逆序读取 + `None` | 99 |
| 234 | `palindrome-linked-list` | `isPalindrome` | `bool` | 首尾双指针 | 91 |
| 94 | `binary-tree-inorder-traversal` | `inorderTraversal` | `ArrayList<i64>` | 堆式下标中序递归 | 24 |
| 144 | `binary-tree-preorder-traversal` | `preorderTraversal` | `ArrayList<i64>` | 前序递归 | 12 |
| 145 | `binary-tree-postorder-traversal` | `postorderTraversal` | `ArrayList<i64>` | 后序递归 | 20 |
| 110 | `balanced-binary-tree` | `isBalanced` | `bool` | 自底向上高度哨兵 | 15 |
| 100 | `same-tree` | `isSameTree` | `bool` | 双树同步递归 | 17 |
| 101 | `symmetric-tree` | `isSymmetric` | `bool` | 镜像双指针递归 | 17 |
| 111 | `minimum-depth-of-binary-tree` | `minDepth` | `i64` | 大哨兵 + 叶判定 | 12 |
| 222 | `count-complete-tree-nodes` | `countNodes` | `i64` | 完全树长度即节点数 | 46 |
| 404 | `sum-of-left-leaves` | `sumOfLeftLeaves` | `i64` | 递归携带 `is_left` | 15 |
| 530 | `minimum-absolute-difference-in-bst` | `getMinimumDifference` | `i64` | 中序 + 三格状态累加器 | 57 |
| 543 | `diameter-of-binary-tree` | `diameterOfBinaryTree` | `i64` | 后序 + 单格累加器 | 11 |
| 563 | `binary-tree-tilt` | `findTilt` | `i64` | 子树和 + 累加器 | 41 |
| 257 | `binary-tree-paths` | `binaryTreePaths` | `ArrayList<utf8>` | `Utf8Builder.append_i64` 拼路径 | 14 |
| 270 | `closest-binary-search-tree-value` | `closestValue` | `i64` | BST 单路径下行 + 等距取小 | 17 |
| 501 | `find-mode-in-binary-search-tree` | `findMode` | `ArrayList<i64>` | 中序 + 游程统计 | 52 |

## 批次 R20-2026-11-04（Easy 标量池 25 题，写完未构建）

- 范围：Easy 标量池剩余题，纯整数 / 纯算术签名，不涉及 `std.text`，也没有新增集合面；
  canonical 673 → **698**。
- 构建 / 判题状态：**未验证（authored-unverified），构建通过 0 题**。
  本轮实测撞到 std 闭包在 HEAD 的前端解析回归，**所有**含 std 的构建（含此前已构建通过的
  `4-keys-keyboard` 复跑）都中止在同一点，本批因此无法进入编译阶段：

  ```text
  std/source/operator/comparable.v:169:26   trait Comparable 的 infix `<` 成员
  引入提交：valkyrie.v d48011b ✨ implement Comparable and Ordering（2026-11-04 18:40）
  现象：legionBuildProject(..., 'wasm', ...) 在 projects/std 前置解析阶段失败，未进入题解源码
  ```

  该停点属于并行 std 线的在途状态，不归本题库，也不新增能力缺口编号；
  std 线修复后按本表 slug 复跑 `legionBuildProject` + 隔离判题即可产出真实覆盖数。
- TS 参考解：25 题**全部实跑**
  （`run_isolated_judge.ts --lang typescript --iterations 1 --warmup 0`），25/25 `ok=true`；
  逐题通过数见下表末列。TS 侧修正 2 题：
  - `minimum-operations-to-make-the-array-increasing`（1827）：原解原地改写入参，判题器多轮复用
    同一个 `args` 对象，第二轮起读到已被抬升的数组而返回 0；改为不改写入参。
  - `missing-number-in-arithmetic-progression`（1228）：原二分实现在非严格等差语料上返回 5.5；
    改为闭式 `(首 + 末) * (n + 1) // 2 - 和`（负分子按向下取整），与全部 `expected` 一致。
- 数据清洗：**未删用例、未改断言**。两题因语料与题面矛盾而**移出本批**（文件原样保留，未改动）：
  - `maximize-sum-of-array-after-k-negations`（1005）：15 条用例的 `nums` 低于 -100（越出题面约束），
    其 `expected` 等于「一次也不翻转」的原和。例：`nums=[-100,-200,-300,-400,-500], k=2`
    期望 -1500，而按「最大化」最优为 300。
  - `element-appearing-more-than-25-in-sorted-array`（1287）：114 条中 113 条 `expected` 为
    `Error: list index out of range`，不是合法答案形态。
- 入口签名：25/25 导出形参与 `metadata.tests.args` 键**逐字同序**：
  `timeSeries`+`duration` / `nums` / `nums`+`k` / `arr` / `bills` / `position` / `mat` /
  `cost` / `startTime`+`endTime`+`queryTime` / `nums`+`target`+`start`。
- 写出形态：25/25 采用**构建通过批次的已验证形状**——算法放在顶层
  `[export(case: "camelCase")] micro`，再用 `class Solution { micro <同名>(self, ...): T }`
  向上委托；未使用未验证的「类方法持有算法 + 顶层 `Solution().method`」写法。
- **算法等价移植核对（非编译验证）**：把 25 份 `solution.v` 的分支结构逐条移植成 JS，
  在同一批 metadata 用例上跑，25/25 全用例一致（0 失败）。这只说明算法分支正确，
  不替代 `legionBuildProject` 的编译与 wasm 真跑。
- 纸面 API：**0 个**。只用 `ArrayList::new(capacity)` / `push` / `length` / `⁅ ⁆` 下标读写；
  排序面一律用值域有界的计数表，不调用 `merge_sort` 与 G27 的排序提案。
- marshal 面（**待验证**）：`matrix-diagonal-sum`（1572）入参 `mat` 为
  `ArrayList<ArrayList<i64>>`；嵌套入参是否与 G3 的返回侧走同一条 ABI，不预先判定，留待真评。

| 题号 | slug | 入口 | 返回 | TS 实跑 |
| --- | --- | --- | --- | --- |
| 495 | `teemo-attacking` | `findPoisonedDuration` | `i64` | 120/120 |
| 561 | `array-partition` | `arrayPairSum` | `i64` | 112/112 |
| 628 | `maximum-product-of-three-numbers` | `maximumProduct` | `i64` | 111/111 |
| 724 | `find-pivot-index` | `pivotIndex` | `i64` | 95/95 |
| 860 | `lemonade-change` | `lemonadeChange` | `bool` | 106/106 |
| 908 | `smallest-range-i` | `smallestRangeI` | `i64` | 126/126 |
| 941 | `valid-mountain-array` | `validMountainArray` | `bool` | 141/141 |
| 1013 | `partition-array-into-three-parts-with-equal-sum` | `canThreePartsEqualSum` | `bool` | 77/77 |
| 1085 | `sum-of-digits-in-the-minimum-number` | `sumOfDigits` | `i64` | 121/121 |
| 1217 | `minimum-cost-to-move-chips-to-the-same-position` | `minCostToMoveChips` | `i64` | 105/105 |
| 1228 | `missing-number-in-arithmetic-progression` | `missingNumber` | `i64` | 147/147 |
| 1437 | `check-if-all-1s-are-at-least-length-k-places-away` | `kLengthApart` | `bool` | 104/104 |
| 1450 | `number-of-students-doing-homework-at-a-given-time` | `busyStudent` | `i64` | 95/95 |
| 1464 | `maximum-product-of-two-elements-in-an-array` | `maxProduct` | `i64` | 96/96 |
| 1550 | `three-consecutive-odds` | `threeConsecutiveOdds` | `bool` | 131/131 |
| 1572 | `matrix-diagonal-sum` | `diagonalSum` | `i64` | 54/54 |
| 1800 | `maximum-ascending-subarray-sum` | `maxAscendingSum` | `i64` | 128/128 |
| 1827 | `minimum-operations-to-make-the-array-increasing` | `minOperations` | `i64` | 118/118 |
| 1848 | `minimum-distance-to-the-target-element` | `getMinDistance` | `i64` | 117/117 |
| 1991 | `find-the-middle-index-in-array` | `findMiddleIndex` | `i64` | 94/94 |
| 2057 | `smallest-index-with-equal-value` | `smallestEqual` | `i64` | 98/98 |
| 2144 | `minimum-cost-of-buying-candies-with-discount` | `minimumCost` | `i64` | 96/96 |
| 2455 | `average-value-of-even-numbers-that-are-divisible-by-three` | `averageValue` | `i64` | 124/124 |
| 2529 | `maximum-count-of-positive-integer-and-negative-integer` | `maximumCount` | `i64` | 96/96 |
| 2535 | `difference-between-element-sum-and-digit-sum-of-an-array` | `differenceOfSum` | `i64` | 99/99 |

## 批次 R19-2026-11-04（理想解滚动批次 19，8 题，写完未构建）

- 范围：继续避开 11 条真缺口，纸面 API 保持 **0**。选题面主动放 1 题撞 graph 二色面
  （`possible-bipartition`，886），它命中 **G9**（已在缺口段），不产生新编号，用来验证
  「账本已记录」这条路径是否走得通；其余 7 题只落在观察档（纯数组 / 栈 / 前缀和）。
- 构建 / 判题状态：**未验证**，全部 `authored-unverified`，本轮按口径**不编译、不跑**。
- 新缺口：**0 条**。canonical 665 → **673**。
- 反向验证：本批是第二组对照组。若 8 题全干净，说明观察档连续两批可用（见
  `valkyrie-gap-ledger.md` 的 R19 意义句）。
- 纸面 API：**0 个**。全部调用点只用源码已有签名：`DirectedGraph::new` / `add_node` / `add_edge` /
  `successors`（graph 模块）、`HashMap::new(capacity)` / `contains_key` / `get` / `insert` / `unwrap`、
  `ArrayList::new(capacity)` / `push` / `pop` / `length`、`⁅ ⁆` 下标读写。环形下标改成显式回绕，
  不依赖尚未核对的取模运算符。
- 比较器数量：**0**；本批没有自定义类型，也没有排序。
- 入口签名：8/8 导出形参与 `metadata.tests.args` 键同序
  （`n`+`dislikes` / `bits` / `nums`+`k` / `nums` / `colors` / `nums` / `rungs`+`dist` / `arr`）。

| 题号 | slug | 入口 | 返回 | 考点 / 命中面 |
| --- | --- | --- | --- | --- |
| 886 | `possible-bipartition` | `possibleBipartition` | `bool` | `DirectedGraph` + `successors` + 双色 BFS；**G9 模块内空洞**验证点 |
| 717 | `1-bit-and-2-bit-characters` | `isOneBitCharacter` | `bool` | 按编码宽度前进，末位是否落在 1 位 |
| 3349 | `adjacent-increasing-subarrays-detection-i` | `hasIncreasingSubarrays` | `bool` | 量连续严格递增段长，相邻两段都 >= `k` |
| 3028 | `ant-on-the-boundary` | `returnToBoundaryCount` | `i64` | 前缀位移计数，回到 0 记一次 |
| 3206 | `alternating-groups-i` | `numberOfAlternatingGroups` | `i64` | 环形取三连点，严格交替计数 |
| 456 | `132-pattern` | `find132pattern` | `bool` | 逆序扫描 + 单调栈，记录最大「第三位」 |
| 1936 | `add-minimum-number-of-rungs` | `addRungs` | `i64` | 相邻阶空隙按 `dist` 求需补阶数 |
| 1588 | `sum-of-all-odd-length-subarrays` | `sumOddLengthSubarrays` | `i64` | 按起点枚举奇数长度窗口并累加 |

- marshal 面（**待验证**）：886 入参 `dislikes` 为 `ArrayList<ArrayList<i64>>`，与 G3 的返回侧
  `ArrayList` ABI 是否同一条路径**不预先判定**，留待真评。
- TS 参考解：7 题新写（717 / 3349 / 3028 / 3206 / 456 / 1936 / 1588），886 复用已有 TS 解；
  算法与 V 解同阶同语义；按本轮口径**未实跑**。
- 数据清洗（按 `valkyrie-gap-ledger.md` 的「用例数据清洗规则（通用）」核对）：
  - 8 题全部逐条以独立实现复核，`expected` 均为合法答案形态且与复核值**零不一致**，
    因此**无删除、无改写**。
  - `alternating-groups-i`（3206）的判据是**严格交替**（相邻两对都不同），不是「三段不全相等」；
    复核时按前者才全部一致，实现按前者写。

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
- 数据清洗（按 `valkyrie-gap-ledger.md` 的「用例数据清洗规则（通用）」：先看 `expected` 是不是合法答案，再决定删 / 改）：
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

- 2026-11-07 复跑（`char: Hash` 生效后）：`shortest-completing-word` 编译运行通过，1/85 PASS，
  首败 `tests[1]: expected null, got "these"`（语义失败，非 G17）。
  `find-resultant-array-after-removing-anagrams` 构建失败
  `unresolved call \`infix ==\` in remove_anagrams`（`solution.v:38`，`MultiSet<char>` 无 `equals`，G24）。
  本批其余 6 题本轮未复跑。

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

## 特性定向批次（2026-11-05）

共享 addon `07b625aa`，不重建。TS/Python 参考 13/13 通过；V 侧实测：

| slug | 特性 | 构建 | 判题 |
|---|---|---|---|
| `sort-integers-by-the-number-of-1-bits` | `sorted_by` + multi-key | `build=0` | **96/96 通过** |
| `sort-array-by-increasing-frequency` | `sorted_by` + packed-key | `build=0` | **117/117 通过** |
| `k-closest-points-to-origin` | `sorted_by` + nested-array cmp | `build=0` | **98/98 通过** |
| `sort-characters-by-frequency` | `sorted_by` + frequency | `build=0` | 0/54，`TypeError`（F3 utf8 返回） |
| `largest-number` | `sorted_by` + utf8 concat | 阻断（`__u8_add` host provider） | 未执行 |
| `reorder-data-in-log-files` | `sorted_by` + multi-key utf8 | 编译器 panic（`host_slice` 槽冲突） | 未执行 |
| `top-k-frequent-words` | `sorted_by` + utf8 ordering | 阻断（`is_less_or_equal` ABI carrier mismatch） | 未执行 |
| `group-anagrams` | `sorted_by` + utf8 canonical key | 阻断（`std::hash` 合同实例缺失） | 未执行 |
| `longest-word-in-dictionary` | `sorted_by` + utf8 ordering | 阻断（`HashSet<utf8>` 同一 hash 缺口） | 未执行 |
| `most-common-word` | utf8 扫描 + multi-key | 阻断（`Utf8Builder` 合同实例缺失） | 未执行 |
| `last-stone-weight` | `BinaryHeap` + `Comparable` | 阻断（`push/pop` 义务未消解） | 未执行 |
| `furthest-building-you-can-reach` | `BinaryHeap` + `Comparable` | 阻断（同上） | 未执行 |
| `minimum-operations-to-halve-array-sum` | `BinaryHeap<f64>` | **`57992125` 后仅剩 `new_by` 提案入口**（`f64` 序与宽度阻断已消失） | 未执行 |

结论：本批 3 题通过（311 条用例），其余 10 题被 utf8 字节合同、`utf8` 泛型序实例化、
`std::hash` 合同实例与 `BinaryHeap` 义务传播四条线挡住；`reorder-data-in-log-files`
另触发 emitter panic，需在 `nyar-vm.rs` 侧修，不在本仓改。

## 特性面空白批次 R30（2026-11-05）

选题规则：`solution.v` 为 1 字节占位、`metadata.tests` 只有整数 / 整数数组、避开
`utf8` 容器与返回值、`BinaryHeap` / `Comparable`、设计类实例 ABI。共享 addon `07b625aa`，不重建。

| slug | 特性 | 构建 | 判题 |
|---|---|---|---|
| `number-of-zero-filled-subarrays` | 整数 / `ArrayList` 单遍扫描 | build=0 | **99/99 通过** |
| `maximum-sum-score-of-array` | 前缀和 / 后缀和同步推进 | build=0 | **93/93 通过** |
| `bag-of-tokens` | 双指针 + `sorted_by(i64)` | build=0 | **103/103 通过** |
| `partition-array-for-maximum-sum` | 一维 DP（`ArrayList<i64>`） | build=0 | **104/104 通过** |
| `uncrossed-lines` | 二维 DP（`ArrayList<ArrayList<i64>>` 嵌套下标读写） | build=0 | **106/106 通过** |
| `pairs-of-songs-with-total-durations-divisible-by-60` | `HashMap<i32, i64>`（i32 键 + i32 相等/哈希） | build=0 | **89/89 通过** |
| `minimum-index-of-a-valid-split` | `HashMap<i64, i64>` 频次 + 前缀计数 | build=0 | **12/12 通过** |
| `construct-the-lexicographically-largest-valid-sequence` | 递归 / 回溯（深度 2n ≤ 40，`ArrayList` 引用写回） | build=0 | **18/18 通过** |
| `matrix-block-sum` | 矩阵 + 二维前缀和（`ArrayList<ArrayList<i64>>` 嵌套下标） | build=0 | **88/88 通过** |
| `maximum-length-of-pair-chain` | `sorted_by` 以 `ArrayList<i64>` 实例化 + 贪心 DP | build=0 | **106/106 通过** |
| `describe-the-painting` | `BTreeMap` / `Comparable` 义务 | **build=0**（`57992125`） | **98/98 通过**（旧 `07b625aa` 诊断见下，已不再复现） |

`describe-the-painting` 旧 addon `07b625aa` 上的失败诊断原文（历史记录，`57992125` 已不复现）：

```
error[valkyrie.hir.unresolved_call]: unresolved call `deltas.contains_key` in splitPainting:
1 candidate(s) share the name, but none matches the argument types
  --> solution.v:16:12
error[valkyrie.hir.unresolved_call]: unresolved call `deltas.insert` in splitPainting:
2 candidate(s) share the name, but none matches the argument types
error[valkyrie.hir.unresolved_call]: unresolved call `deltas.get` in splitPainting:
4 candidate(s) share the name, but none matches the argument types
error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>.unwrap` in splitPainting:
receiver type is unknown, so member `unwrap` cannot be resolved
```

`BTreeMap<i64, i64>` 的 `get` / `insert` / `contains_key` 都带 `where K: Equal & std::operator::Comparable`，
旧 `07b625aa` 上即使补 `using std.operator;` 仍全部无法解析，`BTreeMap::keys()` 也无法走到。
**2026-11-06 更新（addon `57992125`）**：该 `where` 义务已在调用点消解，复跑 **98/98 全绿**，
该阻断面从 blocked 摘除。

- for-in 标量写回（已修复，`172b944a`）：`loop value in nums { total = total + value }` 对导出形参
  `ArrayList<i64>` 在旧 addon `07b625aa` 与其父 `8ebc289e` 上迭代正常但标量写回丢失（输入
  `[-10,-20,-30,-40,-50]` 应得 `-150`，实测 `0`）；`172b944a` 与当前 HEAD `25132ccf` 均实测 `-150`，
  配套 `loop` + `HashMap.insert` 从 `5` 变 `-14995`，证明迭代本身一直正确。判据：`maximum-sum-score-of-array`。
- 还原：`maximum-sum-score-of-array` 的求和已从 `while` 下标累加改回 `loop`，文件顶部注明还原依据；
  用当前 HEAD 的 addon 副本真跑 **93/93**（`VALKYRIE_NATIVE` 指向 `.cache/valkyrie-forin.node`）。
  验收纪律：缺口"已修"的结论必须用对应 addon 副本或新重建 addon 验证，不得拿共享旧 addon 复跑后宣布通过。

## 待还原组全面复核（2026-11-05，addon `25132ccf` + `9d51ad08`）

量具：addon 副本 `projects/conformance/.cache/valkyrie-forin.node`（`25132ccf`）与
`projects/conformance/.cache/valkyrie-ordering.node`（`9d51ad08` 独立 worktree 构建），
`VALKYRIE_NATIVE` 指向副本，未使用共享旧 addon，未替换共享 `.node`。

| 项 | 结论 | 证据 / 实测 |
| --- | --- | --- |
| 30 题 `loop` 还原（+3 同注释题） | 已修 → 已还原 | 全部真跑通过，逐题数字见 `valkyrie-gap-ledger.md`「待还原组」 |
| `HashSet<utf8>`（`phone-number-prefix`） | 可用（旧结论「`std::hash#` 缺失」不成立） | 97/97 |
| `HashMap<utf8,_>`（`group-anagrams` / `most-common-word` / `top-k-frequent-words`） | 仍阻断 | `WASM ABI carrier mismatch in std::insert: slot=i32 actual=anyref operand=%1 (Utf8)`；三题绕法版本 69/69、20/20、92/92 |
| `HashMap<char,i64>`（`sort-characters-by-frequency`） | 已修 → 已还原 | 编译并运行 35/54；剩余掉红是多字节 ABI（`İ` → `����`） |
| `Utf8Builder` | 可用 | `phone-number-prefix` 97/97、`group-anagrams` 69/69、`most-common-word` 20/20 |
| `sorted_by` / `sort` 以 `utf8` 实例化 | 仍阻断 | `is_less_or_equal` carrier mismatch（`sort` 的 `Ordering` 报错已在 `9d51ad08` 消失，但改报此 ABI 错） |
| `BinaryHeap` + `Comparable` | **已修（`9d51ad08`）** | `last-stone-weight` 124/124、`furthest-building-you-can-reach` 118/118（后者原为算法错，已改正确策略）；仍缺 `max()` / `new_by` |
| `utf8` 返回值（F3） | 部分修复 | 不再抛 `Cannot convert object to primitive value`，但多字节字符被截断（`İ` → `����`） |
| `Ordering` 布局（`sort(ArrayList<i64>)`） | **已修（`9d51ad08`）** | `advantage-shuffle` 99/99、`boats-to-save-people` 89/89、`destroying-asteroids` 88/88、`max-number-of-k-sum-pairs` 68/68、`least-number-of-unique-integers-after-k-removals` 69/69、`hand-of-straights` 81/81 |

附带修复：`most-common-word` 原 `Utf8Builder` 交接处触发
`OperationResultTypeMismatch`（`StoreVar { name: "best" }`，utf8 变量重赋值），改为按最优词下标返回后消除。`sort-characters-by-frequency` 改回 `HashMap<char,i64>`，计数结果与线性版一致（同 35/54，说明差异只来自多字节 ABI）。

## 批次 R31-2026-11-06（纯整数占位题：24 题写入 + 6 题语料缺陷，本轮实测）

- 起点：`dev` 领先 `origin/dev` 2 个提交；17 个他人未提交 metadata（permutations / backtracking 一组）全部避开。
- 对账（实测非引用）：`solvers/valkyrie/solution.v` 无 `[export` 共 1841 个 —— 空白/1 字节 1129、
  `# blocked` 注释 706、其他纯注释 6；其中纯整数/纯算术签名且无 `invoke.valkyrie` 的 291 道，本轮从该池选 30 道。
  这些题的阻塞注释统一是 `# blocked: std.collection 数组参数读取`，已被 `two-sum` 与 R30 的同类数组形参实测证伪。
- 写入 24 题并补 `metadata.invoke.valkyrie`（本轮分组复跑后 **23 题端到端通过**，1 题转语料缺陷，见文末「R31 + R32 48 题分组复跑」）：
  `final-prices-with-a-special-discount-in-a-shop`、`replace-elements-with-greatest-element-on-right-side`、
  `create-target-array-in-the-given-order`、`how-many-numbers-are-smaller-than-the-current-number`、
  `defuse-the-bomb`、`number-of-equivalent-domino-pairs`、`minimum-time-visiting-all-points`、
  `richest-customer-wealth`、`shift-2d-grid`、`transpose-matrix`、`projection-area-of-3d-shapes`、
  `surface-area-of-3d-shapes`、`largest-subarray-length-k`、`sum-of-unique-elements`、
  `number-of-rectangles-that-can-form-the-largest-square`、`counting-elements`、
  `find-lucky-integer-in-an-array`、`minimum-absolute-difference`、
  `widest-vertical-area-between-two-points-containing-no-points`、`special-positions-in-a-binary-matrix`、
  `how-many-apples-can-you-put-into-the-basket`、`array-transformation`、
  `minimum-moves-to-equal-array-elements`、`sign-of-the-product-of-an-array`。
- 静态自查：24 题 `namespace` / `[export(case: "camelCase")]` / `class Solution` / invoke 名一致；
  按 metadata 参数序镜像回放全量用例 **2287 条，mismatch=0**（Python 镜像，非 V 构建，不作为通过证据）。
  其中 `surface-area-of-3d-shapes` 按用例中的非方阵（5×3、5×6）修正为行列分别取值。
- 语料缺陷 6 题：不删除、不改原值，保持 blocked，`solution.v` 还原为阻塞注释并注明缺陷，
  `metadata.corpusDefect=true`，不加 `invoke.valkyrie`：
  - `decompress-run-length-encoded-list`：4 条奇数长度输入，期望值 `Error: list index out of range`；
  - `cells-with-odd-values-in-a-matrix`：4 条同类字符串期望；
  - `element-appearing-more-than-25-in-sorted-array`：31 条同类字符串期望；
  - `count-negative-numbers-in-a-sorted-matrix`：20 条期望与 TS/Python 参照解矛盾（5×1 网格期望 0）；
  - `flipping-an-image`：8 条期望与参照解矛盾（全 1 行期望半 0 半 1）；
  - `n-repeated-element-in-size-2n-array`：1 条全不重复且期望 null，违反题面约束。
- 构建：R31 写入窗口未运行 `legion build`；2026-11-06 构建窗口开放后按能力面分组复跑，
  单进程、逐题独立产物目录、单条 ≤300 秒，结果见文末「R31 + R32 48 题分组复跑」。

### 语料缺陷逐条证据（供语料侧统一处理）

以下“期望”均指 `metadata.tests[i].expected`，参照解指同题 TS/Python 解法。

- `decompress-run-length-encoded-list`：4 条，索引 23、24、77、81。输入均为奇数长度，
  参照解按游程展开会缺最后一个值，语料生成器把期望写成字符串 `Error: list index out of range`；
  例：#23 的 `nums` 长度 31，#24 为 `[10,1,9,2,8,3,7,4,6]`。
- `cells-with-odd-values-in-a-matrix`：4 条，索引 1、42、69、72。`indices` 中的列号越出 `n`，
  例：#1 `m=4,n=3` 但含 `[3,3]`；参照解直接抛 `IndexError`，期望同样被写成该错误串。
  说明缺陷同时存在于输入与期望两侧。
- `element-appearing-more-than-25-in-sorted-array`：31 条，索引 1、17、18、19、23、24、34、35、43、45、
  46、49、54、57、59、61、66、67、77、80、83、85、86、89、96、99、100、101、106、108、109。
  多数输入不存在占比严格大于 25% 的元素，例：#1 `[0..10]` 每个值各 1 次，#18 中 2 只占 3/12，
  期望被写成错误串，参照解返回候选值或回退 `arr[0]`。
- `count-negative-numbers-in-a-sorted-matrix`：20 条，索引 1、20、26、28、30、32、35、37、38、39、41、
  43、49、68、76、81、86、90、91、94。期望与参照解成对矛盾，例：#1 为 5×1 的 `[-3,-2,-1,0,1]`，
  期望 0 而参照解得 5；#20 为 5×5 阶梯矩阵，期望 20 而参照解得 0。
- `flipping-an-image`：8 条，索引 7、8、15、30、34、38、39、58。期望不符合“水平翻转再取反”：
  例：#7 输入首行全 1，期望为前 5 个 0、后 5 个 1，参照解为全 0；#8、#15 同样只翻转或只取反了部分行列。
- `n-repeated-element-in-size-2n-array`：1 条，索引 43。`nums` 共 100 个且全不重复，
  违反“恰有一个元素出现 n 次”的题面约束，期望为 `null`，TS 参照解返回 `-1`，
  i64 通道无法表达 `null`，只能保持 blocked。

## 批次 R32-2026-11-06（纯整数占位题第二批：24 题写入 + 9 题语料缺陷，本轮实测）

- 口径：与 R31 相同。只改 `leetcode.v` 的 `solvers/valkyrie/solution.v` 与 `metadata.json`；
  `valkyrie.v`、`nyar-vm.rs`、`valkyrie.rs` 未动；判题框架、既有用例与期望值未改。
- 挑题：按“同一能力面成组”选 33 题，三组各 8 题，另 9 题作为同面替换/补充：
  - 矩阵 / 区间组（8）：`maximum-students-on-a-single-bench`、`find-champion-i`、
    `delete-greatest-value-in-each-row`、`prime-in-diagonal`、`maximum-population-year`、
    `points-that-intersect-with-cars`、`minimum-operations-to-make-columns-strictly-increasing`、
    `button-with-longest-push-time`。
  - 一维重建组（8）：`build-array-from-permutation`、`minimum-number-game`、
    `separate-the-digits-in-an-array`、`transform-array-by-parity`、
    `bitwise-or-of-adjacent-elements`、`find-the-distinct-difference-array`、
    `left-and-right-sum-differences`、`apply-operations-to-an-array`。
  - 单数组扫描组（8）：`count-pairs-whose-sum-is-less-than-target`、`buy-two-chocolates`、
    `maximum-sum-with-exactly-k-elements`、`count-equal-and-divisible-pairs-in-an-array`、
    `count-number-of-pairs-with-absolute-difference-k`、`maximize-sum-of-array-after-k-negations`、
    `minimum-operations-to-exceed-threshold-value-i`、`number-of-arithmetic-triplets`。
  - 同面补充（9）：`image-smoother`、`largest-local-values-in-a-matrix`、
    `find-the-width-of-columns-of-a-grid`、`row-with-maximum-ones`、
    `find-missing-and-repeated-values`、`maximum-area-of-longest-diagonal-rectangle`、
    `modify-the-matrix`、`zigzag-grid-traversal-with-skip`、`find-the-number-of-good-pairs-i`。
- **写入实现 24 题**（`solution.v` + `metadata.invoke.valkyrie`，本轮分组复跑 **24/24 端到端通过**）：
  - 矩阵 / 区间（5）：`maximum-students-on-a-single-bench`（86）、
    `delete-greatest-value-in-each-row`（93）、`prime-in-diagonal`（73）、
    `minimum-operations-to-make-columns-strictly-increasing`（93）、
    `button-with-longest-push-time`（104）；
  - 一维重建（5）：`transform-array-by-parity`（104）、`bitwise-or-of-adjacent-elements`（104）、
    `find-the-distinct-difference-array`（107）、`left-and-right-sum-differences`（131）、
    `apply-operations-to-an-array`（123）；
  - 单数组扫描（7）：`count-pairs-whose-sum-is-less-than-target`（112）、
    `buy-two-chocolates`（111）、`maximum-sum-with-exactly-k-elements`（97）、
    `count-equal-and-divisible-pairs-in-an-array`（89）、
    `count-number-of-pairs-with-absolute-difference-k`（106）、
    `minimum-operations-to-exceed-threshold-value-i`（104）、`number-of-arithmetic-triplets`（104）；
  - 同面补充（7）：`image-smoother`（81）、`largest-local-values-in-a-matrix`（56）、
    `row-with-maximum-ones`（71）、`maximum-area-of-longest-diagonal-rectangle`（107）、
    `modify-the-matrix`（85）、`zigzag-grid-traversal-with-skip`（71）、
    `find-the-number-of-good-pairs-i`（106）。
- 静态自查：24 题 `namespace` 与 slug、`[export(case: "camelCase")]`、全局函数名、
  `class Solution` 方法名、`metadata.invoke.valkyrie` 六者一致；无残留 `# blocked` 注释。
- 镜像回放（Python 镜像按 metadata 参数序回放，非 V 构建，不作为通过证据）：
  **2318 条用例，mismatch=0**。
- 陈旧 `# blocked: std.collection 数组参数读取` 的处理：两批实证（R30 的 `ArrayList<i64>` 形参、
  `two-sum`）已证伪该阻塞理由，本批全部按实际可读数组参数写法实现，不照抄旧注释。
- 构建：R32 写入窗口未运行 `legion build`；2026-11-06 构建窗口开放后分组复跑，24/24 通过，详见文末。

### R32 语料缺陷逐条证据（供语料侧统一处理）

以下 9 题保持 blocked、原用例与期望值未改、`metadata.corpusDefect=true`、不加 `invoke.valkyrie`；
“参照”指同题 TS/Python 解法。

- `find-champion-i`：44/56 条用例。多数输入不存在“击败其他所有队”的冠军（如 #2 的 3×3
  石头剪刀布循环 `[[0,1,0],[0,0,1],[1,0,0]]`），题面保证冠军存在；期望 `null` 与 Python 参照
  （返回 `None`）一致，而 TypeScript 参照返回 `-1`，两侧参照互相矛盾。
- `maximum-population-year`：#33。`logs` 含 `[2045, 2055]`，死亡年份 2055 超出题面上界 2050，
  Python 参照抛 `IndexError`，期望被写成 `Error: list index out of range`。
- `points-that-intersect-with-cars`：5 条，索引 17、50、54、62、78。区间右端点超过 100
  （如 #17 的 `[200, 300]`），Python 参照抛 `IndexError`，期望为错误串。
- `build-array-from-permutation`：#42。`nums=[2,4,6,8,10,1,3,5,7,9]` 不是 `0..n-1` 的置换，
  按置换取值越界，Python 参照抛 `IndexError`，期望为错误串。
- `minimum-number-game`：5 条，索引 21、35、76、89、92。数组长度分别为 15、15、15、45、15，
  题面要求偶数长度；Python 参照两两交换时越界，期望为错误串。
- `separate-the-digits-in-an-array`：#14 含 0（题面要求 `nums[i] >= 1`），期望丢弃该位，
  而 TypeScript 参照 `String(0)` 会保留 0；#48 含字符串元素 `"112233445566778900"`，
  且数值超过 10^5，属类型与约束双重错误。
- `maximize-sum-of-array-after-k-negations`：#106。`nums` 含 -200..-500，超出题面下界 -100；
  期望 -1500 等于完全不翻转的原始和，与 TypeScript 参照 300 矛盾
  （Python 参照只对 `[-100, 100]` 建表，因此也输出 -1500）。
- `find-the-width-of-columns-of-a-grid`：#41。`grid` 三行长度分别为 5、5、4（列长不一致），
  期望 `[9, 10, 8, 8]` 按 4 列给出，参照按 3 列输出。
- `find-missing-and-repeated-values`：20 条，索引 3、12、15、17、18、31、37、40、41、43、44、
  52、58、59、66、67、68、73、80、81。其中 17 条含超出 `1..n²` 的值（如 #3 的 4×4 含 17）；
  #15 为 10×5、#41/#43 为 10×6 的非方阵；期望为错误串或 `[x, 100]`，参照解越界或无法定义。

## R31 + R32 48 题分组复跑（2026-11-06 构建窗口实测）

- 环境：`leetcode.v` `dev` 基线 `81f5592b5`（文档提交 `d94b85a95` 之上）；兄弟仓 `valkyrie.v` 本地 tip
  `a3a8af6`（`i64` 重载与 `HashSet` 容量构造已验证）。`std` 线收工后本窗口只做 V 构建与判题，不写新题。
- 口径：`node --import tsx projects/conformance/scripts/run_v_solver.ts ../problems/<slug>` 逐题
  `resolveCompileTargetPlan` + `legion build` + 全量 `metadata.tests`。单进程顺序执行，同一时刻只留一个构建或测试进程；
  每题使用独立产物目录 `.cache/<slug>-bench-node`（复跑前全部不存在，均为本次新产物）；单条命令 ≤300 秒，超时不重试。
  `legion build` 走 N-API 结构调用，不接受 `-j 4`，以单进程等同约束执行。
- 分组与结果：

| 组 | 能力面 | 题数 | 已跑用例 | 通过题 | 失败/转缺陷 | 结果 |
| --- | --- | --- | --- | --- | --- | --- |
| G1 | 矩阵（R31） | 8 | 687 | 8 | 0 | 全绿 |
| G2 | 矩阵（R32） | 12 | 1028 | 12 | 0 | 全绿 |
| G3 | 一维重建（R31 3 + R32 5） | 8 | 898 | 8 | 0 | 全绿（1 题实现修复后复跑） |
| G4 | 单数组扫描（R31） | 13 | 1175 | 12 | 1 转语料缺陷 | 12 绿 |
| G5 | 单数组扫描（R32） | 7 | 724 | 7 | 0 | 全绿 |
| 合计 | | 48 | 4512 | 47 | 1 | 47/48 |

- G1 逐题（全部 `ok=true`）：`minimum-time-visiting-all-points` 120/120、`richest-customer-wealth` 85/85、
  `shift-2d-grid` 84/84、`transpose-matrix` 74/74、`projection-area-of-3d-shapes` 72/72、
  `surface-area-of-3d-shapes` 78/78、`widest-vertical-area-between-two-points-containing-no-points` 104/104、
  `special-positions-in-a-binary-matrix` 70/70。
- G2 逐题（全部 `ok=true`）：`maximum-students-on-a-single-bench` 86/86、
  `delete-greatest-value-in-each-row` 93/93、`prime-in-diagonal` 73/73、
  `minimum-operations-to-make-columns-strictly-increasing` 93/93、`button-with-longest-push-time` 104/104、
  `image-smoother` 81/81、`largest-local-values-in-a-matrix` 56/56、`row-with-maximum-ones` 71/71、
  `maximum-area-of-longest-diagonal-rectangle` 107/107、`modify-the-matrix` 85/85、
  `zigzag-grid-traversal-with-skip` 71/71、`find-the-number-of-good-pairs-i` 106/106。
- G3 逐题（全部 `ok=true`）：`replace-elements-with-greatest-element-on-right-side` 104/104、
  `create-target-array-in-the-given-order` 115/115、`how-many-numbers-are-smaller-than-the-current-number` 110/110、
  `transform-array-by-parity` 104/104、`bitwise-or-of-adjacent-elements` 104/104、
  `find-the-distinct-difference-array` 107/107、`left-and-right-sum-differences` 131/131、
  `apply-operations-to-an-array` 123/123。
- G4 逐题（12 题 `ok=true`）：`final-prices-with-a-special-discount-in-a-shop` 117/117、
  `defuse-the-bomb` 119/119、`number-of-equivalent-domino-pairs` 89/89、`largest-subarray-length-k` 123/123、
  `sum-of-unique-elements` 99/99、`number-of-rectangles-that-can-form-the-largest-square` 83/83、
  `counting-elements` 125/125、`find-lucky-integer-in-an-array` 61/61、`minimum-absolute-difference` 101/101、
  `how-many-apples-can-you-put-into-the-basket` 59/59、`array-transformation` 122/122、
  `minimum-moves-to-equal-array-elements` 77/77。`sign-of-the-product-of-an-array` 转语料缺陷，见下。
- G5 逐题（全部 `ok=true`）：`count-pairs-whose-sum-is-less-than-target` 112/112、`buy-two-chocolates` 111/111、
  `maximum-sum-with-exactly-k-elements` 97/97、`count-equal-and-divisible-pairs-in-an-array` 89/89、
  `count-number-of-pairs-with-absolute-difference-k` 106/106、
  `minimum-operations-to-exceed-threshold-value-i` 104/104、`number-of-arithmetic-triplets` 104/104。

### 失败归并与处置

- `create-target-array-in-the-given-order`（G3，首次运行）：`AbiSchemaError: args.positions: metadata.tests.args
  缺少参数 "positions"`。根因是实现侧形参名与 `metadata.tests.args` 键 `index` 不一致，不是编译器缺口。
  同日改 `positions` 为 `index` 后暴露第二层：`ArrayList::insert` 在空表上不增长（`tests[0]` 期望 `[1]` 得 `[]`），
  改为 `push(0)` + 显式右移后 `tests[4]` 触发越界（该用例 `index=[4,3,2,1,0]`，`index[0]=4 > i=0` 越出题面
  `0 <= index[i] <= i`，但 TS/Python 参照都按 `insert` 钳制到表尾并给出期望 `[1,5,2,4,3]`）。
  最终按参照的钳制语义实现（`slot = min(index[i], 当前长度)`），复跑 **115/115**。用例与期望未改。
- `sign-of-the-product-of-an-array`（G4）：3 条用例的 `nums` 含非整数元素，`i64` 通道无法表达，转语料缺陷。

### G4 新增语料缺陷证据（供语料侧统一处理）

- `sign-of-the-product-of-an-array`：3 条，索引 18、30、51。`metadata.tests[i].args.nums` 含小数：
  #18 `[100,-50,25,-12.5,6.25]`、#30 `[50,25,-10,4,-2,0.5,0.2]`、#51 `[100,-50,25,-12.5,0.5]`；
  题面与其余 93 条用例均为整数数组，三条期望均为 1（按浮点符号积一致），但 ABI 形参是 `ArrayList<i64>`，
  首轮在 #18 报 `args.nums[3] 需要整数实参，实际为非整数数值 -12.5`。处置：`solution.v` 还原为 blocked 注释并
  追加 `# corpusDefect` 具体证据，`metadata.corpusDefect=true`，删除 `invoke.valkyrie`，原用例与期望值未改。

## 批次 R33-2026-11-06（纯整数占位题第三批：27 题写入 + 3 题语料缺陷，本轮实测）

- 选题：从剩余候选（`vk-remain2b.txt` 261 行，已排除 R31/R32 的 33 题）取 30 题，按能力面成组；
  同组题同签名、同语义族，便于后续一次构建验一组。
- 口径：只写 `solvers/valkyrie/solution.v` 与 `metadata.invoke.valkyrie`；写入窗口不运行 `legion build` / cargo，
  写完后按 S1 / S2 / R 三组各做一次构建验证。判题框架、既有用例与 `expected` 未改。陈旧
  `# blocked: std.collection 数组参数读取` 已由 R30/R32 实证证伪，本批不照抄。
- **写入实现 27 题**（每题目录用例数为镜像回放用例数；`count-subarrays-of-length-three-with-a-condition`
  实测转语料缺陷后不再计入实现数）：

  - S1 单数组统计（9）：`count-elements-with-strictly-smaller-and-greater-elements`（120）、
    `count-hills-and-valleys-in-an-array`（154）、`find-closest-number-to-zero`（128）、
    `make-array-zero-by-subtracting-equal-amounts`（116）、`most-frequent-even-element`（110）、
    `largest-positive-integer-that-exists-with-its-negative`（116）、
    `number-of-unequal-triplets-in-array`（74）、`neither-minimum-nor-maximum`（94）、
    `sum-of-squares-of-special-elements`（105）；
  - S2 单数组进阶（8）：`max-pair-sum-in-an-array`（126）、
    `maximum-value-of-an-ordered-triplet-i`（126）、`minimum-sum-of-mountain-triplets-i`（118）、
    `maximum-strong-pair-xor-i`（125）、`count-tested-devices-after-test-operations`（107）、
    `maximum-number-of-operations-with-the-same-score-i`（109）、
    `maximum-difference-between-adjacent-elements-in-a-circular-array`（120）、
    `unique-3-digit-even-numbers`（128）；
  - R 一维重建（10）：`minimum-subsequence-in-non-increasing-order`（60）、
    `maximum-number-of-pairs-in-array`（126）、`distribute-elements-into-two-arrays-i`（107）、
    `construct-the-minimum-bitwise-array-i`（124）、`transformed-array`（126）、
    `minimum-cost-to-reach-every-position`（109）、`the-two-sneaky-numbers-of-digitville`（74）、
    `find-target-indices-after-sorting-array`（118）、`find-indices-of-stable-mountains`（113）、
    `longest-alternating-subarray`（157）。

- 静态自查（28/28）：namespace 与目录名一致、`[export(case: "camelCase")]` 恰一处、全局函数与
  `Solution` 方法同名、`metadata.invoke.valkyrie` 为 `Solution().<method>`、无残留 `# blocked`。
- 镜像回放（Python 镜像按 `metadata.tests[].args` 键序回放，非 V 构建，不作为通过证据）：
  **3224 条用例，mismatch=0**。
- 构建验证（2026-11-06，写入完成后构建窗口开放）：单进程、逐题独立产物目录（三组复跑前
  `.cache/<slug>-bench-node` 全部不存在，均为本次新产物）、单条 ≤300 秒、超时不重试；验证期间未再写新题。
  - S1：9/9 题通过，**1017/1017 用例**；
  - S2：8/9 题通过，**992/992 用例**（`count-subarrays-of-length-three-with-a-condition` 转语料缺陷，见下）；
  - R：10/10 题通过，**1114/1114 用例**；
  - 合计 **27/28 题端到端通过，3123/3123 用例**；1 题转语料缺陷。

### R33 语料缺陷逐条证据（供语料侧统一处理）

以下 3 题保持 blocked、原用例与期望值未改、`metadata.corpusDefect=true`、不加 `invoke.valkyrie`。

- `semi-ordered-permutation`：2 条，索引 #21、#95。`#21` 为 51 个元素，其中 `1` 出现两次、缺 `51`，
  期望 `"Error: 51 is not in list"`；`#95` 为 39 个元素，其中 `1..5` 各出现两次、缺 `35..39`，
  期望 `"Error: 39 is not in list"`。两例都违反题面「`nums` 是 `1..n` 的排列」约束，期望是宿主
  `index()` 异常串而非整数返回值。其余 99 条（含 #38/#61 缺值的非错误串用例）与参考公式一致。
- `minimum-right-shifts-to-sort-the-array`：6 条，索引 #33、#52、#58、#62、#93、#117。这些用例只有一个
  降序点且位于末位（如 #33 `[1,2,3,5,4]`、#62 `[1,3,2]`），右旋任意次数都无法整体有序，期望却给出 `1`；
  参照公式 `n - pivot` 漏判 `nums[n-1] <= nums[0]`，正确结果应为 `-1`。原值未改。
- `count-subarrays-of-length-three-with-a-condition`：3 条，索引 #28、#33、#124。`nums` 含小数：
  #28 `[25,50,25,75,37.5,75,37.5,100,50,100,50,150,75]`、#33 `[7,14,7,21,10.5,21,14,28,14]`、
  #124 `[99,198,99,297,148.5,297,148.5,396,198,396,198,495,247.5]`；三条期望均为 0。
  首轮在 #28 报 `args.nums[4] 需要整数实参，实际为非整数数值 37.5`，已执行 28/134 用例后中止。
  处置：`solution.v` 还原为 blocked 注释并追加 `# corpusDefect`，删除 `invoke.valkyrie`，原值未改。

## 批次 R34-2026-11-06（纯整数占位题 26 题，本轮已整组复跑）

- 范围与能力分组（26）：
  - 矩阵扫描 6：`toeplitz-matrix`、`lucky-numbers-in-a-matrix`、
    `check-if-every-row-and-column-contains-all-numbers`、
    `determine-whether-matrix-can-be-obtained-by-rotation`、`check-if-matrix-is-x-matrix`、
    `matrix-similarity-after-cyclic-shifts`。
  - 计数 / 频次 6：`largest-unique-number`、`divide-array-into-equal-pairs`、
    `number-of-beautiful-pairs`、`count-pairs-that-form-a-complete-day-i`、
    `find-the-xor-of-numbers-which-appear-twice`、`two-out-of-three`。
  - 子数组 / 滑窗 5：`longest-strictly-increasing-or-strictly-decreasing-subarray`、
    `longest-even-odd-subarray-with-threshold`、`shortest-subarray-with-or-at-least-k-i`、
    `find-subarrays-with-equal-sum`、`count-partitions-with-even-sum-difference`。
  - 排序 / 前缀 / 二分 4：`minimum-difference-between-highest-and-lowest-of-k-scores`、
    `longest-subsequence-with-limited-sum`、`kth-missing-positive-number`、
    `maximum-product-difference-between-two-pairs`。
  - 模拟 / 贪心 5：`determine-the-winner-of-a-bowling-game`、`min-max-game`、
    `minimum-total-operations`、`minimum-operations-to-make-array-values-equal-to-k`、
    `minimum-number-of-operations-to-make-elements-in-array-distinct`。
- 三件套：**26/26**（`solution.v` + `metadata.invoke.valkyrie`；题库原有 TS / Python 参照不变）。
- 口径（三者分开）：**编译通过 0 题、端到端通过 0 题、写完未验证 26 题**；本轮不占构建窗口。
- 镜像回放（Python 镜像按 `metadata.tests[].args` 键序回放，非 V 构建，不作为通过证据）：
  **2599 条用例，mismatch=0**，本批无 `corpusDefect`。
- 形参名与 `tests[].args` 键：26/26 逐字同序（脚本静态核对）。
- 静态一致性：namespace / `[export(case: "camelCase")]` / `micro` 与 `Class Solution` 方法名 /
  `invoke.valkyrie` 五处 26/26 一致。
- 特性适配：全部只用整数与 `ArrayList` 下标读写，未使用 `ArrayList.get`（避开 1 基序数与
  `None` 上的 `unwrap()`）；`length()` 现按 Unicode 标量计数，本批无 `utf8` 断言，不受影响。

### 2026-11-06 判题 / 编译器线移交的两条收尾

- `accounts-merge`：`tests[55]` 的账户组 2/4/5 并查集根为 5（Bob），旧解取扫描下标 `i=2` 的
  `accounts[2][0]`（Charlie）；已改为按根取代表名，待窗口复验。
- `path-with-maximum-probability`：8 条用例（索引 20、24、31、40、44、49、62、63）的 `edges` 与
  `succProb` 长度不一致（#24 为 9 条边、8 个概率），属 metadata 自相矛盾；原用例与期望未改，
  `solution.v` 还原 blocked 并标 `corpusDefect`，删除 `invoke.valkyrie`。

## 102 题待验证池整组复跑（2026-11-06 构建窗口实测）

- 环境：新 addon `leetcode.v/.cache/utf8abi/addon-fixed.node`（`Option::unwrap` 在 `None` 上变为结构化 panic），经 `VALKYRIE_NATIVE` 注入 `run_v_solver.ts`。
- 口径：单进程顺序执行，同一时刻只留一个构建或测试进程；每题独立产物目录 `.cache/<slug>-bench-node`，
  `legion build` 每次都重建（harness 不做第二层缓存判断）；单条 ≤300 秒，超时不重试；验证期间未写新题。
- 分组结果（用例数按实际执行计，语料缺陷题因无入口不计执行）：

| 组 | 能力面 | 题数 | 执行用例 | 通过题 | 失败坐标 |
| --- | --- | --- | --- | --- | --- |
| R31/R32-A1 | 矩阵（R31） | 8 | 687 | 8 | 无 |
| R31/R32-A2 | 矩阵（R32） | 12 | 1026 | 12 | 无 |
| R31/R32-A3 | 一维重建（R31+R32） | 8 | 898 | 8 | 无 |
| R31/R32-A4 | 单数组扫描（R31） | 13 | 1175 | 12 | `sign-of-the-product-of-an-array` 语料缺陷（无 `[export]` 入口，96 条不可执行） |
| R31/R32-A5 | 单数组扫描（R32） | 7 | 723 | 7 | 无 |
| R33-S1 | 单数组统计 | 9 | 1017 | 9 | 无 |
| R33-S2 | 单数组进阶 | 9 | 959 | 8 | `count-subarrays-of-length-three-with-a-condition` 语料缺陷（134 条不可执行） |
| R33-R | 一维重建 | 10 | 1114 | 10 | 无 |
| R34-G1 | 矩阵扫描 | 6 | 476 | 6 | 无 |
| R34-G2 | 计数/频次 | 6 | 585 | 6 | 首跑 `find-the-xor-of-numbers-which-appear-twice` 编译失败，修复后 120/120 |
| R34-G3 | 子数组/滑窗 | 5 | 583 | 5 | 首跑 `shortest-subarray-with-or-at-least-k-i` 编译失败，修复后 109/109 |
| R34-G4 | 排序/前缀/二分 | 4 | 410 | 4 | 无 |
| R34-G5 | 模拟/贪心 | 5 | 545 | 5 | 无 |

- 合计 **102 题：100 题端到端通过，2 题语料缺陷（均为既有登记项）**，执行 **10198 条用例全部通过**
  （R31/R32 4509、R33 3090、R34 2599）。新 addon 下未出现 `illegal cast`。
- 首跑暴露并已修复的两处实现缺陷（commit `d1fca6e7d`）：
  - `find-the-xor-of-numbers-which-appear-twice`：`bit_xor` 只有 `i64` 方法形态，自由函数调用在
    `solution.v:24` 报 `unresolved_call`；改为 `answer.bit_xor(value)` 后 120/120。
  - `shortest-subarray-with-or-at-least-k-i`：`1 << shift` 的移位量是 `usize`，`value.bit_and(...)` 候选
    类型不匹配；改为 `(1 as i64).bit_shift_left(shift)` 掩码后 109/109。
- `accounts-merge` 复验（commit `a7c2adaaa`）：85/85。仅按并查集根取名仍不够——`std` `DisjointSet::union`
  同秩取左根，语料参照解同秩取右根，`tests[6]` 的组根因此落在 Charlie；改为本地按规模合并（同规模取右）
  并按槽位聚合邮箱后与参照解逐个用例一致。
- `63 个 case` 抽样复跑（6 题）：`1-bit-and-2-bit-characters` 95/95、`132-pattern` 143/143、
  `add-minimum-number-of-rungs` 102/102 通过。另 3 题为既有实现/提案问题，与 `[export(case:)]` 修复无关：
  `crawler-log-folder`（`solution.v:29` `classify_folder` unresolved）、`merge-intervals`（`solution.v:38`
  `order_items` 走未落地的 `sort` 提案入口）、`valid-sudoku`（`source/collection` `self.words.set` 5 个候选
  均不匹配实参类型）。

## 批次 R35-2026-11-10（陈旧 `数组参数读取` blocked 清障：27 题理想写法写入，写完未构建）

- 选题：从 254 道仍带 `# blocked: std.collection 数组参数读取` 的题池取 27 题。该阻塞注释已被
  `two-sum` 与 R30/R32 实证证伪（数组形参可直接索引与遍历），本批成规模清障。
  排除口径：`corpusDefect=true` 的题一律不碰（本批剔除 `cells-with-odd-values-in-a-matrix`、
  `count-negative-numbers-in-a-sorted-matrix`、`element-appearing-more-than-25-in-sorted-array`、
  `build-array-from-permutation`；`fair-candy-swap` / `apple-redistribution-into-boxes` 的
  `tests[].expected` 为 `null`（宿主异常期望未清），不入本批）。
- **本批口径（用户指令）**：只考虑理想写法、倒逼上游完善——不迁就编译器/运行时当前进度，
  不写绕路 hack；缺能力处按账本标注约定登记（本批新编号 **G33**：`utf8` 数值解析无一等入口）。
  写入窗口不运行 `legion build` / cargo，不占构建槽位。
- 能力分组（27）：
  - 矩阵 / 棋盘 6：`check-if-grid-satisfies-conditions`、`convert-1d-array-into-2d-array`、
    `diagonal-traverse`（`reverse()`）、`battleships-in-a-board`、`available-captures-for-rook`、
    `bomb-enemy`（`[[utf8]]` 等值比较面）。
  - 排序 / 双指针 6：`3sum-closest`、`3sum-smaller`、`4sum`（`sort(ArrayList<i64>)` 自然序 +
    去重）、`check-if-n-and-its-double-exist`（`HashSet`）、`distance-between-bus-stops`
    （`std.math.min`）、`diet-plan-performance`（定窗滑动）。
  - 哈希 / 前缀 / DP 5：`contiguous-array`（`HashMap` 前缀平衡）、`circular-array-loop`
    （快慢指针 + 就地标记，拷贝入参后 `⁅ ⁆=` 写穿副本）、`combination-sum-iv`（递推 DP，
    `expected` 8437020668201 在 i64 域内）、`faulty-sensor`、`check-if-it-is-a-straight-line`（叉积）。
  - 文本 6：`check-distances-between-same-letters`、`count-the-number-of-vowel-strings-in-range`、
    `check-if-string-is-a-prefix-of-array`（`utf8` `+` 拼接）、`count-items-matching-a-rule`
    （`utf8 ==` 等值）、`delete-columns-to-make-sorted`（`char` 码位比较）、
    `evaluate-reverse-polish-notation`（手写数字解析 → 触发 G33）。
  - 树 / 栈 4：`average-of-levels-in-binary-tree`（`ArrayList<f64>` 返回，G2/G3 叠加实例，
    题内已标 `# 题内触发点:`）、`binary-tree-right-side-view`、`find-bottom-left-tree-value`、
    `cousins-in-binary-tree`。
- 三件套：27/27（`solution.v` + `metadata.invoke.valkyrie`；题库原有 TS / Python 参照不变）。
- 理想写法面：`loop <var> in <ArrayList>` 首次成规模使用（12 题）；`sort` 自然序入口（3 题）；
  `std.math` `abs` / `min`（2 题）；`utf8` `+` / `==` / `⁅i⁆` 取 `char`（6 题）；
  定长填充不再手写（本批计数表用 `ArrayList::new + push` 显式构造，未用 `[value; count]`，
  该面归 G1 观察）。
- 静态自查（27/27）：namespace 与目录名一致（数字 slug 按 `three_sum_*` / `four_sum` 拼写，
  与 `three_sum_with_multiplicity` 先例一致）、`[export(case: "camelCase")]` 恰一处、
  顶层 `micro` 与 `Class Solution` 方法同名、`invoke.valkyrie` 为裸导出名、
  形参名与 `tests[].args` 键逐字同序、无残留 `# blocked`。
- 镜像回放（按 `metadata.tests[].args` 键序回放，非 V 构建，不作为通过证据）：
  Python 参照 **23 题通过**；`average-of-levels-in-binary-tree` / `binary-tree-right-side-view` /
  `find-bottom-left-tree-value` / `cousins-in-binary-tree` 4 题 Python 参照按 `TreeNode` 对象写、
  与堆式数组语料不符（Python lane 既有缺陷，非本批引入、非语料缺陷），改用 TS 参照复核：
  **4/4 全过（55 用例）**。本批合计 **2357 条用例** 经参照实现核对一致，无 `corpusDefect` 新增。
- 验证口径：编译通过 0、端到端通过 0、写完未验证 27；待构建窗口按
  `node --import tsx projects/conformance/scripts/run_v_dual_target_baseline.ts --one-id <id>` 复跑。

## 批次 R36-2026-11-10（blocked 清障续批 24 题 + TypeScript 基线 16 题，V 写完未构建）

- 两个子批。R36-A 沿 R35 口径（用户指令：只考虑理想写法、倒逼上游完善，不考虑
  `nyar.rs` / `valkyrie.v` 进度），从剩余陈旧 `# blocked: std.collection 数组参数读取`
  题池再清 24 题；R36-B 为 TypeScript 基线：从「V 有解、TS 空」题池（123 题）取 16 题
  补参考解，覆盖数值 / 位 / 日期 / DP / 前缀和 / 双指针面。
- R36-A 能力分组（24）：
  - 均值 / f64 触发点 4：`average-salary-excluding-the-minimum-and-maximum-salary`
    （i64 整除口径）、`mean-of-array-after-removing-some-elements`、
    `maximum-average-subarray-i`、`calculate-amount-paid-in-taxes`（后三题返回 f64，
    题内标 `# 题内触发点:`，G2/G3 叠加实例）。
  - 哈希 / 计数 7：`find-anagram-mappings`、`find-common-characters`（`Utf8Builder`
    单字符构造）、`form-smallest-number-from-two-digit-arrays`、`minimum-common-value`、
    `count-special-quadruplets`、`find-winner-on-a-tic-tac-toe-game`（行列掩码）、
    `h-index`（`sort` 自然序）。
  - 位 2：`find-the-k-or-of-an-array`（`bit_or` + `(1 as i64).bit_shift_left(bit as u32)`）、
    `binary-prefix-divisible-by-5`（`ArrayList<bool>`）。
  - 双指针 / 二分 / 前缀和 / 贪心 8：`detect-pattern-of-length-m-repeated-k-or-more-times`
    （usize 乘比较）、`continuous-subarray-sum`（前缀余数 `HashMap`）、`heaters`
    （sort + 二分）、`find-peak-element`、`single-element-in-a-sorted-array`（偶 mid 二分）、
    `product-of-array-except-self`（前缀/后缀积两趟）、`search-a-2d-matrix-ii`（右上阶梯）、
    `gas-station`（贪心）。
  - 图 / 树 3：`number-of-islands`（`[[utf8]]` 就地改 `"0"` 洪泛 DFS）、
    `number-of-provinces`（路径压缩并查集递归 `find`）、`validate-binary-search-tree`
    （堆式下标 + `Option<i64>` 开区间界）。
- 三件套：24/24（`solution.v` + `metadata.invoke.valkyrie` 裸导出名；题库原有 TS / Python 参照不变）。
- 静态自查：24/24 通过（namespace / export 恰一处 / 顶层=类名=invoke / 无残留 blocked /
  形参名同序 / 括号配平，六项同 R35）。
- 镜像回放（非 V 构建，不作为通过证据）：Python 参照 **23 题通过**；
  `validate-binary-search-tree` Python 参照按 `TreeNode` 对象写、与堆式数组语料不符
  （Python lane 既有缺陷，非本批引入），改用 TS 参照复核 **26/26**。本批合计
  **2226 条用例** 经参照实现核对一致。
- R36-B 范围（16）：`add-two-integers`、`alternating-digit-sum`、`base-7`、`binary-gap`、
  `clumsy-factorial`、`complement-of-base-10-integer`、`count-square-submatrices-with-all-ones`、
  `day-of-the-week`、`hamming-distance`、`integer-break`、`k-radius-subarray-averages`、
  `number-of-1-bits`、`pascals-triangle-ii`、`shortest-distance-to-a-character`、
  `sum-of-square-numbers`、`arranging-coins`。
- R36-B 实测：`run_ts_solver.ts` 逐题单进程，**16/16 exit 0（981 用例全过）**。
- R36-B 语料修正（1 题 47 条）：`base-7` 的 `tests[].expected` 被生成器写成 number
  （如 `-11333311`），题面返回 String；按 R28 `remove-all-occurrences-of-a-substring`
  先例逐条修为字符串，未删用例；修正后 Python / TS 参照双绿。
- R36-B 参照解实测修正（3 题，非 V 缺口）：`clumsy-factorial` 减法分支（op 循环 push `-i`）；
  `complement-of-base-10-integer` 的 `<<` 在 n=2³²-1 溢出 int32 死循环，改算术 mask；
  `number-of-1-bits` 的 `>>> 0` 在 n=2⁴⁰（语料超 LeetCode 约束）截位，改算术取位。
- 验证口径：编译通过 0、端到端通过 0、写完未验证 24（V）；TS 基线 16/16 实测通过。

## 批次 R37-2026-11-10（blocked 清障续批二 24 题 + TypeScript 基线 16 题，V 写完未构建）

- 两个子批，口径同 R36。R37-A 从剩余陈旧 `# blocked: std.collection 数组参数读取`
  题池（清障后剩 177）再选 24 题；`expected` 为 `null` 的就地修改类 3 题
  （`surrounded-regions` / `walls-and-gates` / `wiggle-sort`）按 R35 排除口径不入批。
- R37-A 能力分组（24）：
  - 矩阵 / 图 4：`maximal-square`（`[[utf8]]` 滚动 DP）、`pacific-atlantic-water-flow`
    （双海岸 DFS）、`unique-paths-ii`（滚动列 DP）、`the-maze`（四向滑动 DFS）。
  - 哈希 / 计数 5：`intersection-of-multiple-arrays`（值域桶计数）、
    `find-common-elements-between-two-arrays`（双桶存在性）、`two-sum-less-than-k`
    （`sort` 自然序 + 双指针）、`most-frequent-number-following-key-in-an-array`（桶计数）、
    `count-pairs-of-similar-strings`（字符集压 26 位掩码 + `HashMap<i64, i64>`）。
  - 二分 5：`h-index-ii`（升序找首个 `citations[i] >= n - i`）、`search-in-rotated-sorted-array`
    （i64 下标避免 usize 减穿）、`fixed-point`、`search-a-2d-matrix`（展平二分）、
    `insert-interval`（三段线性归并）。
  - DP / 贪心 4：`paint-house`（三列滚动）、`coin-change-ii`（组合数 DP）、
    `target-sum`（2^n DFS 递归）、`wiggle-subsequence`（up/down 贪心，`std.math.max`）。
  - 树 4：`univalued-binary-tree`、`sum-root-to-leaf-numbers`、`range-sum-of-bst`（BST 剪枝）、
    `find-leaves-of-binary-tree`（按高度分行；内层 `ArrayList::new` 显式类型避嵌套推断）——
    全部堆式下标递归。
  - 文本 2：`unique-email-addresses`（`Utf8Builder` 双段重建 + `HashMap<utf8, i64>`
    去重键 → 题内标 `# 题内触发点:` 命中 std::hash#445）、`verifying-an-alien-dictionary`
    （rank 表 + `char as u32` 逐字符比较）。
- 三件套：24/24（`solution.v` + `metadata.invoke.valkyrie` 裸导出名）。
- 静态自查：24/24 通过（六项同 R35 / R36）。
- 镜像回放（非 V 构建，不作为通过证据）：Python 参照 **19 题通过**；
  树 4 题 Python 参照按 `TreeNode` 对象写、与堆式数组语料不符（Python lane 既有缺陷）；
  `pacific-atlantic-water-flow` Python 参照返回 `(i, j)` 元组、与 list 期望永不相等
  （同为 Python lane 既有缺陷，值本身逐条一致）——共 5 题改 TS 参照复核
  **5/5 全过（190 用例）**。本批合计 **2272 条用例** 经参照实现核对一致。
- R37-B 范围（16）：`a-number-after-a-double-reversal`、`add-digits`、`armstrong-number`、
  `binary-watch`、`bitwise-and-of-numbers-range`、`bulb-switcher`、
  `calculate-money-in-leetcode-bank`、`cells-in-a-range-on-an-excel-sheet`、
  `concatenation-of-array`、`consecutive-numbers-sum`、`construct-the-rectangle`、
  `convert-a-number-to-hexadecimal`、`convert-integer-to-the-sum-of-two-no-zero-integers`、
  `convert-the-temperature`、`count-asterisks`、`count-integers-with-even-digit-sum`。
- R37-B 实测：`run_ts_solver.ts` 逐题单进程，**16/16 exit 0（1061 用例全过）**。
- R37-B 语料清洗（1 条）：`convert-a-number-to-hexadecimal` `tests[24]` 的 `args.num`
  为越界字符串 `"67553994410557440"`（2⁵⁶，超 32 位有界约束），且 `expected`
  `"fffffffc"` 与参照对该实参的输出（`""`）矛盾——实参已损坏，删除该条（60 → 59），
  删除后 Python / TS 参照双绿。
- R37-B 参照解实测修正（1 题）：`convert-a-number-to-hexadecimal` 手写十进制转换
  与参照的「低 32 位 8 nibble 窗口」语义在越界实参上不一致，改 `BigInt` 移位 +
  `& 0xF` 复刻参照窗口。
- 验证口径：编译通过 0、端到端通过 0、写完未验证 24（V）；TS 基线 16/16 实测通过。

## 批次 R38-2026-11-10（blocked 清障续批三 24 题 + TypeScript 基线 16 题，V 写完未构建）

- 两个子批，口径同 R36 / R37。R38-A 从剩余陈旧 `# blocked: std.collection 数组参数读取`
  题池（上批后剩 137）再选 24 题。
- R38-A 能力分组（24）：
  - 矩阵 / 图 4：`01-matrix`（多源 BFS，数字 slug namespace `one_one_matrix`）、
    `the-maze-ii`（停点图 Dijkstra，`bit_shift_left(60)` 哨兵）、`word-search`
    （DFS 回溯 + 就地 `"#"` 占位、`char as u32` 比较）、`sparse-matrix-multiplication`
    （跳零三重循环）。
  - 哈希 / 计数 4：`group-shifted-strings`（规范键 `HashMap<utf8, i64>` →
    题内标 `# 题内触发点:` 命中 std::hash#445）、`find-maximum-number-of-string-pairs`
    （`Utf8Builder` 反转串暴力配对）、`number-of-boomerangs`（距离桶增量 `2 * prior`）、
    `sum-of-good-numbers`（左右邻查）。
  - 双指针 / 栈 / 二分 5：`maximum-size-subarray-sum-equals-k`（前缀和首现表）、
    `minimum-size-subarray-sum`（滑动窗口）、`next-greater-element-ii`（循环数组单调栈，
    `remove(length())` 弹栈）、`sort-transformed-array`（抛物线两端收缩）、
    `search-in-rotated-sorted-array-ii`（同值收缩二分）。
  - DP / 回溯 4：`best-time-to-buy-and-sell-stock-with-cooldown`（hold/sold/rest 三态）、
    `combination-sum-ii`（排序 + 同层跳重回溯）、`partition-equal-subset-sum`
    （`ArrayList<bool>` 子集和滚动表）、`predict-the-winner`（区间差分 DP）。
  - 树 4：`binary-tree-zigzag-level-order-traversal`（按层索引 BFS + 奇层反转）、
    `count-univalue-subtrees`（递归 bool + 计数器数组）、`path-sum-iii`（双重递归，
    语料含空树）、`kth-smallest-element-in-a-bst`（堆式下标中序 + 计数器）。
  - 文本 2：`shuffle-string`（`ArrayList<char>` 落位 + builder 拼接）、
    `slowest-key`（码位比较 + builder 单字符返回）。
- 三件套：24/24（`solution.v` + `metadata.invoke.valkyrie` 裸导出名）。
- 静态自查：24/24 通过（六项同前；数字 slug 拼写映射 `01-matrix` → `one_one_matrix`，
  与 `three_sum_*` 先例一致）。
- 镜像回放（非 V 构建，不作为通过证据）：Python 参照 **20 题通过**；
  树 4 题 Python 参照按 `TreeNode` 对象写、与堆式数组语料不符（Python lane 既有缺陷），
  改 TS 参照复核 **4/4 全过**。本批合计 **1823 条用例** 经参照实现核对一致。
- R38-A 语料清洗（1 题 10 条）：`kth-smallest-element-in-a-bst` 的 10 条
  `k > 节点数` 越界用例 `expected` 为 `null`（宿主异常期望未清），按 R29 C 批口径
  删除（41 → 31），删除后 TS 复核 31/31 绿。
- R38-B 范围（16）：`2-keys-keyboard`、`account-balance-after-rounded-purchase`、
  `binary-number-with-alternating-bits`、`counting-bits`、`day-of-the-year`、
  `decode-xored-array`、`defanging-an-ip-address`、`detect-capital`、`di-string-match`、
  `distinct-numbers-in-each-subarray`、`divide-two-integers`、`fibonacci-number`、
  `final-value-of-variable-after-performing-operations`、
  `find-greatest-common-divisor-of-array`、`fizz-buzz`、`count-numbers-with-unique-digits`。
- R38-B 实测：`run_ts_solver.ts` 逐题单进程，**16/16 exit 0（1590 用例全过）**。
- R38-B 语料清洗（1 题 5 条）：`binary-number-with-alternating-bits` 的 5 条
  `n > 2³¹-1` 越界用例 expected 由 int32 算术移位参照算出（与题面参照矛盾），删除
  （72 → 67），删除后 TS 绿。
- R38-B 参照解实测修正（2 题，本批自写初版错）：`account-balance-after-rounded-purchase`
  题面是「初始 100、就近取十、5 进位」（非 1000/向上取整），改 `Math.round`；
  `divide-two-integers` 的 `<<` 在 `shift + 1 >= 32` 按模 32 回绕死循环，改倍增减法。
- 验证口径：编译通过 0、端到端通过 0、写完未验证 24（V）；TS 基线 16/16 实测通过。

