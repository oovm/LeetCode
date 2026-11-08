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

当前：88 场景 / 255 用例，144 过、111 红（构建拒绝 106、运行断言失败 5）。这些数字与全表状态只对下面这套工具链成立。

### 状态出处

| 角色 | 本次取值 | 证据 |
| --- | --- | --- |
| 编译器原生 binding | `@nyar/valkyrie` `0.0.22` 的 `valkyrie.win32-x64-msvc.node`，sha256 `19AB115A412BD2D27A3A03D6B1B2644AA1BD1590EE507CEB0032049C89E7ECBE`，短标识 `c19AB115A` | 文件 mtime `2026-11-07 07:37:30 (+08)`。原生产物未内嵌源码 rev |
| 编译器源码边界 | 构建时刻之前最后一条提交 `350d49c3`（2026-11-07 05:46:58），之后第一条 `d7c65e6b`（07:37:59），实际 rev 落在这两者之间，无法自证。**`nyar-vm.rs` 当前 HEAD `d4ad6ce4`（2026-11-08 16:20:26）晚于该 binding，不能当作本次编译器 rev** | `git log --before/--after` 与 binding mtime |
| 标准库 | `valkyrie.v@9016ae49e609131d876745710dd9b5cb6522856b`，短标识 `s9016ae49` | `git rev-parse HEAD`，`std` 子目录无改动 |
| 装配与运行器 | `@nyar/valkyrie` JS 层 dist 重建于 `2026-11-08 16:14:56`，探针运行器 `scripts/run_v_scenes.ts` | dist 文件 mtime |
| 本次运行 | `pnpm --filter @leetcode/conformance scenes`，输出 `scenes: 73, cases: 199, pass: 112, fail: 87`，退出码 `1`（有红） | 终端输出，2026-11-09 |

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
| `text-indexing` | 7 | 过（第八批重跑，`astralChecksum` 转绿，见 L9） | c19AB115A / s9016ae49 | 码位长度、BMP 与星平面字符、按码位切片、Cardinal 取字符、`index_of`、`split` |
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
| `graph-scc-cycle` | 3 | 过 | c19AB115A / s9016ae49 | Kosaraju 正反两遍扫描求强连通分量数、Kahn 剩余节点判环、无环对照 |
| `string-ordering` | 4 | 过（第八批重跑，`sortedCodePointSum` 转绿，见 L9） | c19AB115A / s9016ae49 | 按码位字典序比较、Unicode 排序位次与码位和 |
| `monotonic-stack-window` | 3 | 红（构建拒绝） | c19AB115A / s9016ae49 | 单调递减栈求下一个更大元素、单调队列滑动窗口最大值、直方图最大矩形（L20） |
| `prefix-sum-binary-search` | 3 | 过 | c19AB115A / s9016ae49 | 前缀和区间和、下界二分、前缀和二分最少项数 |
| `bitmap-bloom` | 3 | 过 | c19AB115A / s9016ae49 | i64 位图置位/清零/查询/异或翻转、popcount、布隆式双哈希成员判定 |
| `recursive-descent-parser` | 3 | 红（构建拒绝） | c19AB115A / s9016ae49 | 手写词法与递归下降表达式求值、递归 `unite` AST（L4） |
| `hash-dedup` | 4 | 过 | c19AB115A / s9016ae49 | 自定义键 `imply Equal/Hash` + 手写 8 桶注册表、`quick_sort` 后相邻 `==` 去重 |
| `union-find-weighted` | 3 | 过 | c19AB115A / s9016ae49 | 带权并查集：递归 `find_root` 压缩偏移、按分量大小合并、`distance` |
| `heap-kway-merge` | 3 | 过 | c19AB115A / s9016ae49 | 手写最小堆 `push` / `sink` / `pop`、两堆拼接后自底向上堆化、k 路归并 |
| `kmp-automaton` | 3 | 过 | c19AB115A / s9016ae49 | 前缀函数、两字母表自动机状态转移、`patternPeriod` |
| `dp-interval-knapsack` | 3 | 过 | c19AB115A / s9016ae49 | 区间 DP（矩阵链）、01 背包倒序容量、无限背包正序容量 |
| `mini-interpreter` | 4 | 红（构建拒绝） | c19AB115A / s9016ae49 | 词法 + 递归下降 + 求值 + 错误链，叠加递归 `unite` / `Result` 传播 / 迭代器链（L1，探针另见 L21、L7） |
| `csv-tsv-parser` | 6 | 红（构建拒绝） | c19AB115A / s9016ae49 | 手写 CSV/TSV：引号字段、双引号转义、空字段、CRLF、未闭合与字段中途引号错误链（L7） |
| `json-roundtrip` | 5 | 红（构建拒绝） | c19AB115A / s9016ae49 | 递归 `unite Json` 与递归下降解析、转义写回、`null` 往返、畸形输入错误链（L21） |
| `regex-nfa` | 6 | 红（构建拒绝） | c19AB115A / s9016ae49 | Thompson NFA：字面、`.`、`*`、epsilon 闭包、多起点扫描、悬挂闭包错误链（L21） |
| `config-table-report` | 6 | 红（构建拒绝） | c19AB115A / s9016ae49 | 键值配置解析、右对齐表格、i64 与 f64 Display 往返（L24） |
| `float32-display` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | `f32` Display（1.5）（L24） |
| `state-machine-dispatch` | 4 | 过 | c19AB115A / s9016ae49 | `enums` 状态机 + `unite` 命令分发 + FIFO 事件队列 |
| `numeric-roundtrip` | 7 | 红（构建拒绝） | c19AB115A / s9016ae49 | 整数解析/显示往返、MIN/MAX、溢出探针、f64 位重解释与负零（L26，位重解释另见 L25） |
| `string-escape-quote` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | 字符串 `\"` 转义（L22） |
| `enum-equality` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | 用户 `enums` 的 `==`（L23） |
| `integer-narrow-casts` | 6 | 过 | c19AB115A / s9016ae49 | `i8` / `u8` / `i16` / `u16` / `u32` 截断与符号扩展、负值按模取低字节 |
| `integer-shift-widths` | 6 | 5 过 / 1 红（运行值错） | c19AB115A / s9016ae49 | 算术与逻辑右移、`i8` 移位饱和与越界归零、`1 << 62`、`1 << 64` 实测 |
| `integer-division-signs` | 5 | 红（构建拒绝） | c19AB115A / s9016ae49 | 商向零截断、余数随被除数、`u32` 无符号除法、`i32` MIN / -1 探针（L28） |
| `container-linked-list` | 3 | 红（构建拒绝） | c19AB115A / s9016ae49 | 双端建表、两端出队、长度与 `contains`（L32，std 源码自身不可编译） |
| `container-deque-stack-queue` | 3 | 过 | c19AB115A / s9016ae49 | `Deque` 两端进出、`Stack` 后进先出、`Queue` 先进先出与排空 |
| `container-ring-buffer` | 2 | 红（构建拒绝） | c19AB115A / s9016ae49 | 容量边界拒绝、尾指针回绕（L33） |
| `option-map-chain` | 6 | 红（构建拒绝） | c19AB115A / s9016ae49 | `Option::map` / `and_then` / `filter` 组合子（L29，守卫匹配触发 CAN015） |
| `option-alternatives` | 5 | 红（构建拒绝） | c19AB115A / s9016ae49 | `or_else` / `unwrap_or_else` / `flatten` 与嵌套 `Option` 构造（L30、L31） |
| `text-case-transforms` | 4 | 2 过 / 2 红（运行值错） | c19AB115A / s9016ae49 | `to_upper` / `to_lower`（L34）、`replace` 形状、`starts_with` / `ends_with` / `contains` |
| `text-split-once` | 4 | 过 | c19AB115A / s9016ae49 | `split_once` 的 `head` / `tail`、无分隔符返回 `None`、`split_whitespace` 段长 |
| `char-classification` | 3 | 过 | c19AB115A / s9016ae49 | `is_ascii_digit` / `is_ascii_alpha` / `is_ascii_alphanumeric` / `is_ascii_vowel` 计数、非 ASCII 对照、`char::from` |
| `struct-methods-imply` | 3 | 过 | c19AB115A / s9016ae49 | `structure` + `imply` 的 `Self` 构造、`mut self` 方法改写、嵌套结构体字段读写 |
| `struct-value-semantics` | 2 | 过 | c19AB115A / s9016ae49 | 赋值共享存储实测、`mut` 形参改写对调用方可见 |
| `panic-traps` | 3 | 过 | c19AB115A / s9016ae49 | 除零与 `None.unwrap()` 可观察拒绝、`Some.unwrap()` 正常返回 |
| `panic-explicit` | 1 | 红（构建拒绝） | c19AB115A / s9016ae49 | `panic` 的发散类型（L35） |

