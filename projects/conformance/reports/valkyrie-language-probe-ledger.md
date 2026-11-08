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

当前：38 场景 / 81 用例，52 过、29 红（构建拒绝 25、运行断言失败 4）。

| 场景 | 用例 | 状态 | 覆盖点 |
| --- | --- | --- | --- |
| `text-indexing` | 7 | 6 过 / 1 红（运行值错） | 码位长度、BMP 与星平面字符、按码位切片、Cardinal 取字符、`index_of`、`split` |
| `generic-iteration` | 2 | 过 | 泛型容器 + `micro(T) -> i64` 权重函数、`ArrayList<ArrayList<i64>>` |
| `iterator-pipeline` | 2 | 红（构建拒绝） | `filter` 后 `map` 再 `collect`、适配器后接 `fold` |
| `iterator-map-collect` | 1 | 红（构建拒绝） | 单个 `map` 适配器后接 `collect` |
| `iterator-terminal` | 3 | 红（构建拒绝） | 适配器后接 `fold` / `any` / `all`、`enumerate().count()` |
| `higher-order` | 2 | 过 | 命名函数作为比较器与一元函数值 |
| `sorting-comparison` | 2 | 过 | `sort` 类型合同入口、`quick_sort` 显式比较器 |
| `type-ordering` | 2 | 红（构建拒绝） | `structure` + `imply Equal/Comparable` 后 `sort`、稳定性 |
| `type-ordering-player` | 1 | 红（构建拒绝） | 同上，用仓库既有 solver 的 `Player` 写法复核 |
| `bit-operations` | 6 | 过 | `bit_and` / `bit_or` / `bit_xor`、`count_ones`、`leading_zeros` / `trailing_zeros`、移位、异或交换 |
| `pattern-matching` | 1 | 红（构建拒绝） | 扁平带载荷 `unite`（零元/单字段/双字段）与 `match` |
| `option-match` | 1 | 红（构建拒绝） | `Option` 的 `Some` / `None` 匹配（`None` 分支为空） |
| `option-match-nonempty` | 1 | 红（构建拒绝） | 对照：`None` 分支非空，排除空块因素 |
| `recursive-union` | 2 | 红（构建拒绝） | 递归带载荷 `unite`（`Expr`）与递归求值 |
| `result-errors` | 2 | 红（构建拒绝） | `Result<i64, <自定义 unite>>` 的 `unwrap_or` / `unwrap_or_else` |
| `result-fold` | 1 | 红（构建拒绝） | 同上，`fold` 两个方向处理函数 |
| `result-match` | 1 | 红（构建拒绝） | `Result` / `Option` 三态匹配 |
| `result-plain` | 1 | 过 | 对照：`Result<i64, i64>` 的 `fold` |
| `result-utf8-payload` | 1 | 红（构建拒绝） | `Result<i64, utf8>` 的构造与 `fold` |
| `integer-boundaries` | 6 | 5 过 / 1 红（运行值错） | i64 边界位模式、i64→i32 截断、除法向零截断、i32 边界提升、加法越界 |
| `struct-literal` | 1 | 过 | 具名字段结构体字面量 |
| `lru-cache` | 2 | 过 | `HashMap<i64, i64>` 槽位 + 平行数组双向链表、`⁅i⁆` 读与 `set_cardinal` 写、容量淘汰 |
| `union-find` | 2 | 过 | 父指针 + 按深度合并 + 两遍路径压缩、`mut` 结构体跨辅助函数传递 |
| `trie` | 2 | 过 | `utf8` 字符迭代建 Trie、`节点 × 26` 扁平子表、前缀计数与精确计数 |
| `min-heap-kth` | 2 | 过 | 数组最小堆的 `sift_up` / `sift_down`、大小为 k 的堆求第 k 大 |
| `interval-merge` | 2 | 过 | `structure` 区间 + `quick_sort` 显式比较器 + 相邻区间合并 |
| `segment-tree` | 2 | 过 | 递归 `mut` 结构体建树、区间求和查询、单点更新 |
| `kmp` | 2 | 过 | 码位序列上的前缀函数、首次出现下标、重叠出现计数 |
| `topological-sort` | 2 | 过 | `ArrayList<ArrayList<i64>>` 邻接表原地追加、Kahn 队列、有环返回 -1 |
| `dijkstra` | 2 | 红（构建拒绝） | `BinaryHeap<Frontier>` + `new_by` 比较器、弛豫与陈旧项跳过（L11） |
| `backtracking-in-place` | 2 | 过 | 棋盘原位标记与撤销、递归 `mut` 结构体、N 皇后计数 |
| `memoized-dp` | 2 | 过 | `HashMap` 记忆化的递归斐波那契与网格路径 |
| `big-int` | 2 | 过 | 十进制串逐位加减、进位/借位、超 i64 量级结果的位数与数位和 |
| `iterator-long-chain` | 2 | 红（构建拒绝） | `filter` / `map` / `skip` / `take` / `filter` / `fold` 长链与简单 Lambda（L12） |
| `closure-capture` | 2 | 过 | 闭包按值捕获形参与局部变量后逃逸、函数值可重复调用 |
| `recursive-unite-tree` | 2 | 红（构建拒绝） | 双载荷递归 `unite Node`、递归求和与深度（L14） |
| `generic-constraints` | 3 | 1 过 / 2 红（运行值错） | `Comparable` / `Equal` 约束跨两层泛型传递（L13） |
| `higher-order-returning` | 2 | 过 | 返回函数的高阶函数、闭包捕获函数值、组合与重复 |

