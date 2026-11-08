# Valkyrie 语言探针缺口账

`leetcode.v` 是探针仓：`projects/conformance/scenes/**` 只写理想 V 写法，不迁就当前编译器或标准库。
场景跑红时**不改场景源码**，只在本账登记缺口。编译器侧工单仍以
[`valkyrie-gap-ledger.md`](./valkyrie-gap-ledger.md) 为准，本账只记语言、标准库与运行时语义能力缺口。

## 运行

```text
pnpm --filter @leetcode/conformance scenes              # 全部场景
pnpm --filter @leetcode/conformance scenes text-indexing # 指定场景
```

每个场景目录包含 `legion.von`（wasm 目标）、`scene.v`（理想实现 + `[export]` 入口）、`scene.json`
（导出名与期望值）。`expected: "trap"` 表示该出口必须可观察地拒绝而不是返回数值。

## 场景与用例

当前：52 场景 / 122 用例，78 过、44 红（构建拒绝 40、运行断言失败 4）。这些数字与全表状态只对下面这套工具链成立。

### 状态出处

| 角色 | 本次取值 | 证据 |
| --- | --- | --- |
| 编译器原生 binding | `@nyar/valkyrie` `0.0.22` 的 `valkyrie.win32-x64-msvc.node`，sha256 `19AB115A412BD2D27A3A03D6B1B2644AA1BD1590EE507CEB0032049C89E7ECBE`，短标识 `c19AB115A` | 文件 mtime `2026-11-07 07:37:30 (+08)`。原生产物未内嵌源码 rev |
| 编译器源码边界 | 构建时刻之前最后一条提交 `350d49c3`（2026-11-07 05:46:58），之后第一条 `d7c65e6b`（07:37:59），实际 rev 落在这两者之间，无法自证。**`nyar-vm.rs` 当前 HEAD `d4ad6ce4`（2026-11-08 16:20:26）晚于该 binding，不能当作本次编译器 rev** | `git log --before/--after` 与 binding mtime |
| 标准库 | `valkyrie.v@9016ae49e609131d876745710dd9b5cb6522856b`，短标识 `s9016ae49` | `git rev-parse HEAD`，`std` 子目录无改动 |
| 装配与运行器 | `@nyar/valkyrie` JS 层 dist 重建于 `2026-11-08 16:14:56`，探针运行器 `scripts/run_v_scenes.ts` | dist 文件 mtime |
| 本次运行 | `pnpm --filter @leetcode/conformance scenes`，输出 `scenes: 52, cases: 122, pass: 78, fail: 44`，退出码 `1`（有红） | 终端输出，2026-11-08 |

口径：

- 全表每行状态都带 `rev` 列（`c19AB115A` / `s9016ae49`），表示该结论只在上述 binding 与 std 组合下成立。
- 历史状态若没有同时记录编译器 binding 与 std rev，一律记为「未验证」，不得作为已关闭依据。`8596d3daa` 记下的 10 条「已关闭」即属此类。
- 更换 binding 或 std rev 后必须整表重跑再改状态，不能沿用旧结论。
- **可复现性**：原生 binding 不自报 rev，`.node` 里也没有嵌入 git 哈希，编译器源码 rev 只能给未知区间
  `(350d49c3, d7c65e6b)`。因此任何跨运行比较只有在 **binding sha256 与 std rev 完全一致**时才可比；
  否则一律标注「不可比」，不得把红翻绿或绿翻红归因于某次编译器修复。
- 源码构建可行性：`Cargo.lock` 锁定的 Oak 依赖在本地 cargo 缓存中已存在
  （`oak.rs-4b2f523b24aa45b8/180d238`），理论上可离线重建 binding；但重建会覆盖共享的
  `platforms/valkyrie-win32-x64/lib/*.node`，本次未执行。要做到完全可复现，需在独立 target 下构建，
  并把新 binding 的 sha256 追加进本表。