## 对账：46 用例 → 当前 255 用例

上一批口径：21 场景 / 46 用例，25 过、21 红（构建拒绝 19、运行断言失败 2）。
第一批新增 6 场景 / 12 用例，全过。第二批新增 6 场景 / 12 用例，10 过、2 红
（`scenes/dijkstra` 两例，属 L11）。第三批新增 5 场景 / 11 用例，5 过、6 红
（`iterator-long-chain` 2 例属 L12，`generic-constraints` 2 例属 L13，`recursive-unite-tree` 2 例属 L14）。
第四批新增 8 场景 / 19 用例，12 过、7 红（`trait-default-impl` 2 例属 L15，
`result-propagation` 4 例属 L16，`enum-variant-argument` 1 例属 L17）。
第五批新增 6 场景 / 22 用例，14 过、8 红（`struct-equal-hash` 4 例属 L18，
`custom-error-chain` 4 例属 L7）。
第六批新增 6 场景 / 19 用例，12 过、7 红（`string-ordering` 1 例属 L9，
`monotonic-stack-window` 3 例属 L20，`recursive-descent-parser` 3 例属 L4）。
第七批新增 6 场景 / 20 用例，16 过、4 红（`mini-interpreter` 4 例属 L1，构建在首个错误处停止）。
第八批新增 9 场景 / 38 用例，4 过、34 红（`state-machine-dispatch` 4 例全过；
`csv-tsv-parser` 6 例归 L7，`json-roundtrip` 5 例与 `regex-nfa` 6 例归 L21，
`config-table-report` 6 例与 `float32-display` 1 例归 L24，`numeric-roundtrip` 7 例归 L26，
`string-escape-quote` 1 例归 L22，`enum-equality` 2 例归 L23）。
第九批新增 8 场景 / 36 用例，15 过、21 红（`integer-narrow-casts` 6 例与
`integer-shift-widths` 6 例全过、`container-deque-stack-queue` 3 例全过；
`integer-division-signs` 5 例归 L28，`container-linked-list` 3 例归 L32，
`container-ring-buffer` 2 例归 L33，`option-map-chain` 6 例归 L29，`option-alternatives` 5 例归 L31）。
累计 25 + 12 + 10 + 5 + 12 + 14 + 12 + 16 + 4 + 15 = 125 过。
第十批新增 7 场景 / 20 用例，17 过、3 红（`text-split-once` 4 例、`char-classification` 3 例、
`struct-methods-imply` 3 例、`struct-value-semantics` 2 例、`panic-traps` 3 例全过，
`text-case-transforms` 另 2 例过；`text-case-transforms` 的 `upperChecksum` / `lowerChecksum` 归 L34，
`panic-explicit` 1 例归 L35）。
另有两例既有运行断言红在本批重跑中转绿（`text-indexing::astralChecksum`、
`string-ordering::sortedCodePointSum`），见下方「红点观测变化」与 L9。
当前口径（第八批全量重跑 + 第九、十批批内重跑）：
**88 场景 / 255 用例，144 过、111 红（构建拒绝 106、运行断言失败 5）**。

- **前七批没有红翻绿用例**，新增都只做加法：第一批后 25 + 12 = 37，第二批再 +10 = 47，
  第三批再 +5 = 52，第四批再 +12 = 64，第五批再 +14 = 78，第六批再 +12 = 90，第七批再 +16 = 106。
  第八批新增 4 过，另有 2 例既有红转绿，累计 106 + 4 + 2 = 112；第九批再 +15 = 127；第十批再 +17 = 144。
- **第九、十批只跑了批内场景**（`scenes <本批 id>`），没有重跑全表；上一批场景的状态沿用第八批
  全量结果。两批都没有改动任何既有场景源码或期望值，因此沿用成立；下次全量重跑时需复核。
- 第九批唯一的运行值错来自自己写错的期望值：`integer-shift-widths::shiftLeftInRange` 的 `1 << 62`
  初版在 `scene.json` 里写成 JSON 数值，超过 `2^53` 被 `JSON.parse` 截成 `4611686018427388000`。
  改成十进制字符串后复跑通过，不是编译器缺陷，也不入库为缺口。
- 第十批有一处同类笔误：`struct-methods-imply::nestedFieldUpdate` 初版期望写成 710，
  实际表达式是 `before * 10 + width` = 7 * 10 + 10 = 80，改成 80 后通过。同属场景自身错误，不入账。

### 第十批实测的语义（未冻结，只记录）

- **结构体赋值共享存储**：`let a: Point = ...` 后 `let mut b: Point = a; b.x = 9`，
  读 `a.x` 得到 9（`scenes/struct-value-semantics::assignmentSharing` 实测 99）。
  语义未冻结，本账不判定是值复制还是引用共享，只记录当前行为。
