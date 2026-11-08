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

当前：21 场景 / 46 用例，35 过、11 红（构建拒绝 8、运行断言失败 3）。

| 场景 | 用例 | 状态 | 覆盖点 |
| --- | --- | --- | --- |
| `text-indexing` | 7 | 6 过 / 1 红（运行值错） | 码位长度、BMP 与星平面字符、按码位切片、Cardinal 取字符、`index_of`、`split` |
| `generic-iteration` | 2 | 过 | 泛型容器 + `micro(T) -> i64` 权重函数、`ArrayList<ArrayList<i64>>` |
| `iterator-pipeline` | 2 | 红（构建拒绝） | `filter` 后 `map` 再 `collect`、适配器后接 `fold` |
| `iterator-map-collect` | 1 | 红（构建拒绝） | 单个 `map` 适配器后接 `collect` |
| `iterator-terminal` | 3 | 红（构建拒绝） | 适配器后接 `fold` / `any` / `all`、`enumerate().count()` |
| `higher-order` | 2 | 过 | 命名函数作为比较器与一元函数值 |
| `sorting-comparison` | 2 | 过 | `sort` 类型合同入口、`quick_sort` 显式比较器 |
| `type-ordering` | 2 | 过 | `structure` + `imply Equal/Comparable` 后 `sort`、稳定性 |
| `type-ordering-player` | 1 | 过 | 同上，用仓库既有 solver 的 `Player` 写法复核 |
| `bit-operations` | 6 | 过 | `bit_and` / `bit_or` / `bit_xor`、`count_ones`、`leading_zeros` / `trailing_zeros`、移位、异或交换 |
| `pattern-matching` | 1 | 过 | 扁平带载荷 `unite`（零元/单字段/双字段）与 `match` |
| `option-match` | 1 | 红（运行值错） | `Option` 的 `Some` / `None` 匹配（`None` 分支为空） |
| `option-match-nonempty` | 1 | 红（构建拒绝） | 对照：`None` 分支非空，排除空块因素 |
| `recursive-union` | 2 | 过 | 递归带载荷 `unite`（`Expr`）与递归求值 |
| `result-errors` | 2 | 过 | `Result<i64, <自定义 unite>>` 的 `unwrap_or` / `unwrap_or_else` |
| `result-fold` | 1 | 过 | 同上，`fold` 两个方向处理函数 |
| `result-match` | 1 | 过 | `Result` / `Option` 三态匹配 |
| `result-plain` | 1 | 过 | 对照：`Result<i64, i64>` 的 `fold` |
| `result-utf8-payload` | 1 | 红（构建拒绝） | `Result<i64, utf8>` 的构造与 `fold` |
| `integer-boundaries` | 6 | 5 过 / 1 红（运行值错） | i64 边界位模式、i64→i32 截断、除法向零截断、i32 边界提升、加法越界 |
| `struct-literal` | 1 | 过 | 具名字段结构体字面量 |

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