| 场景 | 用例 | 状态 | rev | 覆盖点 |
| --- | --- | --- | --- | --- |
| `text-indexing` | 7 | 6 过 / 1 红（运行值错） | c19AB115A / s9016ae49 | 码位长度、BMP 与星平面字符、按码位切片、Cardinal 取字符、`index_of`、`split` |
| `generic-iteration` | 2 | 过 | c19AB115A / s9016ae49 | 泛型容器 + `micro(T) -> i64` 权重函数、`ArrayList<ArrayList<i64>>` |
| `iterator-pipeline` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | `filter` 后 `map` 再 `collect`、适配器后接 `fold` |
| `iterator-map-collect` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | 单个 `map` 适配器后接 `collect` |
| `iterator-terminal` | 3 | 红（构建拒绝） | c19AB115A / s9016ae49 | 适配器后接 `fold` / `any` / `all`、`enumerate().count()` |
| `higher-order` | 2 | 过 | c19AB115A / s9016ae49 | 命名函数作为比较器与一元函数值 |
| `sorting-comparison` | 2 | 过 | c19AB115A / s9016ae49 | `sort` 类型合同入口、`quick_sort` 显式比较器 |
| `type-ordering` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | `structure` + `imply Equal/Comparable` 后 `sort`、稳定性 |
| `type-ordering-player` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | 同上，用仓库既有 solver 的 `Player` 写法复核 |
| `bit-operations` | 6 | 过 | c19AB115A / s9016ae49 | `bit_and` / `bit_or` / `bit_xor`、`count_ones`、`leading_zeros` / `trailing_zeros`、移位、异或交换 |
| `pattern-matching` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | 扁平带载荷 `unite`（零元/单字段/双字段）与 `match` |
| `option-match` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | `Option` 的 `Some` / `None` 匹配（`None` 分支为空） |
| `option-match-nonempty` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | 对照：`None` 分支非空，排除空块因素 |
| `recursive-union` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | 递归带载荷 `unite`（`Expr`）与递归求值 |
| `result-errors` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | `Result<i64, <自定义 unite>>` 的 `unwrap_or` / `unwrap_or_else` |
| `result-fold` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | 同上，`fold` 两个方向处理函数 |
| `result-match` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | `Result` / `Option` 三态匹配 |
| `result-plain` | 1 | 过 | c19AB115A / s9016ae49 | 对照：`Result<i64, i64>` 的 `fold` |
| `result-utf8-payload` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | `Result<i64, utf8>` 的构造与 `fold` |
| `integer-boundaries` | 6 | 5 过 / 1 红（运行值错） | c19AB115A / s9016ae49 | i64 边界位模式、i64→i32 截断、除法向零截断、i32 边界提升、加法越界 |
| `struct-literal` | 1 | 过 | c19AB115A / s9016ae49 | 具名字段结构体字面量 |
| `lru-cache` | 2 | 过 | c19AB115A / s9016ae49 | `HashMap<i64, i64>` 槽位 + 平行数组双向链表、`⁅i⁆` 读与 `set_cardinal` 写、容量淘汰 |
| `union-find` | 2 | 过 | c19AB115A / s9016ae49 | 父指针 + 按深度合并 + 两遍路径压缩、`mut` 结构体跨辅助函数传递 |
| `trie` | 2 | 过 | c19AB115A / s9016ae49 | `utf8` 字符迭代建 Trie、`节点 × 26` 扁平子表、前缀计数与精确计数 |
| `min-heap-kth` | 2 | 过 | c19AB115A / s9016ae49 | 数组最小堆的 `sift_up` / `sift_down`、大小为 k 的堆求第 k 大 |
| `interval-merge` | 2 | 过 | c19AB115A / s9016ae49 | `structure` 区间 + `quick_sort` 显式比较器 + 相邻区间合并 |
| `segment-tree` | 2 | 过 | c19AB115A / s9016ae49 | 递归 `mut` 结构体建树、区间求和查询、单点更新 |
| `kmp` | 2 | 过 | c19AB115A / s9016ae49 | 码位序列上的前缀函数、首次出现下标、重叠出现计数 |
| `topological-sort` | 2 | 过 | c19AB115A / s9016ae49 | `ArrayList<ArrayList<i64>>` 邻接表原地追加、Kahn 队列、有环返回 -1 |
| `dijkstra` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | `BinaryHeap<Frontier>` + `new_by` 比较器、弛豫与陈旧项跳过（L11） |
| `backtracking-in-place` | 2 | 过 | c19AB115A / s9016ae49 | 棋盘原位标记与撤销、递归 `mut` 结构体、N 皇后计数 |
| `memoized-dp` | 2 | 过 | c19AB115A / s9016ae49 | `HashMap` 记忆化的递归斐波那契与网格路径 |
| `big-int` | 2 | 过 | c19AB115A / s9016ae49 | 十进制串逐位加减、进位/借位、超 i64 量级结果的位数与数位和 |
| `iterator-long-chain` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | `filter` / `map` / `skip` / `take` / `filter` / `fold` 长链与简单 Lambda（L12） |
| `closure-capture` | 2 | 过 | c19AB115A / s9016ae49 | 闭包按值捕获形参与局部变量后逃逸、函数值可重复调用 |
| `recursive-unite-tree` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | 双载荷递归 `unite Node`、递归求和与深度（L14） |
| `generic-constraints` | 3 | 1 过 / 2 红（运行值错） | c19AB115A / s9016ae49 | `Comparable` / `Equal` 约束跨两层泛型传递（L13） |
| `higher-order-returning` | 2 | 过 | c19AB115A / s9016ae49 | 返回函数的高阶函数、闭包捕获函数值、组合与重复 |
| `enum-state-machine` | 2 | 过 | c19AB115A / s9016ae49 | 用户态 `enums` 相位机、值形 `match` 推进与状态码 |
| `trait-required-call` | 2 | 过 | c19AB115A / s9016ae49 | `structure` + `imply` 实现 trait 必实现成员后按方法调用（L15 对照） |
| `trait-default-impl` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | trait 默认体成员在实现体上按方法调用（L15） |
| `mutual-recursion` | 2 | 过 | c19AB115A / s9016ae49 | Hofstadter Female / Male 互递归 |
| `utf8-word-count` | 2 | 过 | c19AB115A / s9016ae49 | `utf8` 作 `HashMap` 键、`split_whitespace` 词频与去重 |
| `string-algorithms` | 4 | 过 | c19AB115A / s9016ae49 | 中心扩展最长回文（ASCII/BMP）、一维压缩表的编辑距离 |
| `result-propagation` | 4 | 红（构建拒绝） | c19AB115A / s9016ae49 | 两层 `Result` 传播 + 早退（L16） |
| `enum-variant-argument` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | `enums` 裸变体直接作为构造器实参（L17） |
| `struct-equal-hash` | 4 | 红（构建拒绝） | c19AB115A / s9016ae49 | 自定义 `imply Equal` / `Hash` 的 `structure` 作 `HashMap` / `HashSet` 键（L18） |
| `custom-error-chain` | 4 | 红（构建拒绝） | c19AB115A / s9016ae49 | 三层自定义 `unite` 错误链、位置构造器与 `Result` 传播（L7） |
| `text-index-boundaries` | 6 | 过 | c19AB115A / s9016ae49 | 空串、空模式、单字节、星平面切片边界、`index_of` 重叠匹配 |
| `matrix-rotation` | 2 | 过 | c19AB115A / s9016ae49 | `ArrayList<ArrayList<i64>>` 二维矩阵、原地顺时针旋转、对角线 |
| `greedy-interval-scheduling` | 3 | 过 | c19AB115A / s9016ae49 | 区间结构体 + 显式结束时间比较器 + 贪心不相交选择 |
| `bit-subset-enumeration` | 3 | 过 | c19AB115A / s9016ae49 | `bit_and` 掩码枚举子集、`count_ones` 汇总、移位计数 |