- **`mut` 形参改写对调用方可见**：`shift_x(mut point: Point, delta)` 连续两次改写同一实参后
  调用方读到累计值（4 + 5 + 3 = 12）。这与 `scenes/union-find`、`scenes/segment-tree`
  既有用法一致，按已成立语义计。
- **陷阱语义成立**：`10 / 0` 与 `None.unwrap()` 都按 `expected: "trap"` 可观察拒绝，
  `Some(42).unwrap()` 正常返回 42。因此 `panic` 的失败（L35）是表达式类型问题，不是 trap 机制缺失。
- 第七批的 4 条红全部来自 `mini-interpreter` 的模块级构建失败，构建停在首个错误（L1 的 `.collect`）。
  去掉迭代器出口后的临时探针（已删除）显示后续还有两层阻塞：`match` 绑定载荷进 `Fine` 触发 L21，
  以及 `Result<Expr, <自定义 unite>>` 撞 L7 布局冲突。因此该场景的 4 条红只按首个错误归 L1，
  后续层的结论来自探针，不计入用例级红。
- **红点观测变化（第八批）**：`text-indexing::astralChecksum` 与 `string-ordering::sortedCodePointSum`
  在同一 binding sha256 与 std `9016ae49` 下重跑转绿。先前判定「修复在更晚的 `246eeb0`」因此不再成立，
  但也没有证据表明工具链被替换过。按口径记为「当前 pin 复跑通过，待独立复验」：
  不据此关闭 L9、不改场景、不把这次变化归因于编译器修复。整表重跑后这两条已移出红表。
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

### 111 条红与 L 条目的对应

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
| `monotonic-stack-window::nextGreaterSum` | 1 | L20 | SMIR007 `jump arity differs from target block parameters` |
| `monotonic-stack-window::windowMaxSum` | 1 | L20 | 同上（模块级构建失败，未进入用例级判定） |
| `monotonic-stack-window::histogramLargest` | 1 | L20 | 同上 |
| `recursive-descent-parser::evaluatePrecedence` | 1 | L4 | CAN054 递归 payload 未实例化（`at Expr::Negate`） |
| `recursive-descent-parser::evaluateParenNegate` | 1 | L4 | 同上 |
| `recursive-descent-parser::evaluateIntegerDivision` | 1 | L4 | 同上 |
| `mini-interpreter::evaluatePrecedence` | 1 | L1 | `unresolved call` `<fn value>.collect`（探针另见 L21、L7） |
| `mini-interpreter::evaluateNested` | 1 | L1 | 同上（模块级构建失败，未进入用例级判定） |
| `mini-interpreter::divisionByZeroCode` | 1 | L1 | 同上 |
| `mini-interpreter::iteratorTokenTotal` | 1 | L1 | 同上 |
| `csv-tsv-parser::csvFieldCount` | 1 | L7 | 布局 `std.diagnostic.Diagnostic` 合同冲突 |
| `csv-tsv-parser::csvQuotedCommaChecksum` | 1 | L7 | 同上 |
| `csv-tsv-parser::csvEscapedQuoteChecksum` | 1 | L7 | 同上 |
| `csv-tsv-parser::csvCrLfFieldCount` | 1 | L7 | 同上 |
| `csv-tsv-parser::csvUnterminatedCode` | 1 | L7 | 同上 |
| `csv-tsv-parser::csvUnexpectedQuoteCode` | 1 | L7 | 同上 |
| `json-roundtrip::jsonArrayLength` | 1 | L21 | `parse_array` 返回类型带 `T[GenericBinderId]` |
| `json-roundtrip::jsonRoundTripChecksum` | 1 | L21 | 同上（模块级构建失败，未进入用例级判定） |
| `json-roundtrip::jsonEscapedChecksum` | 1 | L21 | 同上 |
| `json-roundtrip::jsonMalformedCode` | 1 | L21 | 同上 |
| `json-roundtrip::jsonNullChecksum` | 1 | L21 | 同上 |
| `regex-nfa::nfaLiteralMatch` | 1 | L21 | `compile_rest` 返回类型带 `T[GenericBinderId]` |
| `regex-nfa::nfaStarMatch` | 1 | L21 | 同上（模块级构建失败，未进入用例级判定） |
| `regex-nfa::nfaDotMatch` | 1 | L21 | 同上 |
| `regex-nfa::nfaNoMatch` | 1 | L21 | 同上 |
| `regex-nfa::nfaScanCount` | 1 | L21 | 同上 |
| `regex-nfa::nfaDanglingCode` | 1 | L21 | 同上 |
| `config-table-report::configEntryCount` | 1 | L24 | `display_float64` SMIR007 拖垮模块 |
| `config-table-report::configValueSum` | 1 | L24 | 同上（模块级构建失败，未进入用例级判定） |
| `config-table-report::configTableChecksum` | 1 | L24 | 同上 |
| `config-table-report::configFirstLineWidth` | 1 | L24 | 同上 |
| `config-table-report::integerFormatChecksum` | 1 | L24 | 同上 |
| `config-table-report::float64FormatChecksum` | 1 | L24 | `std.text::display_float64` 返回类型 `Utf8` vs `Nominal ItemId(86)` |
| `float32-display::float32DisplayChecksum` | 1 | L24 | `std.text::display_float32` 返回类型 `Utf8` vs `Nominal ItemId(85)` |
| `numeric-roundtrip::integerRoundTripChecksum` | 1 | L26 | MIR lowering unresolved callable identity（`f64`） |
| `numeric-roundtrip::integerMinRoundTripChecksum` | 1 | L26 | 同上（模块级构建失败，未进入用例级判定） |
| `numeric-roundtrip::integerMaxFormatChecksum` | 1 | L26 | 同上 |
| `numeric-roundtrip::integerBadDigitCode` | 1 | L26 | 同上 |
| `numeric-roundtrip::integerOverflowProbe` | 1 | L26 | 同上 |
| `numeric-roundtrip::float64BitsRoundTrip` | 1 | L26 | 同上（解 L26 后另见 L25） |
| `numeric-roundtrip::negativeZeroBits` | 1 | L26 | `-zero` 触发 MIR lowering 未解析 `f64` |
| `string-escape-quote::escapedQuoteLength` | 1 | L22 | `unterminated quoted literal` |
| `enum-equality::sameEnumEqual` | 1 | L23 | `unresolved call` `infix ==`：4 个候选均不匹配 |
| `enum-equality::differentEnumEqual` | 1 | L23 | 同上（模块级构建失败，未进入用例级判定） |
| `integer-division-signs::truncationTowardZero` | 1 | L28 | `let` 初始化 `i32` vs `i64`（`i32` / `i64` 除法并存） |
| `integer-division-signs::negativeBothSigns` | 1 | L28 | 同上（模块级构建失败，未进入用例级判定） |
| `integer-division-signs::negativeRemainder` | 1 | L28 | 同上 |
| `integer-division-signs::unsignedDivision` | 1 | L28 | 同上 |
| `integer-division-signs::i32MinDivMinusOneProbe` | 1 | L28 | 同上；MIN / -1 溢出行为尚无实测值 |
| `container-linked-list::linkedListFrontBack` | 1 | L32 | `unresolved constructor LinkedListNode`（std 源码） |
| `container-linked-list::linkedListMembership` | 1 | L32 | 同上（模块级构建失败，未进入用例级判定） |
| `container-linked-list::linkedListDrainOrder` | 1 | L32 | 同上 |
| `container-ring-buffer::ringBufferBounds` | 1 | L33 | `unresolved call data.push`：`T.default` 不可解析 |
| `container-ring-buffer::ringBufferWrapAround` | 1 | L33 | 同上（模块级构建失败，未进入用例级判定） |
| `option-map-chain::optionMapSquare` | 1 | L29 | CAN015 `UseBeforeDefinition`（`filter` 的守卫匹配拖垮模块） |
| `option-map-chain::optionMapNone` | 1 | L29 | 同上（单独探针已验证 `map` 可用） |
| `option-map-chain::optionAndThenChain` | 1 | L29 | 同上（单独探针已验证 `and_then` 可用） |
| `option-map-chain::optionAndThenMiss` | 1 | L29 | 同上 |
| `option-map-chain::optionFilterKeeps` | 1 | L29 | 守卫匹配 `case Some(value) if predicate(value):` |
| `option-map-chain::optionFilterDrops` | 1 | L29 | 同上 |
| `option-alternatives::optionOrElseRecovers` | 1 | L31 | `unresolved call Some`（`Some(None)` 拖垮模块） |
| `option-alternatives::optionOrElseSkips` | 1 | L31 | 同上（单独探针已验证 `or_else` 可用） |
| `option-alternatives::optionFlattenInner` | 1 | L31 | 同上；解 L31 后另见 L30 |
| `option-alternatives::optionFlattenMissing` | 1 | L31 | `Some(None)` 内层类型无法推断 |
| `option-alternatives::optionUnwrapOrElse` | 1 | L31 | 同上（单独探针已验证 `unwrap_or_else` 可用） |
| `text-case-transforms::upperChecksum` | 1 | L34 | `to_upper` 返回原文，实测码位和 500 |
| `text-case-transforms::lowerChecksum` | 1 | L34 | `to_lower` 返回原文，实测码位和 500 |
| `panic-explicit::explicitPanic` | 1 | L35 | `panic` 的 return 操作数是 `Unit`，与 `i64` 不符 |