## 对账：46 用例 → 当前 81 用例

上一批口径：21 场景 / 46 用例，25 过、21 红（构建拒绝 19、运行断言失败 2）。
第一批新增 6 场景 / 12 用例，全过。第二批新增 6 场景 / 12 用例，10 过、2 红
（`scenes/dijkstra` 两例，属 L11）。第三批新增 5 场景 / 11 用例，5 过、6 红
（`iterator-long-chain` 2 例属 L12，`generic-constraints` 2 例属 L13，`recursive-unite-tree` 2 例属 L14）。
累计 25 + 12 + 10 + 5 = 52 过。
当前全量重跑（`pnpm --filter @leetcode/conformance scenes`）：
**38 场景 / 81 用例，52 过、29 红（构建拒绝 25、运行断言失败 4）**。

- **没有红翻绿用例**，三批新增都只做加法：第一批后 25 + 12 = 37，第二批再 +10 = 47，
  第三批再 +5 = 52。
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
  `scenes/option-match-nonempty` 现在都报 CAN010 构建拒绝。L1–L10 正文与标题保持原样，
  状态以本节和场景表为准。

### 29 条红与 L 条目的对应

| 场景::用例 | 数量 | L 条目 | 现行诊断 |
| --- | --- | --- | --- |
| `iterator-pipeline::iteratorPipelineTotal` | 1 | L1 | `unresolved call` `<fn value>.collect` |
| `iterator-pipeline::iteratorFoldTotal` | 1 | L1 | 同上 |
| `iterator-map-collect::mapCollectTotal` | 1 | L1 | 同上 |
| `iterator-terminal::foldSum` | 1 | L1 | 同上 |
| `iterator-terminal::anyAll` | 1 | L1 | 同上 |
| `iterator-terminal::enumerateCount` | 1 | L8 | `EnumerateIterator::next` 匿名元组与具名元组不兼容 |
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
| `generic-constraints::largestValue` | 1 | L13 | 泛型内 `Ordering` 匹配不生效（运行值错） |
| `generic-constraints::largestOfRows` | 1 | L13 | 同上 |
| `recursive-unite-tree::treeSum` | 1 | L14 | SMIR007 return 操作数 Unit vs i64 |
| `recursive-unite-tree::treeDepth` | 1 | L14 | 同上 |

按条目汇总：L1 5 条、L2 2 条、L3 1 条、L4 2 条、L5 3 条、L6 1 条、L7 4 条、L8 1 条、L9 1 条、
L10 1 条、L11 2 条、L12 2 条、L13 2 条、L14 2 条，合计 29 条。

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

### L2 `Option` 匹配：CAN010 已关闭，剩余运行值与 nonempty 的 CAN015

- 分类：编译器（canonical MIR）
- 最小复现：`scenes/option-match-nonempty/scene.v` 的 `optionMatchNonempty`
- 证据：`scenes/option-match` 构建已通过，但 `optionMatch` 实得 `0`（期望 `42`）；
  `scenes/option-match-nonempty` 转为 `(CAN015): TerminatorUseBeforeDefinition`。
- 说明：原 CAN010 已随布局身份合并关闭；剩余失败是 `Option` 匹配的运行值错误与
  nonempty 的 CAN015，二者仍按独立根因记录。

### L3 CAN015：扁平带载荷联合的 match 触发 use-before-def

- 分类：编译器（canonical MIR）
- 最小复现：`scenes/pattern-matching/scene.v` 的 `flatUnion`
  （`unite Command { Stop / Move { steps } / Jump { left, right } }`）
- 证据：`(CAN015): canonical MIR 校验失败: TerminatorUseBeforeDefinition { function: ItemInstanceId(7), value: MirValueId(17) }`
- 状态：已关闭。当前编译器上 `flatUnion` 通过；根因与 L7 同属跨模块聚合布局身份，
  随布局合并按声明身份重映射本地 `LayoutId` 一并消除。

### L4 CAN054：递归带载荷联合的物理 payload 未实例化

- 分类：编译器（canonical / 实例化）
- 最小复现：`scenes/recursive-union/scene.v`（`unite Expr` 的 `Neg { inner: Expr }` 等递归载荷）
- 证据：`(CAN054): sum 物理 payload 类型未完成实例化: Nominal declaration `ItemId(10)` 需要平台 NyarType::Nominal，禁止降级为 Named 短名 (at Expr::Neg)`
- 影响：递归数据结构（表达式树、链表、树节点）整体不可用。
- 状态：已关闭。当前编译器上 `evalNegated` / `evalNested` 两条均通过。