## 对账：46 用例 → 当前 122 用例

上一批口径：21 场景 / 46 用例，25 过、21 红（构建拒绝 19、运行断言失败 2）。
第一批新增 6 场景 / 12 用例，全过。第二批新增 6 场景 / 12 用例，10 过、2 红
（`scenes/dijkstra` 两例，属 L11）。第三批新增 5 场景 / 11 用例，5 过、6 红
（`iterator-long-chain` 2 例属 L12，`generic-constraints` 2 例属 L13，`recursive-unite-tree` 2 例属 L14）。
第四批新增 8 场景 / 19 用例，12 过、7 红（`trait-default-impl` 2 例属 L15，
`result-propagation` 4 例属 L16，`enum-variant-argument` 1 例属 L17）。
第五批新增 6 场景 / 22 用例，14 过、8 红（`struct-equal-hash` 4 例属 L18，
`custom-error-chain` 4 例属 L7）。
累计 25 + 12 + 10 + 5 + 12 + 14 = 78 过。
当前全量重跑（`pnpm --filter @leetcode/conformance scenes`）：
**52 场景 / 122 用例，78 过、44 红（构建拒绝 40、运行断言失败 4）**。

- **没有红翻绿用例**，五批新增都只做加法：第一批后 25 + 12 = 37，第二批再 +10 = 47，
  第三批再 +5 = 52，第四批再 +12 = 64，第五批再 +14 = 78。
- 之前回报的「45 过 / 11 红」是账目错误，不作数。它沿用了 `8596d3daa` 记下的「35 过 / 11 红」口径，
  又漏算了本批新增：35 + 12 应为 47，我误写成 45。两处都错，本账以当前重跑为准。
- `8596d3daa` 记为已关闭的 10 个用例在当前工具链上仍按原诊断失败，因此重新计红：
  `scenes/pattern-matching` 仍报 CAN015，`scenes/recursive-union` 仍报 CAN054，
  `scenes/type-ordering` 与 `scenes/type-ordering-player` 仍报
  `construct missing HIR callable contract`，`scenes/result-errors` / `result-fold` / `result-match`
  仍报布局 `std.diagnostic.Diagnostic` 合同冲突。
  这 10 条不属于本批新增，也不存在可归因的「编译器修复」：看起来 `8596d3daa` 那次运行用的是
  带布局身份合并的编译器，当前工作区链接到的编译器没有该行为。需要按仓归属到 `nyar-vm.rs` 的
  link 阶段确认，探针仓不做任何消除红点的改动。
- 同样，L2 标题里的「CAN010 已关闭」在当前工具链不成立：`scenes/option-match` 与
  `scenes/option-match-nonempty` 现在都报 CAN010 构建拒绝。L1–L10 的诊断与坐标保持原样，
  状态行按下一节的口径统一处理。

### 状态降级：没有 rev 的「已关闭」一律改判「未验证」

- `8596d3daa` 记录过 10 条「已关闭」（CAN015、CAN054、`construct missing HIR callable contract`、
  `Diagnostic` 布局冲突四类），但没有记录当时的编译器 binding 与 std rev。按本账新增口径，
  它们一律改判「未验证」，不得再作为已关闭引用；本次 `c19AB115A / s9016ae49` 重跑这 10 条全部复红。
- L2 标题里的「CAN010 已关闭」同样没有 rev 依据，改判未验证；本次两个 `option-match` 场景仍停在 CAN010。
- L3 / L4 / L5 / L7 正文的「状态」行已同步改为「未验证」，原有诊断与坐标保留不改。

### 44 条红与 L 条目的对应