按条目汇总：L1 7 条、L2 2 条、L3 1 条、L4 5 条、L5 3 条、L6 1 条、L7 14 条、L8 3 条、
L10 1 条、L11 2 条、L12 2 条、L13 2 条、L14 2 条、L15 2 条、L16 4 条、L17 1 条、L18 4 条、
L20 3 条、L21 11 条、L22 1 条、L23 2 条、L24 7 条、L26 7 条、L28 5 条、L29 6 条、L31 5 条、
L32 3 条、L33 2 条、L34 2 条、L35 1 条，合计 111 条。
L9 在当前 pin 复跑已无红。L19、L25、L27、L30 只有探针证据，不计红。

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
  `scenes/iterator-terminal/scene.v` 的 `foldSum`（`<fn value>.fold`）、`scenes/mini-interpreter/scene.v`
  的 `iterator_token_total`（`tokens.into_iterator().map(token_value).collect()`，模块级首个错误）、
  以及文本场景最初的 `text.index_of("中").map_or(...)`。同一代码改成先绑定局部变量再调方法即可通过
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
- 同根：`scenes/recursive-descent-parser/scene.v` 的 `unite Expr`（`Negate { operand: Expr }` /
  `Binary { op, left, right: Expr }`）报同一 CAN054：`sum 物理 payload 类型未完成实例化:
  Nominal declaration ItemId(308) … (at Expr::Negate)`，三个用例均在构建阶段被拒。
- 状态：未验证。原「已关闭」没有 rev 依据，撤回；本次 `c19AB115A / s9016ae49` 仍报 CAN054。

### L5 MIR lowering `construct missing HIR callable contract`

- 分类：编译器（MIR lowering）
- 最小复现：`scenes/type-ordering/scene.v` 与 `scenes/type-ordering-player/scene.v`
  的 `sortRankChecksum` / `sortPlayerChecksum`：`structure` + `imply Equal` + `imply Comparable` 后调用单参 `sort`
- 证据：`(valkyrie.mir.diagnostic_rejected): MIR lowering unresolved callable identity `construct missing HIR callable contract``
- 说明：`scenes/struct-literal` 证明结构体字面量本身可用；同一写法出现在
  `projects/problems/best-team-with-no-conflicts/solvers/valkyrie/solution.v`，
  该题 V 解当前应同样红，需编译器线确认是否回归。
- 状态：**已验证关闭**（编译器 rev `eedcf673`，2026-11-09）。按该 rev 从 `wt/legion-text-carrier` 重建
  `valkyrie-napi` 并经 `VALKYRIE_NATIVE` 绑定复跑这两场景 3 例，`3/3 PASS`；同一命令换回 2026-11-07 的平台 addon
  （早于修复 `4a2ddafa`）为 `0/3` 全红。因此修复确为 `4a2ddafa` 的「按 declaration 身份合并布局、重映射本地
  `LayoutId`」。此前 `c19AB115A / s9016ae49` 的复红记录保留为旧工具链证据，不覆盖。

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
  在 `c19AB115A / s9016ae49` 下同样命中本条布局冲突。临时探针（已删除）另确认：`unite` 变体的位置构造器可过 HIR；
  写成结构体字面量 `Range { code: 2 }` 会报 `unresolved constructor`，该形态已独立登记为 L19，不再按「探针写法问题」排除。
- 触发条件（实测范围已扩大）：`Result` **任一侧**载荷是用户自定义 `unite` 即命中，不是只限失败载荷。
  - 失败载荷位：`Result<i64, <自定义 unite>>`（`scenes/result-errors`、`scenes/result-fold`、`scenes/result-match`、`scenes/custom-error-chain`）。
  - 成功载荷位：`Result<Expr, i64>`（`Expr` 是自定义 `unite`，错误位是标量）同样命中，见
    `_probe-local-fine` 形态（`match` 外无 `Fine(局部)`，仅 `Result<Expr, i64>` 的构造与消费）。
  - 对照：`scenes/result-plain`（`Result<i64, i64>`）通过，因此触发点在「自定义联合出现在 `Result` 的任一载荷位」，
    不是 `Result` 本身，也不是「失败位」这一位置属性。