### L5 MIR lowering `construct missing HIR callable contract`

- 分类：编译器（MIR lowering）
- 最小复现：`scenes/type-ordering/scene.v` 与 `scenes/type-ordering-player/scene.v`
  的 `sortRankChecksum` / `sortPlayerChecksum`：`structure` + `imply Equal` + `imply Comparable` 后调用单参 `sort`
- 证据：`(valkyrie.mir.diagnostic_rejected): MIR lowering unresolved callable identity `construct missing HIR callable contract``
- 说明：`scenes/struct-literal` 证明结构体字面量本身可用；同一写法出现在
  `projects/problems/best-team-with-no-conflicts/solvers/valkyrie/solution.v`，
  该题 V 解当前应同样红，需编译器线确认是否回归。
- 状态：已关闭。`sortRankChecksum` 与 `sortPlayerChecksum` 当前均通过；
  与 L7 同属跨模块布局身份，布局合并修复后不再报 `construct missing HIR callable contract`。

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
- 对照：`scenes/result-plain`（`Result<i64, i64>` + `fold`）通过，因此触发条件在
  「自定义联合作为 `Result` 的失败载荷」，不是 `Result` 本身。
- 根因：`LayoutId` 是模块本地编号。依赖模块与 consumer 各自为同一 declaration 产出一份
  布局，字段里的 `Nominal { layout }` 带着各自的本地编号；链接合并直接按原始编号比较
  形状，把「同一声明、同形状」误判成合同冲突。修复在 link 阶段按 declaration 身份合并，
  并先把依赖侧本地 `LayoutId` 重映射到合并身份再核对合同（真实尺寸/对齐差异仍失败闭合）。
- 状态：已关闭。`result-errors`、`result-fold`、`result-match` 三个场景当前全绿；
  全量场景同时转绿 `pattern-matching`、`recursive-union`、`type-ordering`、
  `type-ordering-player`，合计 25 过 → 35 过（46 用例）。

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
  `BinaryHeap<Frontier>` 这个泛型实例本身。按理想写法应保留 `BinaryHeap`，不改为手写堆来绕开。

### L12 简单 Lambda `x => expr` 解析失败

- 分类：编译器（前端 parser）
- 最小复现：`let shifted: micro(i64) -> i64 = x => x + 1`，报
  `error[valkyrie.frontend.parse.syntax]: 此处需要表达式`
- 坐标：`scenes/iterator-long-chain/scene.v` 的 `long_chain_total` / `long_chain_count`
  （`filter(x => x % 2 == 1)` 等）；完整 Lambda `micro(x: i64) -> i64 { ... }` 在
  `scenes/closure-capture/scene.v` 与 `scenes/higher-order-returning/scene.v` 均可解析并通过
- 说明：`x => expr` 是 `documentation/pages/zh-hans/language/expressions.md` 记载的简单 Lambda 形态，
  现网没有一处实际使用。与 L1 无关，L1 是适配器结果上的扩展方法解析，本条目失败在解析阶段。

### L13 泛型函数内 `Ordering` 的 `match` 分支不生效

- 分类：编译器（泛型单态化 / match 派发）
- 最小复现：`micro largest<T>(items: ArrayList<T>) -> T where T: std::operator::Comparable`
  内 `match current.compare(best) { case Greater: { best = current } ... }`，对 `[2, 9, 4, 7]`
  返回首元素 2 而不是 9
- 对照：同一泛型函数把 `match` 换成 `current.compare(best).to_code()` 后返回 9，
  同一 `compare` 在非泛型函数里 `match` 也正常。失败点是泛型上下文里的 `Ordering` 匹配
- 坐标：`scenes/generic-constraints/scene.v` 的 `largest` / `largest_of_rows`；
  对照分支见同文件 `contains_in_rows`（`Equal` 约束，通过）
- 附带：`case Ordering.Greater:` 限定写法会报 `Missing match arm body`，所以目前只有裸变体名可写

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

## 第一批（数据结构）观察

本批 6 个场景 12 个用例全过，未新增缺口。以下两点曾疑似缺口，核对标准库源码后确认是既有 API 合同，
本账不为其新增 L 编号，以免将来重报：

- `ArrayList.at(usize)` 与 `get(isize)` 是 **1 基序数**，`at(0)` 越界结构化失败、`get(0)` 返回 `None`。
  0 基随机访问走 `⁅i⁆` 与 `set_cardinal`，`scenes/lru-cache` 即用该路径。
  坐标：`valkyrie.v/projects/std/source/collection/ArrayList.v` 的 `micro at` / `micro get`。
- `HashMap::new()` 不是零参构造，签名是 `HashMap::new(capacity: usize)`，本批场景均按容量构造。
  坐标：`valkyrie.v/projects/std/source/collection/hashed/HashMap.v`。