| 场景::用例 | 数量 | L 条目 | 现行诊断 |
| --- | --- | --- | --- |
| `iterator-pipeline::iteratorPipelineTotal` | 1 | L1 | `unresolved call` `<fn value>.collect` |
| `iterator-pipeline::iteratorFoldTotal` | 1 | L1 | 同上 |
| `iterator-map-collect::mapCollectTotal` | 1 | L1 | 同上 |
| `iterator-terminal::foldSum` | 1 | L8（构建拒绝，L1 被掩盖） | `EnumerateIterator::next` 匿名元组与具名元组不兼容 |
| `iterator-terminal::anyAll` | 1 | L8（同上） | 同上 |
| `iterator-terminal::enumerateCount` | 1 | L8 | 同上 |
| `option-match::optionMatch` | 1 | L2 | CAN010 终结符操作数不是 SSA 值 |
| `option-match-nonempty::optionMatchNonempty` | 1 | L2 | CAN010 |
| `pattern-matching::flatUnion` | 1 | L3 | CAN015 `TerminatorUseBeforeDefinition` |
| `recursive-union::evalNegated` | 1 | L4 | CAN054 递归 payload 未实例化 |
| `recursive-union::evalNested` | 1 | L4 | CAN054 |
| `type-ordering::sortRankChecksum` | 1 | L5 | `construct missing HIR callable contract` |
| `type-ordering::stableSerialOrder` | 1 | L5 | 同上 |
| `type-ordering-player::sortPlayerChecksum` | 1 | L5 | 同上 |
| `result-errors::safeDivFine` | 1 | L7 | 布局 `std.diagnostic.Diagnostic` 合同冲突 |
| `result-errors::unwrapOrElse` | 1 | L7 | 同上 |
| `result-fold::resultFold` | 1 | L7 | 同上 |
| `result-match::triState` | 1 | L7 | 同上 |
| `result-utf8-payload::resultFoldUtf8` | 1 | L6 | SMIR006 sum 构造合同不一致 |
| `text-indexing::astralChecksum` | 1 | L9 | 星平面字符截断到 16 位 |
| `integer-boundaries::overflowTrap` | 1 | L10 | i64 加法越界静默回绕 |
| `dijkstra::dijkstraDistances` | 1 | L11 | CAN058 `BinaryHeap` 聚合实例布局 |
| `dijkstra::dijkstraUnreachable` | 1 | L11 | 同上 |
| `iterator-long-chain::longChainTotal` | 1 | L12 | 简单 Lambda `x => ...` 解析失败 |
| `iterator-long-chain::longChainCount` | 1 | L12 | 同上 |
| `generic-constraints::largestValue` | 1 | L13 | 块形 `match` 分支赋值被丢弃（运行值错） |
| `generic-constraints::largestOfRows` | 1 | L13 | 同上 |
| `recursive-unite-tree::treeSum` | 1 | L14 | SMIR007 return 操作数 Unit vs i64 |
| `recursive-unite-tree::treeDepth` | 1 | L14 | 同上 |
| `trait-default-impl::simpleTotal` | 1 | L15 | `unresolved call sample.total` 无方法候选 |
| `trait-default-impl::weightedTotal` | 1 | L15 | 同上 |
| `result-propagation::chainSuccess` | 1 | L16 | CAN010 终结符操作数不是 SSA 值 |
| `result-propagation::chainDivisionByZero` | 1 | L16 | 同上 |
| `result-propagation::chainNestedFail` | 1 | L16 | 同上 |
| `result-propagation::chainNegativeInput` | 1 | L16 | 同上 |
| `enum-variant-argument::inlineVariant` | 1 | L17 | `unresolved call Fail` 作用域内无同名可调用 |
| `struct-equal-hash::pointMapLookup` | 1 | L18 | trait witness 缺少实例 |
| `struct-equal-hash::pointMapReplace` | 1 | L18 | 同上 |
| `struct-equal-hash::pointSetSize` | 1 | L18 | 同上 |
| `struct-equal-hash::pointSetContains` | 1 | L18 | 同上 |
| `custom-error-chain::chainSuccess` | 1 | L7 | 布局 `std.diagnostic.Diagnostic` 合同冲突 |
| `custom-error-chain::chainParseFail` | 1 | L7 | 同上 |
| `custom-error-chain::chainRangeFail` | 1 | L7 | 同上 |
| `custom-error-chain::chainIoFail` | 1 | L7 | 同上 |

按条目汇总：L1 3 条、L2 2 条、L3 1 条、L4 2 条、L5 3 条、L6 1 条、L7 8 条、L8 3 条、L9 1 条、
L10 1 条、L11 2 条、L12 2 条、L13 2 条、L14 2 条、L15 2 条、L16 4 条、L17 1 条、L18 4 条，合计 44 条。

说明：`iterator-terminal` 是模块级构建失败，`EnumerateIterator::next` 的元组类型不匹配先拒绝
整个模块，三个用例都无法进入用例级判定，因此 `foldSum` / `anyAll` 不再单独归因 L1。L1 仍由
`iterator-pipeline` 与 `iterator-map-collect` 的 3 条独立证明，不因本次修正而消失。

## 缺口

### L1 适配器调用结果上的扩展方法解析失败

- 分类：编译器（`valkyrie.hir.unresolved_call`）
- 最小复现：`scenes/iterator-map-collect/scene.v` 的 `mapCollectTotal`：
  `filled_ascending(8).into_iterator().map(negate).collect()`