- 根因：`LayoutId` 是模块本地编号。依赖模块与 consumer 各自为同一 declaration 产出一份
  布局，字段里的 `Nominal { layout }` 带着各自的本地编号；链接合并直接按原始编号比较
  形状，把「同一声明、同形状」误判成合同冲突。修复在 link 阶段按 declaration 身份合并，
  并先把依赖侧本地 `LayoutId` 重映射到合并身份再核对合同（真实尺寸/对齐差异仍失败闭合）。
  成功载荷位与失败载荷位共用同一条 link 合并路径，因此两者同根因，不另立条目。
- 状态：未验证。原「已关闭」以及「25 过 → 35 过」的数字都没有记录 rev，撤回；
  本次 `c19AB115A / s9016ae49` 下 `result-errors`、`result-fold`、`result-match` 四例仍红。
  成功载荷位的独立探针同样只作形状证据，未记录 rev。

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
- 同根：`scenes/string-ordering/scene.v` 的 `sorted_code_point_sum` 期望 `149043`
  （`97 + 122 + 233 + 20013 + 128578`），实得 `83507`，差值恰为 `65536`（`0x10000`），
  即 `🙂` 的码位仍被截成 `0xF642`。
- 状态更正：**待独立复验，不据此改场景**。本仓钉住的 std 是 `9016ae49`；先前判断「星平面修复在更晚的
  `246eeb0`（`🐛 Keep astral code points intact in `char` decoding`），本 pin 早于修复」。
- 第八批全量重跑：`c19AB115A / s9016ae49` 未变，但上述两例均 PASS（期望值与场景源码均未改）。
  这与「本 pin 早于修复」的判断冲突，原因未定位（可能是先前运行受缓存或装配产物影响）。
  记为「当前 pin 复跑通过，待独立复验」，不作为关闭依据，也不据此删除 L9。

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
- 修复（编译器 `eedcf673`，父 `2be0cdc0`，已推 `origin/dev`）：`hir/overload/resolve_call/resolve.rs`
  的实参遍历改用 `resolve_argument_expr`，对裸变体做「去掉外层期望类型」重试并改写成带 `resolved` 的
  `Construct`，不再把 `Variable` 留给下游。重试只对实参位置开启，普通表达式位置行为不变
  （`case None: return None` 等既有 fail-open 形态不受影响）。
- 回归锁：`bare_variant_argument_gets_constructor_identity`
  （`rusty-valkyrie/tests/frontend/hir/variant_auto_constructor_call_tests.rs`），断言 `Bad` 与
  `DivisionByZero` 均带 resolved 调用。
- 端到端复核（2026-11-09，编译器 `eedcf673`）：用该 rev 重建的 addon 跑本场景，
  `enum-variant-argument::inlineVariant` PASS（`1/1`）。

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

### L19 同包用户自定义 `unite` 变体不能按具名字段构造

- 分类：编译器（HIR 构造器解析，`valkyrie.hir.unresolved_constructor`）
- 文档与语料：`valkyrie.v/documentation/pages/zh-hans/language/declarations.md` 写明
  「每个变体使用 record-style 字段定义。构造与匹配**还可**使用紧凑语法 `Some(x)` / `case Some(x)`」，
  即具名字段构造是变体的主写法、位置构造是补充；std 源码同样以具名字段构造变体，
  如 `projects/std/source/text/char.v` 的 `Some { value: ... }`。
- 最小复现（临时探针已删除，未入库）：同包内声明
  `unite Code { [constructor] Span { code: i64 } }`，构造 `let value: Code = Span { code: 2 }`
- 证据：`valkyrie.hir.unresolved_constructor`（`Span`）构建拒绝；同一变体的位置构造 `Span(2)` 可通过 HIR。
- 对照：
  - 去掉 `[constructor]`、只留 record-style 字段：复红；
  - 补 `[tag(0)]` + `[tag(1, default)]` 变体形状：复红；
  - 导入 std：`Option` 写 `Some { value: 2 }`、`Result<i64,i64>` 写 `Fine { value: 2 }` 均构建通过并返回值正确；
  - 导入 `std.data::DataSource` 写 `Text { text, digest }` 复红，但 `Text` 同时是 `std.text` 的公开名，
    该例可能是名字冲突而非本条，不作为本缺口证据。
  据此怀疑缺口在「同包用户自定义 `unite` 的具名字段构造器未注册」，而非 record-style 声明写法或 std 导入本身；该判定待下条复核。
- 影响：用户态变体只能用位置构造器，字段顺序一变就要全量改调用点，record-style 声明退化为无意义文档。
- 复核（2026-11-09，父 rev `2be0cdc0`，修复 rev `eedcf673`）：上述最小复现
  （`unite Code { [constructor] Span { code: i64 } }` + `let value: Code = Span { code: 2 }`）在无 std 同名冲突的
  frontend fixture 中**通过**（`same_package_unite_named_construction_with_annotation_resolves`），未复现
  `unresolved_constructor`。`Span` 同时是 `std::diagnostic` 的公开 `structure Span`，与本条已排除的 `Text`
  属同一类同名冲突，因此现有证据不足以支撑「同包用户自定义 `unite` 的具名字段构造器未注册」。
- 状态：待探针复核。拿到探针 rev/场景后，在带 std 导入的包内用非冲突变体名复跑；复现成立前不改判，
  也不删 `hir/lowering/contract_validation.rs:390-398` 的 fail-closed 门禁、不删 `hir/lowering/expr_lowering.rs:597`
  的 `resolved: None` 占位（两者同属闭合段，需先让「已解析但无身份」在类型上不可构造）。
- 待办：未入库场景；编译器线修复后应补一个回归场景，锁 `Span { code: 2 }` 与 `Span(2)` 等价。
  具名构造的 `FieldInit.field_id` 已在 `resolve_expr_calls_at` 按声明身份回填
  （新增 `AggregateFieldIndex::fields_by_declaration`），回归断言 `field_id: Some(_)`。

### L20 嵌套循环的 `if/else` 分支改写集合与循环标志触发 SMIR007

- 分类：编译器（SMIR 跳转参数）
- 最小复现（临时探针已删除，未入库）：外层 `while` 内嵌内层 `while shrinking && stack.length() > 0`，
  体内 `if top <= current { stack.pop() } else { shrinking = false }`
- 证据：`(SMIR007): jump arity differs from target block parameters`，
  坐标 `scenes/monotonic-stack-window/scene.v` 的 `next_greater_sum`，block 11 terminator。
  同一模块级构建失败同时覆盖 `window_max_sum` 与 `largest_rectangle`，三个用例均未进入运行值比对。
- 对照（临时探针，均已删除）：
  - 同样嵌套结构，把 `if/else` 拆成两个并列 `if`：通过；
  - 内层条件改读标量（`counter > 0`）且分支只改标量：通过；
  - 内层 while 提到顶层（不嵌套），保留 `if/else` 与 `pop`：通过；
  - 单层 while 内 `if/else` 各自回写外层 `mut` 标量：通过；
  - 内层条件只读 `stack.length()`、循环体内无 `if/else`：通过。
  因此触发条件是「**嵌套**循环 + 内层条件同时读集合长度与循环标志 + 分支一侧改写集合、另一侧改标志」。
- 影响：单调栈 / 单调队列的标准写法被拒，只有拆成并列 `if` 才构建；这是为编译器让路，不应写进场景。
- 场景保留为回归锁：修复后三例应转绿，不得为变绿把 `if/else` 改写成并列 `if`。

### L21 `match` 分支绑定进 `Fine` 时泛型载荷类型未收敛

- 分类：编译器（类型检查 / 泛型变体构造的类型统一）
- 最小复现（临时探针，已删除；形态取自 `scenes/mini-interpreter`）：函数返回类型声明为
  `Result<Expr, i64>`，`let value: Expr = match input { case Fine(inner): inner case Fail(code): return Fail(code) }`
  之后 `return Fine(value)`
- 证据：
  `` `return` value type `Nominal(ItemId(20))<T[Some(GenericBinderId { owner: ItemId(20), ordinal: 0 })], i64>` is incompatible with the function return type `Nominal(ItemId(20))<Nominal(ItemId(34)), i64>` in function `pass_through` ``
  `scenes/mini-interpreter` 的 `parse_expression` 是同形态（`ItemId(82)` 为 `Result`、`ItemId(381)` 为 `Expr`、
  `ItemId(385)` 为 `CalcError`），报同一句类型不兼容
- 对照（同批临时探针，均已删除）：
  - `return Fine(expr)`，`expr` 是形参：通过类型检查；
  - `let value: Expr = expr` / `let value: Expr = make_literal()` 后 `Fine(value)`：通过类型检查
    （随后停在本条外的 L7 布局冲突）；
  - `match input { case Fine(inner): Fine(inner) case Fail(code): Fail(code) }` 直接作为 return 表达式：通过类型检查；
  - `Result<i64, 自定义 unite>` 与 `Result<i64, i64>` 的 `Fine` / `Fail` 直接构造：通过类型检查。
  因此触发点是「`match` 结果先绑定到局部变量，再作为 `Fine` 实参」，而不是 `Fine`、`Result` 或自定义错误类型本身。
- 解释（未证实）：`match` 表达式的结果类型保留了未解泛型 binder，局部变量注解 `Expr` 没有把该 binder
  收敛到 `Expr`，于是 `Fine(value)` 仍按 `Result<T<binder>, i64>` 构造。属类型检查侧问题，待编译器线确认。
- 影响：`Result` 作为解析器/求值器返回类型时，任何「先从 `match` 取成功值、再重新包成 `Fine`」的写法都不可编译。
- 后续：`scenes/mini-interpreter` 的 4 条红当前只按首个错误归 L1；解掉 L1 后应先复验 L21，再看 L7。
- 第八批复现：`scenes/json-roundtrip`（`parse_array`）与 `scenes/regex-nfa`（`compile_rest`）都是同一形态 ——
  `match` 取出 `Fine` 载荷后作为 `Fine` 实参，返回类型残留 `T[Some(GenericBinderId ...)]`。
  两场景源码保持理想写法，作为本条回归锁。

### L22 字符串字面量中的 `\"` 转义未生效

- 分类：编译器（词法，`valkyrie.frontend.parse.syntax`）
- 文档：`valkyrie.v/documentation/pages/zh-hans/language/lexical-structure.md:191` 写明
  「`\n`、`\t`、`\"` 这类转义序列在普通字符串中生效」。
- 最小复现：`scenes/string-escape-quote/scene.v` 的 `escaped_quote_length`：
  `let text: utf8 = "a\"b"`，期望长度 3
- 证据：`error[valkyrie.frontend.parse.syntax]: unterminated quoted literal: opening run of 1 `"` requires a closing run of 1`
- 对照（临时探针，已删除）：`\n` / `\t` / `\\` 在普通字符串中均可用，只有 `\"` 失败。
- 影响：需要内嵌双引号的 CSV / JSON 文本只能改用 `Utf8Builder` 逐字符拼装，
  字符串字面量表达力与文档承诺不一致。
- 场景保留为回归锁：修复后应恢复 `"a\"b"` 字面量写法。

### L23 用户 `enums` 缺少 `==` / `!=` 实现

- 分类：编译器（`valkyrie.hir.unresolved_call`）
- 最小复现：`scenes/enum-equality/scene.v` 的 `same_enum_equal`：`enums Phase { Alpha Beta }` 后
  `if left == right`
- 证据：``unresolved call `infix ==` in same_enum_equal: 4 candidate(s) share the name, but none matches the argument types``
- 对照（临时探针，已删除）：`!=` 同样无匹配（`6 candidate(s)`）。std 现网 `enums` 判定全部走 `match`，
  如 `valkyrie.v/projects/std/source/operator/comparable.v` 的 `Ordering` 手写 4 × 4 嵌套 `match` 后
  由 `imply` 提供 `==` / `!=`。
- 待决：本场景未写 `imply`，隐含期望是「无载荷 `enums` 默认结构相等」。需产品确认该期望是否成立：
  若结论是「必须手写 `imply`」，本条改记为文档缺口，并在 `enums` 文档写明无默认相等。
- 影响：状态码比较只能改写为 `match` 或先映射到数值，`enums` 不能直接作为相等判定键。

### L24 `std.text` 浮点 Display 在 wasm 目标触发 SMIR007

- 分类：标准库（`std.text::display_float64` / `display_float32`），在 SMIR 合同校验处失败
- 最小复现：`scenes/float32-display` 的 `f32::from_bits(0x3fc00000 as u32).display()`；
  `scenes/config-table-report` 的 `float64FormatChecksum` 对 `0.1f64` 与 `1234.5678f64` 调 `.display()`
- 证据：
  ``(SMIR007): Semantic MIR 合同失败: function=std.text::display_float64, location=block 4 terminator, detail=return operand type differs from function return type (actual=Utf8, expected=Nominal { declaration: ItemId(86), arguments: [], primitive_identity: None })``
  `display_float32` 同形态，`declaration: ItemId(85)`。两次运行的 ItemId 相差 1（87/86 与 86/85），
  属不同模块的实例编号，不是两种缺陷。
- 坐标：`valkyrie.v/projects/std/source/text/float_display.v` 的 `display_float64`（412 行起）与
  `display_float32`（456 行起）
- 对照：`i64` 的 `.display()` 路径在其它场景通过（如 `big-int`、`integer-boundaries`），
  因此不是 `display` 方法本身，而是浮点 Display 的返回类型在 MIR 里退化成裸 `Utf8`。