- 证据：
  ``unresolved call `<fn value>.collect` in map_collect_total: no method candidate named `collect` exists for receiver type `Nominal(ItemId(29))<i64, i64, Nominal(ItemId(27))<i64>>` ``
- 同根：`scenes/iterator-pipeline/scene.v` 的 `iteratorPipelineTotal`（`filter` + `map` 链）、
  `scenes/iterator-terminal/scene.v` 的 `foldSum`（`<fn value>.fold`）、以及文本场景最初的
  `text.index_of("中").map_or(...)`。同一代码改成先绑定局部变量再调方法即可通过
  （`text-indexing` 的 `indexOfChar` 与 `higher-order` 的 `optionChain` 即证）。
- 缺口本质：接收者是「调用结果」时，方法解析把它当成 fn value，没有先物化调用结果。

### L2 CAN010：`Option` 匹配的终结符操作数不是 SSA 值

- 分类：编译器（canonical MIR）
- 最小复现：`scenes/option-match/scene.v` 的 `optionMatch` 与
  `scenes/option-match-nonempty/scene.v` 的 `optionMatchNonempty`（两者只差 `None` 分支是否为空）
- 证据：本次 `c19AB115A / s9016ae49` 两个场景都报 `(CAN010): 终结符操作数不是 SSA 值`，
  构建阶段即拒绝，尚未进入运行值比对
- 历史状态：正文曾记「CAN010 已关闭、`option-match` 构建通过但实得 `0`、nonempty 转 CAN015」，
  但这些结论都没有记录编译器 binding 与 std rev，按本账口径改判「未验证」，不构成关闭依据
- 与 L13 的关系（假设，未证实）：两个场景都在块形 `match` 分支里对外层 `mut` 变量赋值；
  即使 CAN010 修复，按 L13 的观测它们也可能继续返回 `0`。后续复核应先修 L13 再判 L2，
  不能只把「构建变绿」当作关闭条件

### L3 CAN015：扁平带载荷联合的 match 触发 use-before-def

- 分类：编译器（canonical MIR）
- 最小复现：`scenes/pattern-matching/scene.v` 的 `flatUnion`
  （`unite Command { Stop / Move { steps } / Jump { left, right } }`）
- 证据：`(CAN015): canonical MIR 校验失败: TerminatorUseBeforeDefinition { function: ItemInstanceId(7), value: MirValueId(17) }`
- 状态：未验证。原「已关闭」没有记录编译器 binding 与 std rev，按本账口径不构成关闭依据；
  本次 `c19AB115A / s9016ae49` 重跑仍报同一 CAN015。

### L4 CAN054：递归带载荷联合的物理 payload 未实例化

- 分类：编译器（canonical / 实例化）
- 最小复现：`scenes/recursive-union/scene.v`（`unite Expr` 的 `Neg { inner: Expr }` 等递归载荷）
- 证据：`(CAN054): sum 物理 payload 类型未完成实例化: Nominal declaration `ItemId(10)` 需要平台 NyarType::Nominal，禁止降级为 Named 短名 (at Expr::Neg)`
- 影响：递归数据结构（表达式树、链表、树节点）整体不可用。
- 状态：未验证。原「已关闭」没有 rev 依据，撤回；本次 `c19AB115A / s9016ae49` 仍报 CAN054。

### L5 MIR lowering `construct missing HIR callable contract`

- 分类：编译器（MIR lowering）
- 最小复现：`scenes/type-ordering/scene.v` 与 `scenes/type-ordering-player/scene.v`
  的 `sortRankChecksum` / `sortPlayerChecksum`：`structure` + `imply Equal` + `imply Comparable` 后调用单参 `sort`
- 证据：`(valkyrie.mir.diagnostic_rejected): MIR lowering unresolved callable identity `construct missing HIR callable contract``
- 说明：`scenes/struct-literal` 证明结构体字面量本身可用；同一写法出现在
  `projects/problems/best-team-with-no-conflicts/solvers/valkyrie/solution.v`，
  该题 V 解当前应同样红，需编译器线确认是否回归。
- 状态：未验证。原「已关闭」与「布局合并修复」归因均未记录 rev，撤回；
  本次 `c19AB115A / s9016ae49` 仍报 `construct missing HIR callable contract`。

### L6 SMIR006：`Result<i64, utf8>` 的 sum 构造合同不一致

- 分类：编译器（Semantic MIR）
- 最小复现：`scenes/result-utf8-payload/scene.v` 的 `resultFoldUtf8`
- 证据：`(SMIR006): Semantic MIR 合同失败: function=probe.result_utf8_payload::result_fold_utf8, location=block 0 instruction 1, detail=sum construction contract disagrees with declared sum metadata`

### L7 布局阶段 `std.diagnostic.Diagnostic` 合同冲突

- 分类：编译器（布局）
- 最小复现：任意 `Result<i64, <自定义 unite>>` 模块：
  `scenes/result-errors`（`unwrap_or` / `unwrap_or_else`）、
  `scenes/result-fold`（`fold`）、`scenes/result-match`（`match`）