- 影响：f32 / f64 的 Display 往返无法在 wasm 目标验证。`config-table-report` 的四个整数用例
  与两个浮点用例同属一个模块，模块级构建失败后均未进入用例级判定。

### L25 `f64::to_bits` 在 wasm 后端缺少 `i64.reinterpret_f64` 助记符

- 分类：编译器（wasm 后端 operator 绑定）
- 最小复现（临时探针，已删除）：`let value: f64 = f64::from_bits(0x3ff0000000000000); value.to_bits() as i64`
- 证据：``WASM `wasm_operator` 绑定缺少可编码助记符 `i64.reinterpret_f64`: callee=ItemInstanceId(7) function=std::to_bits``
- 对照：同一探针里 `f64::from_bits` 通过类型检查与 lowering，只有 `to_bits` 在编码阶段失败。
- 影响：`scenes/numeric-roundtrip` 的 `float64BitsRoundTrip` 与 `negativeZeroBits` 依赖该路径，
  但当前该场景先被 L26 挡住，本批未取得位模式实测值。
- 后续：解 L26 后应立即复验本条，再补一条入库场景锁 `0x3ff0000000000000` 往返。

### L26 一元负号作用于 `f64` 触发 MIR lowering 未解析调用身份

- 分类：编译器（MIR lowering）
- 最小复现（临时探针，已删除）：`let zero: f64 = 0.0f64; let value: f64 = -zero`
- 证据：``(valkyrie.mir.diagnostic_rejected): MIR lowering unresolved callable identity `f64``
- 场景坐标：`scenes/numeric-roundtrip/scene.v` 的 `negative_zero_bits`。该错误发生在 lowerring 阶段，
  早于 L25 的 `to_bits` 编码，因此整个模块的七个用例都在构建期失败。
- 对照：`i64` 的一元负号与减法在 `big-int` / `integer-boundaries` 通过；`0.0f64` 字面量与
  `f64` 类型注解本身可用。
- 影响：负零与浮点取负只能改写为位模式操作，而位模式路径又被 L25 挡住，浮点位重解释当前完全不可达。
  `scenes/numeric-roundtrip` 的整数往返与溢出探针也因同模块失败而未取得实测值；溢出语义继续沿用
  L10 的既有观察，本批不作新判定。

### L27 wasm 后端没有 `f32` 原语目标合同

- 分类：编译器（后端私有计划）
- 最小复现（临时探针，已删除）：`let value: f32 = f32::from_bits(0x3fc00000 as u32); value.to_bits() as i64`
- 证据：`后端私有计划生产失败: primitive 尚无目标合同: Float { bits: 32 }`
- 关系：与 L24 不同层。L24 是 `std.text::display_float32` 的返回类型在 MIR 处不一致，
  本条是 wasm 目标侧没有 `f32` 的 primitive 计划。即使 L24 修好，`f32` 值进入 wasm 计算仍会撞本条。
- 影响：`f32` 目前只能作为类型注记出现，不能进入 wasm 目标的可执行路径。
- 待决：是否计划让 wasm 目标直接支持 `f32`，或统一要求用户侧以 `f64` 计算。本批不预设结论。

### L28 同一模块内 `i32` 与 `i64` 的除法/取余并存触发 `let` 初始化类型不兼容

- 分类：编译器（operator 实例解析 / 类型检查）
- 最小复现（临时探针，已删除）：
  `micro a() -> i64 { let q: i32 = 7 / (0 - 2); return q as i64 }` 与
  `micro b() -> i64 { let q: i64 = 7 / (0 - 2); return q }` 同模块
- 证据：`` `let` initializer type `i32` is incompatible with the declared type `i64` ``。
  该句没有行列坐标，报错指不到具体函数。
- 对照（同批临时探针，均已删除）：
  - 只保留 `i64` 除法或只保留 `i32` 除法：通过；
  - `i64` 除法 + `u32` 除法：通过；
  - `u32` 除法 + `i32` MIN / -1：通过；
  - `i32` 除法 + `i64` 除法：失败；`i32` 取余 + `i64` 取余：同样失败；
  - 把 `-1`、`-2` 提成形参或局部变量不改变结论。
  因此触发点是「**同一模块内同时出现 `i32` 与 `i64` 宽的 `/` 或 `%`**」，
  与 MIN 边界值、写不写字面量表达式无关。
- 影响：`scenes/integer-division-signs` 的五个用例全部停在构建期。该场景保留为回归锁，
  不为变绿把 `i32` 用例删掉或改宽到 `i64`。
- 连带：`i32` MIN / -1 的溢出行为本批**未取得实测值**（探针只过了构建，未运行就删除）。
  待 L28 修复后按 `scenes/integer-division-signs` 的 `i32MinDivMinusOneProbe` 重新观测。

### L29 `match` 分支带守卫时触发 CAN015 use-before-def

- 分类：编译器（canonical MIR 校验）
- 最小复现（临时探针，已删除）：
  `let value: Option<i64> = Some(6)` 后
  `match value { case Some(inner) if inner % 2 == 0: inner else: -1 }`
- 证据：``(CAN015): canonical MIR 校验失败: UseBeforeDefinition { function: ItemInstanceId(29), value: MirValueId(4) }``
  三次探针的 `ItemInstanceId` 不同（29 / 33 / 34），`value` 恒为守卫读取的那个位置。
- 对照（同批探针，均已删除）：同样形状去掉守卫 `case Some(inner): inner` 通过；
  `Option::map` / `and_then` / `or_else` / `unwrap_or_else` 全部通过。
- 影响：`valkyrie.v/projects/std/source/types/Option.v` 的 `filter` 正是用守卫实现
  （`case Some(value) if predicate(value):`），所以 `Option::filter` 在 wasm 目标上不可用；
  `scenes/option-map-chain` 的三个 `filter` 用例与另外三个 `map` / `and_then` 用例同属一个模块，
  模块级构建失败后六个用例都未进入用例级判定。场景保留为回归锁。

### L30 `Option::flatten` 在 SMIR 合同处返回泛型 `T` 而非实例化类型

- 分类：标准库（`std.types::Option::flatten`），在 SMIR 合同校验处失败
- 最小复现（临时探针，已删除）：
  `let inner: Option<i64> = Some(5 as i64); let nested: Option<Option<i64>> = Some(inner); nested.flatten()`
- 证据：`function=std::flatten#9, location=block 4 terminator, detail=return operand type differs from function return type (actual=Nominal { ItemId(3)<T[GenericBinderId{ owner: ItemId(3), ordinal: 0 }]> }, expected=Nominal { ItemId(3)<Integer64{ signed: true }> })`
- 对照：`map` / `and_then` / `or_else` / `unwrap_or_else` 在同类嵌套结构上通过；
  把内层换成 `None`（`let inner: Option<i64> = None`）仍报同一句，说明与内层取值无关。
- 解释（未证实）：`flatten` 的 `case Some(value): value` 分支直接把 `Option<T>` 的载荷当返回值，
  该分支的返回操作数保留了未实例化的 binder，MIR 合同拿它和实例化后的返回类型比对。
- 影响：`scenes/option-alternatives` 的 `optionFlattenInner` / `optionFlattenMissing` 不可达；
  `or_else` 与 `unwrap_or_else` 的用例同模块被拖红，但单独探针已证明二者可用。

### L31 嵌套 `Option` 构造不按声明注解收敛内层类型

- 分类：编译器（整数字面量默认类型 / 泛型构造实参推断）
- 最小复现（临时探针，已删除）：
  - `let nested: Option<Option<i64>> = Some(Some(5))`
  - `let nested: Option<Option<i64>> = Some(None)`
- 证据：
  - 前者：`` `let` initializer type `Nominal(ItemId(3))<Nominal(ItemId(3))<i32>>` is incompatible with the declared type `Nominal(ItemId(3))<Nominal(ItemId(3))<i64>>` ``；
  - 后者：``unresolved call `Some` in option_flatten_missing: 1 candidate(s) share the name, but none matches the argument types``。
- 对照：`Some(Some(5 as i64))` 越过本条（随后停在 L30）；单层 `Some(5)` 按注解收敛为 `Option<i64>` 正常
  （`scenes/higher-order`、`scenes/option-alternatives` 的其它用例都依赖该路径）。
- 影响：`scenes/option-alternatives` 的五个用例全部不可达。场景保留理想写法，不改写成 `5 as i64`。

### L32 std `LinkedList` 源码自身不可编译：`LinkedListNode` 构造未解析

- 分类：标准库（`class` 具名字段构造），失败于 `valkyrie.hir.unresolved_constructor`
- 坐标：`valkyrie.v/projects/std/source/collection/LinkedList.v:36`、`:55`（`push_front` / `push_back` 各两处）
- 证据：``error[valkyrie.hir.unresolved_constructor]: unresolved constructor `LinkedListNode` in push_front
  --> source/collection/LinkedList.v:36:39``，共 4 处同根因
- 描述：`class LinkedListNode<T>` 声明之后，`let node: LinkedListNode<T> = LinkedListNode { value: ..., next: ..., prev: ... }`
  这个具名构造没有解析到任何构造函数，`<T>` 显式实参也没帮上。
- 影响：`scenes/container-linked-list` 的三个用例全部构建失败。`Deque` / `Stack` / `Queue`
  只依赖 `ArrayList`，同批三用例全过，说明不是「std 容器整体不可用」，而是 `class` 具名构造这一层。
- 待决：这是 std 源码缺陷还是 `class` 构造能力缺口，需编译器线确认；本账不预设。

### L33 无界泛型 `T.default` 在 `RingBuffer::new` 里不可解析

- 分类：标准库（泛型默认值），失败于 `valkyrie.hir.unresolved_call`
- 坐标：`valkyrie.v/projects/std/source/collection/RingBuffer.v:17` 的 `data.push(T.default)`
- 证据：``error[valkyrie.hir.unresolved_call]: unresolved call `data.push` in new: 1 candidate(s) share the name,
  but none matches the argument types``，共 2 处同根因
- 描述：`RingBuffer<T>` 的 `new(capacity)` 用 `T.default` 预填 `ArrayList<T>`；
  `T` 没有任何 bound，`T.default` 解析不出具体类型，于是 `ArrayList::push` 的实参类型也不成立。
- 影响：`scenes/container-ring-buffer` 的两个用例构建失败。
- 待决：`T.default` 是否需要显式 bound（如 `Default` 类约束）才能用，属产品或 std 合同问题。
  本条只记「当前写法不可编译」，不判定哪一侧该改。

### L34 `std.text::to_upper` / `to_lower` 在 wasm 目标是恒等实现

- 分类：标准库（`[host_contract]` 函数缺少 wasm 侧实现）
- 坐标：`valkyrie.v/projects/std/source/text/Utf8Text.v:236`（`to_lower`）、`:241`（`to_upper`），
  两者函数体都是 `return self`，且带 `[host_contract]` 标注
- 证据：运行时实测——`"Hello".to_upper()` 与 `"Hello".to_lower()` 的码位和都是 500，
  与原文 `"Hello"` 的码位和一致；期望分别是 `"HELLO"` 的 372 与 `"hello"` 的 532。
  构建成功，所以这是**运行期语义缺口**，不是构建拒绝。
- 对照：同文件 `replace` / `split_once` / `split_whitespace` / `starts_with` / `ends_with`
  在本批全部按文档语义通过。
- 影响：`scenes/text-case-transforms` 的 `upperChecksum` / `lowerChecksum` 两条运行断言红。
- 说明：`[host_contract]` 的宿主侧（node binding）是否有真实现，本批没验证；wasm 目标上确定是恒等。

### L35 `panic` 不产生发散类型，在 `-> i64` 函数里报 return 操作数类型不符

- 分类：编译器（`panic` 的返回类型 / 控制流发散）
- 最小复现（`scenes/panic-explicit`）：
  `micro explicit_panic() -> i64 { panic("probe panic") }`
- 证据：``(SMIR007): function=probe.panic_explicit::explicit_panic, location=block 0 terminator,
  detail=return operand type differs from function return type (actual=Unit, expected=Integer64 { signed: true })``
- 描述：`panic` 目前被当成普通 `unit` 表达式，`block 0` 的终结符拿 `Unit` 去满足 `i64` 返回；
  没有把 `panic` 路径标成不可达。
- 对照：同一批里 `10 / 0` 与 `None.unwrap()` 都能可观察拒绝（`expected: "trap"` 通过），
  说明陷阱机制本身可用，缺的是 `panic` 表达式的类型与发散标记。
- 影响：`scenes/panic-explicit` 唯一用例构建拒绝。

## 第一批（数据结构）观察

本批 6 个场景 12 个用例全过，未新增缺口。以下两点曾疑似缺口，核对标准库源码后确认是既有 API 合同，
本账不为其新增 L 编号，以免将来重报：

- `ArrayList.at(usize)` 与 `get(isize)` 是 **1 基序数**，`at(0)` 越界结构化失败、`get(0)` 返回 `None`。
  0 基随机访问走 `⁅i⁆` 与 `set_cardinal`，`scenes/lru-cache` 即用该路径。
  坐标：`valkyrie.v/projects/std/source/collection/ArrayList.v` 的 `micro at` / `micro get`。
- `HashMap::new()` 不是零参构造，签名是 `HashMap::new(capacity: usize)`，本批场景均按容量构造。
  坐标：`valkyrie.v/projects/std/source/collection/hashed/HashMap.v`。