- 证据：`布局 `std.diagnostic.Diagnostic` 合同冲突`
- 补充坐标：`scenes/custom-error-chain` 四例（三层 `unite` 错误链，位置构造器 `Parse(1)` / `Range(2)` / `Io(3)`）
  在 `c19AB115A / s9016ae49` 下同样命中本条布局冲突。临时探针（已删除）另确认：`unite` 变体的正确构造写法是
  位置构造器；写成结构体字面量 `Range { code: 2 }` 会报 `unresolved constructor`，属探针写法问题，不记为缺口。
- 对照：`scenes/result-plain`（`Result<i64, i64>` + `fold`）通过，因此触发条件在
  「自定义联合作为 `Result` 的失败载荷」，不是 `Result` 本身。
- 根因：`LayoutId` 是模块本地编号。依赖模块与 consumer 各自为同一 declaration 产出一份
  布局，字段里的 `Nominal { layout }` 带着各自的本地编号；链接合并直接按原始编号比较
  形状，把「同一声明、同形状」误判成合同冲突。修复在 link 阶段按 declaration 身份合并，
  并先把依赖侧本地 `LayoutId` 重映射到合并身份再核对合同（真实尺寸/对齐差异仍失败闭合）。
- 状态：未验证。原「已关闭」以及「25 过 → 35 过」的数字都没有记录 rev，撤回；
  本次 `c19AB115A / s9016ae49` 下 `result-errors`、`result-fold`、`result-match` 四例仍红。

### L8 `EnumerateIterator::next` 用匿名元组构造具名字段元组

- 分类：标准库写法 + 编译器未归一
- 坐标：`valkyrie.v/projects/std/source/iterator/EnumerateIterator.v:28`
  `return Some { value: (ordinal, value) }`，声明类型是 `(ordinal: usize, value: T)`
- 最小复现：`scenes/iterator-terminal/scene.v` 的 `enumerateCount`（任何 `.enumerate()` 使用方）
- 证据：``return` value type `Nominal(...)<(u32, T)>` is incompatible with the function return type `Nominal(...)<(ordinal: u32, value: T)>` in function `next` ``

### L9 星平面字符被截断到 16 位

- 分类：运行时语义 / 标准库 `char`
- 最小复现：`scenes/text-indexing/scene.v` 的 `astralChecksum`（`"🙂"` 经 `loop ch in text` 后 `ch as u32`）
- 证据：期望 `128578`（U+1F642），实得 `63042`（`0xF642`，只保留低 16 位）
- 影响：任何非 BMP 文本的长度、字符比较、哈希都会失真。

### L10 i64 加法越界静默回绕

- 分类：运行时语义
- 最小复现：`scenes/integer-boundaries/scene.v` 的 `overflowTrap`（`9223372036854775807 + 1`）
- 证据：期望可观察拒绝，实得 `-9223372036854775808`
- 说明：若语言合同是「溢出 panic / 可检测」，这里应为 trap；若是 wrapping 语义，则合同需明示。

### L11 `BinaryHeap` 泛型实例无法生成实例级布局

- 分类：编译器（canonical / 聚合实例布局）
- 最小复现：`scenes/dijkstra/scene.v` 的 `dijkstra`：
  `let mut frontier: BinaryHeap<Frontier> = BinaryHeap::new_by(cmp_frontier)`
- 证据：`(CAN058)` 聚合实例 `std.collection.BinaryHeap` 无法按已冻结声明生成实例级布局
- 坐标补充：`valkyrie.v/projects/std/source/collection/BinaryHeap.v` 的 `class BinaryHeap<T>` 与 `new_by`
- 说明：同一场景里的图结构、`Edge` / `Frontier` 结构体与 `BinaryHeap::push` 调用都不单独报错，失败点是
  `BinaryHeap<Frontier>` 这个泛型实例本身。
- 处理：按理想写法保留该条目，场景继续使用 `BinaryHeap::new_by`，未改成手写堆或有序数组绕开。

### L12 简单 Lambda `x => expr` 解析失败

- 分类：编译器（前端 parser）
- 复核结论：**保留，不撤回**。`x => expr` 是语言文档正式承认的语法，不是写错的探针。
- 依据（两处独立文档坐标）：
  - `valkyrie.v/documentation/pages/zh-hans/language/expressions.md:151-154`，
    `### 2. 简单 Lambda — x => expr`，示例 `items.filter(x => x > 0)`
  - `valkyrie.v/documentation/pages/zh-hans/language/language.md:169`，
    同一示例 `items.filter(x => x > 0)                # Lambda`
- 最小复现（独立场景，排除管道与适配器因素）：
  `let f: micro(i64) -> i64 = x => x + 1`，报
  `error[valkyrie.frontend.parse.syntax]: 此处需要表达式`，
  本次 `c19AB115A / s9016ae49` 复测一致
- 坐标：`scenes/iterator-long-chain/scene.v` 的 `long_chain_total` / `long_chain_count`
  （`filter(x => x % 2 == 1)` 等）；完整 Lambda `micro(x: i64) -> i64 { ... }` 在
  `scenes/closure-capture/scene.v` 与 `scenes/higher-order-returning/scene.v` 均可解析并通过
- 旁证：`valkyrie.v/projects/**/*.v` 现网没有一处 `=>` Lambda 实际使用，`rusty-valkyrie` 源码里
  也没有 `=>` 的语法产生式（仅 asgard 渲染层把它当字符串处理）。文档与实现不一致，缺口在实现侧。
- 与 L1 的关系：无关。L1 是适配器结果上的扩展方法解析，本条目失败在前端解析阶段。

### L13 块形 `match` 分支对外层 `mut` 变量的赋值被丢弃

- 分类：编译器（match lowering / 块形分支写回）
- 复核结论：**不是泛型特有问题，也不是误用 `compare` 返回码**。根因是块形 `match` 分支里对外层
  `mut` 变量的赋值不生效；`compare` 本身与 std 返回约定都正确。
- `compare` 契约核对：`valkyrie.v/projects/std/source/operator/comparable.v` 声明
  `compare(self, other: Self): Ordering`，要求返回 `Less` / `Equal` / `Greater`；`to_code` 只是
  全库唯一的 -1/0/1 编码出口，不是比较结果本身。场景用 `match` 消费 `Ordering` 与 std 自身
  （`to_code` / `is_ordered`）的裸变体 match 写法一致，不存在误用返回码。
- 最小复现（本次 `c19AB115A / s9016ae49` 的 10 例对照探针，跑完即删除，未入库）：

  | 探针 | 形态 | 期望 | 实得 |
  | --- | --- | --- | --- |
  | `nonGenericAssign` | 非泛型 + 块形 `match` + 赋值 | 9 | 2（红） |
  | `genericDirect` | 泛型 + 直接匹配调用结果 + 赋值 | 9 | 2（红） |
  | `genericBound` | 泛型 + 先绑定 `Ordering` 再块形匹配 + 赋值 | 9 | 2（红） |
  | `literalMatch` | 字面量 `Ordering` + 块形 `match` + 赋值 | 1 | 0（红） |
  | `unionAssignMatch` | `unite` + 块形 `match` + 赋值 | 1 | 0（红） |
  | `genericOperator` | 泛型 + `>` 派生算子 | 9 | 9（过） |
  | `compareCode` | `compare(...).to_code()` | 1 | 1（过） |
  | `valueFormMatch` | 值形 `match`（无块、无赋值） | 1 | 1（过） |
  | `blockReturnMatch` | 块形 `match` + `return` | 1 | 1（过） |
  | `unionValueMatch` | `unite` 值形 `match` | 1 | 1（过） |

- 结论：赋值型块形分支（`case X: { target = ... }`）被丢弃，与泛型、`compare`、`unite` 还是
  `enums` 都无关；值形分支和 `return` 型分支正常。疑似分支块被当成独立作用域，赋值只落在
  分支内副本，没有回写外层 `mut` 变量（这是对观测结果的解释，非已证实根因）。
- 坐标：`scenes/generic-constraints/scene.v` 的 `largest` / `largest_of_rows`；
  同文件 `contains_in_rows`（`Equal` 约束）通过，因为它只做 `if` 判定，不写 match 分支赋值。
- 附带：`case Ordering.Greater:` 限定写法报 `Missing match arm body`，目前只能写裸变体名。
- 与 L2 的关系（假设，未证实）：`option-match` 历史症状是「匹配 `Some` 却返回 `0`」，形态与
  「块形分支赋值丢失」一致；但该场景当前停在 CAN010 构建拒绝，无法用运行值验证，暂不合并条目。
- 归属：本条目已转编译器线（`nyar-vm.rs`）。`scenes/generic-constraints` 保留为**回归锁**：
  修复后 `largestValue` / `largestOfRows` 应转绿，且不得为了变绿改动场景写法。

### L14 递归 unite 的 `match` 分支提前 `return` 触发 SMIR007

- 分类：编译器（SMIR 生成 / 返回类型）
- 最小复现：`scenes/recursive-unite-tree/scene.v` 的 `tree_sum`：`unite Node` 的三个
  `[constructor]` 变体分别为空载荷、`value: i64`、`left: Node` + `right: Node`，三个 `case` 分支各自 `return`
- 证据：`(SMIR007): function=probe.recursive_unite_tree::tree_sum, location=block 5 terminator,
  detail=return operand type differs from function return type (actual=Unit, expected=Integer64)`
- 与既有条目关系：与 L4 同属递归 payload，但 L4 停在 CAN054，本条目已通过 CAN 并停在 SMIR，
  阶段不同，独立编号。`scenes/recursive-union` 的同一形态仍停在 CAN054（L4）
- 附带解析缺口：位置载荷写法 `unite Node { Empty Leaf(i64) Branch(Node, Node) }` 会报
  `Unexpected expression kind: Type`。本场景改用 `[constructor]` + 具名字段后才通过解析，
  随后停在 SMIR007。位置载荷递归 `unite` 目前不可写，建议在后续批次里单独确认是否值得编号。

### L15 trait 默认体成员不能在实现体上按方法调用

- 分类：编译器（trait 成员解析 / `valkyrie.hir.unresolved_call`）
- 最小复现：`scenes/trait-default-impl/scene.v` 的 `simple_total` / `weighted_total`：
  `trait Scorer { micro base(self): i64  micro bonus(self): i64 { ... }  micro total(self): i64 { ... } }`，
  `imply Simple: Scorer` 只实现必实现成员 `base`，默认体 `bonus` / `total` 未在实现体重写，
  随后调用 `sample.total()`
- 证据：``unresolved call `sample.total` in simple_total: no method candidate named `total` exists for receiver type `Nominal(ItemId(3))` ``
- 对照：`scenes/trait-required-call`（同样的 `structure` + `imply`，只调用必实现成员 `base`）2 例全过，
  说明 `imply` 本身与必实现成员注册正常，失败点是默认体成员未进入实现体的方法集合。
- 影响：trait 默认方法（含跨成员调用 `self.base()`）整体不可用，迫使每个实现体重复默认逻辑。
- 场景保留为回归锁：修复后两例应转绿，不得为变绿把 `total` 展开到每个实现体。

### L16 两层 `Result` 传播 + 早退触发 CAN010

- 分类：编译器（canonical MIR）
- 最小复现：`scenes/result-propagation/scene.v` 的 `checked_chain`：
  外层块形 `match checked_div(a, b)`，`Fine` 分支内再套一层块形 `match checked_div(first, c)`，
  四个分支各自 `return Fine(...)` / `return Fail(...)`，函数尾部另有兜底 `return Fail(3)`
- 证据：`(CAN010): 终结符操作数不是 SSA 值`，构建阶段拒绝，四个用例均未进入运行值比对
- 与 L2 的关系：诊断同为 CAN010，但触发形态不同。L2 是 `Option` 匹配分支对外层 `mut` 变量赋值，
  本条是嵌套块形 `match` + 分支 `return` + `Result` 构造，故独立编号。两者是否同一 canonical MIR
  缺陷，需编译器线在修复时确认；在确认前不合并条目，也不因其中一条修复就改判另一条。
- 对照：单层 `match` 的 `scenes/result-plain`（`Result<i64, i64>` + `fold`）通过，
  说明 `Result` 本身与标量错误载荷可用，失败点在嵌套传播形态。

### L17 `enums` 裸变体不能直接作为调用实参

- 分类：编译器（HIR 调用解析 / 变体构造器作用域）
- 最小复现：`scenes/enum-variant-argument/scene.v` 的 `inline_variant`：
  `let outcome: Result<i64, MathError> = Fail(DivisionByZero)`
- 证据：``unresolved call `Fail` in inline_variant: no callable with this name is in scope``
- 对照（临时探针已删除，未入库）：同一模块改成先绑定
  `let error: MathError = DivisionByZero`，再 `let outcome: Result<i64, MathError> = Fail(error)`，
  构建通过。因此缺口在「裸变体表达式直接作实参」，不是 `Result`/`enums` 或 `Fail` 本身。
- 与 L15 的关系：都是 unresolved call，但 L15 是接收者方法集合缺失，本条是调用实参位置的变体构造，
  归因不同，不合并。

### L18 自定义 `Equal` / `Hash` 类型不能实例化哈希容器

- 分类：编译器（trait witness 实例化 / 后端私有计划）
- 最小复现：`scenes/struct-equal-hash/scene.v` 的 `point_map_lookup` 与 `point_set_size`：
  `structure Point` 同时 `imply Point: std::operator::Equal`（`==` / `!=`）与
  `imply Point: std::collection::Hash`（`hash`），随后使用 `HashMap<Point, i64>` / `HashSet<Point>`
- 证据：`后端私有计划生产失败: trait witness 缺少 declaration=ItemId(153) self_type=TypeId(18) 的实例: trait=ItemId(65)`
- 对照（临时探针已删除，未入库）：
  - 同一 `Point` 直接调用 `a == b` 与 `p.hash()`，构建通过并返回值正确；
  - 单独使用 `HashMap<Point, i64>` 复红；
  - 单独使用 `HashSet<Point>` 复红；
  - `HashMap<i64, i64>` 的 `lru-cache` / `memoized-dp` 通过。
  因此缺口在「自定义 trait 实现到容器泛型实例的 witness 物化」，不是 `imply` 写法本身。
- 影响：自定义类型不能作为 `HashMap` / `HashSet` 键，用户态值对象只能退回标量键间接寻址。
- 场景保留为回归锁：修复后四例应转绿，不得为变绿把 `Point` 拆成标量键。

## 第一批（数据结构）观察

本批 6 个场景 12 个用例全过，未新增缺口。以下两点曾疑似缺口，核对标准库源码后确认是既有 API 合同，
本账不为其新增 L 编号，以免将来重报：

- `ArrayList.at(usize)` 与 `get(isize)` 是 **1 基序数**，`at(0)` 越界结构化失败、`get(0)` 返回 `None`。
  0 基随机访问走 `⁅i⁆` 与 `set_cardinal`，`scenes/lru-cache` 即用该路径。
  坐标：`valkyrie.v/projects/std/source/collection/ArrayList.v` 的 `micro at` / `micro get`。
- `HashMap::new()` 不是零参构造，签名是 `HashMap::new(capacity: usize)`，本批场景均按容量构造。
  坐标：`valkyrie.v/projects/std/source/collection/hashed/HashMap.v`。
