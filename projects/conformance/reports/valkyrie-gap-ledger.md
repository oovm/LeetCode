# Valkyrie 能力缺口账本

本文件是本仓 Valkyrie 解题能力的唯一手工缺口清单。新增缺口必须同时写最小复现坐标；
未验证批次按能力分组登记在 `valkyrie-unverified-batches.md`，本表不重复题目清单。

维护口径：
- 「已构建通过」= `legionBuildProject` 返回 `status=0` 且隔离判题 `ok=true`。
- 仅写完未编译的题不计入覆盖数，也不标 `blocked`；按能力分组登记在
  `valkyrie-unverified-batches.md`，等对应能力复跑。
- 每题有且只有两个状态：已构建通过 / 未验证。未验证不等于通过。
- 验证窗口额外记录三态证据（编译通过 / 编译失败 + 诊断坐标 / 因缺口无法判题），
  逐题结果写在 `valkyrie-unverified-batches.md` 的实测列。
- 每条缺口只保留一个最小复现；题内触发点写在对应 `solution.v` 的 `# 题内触发点:`。
- 标注约定：源码里**不存在**的入口只能以 `[提案]` 形式出现，标题一律写
  `期望签名（[提案]，源码尚不存在）`；真实 API 另按源码签名书写，两者不得混排。
  写解法时以源码为准，不以本账本的愿望为准（见观察 4 / 观察 5）。

G 编号定级规则（2026-11-04 重判，替代上一版；作为 G1–G27 归位与此后新增编号的唯一判据）：

判据看绕路的**性质**，不看「能不能绕」——任何缺失都能靠调用点手写绕过去。

- a) 换等价 API，零重复 → 观察。用别的现成 API 替一下，代码不膨胀。
- b) 在调用点重复实现同一套逻辑，且随调用点数线性增长 → 真缺口。
  这不是绕路，这是缺失被摊派给每个调用点。
- c) 绕路改变题解结构或返回类型 → 真缺口。

原则句：**没有抽象、只有每个调用点手写，那就是缺失，不是绕路。**

边界（防止「模块内空洞」失控）：

- 本判据不推广。不得演变成「std 某个模块有什么能力就都得补全」，否则 `G` 编号会退化成 std 待办清单。
- 判据仍以 b 为主。「模块内空洞」只在两个条件同时成立时采用：
  1) 同模块已有**同类**能力（不是随便一个别的能力）；
  2) 摊派面可观（行数或调用点数至少一项不低）。
- 例：G23（`gcd` / `lcm`）只有 1 处调用点，继续观察——即使 `math` 模块已有其它整数函数，1 处也不构成模块内空洞。

## 缺口与观察分级（2026-11-04 重判）

真缺口（11）：G2 / G3 / G9 / G10 / G11 / G13 / G16 / G17 / G22 / G25 / G26。

| 编号 | 判据 | 摊派面 |
| --- | --- | --- |
| G2 浮点返回值合同 | c | 返回类型即题面合同，绕路必须改返回类型（1227 / 1344） |
| G3 wasm JS glue 的 `ArrayList` ABI | c | ABI 边界由题面固定，题解改不了结构（36 题） |
| G9 二分图判定 | 模块内空洞 | std graph 模块已有 `cycle` / `topological_sort` / 连通分量等**同类**图算法，独缺二分图判定；摊派面 2 处 |
| G10 `DisjointSet` 分量聚合 | b | 3 处 × 重写 DSU 内部聚合 |
| G11 `sorted_by` | b | 18 处 × 副本 + `merge_sort` |
| G13 `utf8` 字典序比较 | b | 4 处 × 约 10 行比较脚手架 |
| G16 `BTreeSet` / `BTreeMap` 界查询 | b | 5 处 × O(k) 物化 + 手写二分 |
| G17 `char` 缺 `Hash` | b | 7 处 × 每次调用点换键型 |
| G22 整数位元查询 | b | 5 处 × 重复位运算 |
| G25 `BitSet` 基数 / 复制 | b | 4 处 × 手写 O(bits) 计数，丢掉位并行 |
| G26 序关系无可用合同 | b | 14 处 × 同一套序逻辑 |

观察（13）：G1 / G4 / G8 / G12 / G14 / G15 / G18 / G19 / G20 / G21 / G23 / G24 / G27。
均为判据 a（换等价 API，零重复），或尚无已证实调用点。

编译器缺陷（3，属实但不归 std 线管）：G5 / G6 / G7。见下一节指向条目。

## 编译器缺陷（不归 std 线）

| 条目 | 现状 | 归口 |
| --- | --- | --- |
| G5 分支内丢弃 `Option<T>`（SMIR007） | 已有真实复现：`baseball-game` | 编译器 MIR 降级，不在 std / leetcode 线 |
| G6 标识符 `round` 误拉 adaptor | 已有真实复现：`sum-of-digits-of-string-after-convert` | 编译器名字解析 / 闭包装配 |
| G7 `HashMap.insert` 作 `else` 尾 + 嵌套 return | 已有真实复现：`isomorphic-strings` | 编译器 MIR 合流 |

- 三条都属实，但修复位置在 `nyar-vm.rs`，不占 std 缺口名额，也不进第 18 批选题面。
- 本节只作指向，详细证据留在各自 G 条内。

## 用例数据清洗规则（通用）

违反题面约束的用例，先看 `expected` 本身是不是**合法答案**，再决定删还是改：

- `expected` 是非答案形态（Python `Error: ...` 字符串、超时消息、平台内部错误）→ **删**。
  这条用例本来就没有可判的答案，留着只会把实现逼成复刻宿主异常文本。
- `expected` 是合法答案形态（数值 / 布尔 / 数组）且语义自洽 → **改解法适配实际判据**。
  不许因为「题面说不会出现」就拒判。

两个已落地的对照：

- R18 `array-nesting`（565）：界外下标，`expected` 是 `Error: list assignment index out of range` → 删 3 条。
- R18 `global-and-local-inversions`（775）：非排列输入，`expected` 仍是 `bool` 且语义自洽 → 改解法
  （后缀最小值扫描按定义判定，对合法排列同样正确），不删用例。

## 库内解法总量口径（2026-11-04 实测）

此前同时出现过两个「总量」，本节是唯一口径来源：

| 数 | 判定条件 | 实测 |
| --- | --- | --- |
| 2869 | `projects/problems/*` 目录数，不论是否含 `solution.v`、是否登记 `invoke` | 2869 |
| 1375 | 其中 `solvers/valkyrie/solution.v` 非空（去空白后长度 > 0） | 1375 |
| 494 | 其中 `solution.v` 文本含 `[export` | 494 |
| 496 | `metadata.json` 的 `invoke.valkyrie` 非空（字符串或带 `entry` 的对象） | 496 |
| **496** | **交集**：既有 `solution.v` 又有合法 `invoke.valkyrie` | **496** |

- `solverOnly` = 2869 − 496 = 2373，且这 2373 个文件全部没有 `[export(`（`solverOnlyWithExport=0`）；
  `invokeOnly` = 0。因此 496 就是两套条件的同一集合。
- 统计命令（`leetcode.v` 根目录，PowerShell）：

```powershell
# 2869：题目目录数
(Get-ChildItem projects/problems -Directory).Count

# 496：metadata.invoke.valkyrie 非空（字符串或带 entry 的对象）
$n = 0
Get-ChildItem projects/problems -Directory | ForEach-Object {
    $meta = Get-Content (Join-Path $_.FullName 'metadata.json') -Raw | ConvertFrom-Json
    $invoke = $meta.invoke.valkyrie
    if ($invoke -and ($invoke.entry -or ($invoke -is [string] -and $invoke.Trim()))) { $n++ }
}
$n
```

- 结论：**「库内解法总量」统一为 496（canonical）**；2869 只作为目录数，不再自称解法总量。
  扫描起点已构建 282 题（`.cache/<slug>-bench-node` 产物存在），未构建 **496 − 282 = 214**，
  不是此前误报的 2580。
- 后续增量（2026-11-04）：新增「Easy 数组返回值补缺」19 题后，canonical 实测 **515**；
  表中 496 仍是扫描起点口径，未构建按起点口径记为 233（见该批次小节）。
- 后续增量（2026-11-04，滚动批次 R3–R6 各 8 题写完未构建后）：canonical 实测 **569**
  （R6 前 561；本批 8 题已计入 `invoke.valkyrie`，但仍属未验证，不代表构建通过）。
- 后续增量（2026-11-04，滚动批次 R7 后）：canonical 实测 **577**（R7 前 569）。
- 后续增量（2026-11-04，滚动批次 R8 后）：canonical 实测 **585**（R8 前 577；本批新编号 0 条）。
- 后续增量（2026-11-04，滚动批次 R9 后）：canonical 实测 **593**（R9 前 585；本批新编号 0 条，
  但新增观察 4：R4–R8 的若干解法调用了尚不存在的提案 API，需在验证窗口前更正）。
- 后续增量（2026-11-04，滚动批次 R10 后）：canonical 实测 **601**（R10 前 593；本批新编号 0 条，
  四个点名 API 面仍无自然调用点，见「未命中面（第 10 批探测）」）。
- 后续增量（2026-11-04，滚动批次 R11 后）：canonical 实测 **609**（R11 前 601；本批新编号 0 条，
  `remove` / `to_array` / `iterator` / `nth` 四个面按新口径跳过，改压写侧与容器构造面，见观察 6）。
- 后续增量（2026-11-04，滚动批次 R12 后）：canonical 实测 **617**（R12 前 609；本批新编号 0 条，
  改压语言构造面：`unite` / `enums` / 闭包 / 递归，见观察 8）。
- 后续增量（2026-11-04，滚动批次 R13 后）：canonical 实测 **625**（R13 前 617；本批新编号 1 条，
  G25 = `BitSet` 缺基数 / 规模 / 迭代 / 复制入口；首次压位集合与位掩码面，见观察 9）。
- 后续增量（2026-11-04，滚动批次 R14 后）：canonical 实测 **633**（R14 前 625；本批新编号 1 条，
  G26 = 自定义类型序关系无可用合同（`Comparable` 缺失 + 排序入口不按合同 + `BTreeSet` 约束不捕获
  `<`）；首次压「序关系属于类型」这面，见观察 10）。
- 后续增量（2026-11-04，滚动批次 R15 后）：canonical 实测 **641**（R15 前 633；本批新编号 1 条，
  G27 = 排序稳定性不是可声明的属性（`sort` / `sort_unstable` 入口缺失，`quick_sort` / `merge_sort`
  同签名且稳定性只由实现决定）；
  本批继续撞 G25 / G26，见观察 11）。
- 后续增量（2026-11-04，滚动批次 R16 后）：canonical 实测 **649**（R16 前 641；本批新编号 0 条，
  按观察 11 避开 G26 / G27，只把 G10 / G12 / G18 / G23 压进真实题解）。
- 后续增量（2026-11-04，滚动批次 R17 后）：canonical 实测 **657**（R17 前 649；本批新编号 0 条，
  继续避开 G26 / G27，把 G25（`BitSet` 基数 / 复制）与 G12（`HashSet` 无容量）的调用点
  收敛成最小必要 API 集，见 G25 / G12 的「本批验证情况（R17）」）。
- 后续增量（2026-11-04，滚动批次 R18 后）：canonical 实测 **665**（R18 前 657；本批新编号 0 条，
  8 题全部避开真缺口，命中面只有观察档与既有缺口，见 `valkyrie-unverified-batches.md` 的 R18 小节）。

**R18 的反向验证意义**：第 18 批是**第一批全部避开真缺口的批次**。它的价值不只是多 8 题，
而是给本账本的判据做反向验证——如果这 8 题里任何一题经真评后撞到新的缺口，说明判据还有漏；
如果全部干净通过，说明判据的「观察档」是可用的。

- 后续增量（2026-11-04，滚动批次 R19 后）：canonical 实测 **673**（R19 前 665；本批新编号 0 条，
  选题面主动撞一次 graph 二色面（`possible-bipartition` 用 `DirectedGraph` + `successors` 组合出
  着色判定），用来验证「G9 已记录」这条路径走通，其余 7 题只落在观察档）。

**R19 的反向验证意义**：第 19 批是第二组对照组。它主动撞已有编号而不产生新编号，
如果也全干净，就说明「观察档」连续两批可用，可以把真缺口修复排进 std 线。

- 后续增量（2026-11-04，Easy 标量池批次 R20 后）：canonical 实测 **698**（R20 前 673；本批 25 题，
  新编号 0 条）。本批**构建通过 0 题**，全部 `authored-unverified`。
- **当前构建停点（R20 实测，2026-11-04）**：std 闭包在 HEAD 的前端解析回归，
  `std/source/operator/comparable.v:169:26`（`trait Comparable` 的 `infix \`<\`` 成员），
  引入提交为 `valkyrie.v` `d48011b`。任何含 std 的 `legionBuildProject`（包括此前已构建通过的题）
  都中止在该点，属于并行 std 线的在途状态，不是本题库缺口，也未被计入任何 `G` 编号。
  std 线修复后，R20 的 25 题按 `valkyrie-unverified-batches.md` 的 slug 复跑即可产出覆盖数。

## 系统性问题（观察，非编号）

> 本节只记观察，不占 `G` 编号；缺口本身仍按 G1–G27 计。

### 观察 1：trait 实现面按需堆，没有「类型 × 核心 trait」矩阵

G13（`[utf8]` 无 `<`）、G15（无 `Comparable` 合同）、G17（`char` 无 `Hash`）、G24（`MultiSet`
无 `Equal`）四条合起来指向同一件事：每个类型只零散实现了 `{Equal, Comparable, Hash}` 的任意
子集，没有任何机制声明「这个类型实现了哪些核心 trait」。现状：
- `i64`：`Equal` + `Hash` + 裸 `<`（无 `Comparable` 合同）
- `utf8`：`Equal` + `Hash`（无 `<`，无 `Comparable`）
- `char`：`Equal`（无 `Hash`，无 `<`）
- `MultiSet<T>`：无 `Equal`、无 `Hash`
后果：判断「这个类型能不能作键 / 能不能排序」只能靠试错（写一遍、看编译器报错），而不是查一份
矩阵。std 侧应补一张 `类型 × {Equal, Hash, Comparable, Ordinal, Cardinal}` 的落表，缺项要么补、
要么显式标「不实现」。
- 修复顺序含义：先建矩阵（G15 的 `Comparable` 是矩阵骨架），再按缺项补 impl（G13 / G17 / G24）。

### 观察 2：同名不同义比缺 API 更危险

`utf8.slice(start, length)` 的第二个参数是**段长**（`Utf8Text.v` L262），不是终点下标；
从 TS 的 `slice(start, end)` 照搬会**静默错位**——不报错、结果整体偏移，比「方法不存在」更难发现。
同类风险入口（需 std 侧逐条核对参数语义并标注差异）：
- `utf8.slice(start, count)` / `try_slice(start, count)` —— **段长，非终点**（已核对，与主流 `slice(start, end)` 不同向）
- `ArrayList.insert(ordinal, value)` / `remove(ordinal)` —— **1 基序数、先位置后元素**（已核对
  `ArrayList.v` L67 / L90，与 `[ ]` / `get` 同基；与 0 基的 `⁅ ⁆` / `get_cardinal` / `set_cardinal`
  是同一容器的两套索引基，命名上可区分）。`insert` 与 TS `splice(k, 0, x)` 同向；`remove` 返回
  `Option<T>`，与 TS `splice(k, 1)` 返回数组不同形。
- `utf8.replace(old, new)` —— **无法核对**：`Utf8Text.v` L199 是 `[host_contract]` 空壳，函数体只有
  `return self`，全量替换还是首个替换由 adaptor 决定，std 源里没有语义。
- `utf8.trim()` —— **无法核对**：`Utf8Text.v` L186 同为 `[host_contract]` 空壳（`return self`），
  去哪些字符（ASCII 空白 / Unicode 空白 / 其它）在 std 层不可判定。`to_lower` / `to_upper` 同形。
- G16 提案的 `range(low, high)` —— **不是同名不同义，是根本不存在**：`BTreeSet` / `BTreeMap` 均无
  `range`，区间开闭问题目前无从发生；风险在于「以为它存在」而照提案签名写代码（见观察 4）。
结论：std 需要一个「参数语义与主流惯例不同」的清单，逐条标差异，不要等解题时一个个踩。
已核对：`slice` 段长（批次 R7）、`insert` / `remove` 1 基（批次 R8 / R9）。
无法在 std 层核对的：`trim` / `replace` / `to_lower` / `to_upper`（全部 `[host_contract]` 空壳）。
不存在而非语义不同：`range`（G16）。

### 观察 3：真正的「无近似物」只有 G2 / G3 两条

按 2026-11-04 重判（判据看绕路性质）：G8（无向图建模）已降为观察——真实调用点就是双写
`add_edge`，属「换构造、零重复」。真正绕不过去的是 G2（浮点返回值合同）与 G3（wasm JS glue 的
`ArrayList` ABI）：绕路会改变返回类型或跨不过 ABI 边界。这条决定下一轮 std 的修复顺序：
1) 先补真缺口里有合同骨架的一档（G26 序关系 → G13 / G17 的 impl 缺项、G16 的有界查询）；
2) 再补其余真缺口 API（G10 / G11 / G22 / G25）；
3) 观察档（G8 / G12 / G14 / G15 / G18–G21 / G23 / G24 / G27）随修复窗口顺带处理，不单独排期。
理由：真缺口是「每个调用点都在重复付成本」，优先修；观察档都有零重复的等价 API。

### 观察 4：未验证语料里混入了「按提案签名写的纸面 API」（R9 静态核对发现，已清）

缺口账本里 G11 / G16 / G13 / G12 的「期望签名」是提案，不是现有 API。R4–R8 的解法中有 10 个文件
直接按提案签名写，源码层并不存在这些入口。逐条坐标：

| 调用 | 实际 std | 文件 |
| --- | --- | --- |
| `sorted_by(list, cmp)` ×9 | 只有 `quick_sort` / `merge_sort`（就地，`sort.v`） | `accounts-merge`、`custom-sort-string`、`group-anagrams`、`height-checker`、`largest-perimeter-triangle`、`meeting-rooms`、`queue-reconstruction-by-height`、`smallest-string-with-swaps`、`top-k-frequent-words` |
| `BTreeSet.floor` / `ceiling` | 不存在（G16 提案） | `contains-duplicate-iii` |
| `utf8.compare` | 不存在（G13 提案；`Utf8Text` 只有 `equals`） | `accounts-merge`（`compare_text`） |
| `HashSet::new(capacity)` | 只有 `new()`（G12） | `accounts-merge` |

- 定性：**这是语料错误，不是新缺口**。等价近似物都已存在（副本 + `merge_sort`、`to_list` 后手写
  二分、逐字节比较、`new()` 后逐个 `insert`），故不新增编号。
- 术语口径（2026-11-04，R15 更正）：本表统一用**纸面 API**（paper API），指「解法里按提案签名调用、
  源码中并不存在的接口」；不再使用 `phantom` 一词，以免与语言标准里的 `Phantom<T>` 撞名。
  `Phantom<T>` 是真实存在的语言类型（编译器开洞实现、零大小、不占布局），但它在算法题里一般用不上；
  **「某个入口源码不存在」不能拿 `Phantom<T>` 当理由**，两者不是一回事。
- 修复口径（验证窗口前完成）：`sorted_by(x, cmp)` → 自建副本后 `merge_sort(copy, cmp)`；
  `floor` / `ceiling` → `to_list()` 后二分；`utf8.compare` → `byte_length` / `byte_at` 逐字节比较；
  `HashSet::new(n)` → `HashSet::new()`。
- 本批（R9）不新增纸面 API 调用：8 题只使用已核对存在的入口。
- **已清（2026-11-04 更正提交）**：上表 10 个文件全部改成等价真实 API 写法 ——
  `sorted_by` ×9 → 自建副本 + `merge_sort`（`custom-sort-string` 改用「rank · 1000000 + 原下标」
  编码进 `ArrayList<i64>`，避免排序闭包捕获 `priority`；`top-k-frequent-words` 改频次桶 +
  桶内命名比较器，避免捕获 `counts`）；`BTreeSet.floor` / `ceiling` → `to_list()` 快照 +
  手写 `lower_bound` 二分；`utf8.compare` ×2 → `byte_length` / `byte_at` 逐字节比较；
  `HashSet::new(n)` ×3 → `HashSet::new()`。`group-anagrams` / `smallest-string-with-swaps` 的
  `char` 比较一并改为 `as u32` 码位比较（G15 下游）。本笔只动这 10 处与账本标注，未掺新题。
- 教训：提案签名必须与「已存在 API」分开存放，写解法时以源码为准，不以账本愿望为准。
  本表此后统一用 `[提案]` 前缀标注源码不存在的入口（见维护口径）。

### 观察 5：`utf8.trim` / `replace` / `to_lower` / `to_upper` 是 `[host_contract]` 空壳，语义不可核对

2026-11-04 静态核对 `std/source/text/Utf8Text.v`：
- `trim()`（L186）、`replace(old, new)`（L199）、`to_lower()`、`to_upper()` 四个入口都标
  `[host_contract]`，函数体只有 `return self`（或等价空实现），std 源里**没有**任何实现语义。
- 后果：`trim` 去哪些字符（ASCII 空白 / Unicode 空白 / 其它）、`replace` 是全量替换还是首个替换、
  `to_lower` / `to_upper` 的 locale 与码位范围，全部由 adaptor 侧决定；在 std 层**不可核对**。
- 约束：任何依赖这四个函数的题解必须显式标注「语义未定，待 adaptor 侧确认」，不得写成既成事实，
  也不得据此断言与主流同向；验证窗口若按宿主实测有偏差，以宿主行为为准并回填本观察。

### 观察 6：`ArrayList.to_array()` 与 `HashMap.iterator` 判为「可疑冗余」（只记账，暂不动）

2026-11-04 第 11 批选题复核后立条，为 std 裁剪攒第二手证据。

- `ArrayList.to_array()`：全仓 `solvers/valkyrie/**` **0 次调用**；唯一使用者是 std 内部的
  `Utf8Builder.build()`（`self.bytes.to_array()`）。返回数组一律走 `ArrayList`（全库无 `-> [i64]`
  先例），宿主入参本身已是 `[T]` 或 `ArrayList<T>`，题内没有「必须降成定长数组再交回」的形态。
  R9–R11 三批共 24 题逐题核对，仍无自然调用点。
- `HashMap.iterator(f: micro(K, V) -> unit)`：回调**无捕获**，无法在遍历时写入外部容器、累加计数器
  或提前中断。凡需要「遍历 + 写入」的题（1636 频次编码、2363 键物化、第 11 批 438/30 的滑窗计数）
  都只能 `keys()` 物化后在外层循环处理。回调形态本身承载不了任何有副作用的遍历。
- 结论：两者都**不是缺口**（有等价写法），但属于「有入口、零有效用法」的可疑冗余。
- **口径：验证窗口打开前不动，只记账**。待宿主 / adaptor 实测确认后再决定是否裁剪，避免在未验证
  语料上先删接口、后补回。

### 观察 7：定长 `Array<T>` 的边界是「有无分配」，不是「能不能解题」

- 定位：定长 `Array<T>` 在 Valkyrie 是 **ABI / 宿主边界载体**（宿主入参、FFI 面、`ArrayView` 的底层），
  不是默认解题载体。C/C++ 解题者频繁用裸定长数组的两个痛点在这里都不成立：`std::vector` 的
  ergonomics 差（迫使手管 `new[]` / `delete[]`）、`vector<bool>` 是假特化（不能取地址、迭代器是代理
  对象，因而退回 `bitset` 或裸数组）。Valkyrie 的 `ArrayList` 是 Vec 形态（`push` 原地摊还 O(1)、
  `reserve`、精确预分配），位集合有专门 `BitSet`。
- 能力边界（不是一刀切）：
  - **mut `Array<T>` 的就地无分配变换是正当能力**：排序、反转、`swap`、原地重排。宿主给进来一块
    固定缓冲、不想再分配一次时，这面真有用。
  - **禁止的是需要分配或改变长度的 API**：`push`、`reserve`、返回新容器的 `sorted_by`、`clone`。
- 结论：**不给定长 `Array<T>` 补分配型解题 API；就地 `mut` 变换不在此列**，不写成「定长数组不能用于
  解题」的一刀切结论。
- 只读核对 `std/source/collection/sort.v`（2026-11-04）：
  - 7 个函数全部是 `ArrayList<T>` 专用，既没有对 `mut` 容器泛化，也不走 trait：
    `quick_sort` L5、`quick_sort_range` L13、`partition` L23、`swap` L38、`merge_sort` L45、
    `merge_sort_range` L53、`merge` L62（均为 `list: ArrayList<T>`，`cmp: micro(T, T) -> i32`）。
  - `Array<T>` 的就地排序入口 **0 个**。
  - 能否直接复用到 `mut Array<T>`：
    - `quick_sort` / `quick_sort_range` / `partition` / `swap` 只依赖「长度 + 读 + 写」，且**不分配
      临时容器**；把 `list.get((i + 1) as isize)` / `list.set(...)` 换成 `⁅ ⁆` 读写即可直接搬。
      这是唯一适合定长形态的路径。
    - `merge_sort` / `merge_sort_range` 的 `merge` 在 L63-L64 分配两个 `ArrayList<T>` 临时区，
      **违反定长无分配前提**，不能原样复用。
  - 结论：给 `mut Array<T>` 补就地排序只需 `swap` + 下标读写，不需要新增分配器；反过来说，任何把
    `merge_sort` 直接搬到定长形态的方案都会引入临时分配，不予采纳。

### 观察 8：第 12 批首次把语言构造（和类型 / 枚举 / 闭包 / 递归）写进真实题解

- `unite`（带 tag 和类型）：生产代码（`yyds.kv`）与探针已用，变体可标 `[constructor]`，载荷可为记录
  字段；`match` 用 `case Variant(payload)` 解构。本批首次在题解里用：`parsing-a-boolean-expression`
  （1106，递归 `BoolNode`，`And` / `Or` 载荷是 `ArrayList<BoolNode>` 聚合体）与 `decode-string`
  （394，`DecodedPart`，`Repeated` 载荷是「文本 + 次数」聚合体）。**递归和类型（变体载荷回指自身）
  此前从未在题解路径构建过**，验证窗口应优先看这两题。
- `enums`（无载荷标记类型）：变体裸用、`match` 分派；`crawler-log-folder`（1598）用它替掉
  目录操作的 `0/1/2` 魔法值。
- 闭包：`micro(a, b) -> i32` 作比较器（179 直接把内联闭包传给 `merge_sort`）、`micro(x) -> bool` 作
  谓词、`micro(acc, x) -> acc` 作 `fold` 累加器（2161）。文档 `expressions.md` 声明复杂 lambda 可按
  引用捕获，但本语料前 11 批全部用具名函数规避捕获；2161 首次写捕获外层 `pivot` 的闭包，捕获在
  题解编译路径是否成立待验证，不作既成事实。
- 递归：241 分治、39 回溯、1087 递归展开、1106 / 394 递归下降都是自然递归，没有为规避语言限制而
  退化成纯迭代。
- 未编号理由：以上都有等价近似物（扁平表示、具名函数、显式循环），按「无等价近似物才编号」的口径
  记观察，不新增 `G` 编号。

### 观察 9：`BitSet` 的真实面只是「按已知下标读写 + 原地结构运算」

- 2026-11-04 全量核对 `std/source/collection/bitset.v`：公开入口 12 个（清单见 G25），全部带
  `[host_contract]`，但函数体是具体实现，不是 `trim` / `replace` 那种空壳，语义可在 std 层核对。
- 能力面分四组：
  1. 构造：`new` / `with_capacity`；
  2. 读写：`set` / `clear_bit` / `get` / `toggle`；
  3. **原地**结构运算：`intersect` / `union` / `difference` / `xor`，均 `mut self` 并吞掉右侧值；
  4. 整体状态：`is_empty` / `clear_all`。
- 反面：没有 `count` / `length` / 迭代 / `clone` / `[u64]` / `[bool]` 互转 / `Equal`。所以它目前是
  「定长布尔位图」，不是可枚举、可复制的集合容器。
- 口径：`BitSet` 与观察 7 的定长 `Array<T>` 同类，都是**边界 / 底层载体**，不是通用集合；要把它当
  集合用，先补 G25 的 `count` + `length` + 迭代。
- R13 首批覆盖：`valid-sudoku`（36，行 / 列 / 宫各 9 位）、`find-all-duplicates-in-an-array`
  （442，出现标记）、`check-if-a-string-contains-all-binary-codes-of-size-k`（1461，`2^k` 码值全集）、
  `maximum-product-of-word-lengths`（318，每词 26 位）、`shortest-path-to-get-all-keys`
  （864，`rows * cols * 64` 访问表）。五题都只在「全集已知 + `set` / `get`」范围内使用，
  没有一题依赖缺失入口；`intersect` / `union` / `xor` 仍无真实调用点。

### 观察 10：「内联比较器是绕路写法」——能跑不等于设计合理

- 前 13 批里凡出现 `merge_sort(x, 比较器)` 的题解，全部属于绕路形态：排序函数收一个闭包，
  比较逻辑写在题解内部，类型系统对「`T` 有没有序」一无所知。内联 `micro(a, b) -> i32`
  （R12 `largest-number`）是这形态的典型；R10 一批传入具名函数，本质相同。
- 这不是算法错，而是**能力面错位**：`sort.v` 的入口把序关系当成调用方参数，所以题解能跑；
  一旦换成 `BTreeSet` / `BTreeMap` 作键（容器内部自己比较），就没有地方塞闭包，类型系统
  补不上序关系，直接失败。前 13 批从未暴露，是因为没有一批题把自定义类型当键。
- 口径：今后遇到「自定义类型排序」，先按 `Comparable` 合同写；**不得把内联比较器当成
  已解决序关系的证据**。能跑只证明「排序函数收闭包」，不证明「语言支持序关系」。
- 本批（R14）是第一次「正着写」：8 题全部声明结构体 + `imply ...: std::operator::Comparable`
  （提案）+ `where T: Equal & Comparable`（提案），不传任何比较器；它们红着是预期结果，
  对应 G26。

### 观察 11：G25 / G26 第二次撞面后仍无等价物——不是选题偏差，是能力面长期缺失

- R15 再次把 8 题压到 G25 / G26：1239 直接调用 `BitSet::clone` ×2 + `count` ×1；
  847 用 `BitSet(n * 2^n)` 作 BFS 访问表；1366 / 2191 / 1691 / 2251 / 1751 用自定义记录
  `Comparable` + 单参排序；1561 对 `i64` 直接单参排序。**传比较器数量仍为 0**。
- 结论：两批共 16 题撞同一面，说明缺口不是「这批题选得偏」，而是「排序与有序容器」
  这条主线长期没有合同。继续堆同类题不会产生新信息，下一轮应直接进修复窗口：
  先落 G26 的 `Comparable` + 单参入口，同时按 G27 区分稳定 / 不稳定，再复跑 R14 / R15。
- `BitSet` 侧同理：1239 证明 `clone` / `count` 不是「锦上添花」，而是分支式集合代数的
  前置条件；在补齐前，凡涉及「复制后做结构运算」的题都只能退回逐位 `get`。

## 未恢复

### G1 定长数组字面量 `[value; count]`

- 状态：未恢复（2026-11-03 复测）
- 最小复现：

```v
micro probe(n: i64) -> i64 {
    let mut a: [i64] = [0; 8]
    return a⁅0⁆
}
```

- 期望：按 `valkyrie-guide/references/lambdas.md` 的「定长数组填充」语义构造并读取。
- 实际：`parse error: 数组字面量缺少闭合括号`；随后连带 `entry source group declares no [export]`。
- 影响：所有需要定长缓冲的题改用 `ArrayList`（见「已恢复」），不改算法结构。
- 判定：**观察**（判据 a：换 `ArrayList`，零重复；全库解法已普遍如此，只有最小复现用到该字面量）。

### G2 浮点返回值合同

- 状态：未恢复（2026-11-03 复测）
- 最小复现：

```v
micro half() -> f64 {
    return 0.5
}
```

- 期望：`-> f64` 直接返回浮点字面量。
- 实际：`return` value type `f64` is incompatible with the function return type `Nominal(ItemId(3))`；
  尝试 `let one: f64 = 1.0`、`1.0 as f64`、`-> std::primitive::f64` 均失败（`浮点常量没有 canonical 形状`）。
- 影响题：`airplane-seat-assignment-probability`（1227）、`angle-between-hands-of-a-clock`（1344）。
- 判定：**真缺口**（判据 c：返回类型即题面合同，绕路必须改返回类型，与 `metadata.expected` 不相容）。

### G3 wasm JS glue 的 `ArrayList` ABI bridge 缺失（入参 marshal / 返回值 demarshal）

- 状态：未恢复（2026-11-03 实测，Medium 37 题复跑暴露）
- 最小复现（入参方向，25 题）：

```v
# `house-robber/solvers/valkyrie/solution.v`
micro rob(nums: ArrayList<i64>) -> i64
```

  实测：`Error: [wasm-js-glue] Cannot marshal schema kind "NamedAggregate": no ABI bridge implemented.
  Schema: {"generic_args":[{"kind":"I64"}],"kind":"NamedAggregate","module_path":"std::collection","name":"ArrayList"}`
- 最小复现（返回值方向，11 题）：

```v
# `sequential-digits/solvers/valkyrie/solution.v`
micro sequential_digits(low: i64, high: i64) -> ArrayList<i64>
```

  实测：`Error: [wasm-js-glue] Cannot demarshal NamedAggregate "ArrayList": no field access contract in ABI schema.`
- 同族形态：`ArrayList<ArrayList<i64>>`（`minimum-path-sum`、`triangle`、`spiral-matrix-ii`）、
  `ArrayList<utf8>`（`generate-binary-strings-without-adjacent-zeros`）均命中同一 bridge 缺口。
- 定位：产物自带的 wasm JS glue（ABI marshal/demarshal 层），`std::collection::ArrayList` 的
  schema 已生成，缺的是 glue 侧聚合类型的字段访问合同；编译期全部 `build=0`，与题目解法无关。
- 影响：本批 36 题判题 0 通过（25 marshal + 11 demarshal）。该项恢复前，任何返回或接收
  `ArrayList` 的题都不能计入构建通过数。
- 判定：**真缺口**（判据 c：入参 / 返回值由题面固定为 `ArrayList`，题解内改不了结构，ABI 边界也跨不过去）。

### G4 std `Utf8Builder.append(char)` 在 std 模块自编译时无法实例化（疑似失效，待复验）

- 状态：**疑似失效，待复验**（2026-11-04 编译线在 dev tip 实测）。旧的「未恢复 / 编译器问题」
  结论作废，不再作为失败归族的依据扩散。旧分类共 24 题（Easy 文本重建组 20 题 + 未登记批次
  4 题），std 修复后逐题重跑再归类。
- 最小复现（只用 std，无题解代码）：

```v
micro probe(c: char) -> i64 {
    let mut b: Utf8Builder = Utf8Builder::new(4)
    b.append(c)
    return b.build().byte_length() as i64
}
```

- 旧测量（2026-11-04 早间，保留为历史证据）：`error[valkyrie.hir.unresolved_call]`，`infix +` 在
  `append` 内 6 个候选无一匹配，`--> source/text/Utf8Builder.v:46:29`；同根因 5 处
  （`Utf8Builder.v:46/50/51/55/56/57:29`）。伴随 `code.bit_shift_right` 在 `append` 内无候选：
  `no method candidate named bit_shift_right exists for receiver type Nominal(ItemId(65))`。
- dev tip 复测（2026-11-04，编译线交棒）：同一最小复现**不再报 append 相关错误**，10 条错误
  **全部**落在 std 的 `from_iterator`，append / `infix +` / `bit_shift_right` **一条都没有**。
- `from_iterator` 归因：**std 声明写错，不是编译器缺口** —— `where I: Iterator` 却在函数体
  用 for-in，for-in 走的是 `IntoIterator`。`valkyrie.v` 的 `Array.v` / `ArrayList.v` 两处正在修。
- 对照（旧测量同日实跑，均 `status=0`，排除「写法错」与「清理引入」两个解释）：
  - 顶层自由函数 `let code: u32 = c as u32` + `code.bit_shift_right(6)`；
  - 用户工程 `imply Buf` + `self.bytes.push((192 + code.bit_shift_right(6)) as u8)`，
    与 `Utf8Builder.append` 同形（`mut self`、`ArrayList<u8>`、`push`、`u32` 位运算）。
  - `thousand-separator` 用 HEAD 版本（保留旧 `.unwrap()`）复建同样 `status=1`、同坐标。
- 结论：旧「**编译器问题**」结论**作废**，上面 `status=1` 的对照也只是旧 std/旧二进制的测量。
  G4 名下的题数（24 / 30 等）都是旧归族，**不可信、不扩散**。std 修复后按实测重验：若大部分
  `status=0`，这批就是白记的缺口；若仍有失败，再按新的最小复现登记失败族，不沿用旧分类。
- 待复验题（旧分类 24 题，std 修复后逐题重跑）：
  `calculate-digit-sum-of-a-string`、`clear-digits`、`convert-a-number-to-hexadecimal`、
  `convert-date-to-binary`、`faulty-keyboard`、`find-valid-pair-of-adjacent-digits-in-string`、
  `first-letter-to-appear-twice`、`greatest-english-letter-in-upper-and-lower-case`、`hexspeak`、
  `increasing-decreasing-string`、`latest-time-by-replacing-hidden-digits`、
  `lexicographically-smallest-palindrome`、`longest-common-prefix`、`make-the-string-great`、
  `rearrange-spaces-between-words`、`reformat-phone-number`、`reformat-the-string`、
  `remove-all-adjacent-duplicates-in-string`、`replace-all-s-to-avoid-consecutive-repeating-characters`、
  `reverse-only-letters`、`reverse-vowels-of-a-string`、`sort-characters-by-frequency`、
  `summary-ranges`、`thousand-separator`。
- 判定：**观察**（待复验：dev tip 复测已不再报 `append` 相关错误，当前无已证实调用点）。

### G5 分支内丢弃 `Option<T>` 返回值触发 SMIR 跳转 arity 失败

- 状态：未恢复（2026-11-04 实测，未登记批次 1 题）
- 最小复现（4 行）：

```v
micro probe(mut s: ArrayList<i64>, flag: bool) -> i64 {
    if flag { s.pop() } else { s.push(1) }
    return s.length() as i64
}
```

- 实际：`(SMIR007): Semantic MIR 合同失败: function=probe.popcompact::probe, location=block 2
  terminator, detail=jump arity differs from target block parameters`。
- 对照（同日实跑，`status=0`）：同一条 `s.pop()` 作为函数顶层语句丢弃返回值，可正常构建；
  仅当它位于 `if` 分支内（作为分支尾表达式）时触发。`ArrayList.pop(mut self): Option<T>`
  见 `std/source/collection/ArrayList.v:53`。
- 结论：**编译器问题**（SMIR 降级把分支内被丢弃的 `Option<T>` 语句当作块尾值，导致跳转参数
  数量与目标块不一致），非题解写法错误。修复位置在编译器的 MIR 降级，不在 `solution.v`。
- 影响题（1）：`baseball-game`（`cal_points`，`stack.pop()` 位于 `else if` 分支，
  诊断 `location=block 4 terminator`）。该题未改写以规避缺口。
- 判定：**已复现编译器缺陷**（属实，但现在不归 std 线管；见「编译器缺陷」条目）。

### G6 标识符 `round` 误拉入 `std.adaptor.wasm.math::round`

- 状态：未恢复（2026-11-04 实测，canonical 未构建 214 题扫块 1 题）
- 最小复现（导出入口里出现同名的局部变量或形参即可）：

```v
[export(case: "camelCase")]
micro probe(round: i64) -> i64 {
    return round
}
```

- 实际：`(SMIR007): Semantic MIR 合同失败: function=std.adaptor.wasm.math::round, location=block 0
  terminator, detail=return operand type differs from function return type (actual=Float64,
  expected=Nominal { ... primitive_identity: Some("std::primitive::f64") })`。
- 对照（同日实跑，均 `status=0`）：同一函数把形参/局部变量改名为 `r`；或保留其它逻辑只改这一个名字。
- 结论：**编译器问题**（入口闭包按未限定标识符名 `round` 误把 adaptor 的 `round` 实现纳入闭包，
  该实现 `return f64(math_round(value))` 在 MIR 里产出 `Float64` 而非 nominal `f64`）。
  修复位置在编译器的名字解析 / 闭包装配，不在 `solution.v`。
- 影响题（1）：`sum-of-digits-of-string-after-convert`（局部变量 `round`）。
- 判定：**已复现编译器缺陷**（属实，但现在不归 std 线管；见「编译器缺陷」条目）。

### G7 `HashMap.insert` 作为 `else` 分支尾 + then 分支嵌套 early return

- 状态：未恢复（2026-11-04 实测，canonical 未构建 214 题扫块 1 题）
- 最小复现：

```v
[export(case: "camelCase")]
micro probe(m: HashMap<i64, i64>, flag: bool, flag2: bool, a: i64, b: i64) -> bool {
    if flag {
        if flag2 {
            return false
        }
    } else {
        m.insert(a, b)
    }
    return true
}
```

- 实际：`(SMIR007): Semantic MIR 合同失败: function=probe::probe, location=block 6 terminator,
  detail=jump arity differs from target block parameters`。
- 对照（同日实跑，均 `status=0`）：`else` 分支改为 `x = x + 1`；`else` 分支改为
  `ArrayList.push(1)`；无 `else` 的嵌套 early return；`HashMap.insert` 不带嵌套 return。
- 结论：**编译器问题**（`HashMap.insert` 作为 `else` 分支尾值、then 分支含嵌套 `return` 时，
  MIR 合流块的参数个数与跳转实参不一致）。与 G5 同诊断码和同一 detail，但触发条件不同
  （G5 是分支尾丢弃 `Option<T>`），不并入 G5。
- 影响题（1）：`isomorphic-strings`（`is_isomorphic`，`forward.insert` 位于 `else`、
  `if forward.get(a).unwrap() != b { return false }` 位于 then，诊断 `location=block 12 terminator`）。
- 判定：**已复现编译器缺陷**（属实，但现在不归 std 线管；见「编译器缺陷」条目）。

### G8 `DirectedGraph<N>` 缺无向边写入

- 状态：未提供（std API 缺口，**不阻断构建**；2026-11-04 静态核对 `std/source/collection/graph/DirectedGraph.v`）
- 定性：**该有但没有**。无向关系没有一等写入入口，`add_edge` 只表达单向，无向边只能由调用方
  双写两条反向边；`has_edge(a, b)` 也不保证 `has_edge(b, a)`，无向性完全靠调用约定维持。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/graph/DirectedGraph.v（与 add_edge 同形）
micro add_undirected_edge(mut self, from: N, to: N): bool
```

- 影响题（4，调用点均为「同一关系双写 add_edge」）：`is-graph-bipartite`（785）、
  `maximal-network-rank`（1615）、`possible-bipartition`（886）、`find-center-of-star-graph`（1791）。
- 不对称点：`std.math.graph_theory.GraphMatrix.add_undirected_edge`（`matrix.v` L49-L52）、
  `WeightedGraph.add_undirected_edge`（`weighted.v` L124-L129）均存在（类型名是 `GraphMatrix`，
  此前记为 `MatrixGraph` 属笔误）；`DirectedGraph` 只有 `add_edge` / `add_node`。
  两处「无向边」实现均只是两次 `add_edge` 转发，只命名了约定，不建立合同。
- 判定：**观察**（判据 a：双写两条 `add_edge`，一行，不随调用点膨胀）。
- 修复初判：**加 API**（一行转发两次 `add_edge`）。更根本的是建模问题，见本节末尾「建模提示」。

### G9 `std.math.graph_theory` 缺二分图判定（二色着色）

- 状态：未提供（std API 缺口，不阻断构建；2026-11-04 静态核对 `unweighted.v`）
- 定性：**该有但没有**。模块自述「只补连通分量与无权最短路，BFS/DFS 归 `DirectedGraph`」，
  但二分性（二色着色）是图上最基础的可判定性质，目前无入口。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/math/graph_theory/unweighted.v（与 weak_components 同形）
micro bipartition<N>(graph: std.collection.DirectedGraph<N>) -> Option<HashMap<N, i64>>
    where N: Equal & Hash
```

  `Some(coloring)`（每点 0/1 着色）表示二分；`None` 表示存在冲突边。
- 影响题（2）：`is-graph-bipartite`（785）、`possible-bipartition`（886），两题都在题内手写 BFS 着色。
- 不对称点：`weak_components`、`strong_components`、`unweighted_shortest_paths` 均已提供，
  同级的二分性判定缺席。
- 判定：**真缺口**（模块内空洞：std 的 graph 模块已提供 `cycle` / `topological_sort` / 连通分量等**同类**图算法，唯独缺二分图判定。同模块有 A 有 B 没 C，C 就是模块内空洞，不是「能绕过去」）。
- 修复初判：**加 API**（直接复用 `DirectedGraph` 的 BFS）。

### G10 `DisjointSet<T>` 缺分量规模 / 成员聚合

- 状态：未提供（std API 缺口，不阻断构建；2026-11-04 静态核对 `std/source/collection/DisjointSet.v`）
- 定性：**该有但没有**。并查集把「合并」做成 API，却没把「这个分量有多大 / 有哪些成员」暴露出来；
  调用方只能逐个 `find_root` 再自建 `HashMap` 归并，等于重写 DSU 的内部职责。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/DisjointSet.v
micro group_sizes(mut self): HashMap<T, usize>
micro group_members(mut self, root: T): ArrayList<T>
```

- 影响题（3）：`count-unreachable-pairs-of-nodes-in-an-undirected-graph`（2316）、
  `count-the-number-of-complete-components`（2685）、`largest-component-size-by-common-factor`（952）。
  三题都出现「`find_root` + `HashMap<i64, i64>` 累加」的同一段手写聚合。
- 不对称点：`group_count()` 已提供、`length()` 是元素总数，二者都拿不到单个分量的规模。
- 判定：**真缺口**（判据 b：3 处 × 重写 DSU 内部聚合，缺失被摊派给每个调用点）。
- 修复初判：**加 API**（`group_sizes` 一次遍历即可，且与路径压缩共用）。

### G11 `std.collection.sort` 只有就地排序，缺返回新序列的 `sorted_by`

- 状态：未提供（std API 缺口，不阻断构建；2026-11-04 静态核对 `std/source/collection/sort.v`）
- 定性：**该有但没有**。`quick_sort` / `merge_sort` 形参是 `list: ArrayList<T>`（非 mut），语义为
  「就地改容器」，调用方要排序必须先自建副本；`Array<T>` 没有任何排序入口。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/sort.v
micro sorted_by<T>(list: ArrayList<T>, cmp: micro(T, T) -> i32): ArrayList<T>
micro sorted_by<T>(list: Array<T>, cmp: micro(T, T) -> i32): ArrayList<T>
```

- 影响题（18）：`groups-of-special-equivalent-strings`（893，even/odd 两个副本）、
  `reorder-data-in-log-files`（937，整表副本）、`height-checker`（1051，批次 R4 曾直接按 `[提案]`
  的 `sorted_by(Array<T>)` 写）、`largest-perimeter-triangle`（976，批次 R6 同上）；
  另有 7 题（`accounts-merge` / `custom-sort-string` / `group-anagrams` / `meeting-rooms` /
  `queue-reconstruction-by-height` / `smallest-string-with-swaps` / `top-k-frequent-words` 中的
  7 处调用）在 2026-11-04 更正提交清理，见观察 4。第 10 批又有 7 题走「副本 + `merge_sort`」：
  `remove-covered-intervals`（1288）、`sort-even-and-odd-indices-independently`（2164）、
  `sort-array-by-increasing-frequency`（1636）、`relative-ranks`（506）、`sort-the-people`（2418）、
  `merge-similar-items`（2363）、`minimum-moves-to-equal-array-elements-ii`（462）。
- 不对称点：`ArrayList` 有 **7 个**排序函数（`quick_sort` / `quick_sort_range` / `partition` / `swap` /
  `merge_sort` / `merge_sort_range` / `merge`；此前记为 6 个，漏了 `merge`），`Array<T>` 为 **0 个**
  排序入口；没有任何一个返回新序列。另：std 测试目录下无 `quick_sort` / `merge_sort` 用例，
  「就地改容器」目前只有源码证据（`class` 是引用类型，`swap` 经 `list.set` 写穿）。
- 判定：**真缺口**（判据 b：18 处 × 副本 + `merge_sort`，每题重复同一套两行与一次分配）。
- 修复初判：**加 API**（在副本上调 `merge_sort` 的薄封装）。

### G12 `HashSet::new()` 无容量参数

- 状态：未提供（std API 缺口，不阻断构建；2026-11-04 静态核对 `std/source/collection/hashed/HashSet.v`）
- 定性：**该有但没有**。同族容器 `HashMap::new(capacity)` 支持预分配，`HashSet` 把容量写死为 16。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/hashed/HashSet.v
micro new(capacity: usize): Self
micro with_capacity(capacity: usize): Self
```

- 影响题（9）：`groups-of-special-equivalent-strings`（893）、`longest-consecutive-sequence`（128，
  元素数最大 1e5 的整表插入）、`unique-number-of-occurrences`（1207，批次 R6，频次去重集合
  规模 = 键数）、`top-k-frequent-elements`（347，批次 R9，去重保序集合）、
  `k-diff-pairs-in-an-array`（532，批次 R9，`BTreeSet::new()` 同样无容量）、
  `relative-sort-array`（1122，批次 R9，已出现值集合）、
  `find-the-difference-of-two-arrays`（2215，批次 R9，两个存在性集合）、
  `accounts-merge`（721，R4–R8 曾按 `[提案]` 写 `new(count)`，2026-11-04 更正为 `new()`）、
  `rank-transform-of-an-array`（1331，批次 R10，`BTreeSet::new()` 同样无容量）。
- 不对称点：`HashSet::new()` 固定 `SwissSet::new(16)`；`HashMap::new(capacity: usize)` 直传容量。
- 口径（2026-11-04 更正）：`HashSet::new()` 是**真实签名**（`HashSet.v` L13 `micro new(): Self`，
  无容量参数），解法里写 `new()` 属于依赖本条现状的合法调用，**不是纸面 API**。
  纸面 API 专指「源码里根本不存在的入口」；本条缺的只是 `new(capacity)` / `with_capacity`。
- 本批验证情况（R16 / R17，`authored-unverified`）：
  - R16 `word-ladder`（127）按真实签名写 `HashSet::new()` 建词典与访问集，容量只能摊还增长；
    这是 G12 现状调用点，不计入纸面 API 数。
  - R17 `count-number-of-distinct-integers-after-reverse-operations`（2442）、
    `repeated-dna-sequences`（187）、`number-of-distinct-averages`（2465）三题同法；
    其中 187 以 `utf8` 作键、2442 / 2465 以 `i64` 作键，两种键型都不受容量预分配支持。
  - 最小必要 API 集（R17 收敛结果）：**只有一条签名** `new(capacity: usize)`（或同形的
    `with_capacity`），不需要桶视图 / 保留策略等其余入口；四个调用点（127 / 2442 / 187 / 2465）
    都只缺「一次性给足上界」。
- 判定：**观察**（判据 a：`new()` 可用，只是摊还增长，代码不膨胀）。
- 修复初判：**加 API**（一行转发 `SwissSet::new(capacity)`）。

### G13 `utf8` 缺字典序比较

- 状态：未提供（std API 缺口，不阻断构建；2026-11-04 `reorder-data-in-log-files` 静态确认）
- 定性：**该有但没有**。`utf8` 只实现 `equals` / `not_equals`，没有大小比较；任何按字典序排序的题
  都要在题内逐字符手写比较函数。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/text/Utf8Text.v
micro compare(self, other: utf8) -> i32   # <0 / 0 / >0，按码位（与 UTF-8 字节序一致）
```

- 影响题（4）：`reorder-data-in-log-files`（937，题内 `compare_text`）、
  `find-smallest-letter-greater-than-target`（744，上界二分对 `utf8` 直接写 `<=`）、
  `accounts-merge`（721，题内 `compare_text`）、`top-k-frequent-words`（692，题内 `compare_text`）。
  后两题 R4–R8 曾按 `[提案]` 写 `left.compare(right)`，2026-11-04 更正为
  `byte_length` / `byte_at` 逐字节比较。
- 附注：`Utf8Text` 的 `trim` / `replace` / `to_lower` / `to_upper` 是 `[host_contract]` 空壳，
  语义不可核对，见观察 5；依赖它们的题解必须标「语义未定」。
- 附注（第 11 批）：`find-all-anagrams-in-a-string`（438）、`substring-with-concatenation-of-all-words`
  （30）、`restore-ip-addresses`（93）、`letter-combinations-of-a-phone-number`（17）都需要逐字符
  处理 ASCII 文本，因无码点视图只能 `byte_at` 逐字节走；这些题**不**涉及字典序比较，故不并入上面的
  「影响题」计数，只记在「不对称点」。
- 不对称点：`char` 只有 `as u32` 转换运算符、**无 `<`**、也不是 `Ordinal` 载体（`char.v` 仅实现
  `==` / `!=`）；`utf8` 连可比较的码位视图都没有。（此前记作「`char` 可经 `Ordinal` 转 `u32`」，
  该论断错误，已更正。）
- 判定：**真缺口**（判据 b：4 处 × 约 10 行逐字节比较脚手架）。
- 修复初判：**加 API**（按字节序比较，与 UTF-8 编码自洽）。
- 根因交叉引用：本缺口是 **G15**（顺序关系没有 trait 抽象）的下游表现 —— `utf8` 既无 `<` 可裸调，
  也无 `Comparable` 合同可挂，两者都是 G15 的同一空缺。

### G14 `utf8` 缺 `split_once`

- 状态：未提供（std API 缺口，不阻断构建；2026-11-04 `reorder-data-in-log-files` 静态确认）
- 定性：**该有但没有**。`split(separator) -> [utf8]` 只能整段切分；需要「首个分隔符左/右两段」时，
  只能组合 `index_of` + `slice` 三次，且「无分隔符 / 分隔符在末尾」等分支都要调用方自处理。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/text/Utf8Text.v（成对承载需要新增记录类型）
class SplitParts { head: utf8; tail: utf8 }
micro split_once(self, separator: utf8) -> Option<SplitParts>
```

- 影响题（1）：`reorder-data-in-log-files`（937，`separator_of` + 两次 `slice`）。
- 不对称点：`split` / `slice` / `try_slice` / `index_of` 都有，唯独缺单次切分。
- 判定：**观察**（判据 a：`index_of` + `slice` 组合，1 处，代码不膨胀）。
- 修复初判：**加 API**（`index_of` + 两段 `slice` 即可，代价是要引入承载两段的记录类型）。

### G15 顺序关系没有 trait 抽象（约束与操作不一致）

- 状态：未提供（**std 模型缺口**，不阻断构建；2026-11-04 静态核对 `std/source/operator/`、
  `std/source/primitive/`、`std/source/collection/sorted/BTreeSet.v`）
- 定性：**该建 trait 没建**。这不是「缺一个 `sorted_by`」（那是 G11 的人体工学缺口），而是
  **泛型约束没有捕获它实际使用的操作**：`operator/` 只有 `Equal` / `Identical` / `Cardinal` /
  `Ordinal` 四个合同，**没有任何顺序或偏序 trait**；`<` / `<=` / `>` 在 `primitive/` 里逐类型手写
  （`i8` / `i16` / `i32` / `i64` / `u8` / `u16` / `u32` / `u64` / `f32` / `f64` 各一份）；
  `BTreeSet` 声明 `T: Equal`（`BTreeSet.v` L23-L24）却在 L170 与 L239 裸调 `<` ——
  类型检查通过，但语义前提没有任何约束表达，属**不健全的泛型容器**。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/operator/comparable.v（与既有 operator 合同同构，
# `trait A: B` 超 trait 语法见 `std/source/text/text_span.v` 的 `trait TextView: Text`）
trait Comparable: Equal {
    micro compare(self, other: Self) -> i32
}

# std/source/primitive/{i8,i16,i32,i64,u8,u16,u32,u64,f32,f64}.v：逐类型补齐
imply i64: Comparable {
    micro compare(self, other: Self) -> i32
}

# std/source/text/char.v、std/source/text/Utf8Text.v：G13 的字典序比较落到此处
imply char: Comparable { ... }
imply Utf8Text: Comparable { ... }
```

  `compare` 返回 `<0 / 0 / >0`，与 `sort.v` 现有 `cmp: micro(T, T) -> i32` 的既有约定同形，可直接复用。
- 消费方：`BTreeSet` / `BTreeMap` 及其节点拆分类的比较路径改为 `where T: Equal & Comparable`，
  让约束与实际操作一致；`sort.v` 保持闭包形态（排序需要调用方自定义序，不是全序约束能覆盖的）。
- 影响范围：所有依赖裸 `<` 的泛型容器（`BTreeSet` / `BTreeMap`，以及 `SortedSet` / `SortedMap`
  包装层）都要换约束；`char` 与 `utf8` 的比较能力随之落地，G13 自动消解。
- 影响范围（第二实例）：`BinaryHeap` / `PriorityQueue`（`BinaryHeap.v` L58 / L68-L76）同样在
  无约束的 `T` 上裸调 `>=` / `<`，且只实现最小序——没有比较器参数、没有最大序构造，
  泛型元素无法表达「最重优先」。这与 `BTreeSet<T: Equal>` 是同一个病，不是另起一条
  「缺一个 max-heap」的人体工学缺口。
- 不对称点：`Equal` / `Identical` / `Cardinal` / `Ordinal` 都有显式合同，唯独序关系没有；
  `BTreeSet` 用裸 `<` 而 `Utf8Text` / `char` 连 `<` 都没有 —— 同一语言里「有序」有两种互不兼容的表示。
- 先例：`std.math.graph_theory.Weight`（`weighted.v` L6-L10）已把 `add` + `less` 做成合同，证明该形态
  可行；但它局限在图权重域内，不是通用序合同，且同样与 `operator/` 的四个合同平行、互不引用。
- 判定：**观察**（判据 a：裸 `<` 或 `as u32` 码位比较替一下，2 处）。
- 与 G13 的关系：G13 是本条的下游表现。
- 修复初判：**建 trait**（新增 `Comparable` 合同 + 逐 primitive impl + 收窄 BTree 系约束）。
- 影响题（2，均已写）：`find-smallest-letter-greater-than-target`（744，批次 R5，
  `letters⁅mid⁆ <= target`）、`group-anagrams`（49，批次 R7，`sorted_by(ArrayList<char>)` 的比较器
  裸调 `<` / `>` 排序字符；2026-11-04 更正提交改为 `as u32` 码位比较 + 副本 `merge_sort`）。
- 与 G17 的交叉引用：`char` 同时缺 `Hash`。**这两条不是孤立缺 impl，而是同一个 primitive 的
  类型能力面没设计完**——`Ordinal` 视图 / `Comparable` / `Hash` 三条腿一条都没在 `char` 上落地，
  只剩 `==` / `!=`，于是它既进不了有序容器也进不了哈希容器。

### G16 `BTreeSet` / `BTreeMap` 缺序关系查询

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/collection/sorted/BTreeSet.v`、
  `BTreeMap.v`）
- 定性：**该有但没有**。容器按序存放，却只暴露「插入 / 存在性 / 删除 / 全量物化」，
  没有任何按值定位的界查询，调用方拿不到「最近的较小/较大元素」。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/sorted/BTreeSet.v、BTreeMap.v
# 约束随 G15 收敛为 T: Equal & Comparable
micro floor(self, value: T) -> Option<T>
micro ceiling(self, value: T) -> Option<T>
micro first(self) -> Option<T>
micro last(self) -> Option<T>
micro range(self, low: T, high: T) -> ArrayList<T>
micro nth(self, rank: usize) -> Option<T>        # BTreeSet，按秩取元素
micro nth_key(self, rank: usize) -> Option<K>    # BTreeMap，按秩取键
micro ceiling_key(self, value: K) -> Option<K>   # BTreeMap，最小 >= value 的键（下界查询）
micro floor_key(self, value: K) -> Option<K>     # BTreeMap，最大 <= value 的键（上界查询）
```

- 影响题（5）：`contains-duplicate-iii`（220，窗口内前驱/后继判定；R4–R8 曾直接按 `[提案]`
  的 `floor` / `ceiling` 写，2026-11-04 更正提交已改为 `to_list()` 快照 + 手写 `lower_bound`）、
  `sliding-window-median`（480，有序计数表按秩取中位；缺 `nth_key` 只能 `keys()` 全量物化，
  每步退化为 O(k)）、`find-right-interval`（436，批次 R6，按终点求「最小 >= 终点的起点」，
  即 `ceiling_key`；缺它只能 `keys()` 全量物化后手写二分）、`k-diff-pairs-in-an-array`（532，
  批次 R9，去重后有序扫描只能 `to_list()` 后下标遍历，缺 `nth` / `range`）、
  `rank-transform-of-an-array`（1331，批次 R10，去重后按秩回填只能 `to_list()` 后线性建表）。
- 核对补充（批次 R9 / R10）：`BTreeSet` / `BTreeMap` **都没有** `range`，观察 2 里「区间开闭待定」
  的条目当前不存在实现，无从核对；`nth` / `rank` 同样只在提案里。第 10 批的
  `minimum-moves-to-equal-array-elements-ii`（462）虽要「第 k 小」，但 `BTreeSet` 会去重、破坏重复值
  语义，理想解须保留多重集，故**不**计入 `nth` 影响面——`nth` 本身仍无自然调用点。
- 不对称点：`HashMap` 有 `keys` / `values`，`BTreeSet` 有 `to_list`，但有序容器只能被全量物化后
  线性扫描；`floor` / `ceiling` / `first` / `last` / `range` / `nth` 全部缺失，「有序」只剩存储形态。
- 判定：**真缺口**（判据 b：5 处 × O(k) 物化 + 手写二分）。
- 修复初判：**加 API**（底层节点已按序，查询不需新模型）。**实现前提是 G15 的 `Comparable`
  先落地，否则等于在无约束类型上裸调 `<`，和 `BTreeSet<T: Equal>` 那个不健全容器是同一个病。**

### G17 `char` 缺 `Hash` impl

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/text/char.v` 与
  `std/source/collection/hashed/hash.v`）
- 定性：**该有但没有**。`char` 只定义了 `==` / `!=`，没有 `Hash`，于是不能作
  `HashMap` / `HashSet` / `DisjointSet` 的键；同样表示一个小写字母，用 `utf8` 可以入表，
  用 `char` 不行。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/text/char.v
imply char: Hash {
    micro hash(self) -> usize {
        return (self as u32) as usize
    }
}
```

- 影响题（7）：`custom-sort-string`（791，`HashMap<char, i64>` 优先级表）、
  `satisfiability-of-equality-equations`（990，`DisjointSet<char>` 变量连通性）、
  `word-subsets`（916，字符频次上界）、`permutation-in-string`（567，定窗字符计数）、
  `find-words-that-can-be-formed-by-characters`（1160，字符可用量）、
  `find-resultant-array-after-removing-anagrams`（2273，批次 R7，`MultiSet<char>` 规范形）、
  `shortest-completing-word`（748，批次 R7，`HashMap<char, i64>` 牌照频次）。
- 不对称点：`utf8`、`i8`–`u64`、`f32` / `f64` 都有 `Hash`；`char` 有 `Ordinal`（可转 `u32`）
  却没有派生 `Hash`，因此「码位可排序」与「码位可哈希」只实现了一半。
- 判定：**真缺口**（判据 b：7 处 × 每次调用点换键型 `utf8` / `as u32`）。
- 修复初判：**加 API**（补一个 impl，语义与 `Ordinal` 一致）。
- 与 G15 的交叉引用：`char` 同时缺 `Comparable`。**这两条不是孤立缺 impl，而是同一个 primitive 的
  类型能力面没设计完**——`Ordinal` 视图 / `Comparable` / `Hash` 三条腿一条都没在 `char` 上落地，
  只剩 `==` / `!=`，于是它既进不了有序容器也进不了哈希容器。

### G18 `utf8` 缺 `split_whitespace`

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/text/Utf8Text.v` 的
  `split` / `slice` / `try_slice` / `index_of`）
- 定性：**该有但没有**。`split` 只接受精确分隔符，既不按空白类切分，也不丢弃空段；
  「按词切分」这类文本题只能自己逐字符扫描并手写状态机。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/text/Utf8Text.v
micro split_whitespace(self) -> [utf8]
```

- 影响题（2）：`reverse-words-in-a-string`（151，多次空格与前导/尾随空格的切词）、
  `maximum-number-of-words-found-in-sentences`（2114，逐句求词数）。
- 不对称点：`split` / `slice` / `try_slice` / `index_of` 都有，`split` 却只覆盖「固定分隔符 +
  保留空段」一种语义；空白类与空段折叠没有入口。
- 判定：**观察**（判据 a：`split` 加空段过滤，2 处）。
- 修复初判：**加 API**（内部复用 `split` 后过滤空段即可，不引入新类型）。

### G19 `ArrayView` 缺区间窗口构造

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/collection/array_view.v`）
- 定性：**模型已描述、入口未提供**。`ArrayView<T>` 的结构注释写明「视图覆盖创建时刻源数组的
  `[offset, offset + length)` 区间」，结构也持有 `_offset` / `_length`，但唯一构造入口是
  `array_view(source)` 全窗，`_offset` 永远是 0。于是「持有子区间」这件事，类型本身表达不了
  它自己文档化的语义。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/array_view.v
micro array_view<T>(source: [T], offset: usize, length: usize) -> ArrayView<T>
```

- 影响题（1）：`rotate-array`（189，三次反转各自需要 `[0, shift)` / `[shift, n)` 子窗口并写穿）。
- 不对称点：读侧 `length` / `is_empty` / `Cardinal` 都在，写侧 `⁅ ⁆=` 也在，唯独
  「窗口从哪开始、多长」没有入口。
- 判定：**观察**（判据 a：下标循环替一下，1 处）。
- 修复初判：**加 API**。模型不是缺的：`ArrayView` 已经就是这个模型，缺的是把非零 `offset`
  造出来的构造器，因此**不归入表达力缺口档**。

### G20 数值归约只有手写 fold（整数域缺席）

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/math/basic.v`、
  `std/source/iterator/iterator_terminal.v`）
- 定性：**该有但没有，且在两处同时缺**。`std.math` 的 `abs` / `max` / `min` / `clamp`
  只接受 `f64`，没有整数重载；`Iterator` 终端有 `fold` / `reduce` / `any` / `all` /
  `find` / `position` / `count`，但没有 `max` / `min` / `sum` / `product`。于是
  「数组最大值」这种最基础归约只能手写 fold，或手写比较循环。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/math/basic.v
micro abs(value: i64): i64
micro max(a: i64, b: i64): i64
micro min(a: i64, b: i64): i64

# std/source/iterator/iterator_terminal.v
micro max<I, T>(self: I): Option<T> where I: Iterator<Item = T>, T: Comparable
micro min<I, T>(self: I): Option<T> where I: Iterator<Item = T>, T: Comparable
micro sum<I, T>(self: I, initial: T): T where I: Iterator<Item = T>
```

- 影响题（1）：`kids-with-the-greatest-number-of-candies`（1431，糖果最大值）。
- 不对称点：`f64` 有 `abs` / `max` / `min`，整数没有；迭代器有能表达一切的 `fold`，
  却没有最常用的 `max`。前者是重载缺失，后者是终端缺失，根因同一：数值归约没有按
  「整数 / 浮点」分行。
- 判定：**观察**（判据 a：一行手写 fold，1 处）。
- 修复初判：**加 API**。`max` / `min` 的泛型约束依赖 G15 的 `Comparable`；在此之前只能
  先定 `i64` 重载。

### G21 序列反向没有一等入口

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/collection/ArrayList.v`、
  `std/source/iterator/Iterator.v`、`std/source/text/Utf8Builder.v`）
- 定性：**该有但没有，且三处同时缺**。`ArrayList` 有 `push` / `pop` / `first` / `last` 与
  `insert` / `remove`，但没有 `reverse`；`Iterator` 有 `map` / `filter` / `skip` / `take` /
  `enumerate`，但没有 `rev`；`Utf8Builder` 只有正向 `append`，没有 `prepend`。于是「低位先
  追加、最后整段翻面」这种最常见的构造顺序，只能每次都手写双指针交换。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/ArrayList.v
micro reverse(mut self): unit

# std/source/iterator/Iterator.v
micro rev(self) -> RevIterator<Item, Self>

# std/source/text/Utf8Builder.v
micro prepend(mut self, value: char): unit
```

- 影响题（4）：`add-to-array-form-of-integer`（989，进位从个位起、结果需高位在前）、
  `squares-of-a-sorted-array`（977，双端归并后整段翻面）、`add-binary`（67，builder 逐位追加
  后再整串反转）、`multiply-strings`（43，同上以 builder 逆序承载）。
- 不对称点：`LinkedList` 有 `iter_reverse`（回调式反向遍历），`ArrayList` 却连原地反转都没有；
  `sort.v` 已有 `swap<T>(list, a, b)` 私有工具，说明双指针交换是 std 内部常识，只是没暴露成
  `reverse`。`Utf8Builder` 的逆序构造在 2 题里靠「先拼再整串反转」绕过，等于多做一次全量拷贝。
- 判定：**观察**（判据 a：3 行双指针交换，不随调用点膨胀）。
- 修复初判：**加 API**。`reverse` 在 `swap` 之上十行即可；`RevIterator` 需要 `Iterator` 有
  双端访问，若不做适配器，至少先补 `ArrayList::reverse`。
- 表达力档位：**不属于表达力缺口**——有近似物（双指针交换 / 倒序下标循环）。

### G22 整数位元查询缺席

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/primitive/` 的 `i64` 位运算面、
  `std/source/math/basic.v`）
- 定性：**该有但没有**。`i64` 有完整的 `&` / `|` / `^` / `<<` / `>>` / `bit_not`，却没有
  任何一个位元查询：`count_ones` / `leading_zeros` / `trailing_zeros`。位图类题只能把整数打回
  成 `while value > 0 { value % 2; value / 2 }` 的十进制循环，或自己写 Brian Kernighan 循环。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/primitive/i64.v（以及 u8–u64 / i8–i32 同族逐类型）
micro count_ones(self): u32
micro leading_zeros(self): u32
micro trailing_zeros(self): u32
```

- 影响题（5，均已写、均以手写循环表达）：`number-of-1-bits`（191，模 2 循环计 1）、
  `hamming-distance`（461，异或后逐位计数）、`minimum-bit-flips-to-convert-number`（2220，
  异或后计 1）、`reverse-bits`（190，逐位搬运）、`binary-gap`（868，扫描连续 0 段）。
- 不对称点：位运算算子齐全但位元查询为零；`BitSet` 在容器层有 `get` / `set`，标量层却没有
  等价的「数 1 的个数」。这与 G20 同族（标量数值能力面只做了算子、没做归约），但作用对象是
  位而不是数值大小，故单列。
- 判定：**真缺口**（判据 b：5 处 × 重复位运算）。
- 修复初判：**加 API**（逐 primitive 一个 host contract 或纯循环实现）。
- 表达力档位：**不属于表达力缺口**——有近似物（手写循环）。

### G23 `std.math` 缺整数 gcd / lcm（数论面整体缺席）

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/math/` 全目录）
- 定性：**该有但没有**。`std.math` 只有 `basic`（`abs` / `max` / `min` / `clamp`，且只收 `f64`）、
  `constants`、`splitmix64`、`distribution/*`、`graph_theory/*`；**没有数论模块**，
  `gcd` / `lcm` / `is_prime` / `factorize` 一个都没有。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/math/number_theory.v（新模块）
micro gcd(a: i64, b: i64) -> i64
micro lcm(a: i64, b: i64) -> i64
```

- 影响题（1）：`x-of-a-kind-in-a-deck-of-cards`（914，批次 R6，全体频次的 gcd > 1）。
- 不对称点：`f64` 有 `abs` / `max` / `min`，整数连 `gcd` 都没有；`BitSet` 在容器层有 `intersect` /
  `union` / `difference`，数值层却没有任何整除关系归约。
- 判定：**观察**（判据 a：题内 Euclid 循环，1 处约 10 行）。
- 修复初判：**加 API**（十行 Euclid；`lcm` 需先定零值与溢出策略）。
- 表达力档位：**不属于表达力缺口**——有近似物（题内 Euclid 循环）。
- 与 G20 的关系：同一「标量数值能力面只做算子、不做归约」的根部，但对象是整除关系而非大小归约，
  故单列；`gcd` 若做成泛型还需 G15 的 `Comparable`（`%` 只对整型成立，目前只能定 `i64` 重载）。

### G24 `MultiSet` 没有等价判定与规范序（不能作键、不能比较）

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/collection/MultiSet.v` 全文件）
- 定性：**该有但没有**。`MultiSet<T>` 只声明了 `new` / `with_capacity` / `insert` / `remove` /
  `remove_all` / `count` / `contains` / `length` / `distinct_length` / `is_empty` / `clear` /
  `distinct_elements` / `to_list` / `iter` / `iterator` / `from_list`；**没有 `equals`，也没有
  `Hash`**，`imply MultiSet<T>` 之外只有方法体，没有 `imply MultiSet<T>: Equal`。
- 后果：两个多重集实例无法判「元素与重数完全一致」；也无法作为 `HashMap` / `HashSet` 的键。
  `to_list()` 的顺序取决于内部哈希遍历，不是规范序，因此「排序后比较」这条路在 `T` 无
  `Comparable` 时同样不可走（`char` 正是这种 `T`，见 G15）。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/MultiSet.v
imply MultiSet<T>: Equal where T: Equal {
    micro equals(self, other: MultiSet<T>) -> bool
}
# 规范序：按元素排序输出，前提是 G15 的 Comparable 落地
micro to_sorted_list(self) -> ArrayList<T> where T: Comparable
```

- 影响题（1）：`find-resultant-array-after-removing-anagrams`（2273，批次 R7，异位词规范形
  需要两份 `MultiSet<char>` 判等价）。
- 不对称点：`HashMap` / `HashSet` 都有 `Equal` 语义（靠 `get` / `contains`），`MultiSet` 作为
  「带重数的集合」反而没有等价判定；`BitSet` 有 `union` / `intersect` 等结构运算，`MultiSet`
  连结构相等都没有。
- 判定：**观察**（判据 a：排序字符 / 频次向量，1 处）。
- 修复初判：**加 API**（`equals` 只需 `distinct_length` 一致 + 逐元素 `count` 相等；
  注意不得依赖内部遍历序）。
- 表达力档位：**不属于表达力缺口**——有近似物（排序键或频次向量）。
- 与 G17 的关系：`MultiSet<char>` 同时缺 `char: Hash`（底层就是 `HashMap`），两条一起才可写作。

### G25 `BitSet` 没有基数 / 规模 / 迭代 / 复制入口

- 状态：未提供（**std 缺口**；2026-11-04 静态核对 `std/source/collection/bitset.v` 全文件）
- 真实入口（逐条核对，均带 `[host_contract]`，但函数体是具体实现，不是空壳）：
  `new()` L10、`with_capacity(bits: usize)` L15、`set(mut self, index: usize)` L27、
  `clear_bit(mut self, index: usize)` L36、`get(self, index: usize) -> bool` L47、
  `toggle(mut self, index: usize)` L58、`intersect(mut self, other: BitSet)` L68、
  `union(mut self, other: BitSet)` L84、`difference(mut self, other: BitSet)` L96、
  `xor(mut self, other: BitSet)` L108、`is_empty(self) -> bool` L125、
  `clear_all(mut self)` L137；私有 `ensure_capacity` L146。
- **缺失**：`count()`（置位数）、`length()` / `capacity()`（位集规模）、迭代器（无法枚举置位下标）、
  `clone()`（无法复制后做非破坏性结构运算）、与 `[u64]` / `[bool]` 的互转、`Equal` / `Hash`。
- 后果：`BitSet` 只能「按已知下标 `get` / `set`」，**无法从自身得知有多少位被置、也无法枚举被置的位**。
  这直接影响：
  - `check-if-a-string-contains-all-binary-codes-of-size-k`（1461）：需要「已置位数」判断是否集齐，
    只能在外层另设计数器；`BitSet` 本身没有 `count`。
  - `maximum-product-of-word-lengths`（318）：两两字母集判不相交，因无 `clone` 不能
    「复制 + `intersect` + `is_empty`」，只能对固定 26 位逐位 `get`。
  - `find-all-duplicates-in-an-array`（442）、`valid-sudoku`（36）、
    `shortest-path-to-get-all-keys`（864）：容量都由题面上界已知，可继续用，但规模必须外部维护。
- 期望签名（[提案]，源码尚不存在）：

```v
# std/source/collection/bitset.v
micro count(self) -> usize
micro length(self) -> usize
micro clone(self) -> BitSet
micro to_bool_array(self) -> [bool]
imply BitSet: Equal
```

- 判定：**真缺口**（判据 b：4 处 × 手写 O(bits) 计数或源头重建，丢掉位并行；`count` 与 `clone` 是最小必要面）。
- 影响题：1461、318、442、36、864（批次 R13）；1239（批次 R15，首次在解法里直接调用
  `clone` ×2 + `count` ×1）。847（R15）只用容量外知的 `get` / `set`，不计入本条影响题。
- 本批验证情况（R15，`authored-unverified`）：
  - `maximum-length-of-a-concatenated-string-with-unique-characters`（1239）按理想形态写
    「`current.clone()` 分支 → `merged.union(word.clone())` → `merged.count()` 判重叠」，
    三处缺失入口全部落在搜索主路径；其余 R15 题不含 `BitSet`。
  - `shortest-path-visiting-all-nodes`（847）以 `BitSet(n * 2^n)` 作 BFS 访问表，容量外部给定，
    只依赖现有 `get` / `set`；它证明 `BitSet` 能承担大规模访问表，但不构成缺失入口的调用点。
  - 结论：`clone` / `count` 的绕路结论在解法级复核后仍成立——1239 不 `clone` 就只能退回逐位
    `get` 手写计数，这正是判据 b：同一套计数逻辑被摊派到每个需要基数的调用点。
- 本批验证情况（R17，`authored-unverified`）：
  - `find-the-prefix-common-array-of-two-arrays`（2657）两个前缀集合长期存活，求交必须
    `seen_a.clone()` 后 `intersect` 再 `count()`；`clone` 与 `count` 同时落在主路径。
  - `number-of-corner-rectangles`（750）列数最多 200，超出 i64 掩码，每行一个 `BitSet`；
    每对行重建左操作数后 `intersect` + `count`。本解不 `clone`（重建比复制更直接）。
  - `maximum-rows-covered-by-columns`（2397）列集合作为选中子集，逐行判定「选中列是否都被该行 1
    覆盖」= `chosen.clone()` 后 `difference(row)`，再 `is_empty()`；首次给 `difference` 真实调用点。
  - `n-queens`（51）列 / 下沉对角线 / 上升对角线各一个 `BitSet`，回溯 `set` / `clear_bit`，
    只用现有入口。
  - `partition-to-k-equal-sum-subsets`（698）为控制组：元素 <= 16，i64 掩码 + 占用数组即可，
    只用到 `get` / `set` / `clear_bit`，证明「全集 <= 64 且只判占用」不需要本条缺失项。
  - 最小必要 API 集（R17 收敛结果）：

| 缺失入口 | 是否被本批真实调用点需要 | 依据 |
| --- | --- | --- |
| `count(self) -> usize` | **需要**（2657、750） | 交集结果的置位数无等价近似物：外部计数器只能算「新增」不能算「齐交」 |
| `clone(self) -> BitSet` | **需要**（2657、2397） | `intersect` / `difference` 改写左操作数，集合需长期存活时必须先复制 |
| `length(self) -> usize` | **不需要** | 三题的容量都由题面上界或 `with_capacity` 实参已知，扫描范围可外部保持 |
| 迭代器（枚举置位下标） | **不需要**（可延后） | 51 由列栈渲染、2657 / 750 只需基数；无题需要「不知道全集大小还要枚举」 |
| 与 `[bool]` / `[u64]` 互转 | **不需要**（可延后） | 全库无 `to_bool_array` 消费方；`ArrayList` 下标已能承载同等信息 |
| `Equal`（及 `Hash`） | **不需要**（可延后） | 本批没有「两个位集当值比较 / 作键」的调用点；2657 比的是基数而非集合本身 |

  - 结论：本条真正的最小必要面是 **`count` + `clone`**，`length` / 迭代 / 互转 / `Equal`
    本批全部无自然调用点，维持「已记、可延后」。
  - 口径说明：表中「需要」指**理想写法**所需的入口。按观察 3，本条同样有绕路近似物——
    `count` 可退回逐位 / 逐列手写计数（750 的 TS 对照解即如此），`clone` 可由源头重建集合
    （750 的 V 解即如此）。绕路能跑通但放弃了位集合的表达，故仍记为缺口，不作为「已可用」。
- 修复初判：**加 API**；`count` 可对 `words` 逐字 popcount 求和，`clone` 复制 `words` 数组即可，
  均不改变存储形态。
- 与观察 1 的关系：`BitSet` 同样游离在「类型 × {Equal, Hash}」矩阵之外；本条只记 `Equal`，
  `Hash` 对位集意义有限，不单列。

### G26 自定义类型的序关系没有可用合同（`Comparable` 缺失 + 排序入口不按合同取序）

- 状态：未提供（**std / 语言缺口**；2026-11-04 第 14 批静态核对 `std/source/collection/sort.v`、
  `std/source/collection/sorted/BTreeSet.v`、`std/source/operator/`）
- 缺口三件套：
  1. **没有顺序 trait**：`std.operator` 只有 `Equal` / `Identical` / `Ordinal` / `Cardinal`，
     没有 `Comparable`（G15 已记根因；本条记「自定义类型无法声明自己的序」这一后果）。
  2. **排序入口不按合同取序**：`sort.v` 7 个入口全部是 `ArrayList<T>` 专用 + 显式
     `cmp: micro(T, T) -> i32`，没有 `where T: Comparable` 的单参入口。题解只能把比较逻辑
     写进调用点，序关系落在题内而不是类型上。
  3. **容器约束没有捕获实际操作**：`BTreeSet::insert` 声明 `where T: Equal`，但实现体
     `insert_non_full` 内部裸调 `<`（`std/source/collection/sorted/BTreeSet.v` L170 附近）。
     签名没写序关系，类型系统不报错；自定义类型作键时编译器不会提示「缺序关系」，
     只会在 `<` 求值处失败。约束与实际操作脱节，正是最难自查的一类缺口。
- 最小复现（第 14 批写法口径，理想形态）：

```v
structure Interval {
    start: i64
    end: i64
}

imply Interval: std::operator::Comparable {   # 提案：trait 不存在
    infix `<`(self, other: Interval): bool {
        return self.start < other.start
    }
}

micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable              # 提案：约束不存在
{
    sort(items)                               # 提案：单参入口不存在，现有入口要求 cmp
}
```

- 期望：类型系统按 `Comparable` 捕获 `<`，排序与有序容器都从合同取序；自定义记录类型
  不需要在题解内部传 `micro(a, b) -> i32` 或具名比较函数。
- 实际：`Comparable` 名字无法解析；`merge_sort` 实参个数不符；`BTreeSet<Interval>` 的
  `insert` 签名过宽（只要求 `Equal`）但体内 `<` 无法对结构体求值。
- 影响题（14，批次 R14 / R15，全部 `authored-unverified` 且依赖本条）：
  R14：56 / 435 / 1235 / 452 / 1710 / 1029 / 1626（自定义记录排序）、
  694（自定义类型作 `BTreeSet` 键，同时依赖自定义 `Equal` impl）；
  R15：1366 / 2191 / 1691 / 2251 / 1751（自定义记录 `Comparable`）、
  1561（`i64` 直接依赖 `where T: Comparable` 单参入口）。
- 判定：**真缺口**（判据 b：14 处 × 同一套序逻辑，序被摊派到每个调用点）。
- 与 G15 / G11 的关系：G15 是根因（无合同），G11 的 `merge_sort` 只解决「能排序」；
  本条要解决「序属于类型，而不是题解闭包」，并让有序容器能在签名层要求它。
- 附带观察：仓内**没有任何用户自定义类型实现过 `Equal`**（只有 std 内部的 `i64` / `Utf8Text`
  等），所以 694 的 `imply IslandShape: std::operator::Equal` 也是首次进入题解路径，需与 G26
  一起验证。
- 本批验证情况（R15，`authored-unverified`）：6 题按「结构体 + `Comparable` + 单参排序」写，
  传比较器数量 **0**：
  - 自定义记录 ×5：1366（26 维名次向量 + 字母兜底）、2191（映射值）、1691（三维归一化字典序）、
    2251（花期按起点）、1751（事件按开始日）；
  - `i64` 直接单参排序 ×1：1561（`order_items(piles)` 后单参 `sort(items)`），是第 ② 条
    「无 `where T: Comparable` 单参入口」的最短复现。
  - 新证据：2191 依赖并列映射值保持原序，暴露出单参入口若落到 `quick_sort` 会静默错序，
    已另编 **G27**（稳定性不是可声明属性）。
  - 结论：G26 的三处（合同缺失 / 单参入口缺失 / `BTreeSet` 约束过宽）在本批仍全部成立；
    R14 的 694 之外，本批没有新的「自定义类型作有序容器键」调用点。
- 依赖状态（2026-11-04 更正，R14 + R15 共 14 处 `sort(items)` 调用点）：
  - 这些调用点**依赖 std C4**（`sort` / `sorted` 落地），状态是「**待落地 API**」，
    **不是「已可用」**。与「纸面 API」的区别：纸面 API 指源码里根本不存在的入口（如
    `BitSet::clone` / `BitSet::count`）；C4 指入口尚未由 std 合同落地，但签名已定稿。
  - 定稿签名（`valkyrie-sort-ordering-proposal.md`）：
    `micro sort<T, C>(list: mut C) where C: Cardinal<Element = T> & Countable, T: Comparable`。
    `sort(items)` 能匹配该签名，**写法本身不需要改**。
  - 13 个 `solution.v` 的 `order_items` 垫片已在注释中逐处标注「依赖 std C4（待落地 API）」，
    不因 `authored-unverified` 不编译就隐掉这层依赖。

### G27 排序稳定性不是可声明的属性（`sort` 默认稳定 / `sort_unstable` 显式不稳定）

- 状态：未提供（**std 缺口**；2026-11-04 第 15 批静态核对 `sort.v` + 题 2191，同日契约定稿）
- 现象：`sort.v` 同时暴露 `quick_sort`（不稳定）与 `merge_sort`（稳定），两者签名相同，
  都只接受调用方 `cmp`。稳定性没有写进入口名，调用方无法从签名判断，只能赌实现恰好选了哪个。
  `Comparable` 只描述偏序，不承载「并列键的相对次序必须保持」。
- 契约（定稿，走 Rust 方向，不采纳 C++ 方向）：
  1. **`sort` 默认稳定**。稳定不是可选项，它就是 `sort` 的定义本身。
  2. **`sort_unstable` 是唯一的显式不稳定入口**。调用方写它，等于声明「我知道并列键无所谓」。
  3. **`quick_sort` / `merge_sort` 退成 `private` 实现细节**，不再作为公开契约。
  4. **稳定性是入口属性，不是 `Comparable` 的属性**。`Comparable` 只管序，不管实现怎么排。
  5. 不采纳 C++ 方向（`std::sort` 不稳定 + `stable_sort` 显式稳定）：错序是静默的，
     安全的那一个必须是默认值，不能指望调用方记得传参。
- 期望签名（[提案]，源码尚不存在；完整签名与 `where` 约束见
  `valkyrie-sort-ordering-proposal.md`）：

```v
# 最终定稿签名（依赖 std C4；入口未落地，状态「待落地 API」，不是「已可用」）
micro sort<T, C>(list: mut C) where C: Cardinal<Element = T> & Countable, T: Comparable      # 默认稳定
micro sort_unstable<T, C>(list: mut C) where C: Cardinal<Element = T> & Countable, T: Comparable # 显式承担并列风险
```

- 后果：`sort-the-jumbled-numbers`（2191）的并列映射值必须保持原下标次序。若单参入口落到
  `quick_sort`，结果是**静默错序**而非编译错误；若调用方改用 `sort_unstable`，错序属于
  调用方显式承担的风险。R14 / R15 题解里的 `order_items` 垫片已从 `merge_sort(items)`
  改指向 `sort(items)`（2026-11-04 随本条契约统一改写），不再赌某个实现恰好稳定。
- 影响题（1，批次 R15）：2191（并列映射值依赖稳定性）。
- 判定：**观察**（判据 a：改用显式 `merge_sort`，1 处，代码不膨胀）。
- 与 G26 的关系：G26 解决「序属于类型」；本条解决「并列时谁先谁后属于入口语义」。
  只补 G26 不定本条，2191 仍有静默错序风险。

### 未命中面（第 3 批探测，2026-11-04，无强制影响题，故不编号）

- **迭代器适配器族不是缺口**：`filter_map` / `skip_while` / `take_while` 都在
  （`FilterMapIterator.v` / `SkipWhileIterator.v` / `TakeWhileIterator.v` 加 `Iterator.v`
  的方法入口），终端 `position` 也在（`iterator_terminal.v`）。它们只在 `arch = clr` 下被
  `<% match arch %>` 关掉，wasm 目标可用。账本此前把它们记成「无匹配候选」是旧观测，已失效。
- **组合子仍有边界，但不构成强制缺口**：`Iterator` 没有 `zip` / `chain` / `scan` /
  `step_by` / `rev`。相邻成对本该是 `zip` 加 `skip`，但没有成对承载类型，索引循环是等价
  表达（`find-the-original-array-of-prefix-xor` 即以此写）。
- **大整数没有强制题**：std 没有任意精度类型（`primitive/` 只到 `i128` / `u128`），也没有
  「按寄存器宽度切 limb」的抽象。`multiply-strings`（43）是典型大数题，但它的标准算法本来
  就是手写 limbs（本批以 10 为基数逐位承载并自行进位），不需要 bigint 类型即可表达。结论：
  **未提供，但不是缺口**——理想写法不依赖它。
- **表达力缺口档仍只有 G8**：本批新增的 G19 是「模型已有、构造器缺失」，G20 是「重载与终端
  缺失」，两者都有等价写法（手动偏移、手写 fold），不属于「没有近似物」。

### 未命中面（第 4 批探测，2026-11-04，无强制影响题，故不编号）

- **`Array<T>` 定长写侧够用**：`⁅ ⁆` / `⁅ ⁆=` 两个合同覆盖定长载体就地读写，
  `sort-colors`（75）、`rotate-image`（48）、`set-matrix-zeroes`（73）三题全程写穿原容器，
  没有遇到「定长容器不能写」的问题；`[i64]` 作为宿主数组形参可直接使用（`find-numbers-...`、
  `count-...-strings`、`find-minimum-...`），不需要中转 `ArrayList`。
- **`ArrayView` 区间窗口仍无强制题**：本批 4 题都只需「下标在区间内单调收缩」
  （`find-minimum-in-rotated-sorted-array` 的二分、`rotate-image` 的行内双指针、
  `sort-colors` 的三路划分），索引循环即可表达，硬套 `array_view` 反而多一层间接。
  G19 维持「已记、单实例（189）、非阻断」，**不因本批扩成第二实例**。
- **迭代器适配器第二次确认存在**：`find-numbers-with-even-number-of-digits`（1295）以
  `into_iterator().filter(...).count()` 直接跑通，`filter` / `count` 均为既有 API；
  第 3 批「无匹配候选」的旧观测进一步作废。
- **大整数 limb 面两次确认不需要类型**：`add-to-array-form-of-integer`（989）以十进制逐位
  承载 + 自行进位，`multiply-strings`（43）同法；两题都不需要 `bigint`。**「按寄存器宽度切
  limb」的形态在题库里仍无强制题**——需要它的题（`add-binary`、`multiply-strings`、`989`）
  都以十进制 / 二进制逐位承载即可表达，缺的是「反向」而不是「limb」。
- **`char` 能力面第三次确认**：`count-the-number-of-consistent-strings`（1684）本可写成
  `HashSet<char>`（会命中 G17）或 `BTreeSet<char>`（会命中 G15），因 ASCII 域内 26 位掩码
  本就是更优解，理想写法绕过了两者。**绕开不等于缺口消失**：G15 / G17 的 `char` 交叉引用
  不因本题扩实例。
- **表达力缺口档仍只有 G8**：本批新增 G21（反向无入口）、G22（位元查询缺席）都属「有等价
  写法、只是没有一等入口」，G11 的 `sorted_by` 也属「容器形态不匹配」；「没有任何近似物」
  仍只有无向图建模一条。

### 未命中面（第 5 批探测，2026-11-04，无强制影响题，故不编号）

- **`MultiSet` / `BitSet` 面可直接支撑理想解**：`count-elements-with-maximum-frequency`（3005）
  以 `MultiSet::distinct_elements` + `count` 完成频次归并，`check-if-all-the-integers-in-a-range-
  are-covered`（1893）以 `BitSet::with_capacity` / `set` / `get` 完成区间覆盖判定。两题都不需要
  「手写计数表」，也没有遇到容量或位宽建模问题。
- **`Deque` 面第二次确认**：`shortest-subarray-with-sum-at-least-k`（862）以 `Deque<i64>` 作
  单调递增队列（`push_back` / `pop_back` / `peek_back` / `peek_front` / `pop_front` 全用到），
  与 `sliding-window-maximum`（239）同一组 API，无新增缺口。
- **`utf8` 数组形参与 `[utf8]` 返回仍是待验证面**：`find-smallest-letter-greater-than-target`
  （744）以 `[utf8]` 作形参、`utf8` 作返回值；这一组合在本批只写未构建，未得到运行证据，
  不据此新增或撤销缺口。
- **G18（`split_whitespace`）本批无强制题**：选题偏置里的空白切词面在剩余阻塞 stub 中
  对应的题（`truncate-sentence`、`number-of-valid-words-in-a-sentence`）已有实现，
  `number-of-segments-in-a-string`、`maximum-number-of-words-found-in-sentences` 也已写过；
  本批不扩实例。
- **`ArrayView` 区间窗口仍无强制题**：`spiral-matrix` / `duplicate-zeros` / `sort-array-by-parity`
  都只需「边界下标收缩」或「读写指针相对移动」，索引循环即可表达。G19 维持单实例（189）。
- **表达力缺口档仍只有 G8**：本批新增触发面（G13 第二实例、G18 空转）都有等价写法；
  `MultiSet` / `BitSet` / `Deque` 三条容器面全部落在 std 已有 API 上，未出现「没有任何近似物」。

### 未命中面（第 6 批探测，2026-11-04，仅 G23 一条新编号）

- **`utf8.split` 首次被压住**：`split-strings-by-separator`（2788）直接 `word.split(separator)`
  再显式丢弃空段，全程只用到既有 `split` + `length`。**没有触发 G14**（`split_once` 仍是单实例
  937），也没有触发 G18（本题语义是固定分隔符，不是空白类）。
- **`ArrayView` 写侧第二次确认（仍是全窗）**：`reverse-words-in-a-string-ii`（186）只用
  `array_view(s)` 全窗视图就把整段与每个词就地反转，`⁅ ⁆=` 写穿源数组；G19（区间窗口构造）
  仍无强制题，维持单实例（189）。结论：**写侧不缺，缺的只是非零 `offset` 的构造入口**。
- **`HashMap` 计数面（计数 / `keys()` / `values()`）全部够用**：`unique-number-of-occurrences`
  （1207）、`count-common-words-with-one-occurrence`（2085）、`kth-distinct-string-in-an-array`
  （2053）三题都只用 `new(capacity)` / `contains_key` / `get` / `insert` / `keys` / `values`，
  未遇到任何新缺口。
- **哈希表遍历序不保证插入序，但不构成缺口**：`kth-distinct-string-in-an-array`（2053）需要
  「按出现顺序取第 k 个唯一串」，本批以入参数组本身保序（扫两遍 `arr`），没有依赖 `keys()` 的顺序。
  有序哈希容器（插入序 / 访问序）在 std 里不存在，但题库可用数组下标等价表达，**不编号**。
- **linked-list 形参面在 ABI 层被抹平**：题库 40+ 道链表题的 `head` 一律 marshal 成数值数组
  （`metadata.tests.args.head` 为 `[1,1,2,1,2,3]` 这类），`std.collection.LinkedList` 的能力面
  根本进不了题解入口。顺带核到 `LinkedList` 没有 `to_array` / `into_iterator` / `get(i)`，
  只有 `iter` / `iter_reverse` 两个回调式遍历 + 首尾增删；**token 无法从容器取出，只能回调里消费**。
  但无强制题，**不编号**，仅记「链表面被 ABI 抹平」这一事实。
- **表达力缺口档仍只有 G8**：本批新编号 G23 属「有近似物（题内 Euclid）」，G11 / G12 / G16 的
  新实例都是既有缺口的规模扩张；「没有任何近似物」依旧只有无向图建模一条。

### 未命中面（第 7 批探测，2026-11-04，仅 G24 一条新编号）

- **`utf8` 子串 / 切片面全部够用**：`string-matching-in-an-array`（1408）与
  `number-of-strings-that-appear-as-substrings-in-word`（1967）只用 `contains`（`index_of` 的
  bool 化封装）；`perform-string-shifts`（1427）只用 `slice(start, count)` + `concat`；
  `count-prefixes-of-a-given-string`（2255）只用 `starts_with`。四题均无新增缺口。
- **`slice` 语义记一条易错点（不编号）**：`Utf8Text.slice` 的第二个参数是**段长 `count`**，
  不是终点下标（`Utf8Text.v` L262），与 TS `slice(start, end)` 形似而语义不同；写移位类题时
  必须先 `(n - amount)` 算段长，不能照搬终点的写法。
- **`MultiSet` 能力面首次被压出问题**：`find-resultant-array-after-removing-anagrams`（2273）
  需要两份多重集判等价，实测 `MultiSet` 无 `equals` / 无 `Hash` / 无可依赖的规范序 → **G24**；
  同时其底层 `HashMap` 要求键 `Hash`，`char` 缺席 → G17 叠加。两条是「容器缺 `Equal`」与
  「primitive 缺 `Hash`」的合流，不是同一条。
- **`char` 的 `==` 面够用**：`check-if-a-string-is-an-acronym-of-words`（2828）用 `utf8` 的
  Cardinal 视图直接取 `char` 比较首字母，未触发 G15 / G17 —— 说明 `char` 的「可比较」只差序与哈希，
  等值比较本身没有问题。
- **`HashMap<char, i64>` 频次表第 2 实例**：`shortest-completing-word`（748）只压 G17，
  未触发 G12（容量已知时 `HashMap::new(count)` 正常）。
- **表达力缺口档仍只有 G8**：G24 有近似物（排序键 / 频次向量），G15 / G17 新实例是既有缺口的
  规模扩张；本轮仍无「没有任何近似物」的新面。

### 未命中面（第 8 批探测，2026-11-04，新编号 0 条）

- **`Utf8Builder::append_i64` 首次被压住**：`string-compression`（443）用
  `append_i64(run)` + `build()` + `slice(k, 1)` 把段长逐位写回 `[utf8]`，无需手写除十循环。
  这条 API 此前从未被任何题解使用，属纯增量发现，**不是缺口**。
- **`[utf8]` 的元素是「单字符串」而不是 `char`（类型缝，不编号）**：写侧 `window⁅i⁆ = ...` 的右值
  必须是 `utf8`，直接从 `char` 赋值不成立；本题用 `text.slice(k, 1)` 造单字符。
  `Utf8Builder` 的 `append` 只收 `char` 或 `&Utf8Text`，也没有 `char → utf8` 的一步转换入口。
  有近似物（`slice` / `concat`），故记观察、不编号；对「写数组」类题是高频摩擦点。
- **`slice(start, 1)` 复用问题得到验证**：同一批里 `slice` 既被当作「取一段文本」也被当作
  「造单字符」，第二个参数恒为段长；观察 2 的结论在多题上复用成立。
- **`Deque` 第二面成立**：`verify-preorder-sequence-in-binary-search-tree`（255）只用
  `push_back` / `peek_back` / `pop_back` 做单调栈，`pop_back` 的 `Option` 用局部变量承接
  （不触发 G5 的分支 arity 面）。`Deque::new()` 无容量参数与 G12 同族，但本题规模已知，
  仍属摩擦而非阻断。
- **`ArrayList.insert(ordinal, value)` 语义与 TS `splice` 同向**：`queue-reconstruction-by-height`
  （406）按 `k` 插入，确认参数序是「先位置、后元素」；观察 2 清单第 2 条可在 std 侧直接标「与主流同向」。
- **~~`sorted_by(ArrayList<ArrayList<i64>>)` 可用~~（R9 更正：不成立）**：`sorted_by` 在
  `std/source/collection/sort.v` 中不存在，406 的调用是纸面 API（见观察 4）。同等能力只能是
  「自建副本 + `merge_sort(copy, cmp)`」；G11 的边界是「没有返回新序列的入口」，不是「排序本身」。
- **`ends_with` 存在**：`count-prefix-and-suffix-pairs-i`（3042）与 `starts_with` 对称，
  无需切片比较。
- **表达力缺口档仍只有 G8**：本批 0 条新编号，23 条既有缺口均有等价近似物，结论不变。

### 未命中面（第 9 批探测，2026-11-04，新编号 0 条）

- **`ArrayList.view()` 是零拷贝写侧的正式入口**（首次压到）：`remove-duplicates-from-sorted-array-ii`
  （80）用 `nums.view()` 拿到 `ArrayView<i64>`，`view⁅write⁆ = value` 写穿回源列表。此前批次用自由函数
  `array_view(s)` 只能作用于 `[T]`，对 `ArrayList` 参数不可达；`view()` 补上了这一面，属**已存在 API**，
  不是缺口。
- **`ArrayList.remove(ordinal)` 本批无自然调用点**：它返回 `Option<T>`，可恢复形态完整，但 8 题里
  没有一题需要「按下标删除」，尾部移除归 `pop()`、顺序扫描归下标游标、队列归 `Deque`。按「等价近似物」
  口径记观察，不编号。它的返回值面仍未在真实题解里被压住。
- **`ArrayList.to_array()` 本批无自然调用点**：`HashMap.keys()` / `BTreeSet.to_list()` 已经直接给
  `ArrayList`，而所有需要 `[T]` 的位置都是 `array_view` 入参，本批无 `to_array()` 消费点。全仓
  `solvers/valkyrie/**` 至今 **0 次** `to_array()` 调用（`ArrayList.v` 内部 `split` 除外），返回值面同样未压住。
- **`HashMap.iterator(f: micro(K, V) -> unit)` 形态不可用于累加**：回调没有捕获，只能做纯观察；
  任何「遍历时写入外部容器」的第二遍都表达不了。等价近似物是 `keys()` / `values()` 物化后遍历，
  本批全部走这条路，故不编号。与观察 4 无关，这是回调形态本身的限制。
- **`BTreeSet` 按秩（G16 `nth`）仍缺**：`k-diff-pairs-in-an-array`（532）只需有序遍历，
  `to_list()` 后下标访问即可；真正要「第 k 小」时仍得全量物化，已在 G16 补记。
- **`utf8.trim` / `replace` 语义不可核对**：两者在 `Utf8Text.v` 都是 `[host_contract]` 空壳
  （L186 / L199 直接 `return self`），std 源里没有「去哪些字符 / 全量还是首个替换」的实现。
  本批 8 题不含纯文本题，未实际调用；结论写入观察 2。
- **`Array<T>` 无排序入口仍成立**：本批没有再出现 `Array<T>` 排序需求，残留风险是 R4/R6 的
  `height-checker` / `largest-perimeter-triangle`（见观察 4）。

### 未命中面（第 10 批探测，2026-11-04，新编号 0 条）

- **`ArrayList.remove(ordinal)` 仍无自然调用点（第二批次确认）**：理想解不需要「按序数删元素并消费
  被删值」。`remove-covered-intervals`（1288）单次扫描计数即最优，逐个 `remove` 会退化成 O(n²)，
  属绕路写法；`merge-similar-items`（2363）是双表累加，不是删元素。返回值面（`Option<T>`）仍未被
  真实题解压住，但仍有等价物（`pop()` / 下标游标 / `Deque`），故不编号。
- **`ArrayList.to_array()` 仍无自然调用点**：本批返回数组一律走 `ArrayList`（全库无 `-> [i64]` 先例），
  需要 `[T]` 的位置都是宿主入参或 `array_view`，没有一步要把 `ArrayList` 降成 `[T]`。全仓
  `solvers/valkyrie/**` 至今 **0 次**调用（仅 `Utf8Builder.build()` 在 std 内部用到）。
- **`HashMap.iterator` 的回调无捕获边界（第二次确认）**：`sort-array-by-increasing-frequency`（1636）
  与 `merge-similar-items`（2363）都要遍历计数的键；回调不能捕获结果容器，无法在遍历中 `push`，
  只能 `keys()` 物化后在外层循环处理。这是**能力边界**而非缺口（`keys()` 是等价写法）。
- **`BTreeSet.nth` / `rank` 仍无自然调用点**：`rank-transform-of-an-array`（1331）要「值 → 名次」，
  `to_list()` + 一次线性建表已是 O(n log n)，`nth` 帮不上；`minimum-moves-to-equal-array-elements-ii`
  （462）要中位数，但 `BTreeSet` 会去重、破坏重复值语义，必须保留多重集。G16 影响题扩为 5，
  但 `nth` 本身仍只在提案里。
- **`utf8` 四个 `[host_contract]` 空壳未被本批使用**：8 题没有一题依赖 `trim` / `replace` /
  `to_lower` / `to_upper`，因此本批无需「语义未定，待 adaptor 侧确认」标注；约束见观察 5。

### 未命中面（第 11 批探测，2026-11-04，新编号 0 条）

按新口径**不再重复探测** `remove(ordinal)` / `to_array()` / `HashMap.iterator` / `BTreeSet.nth`
四个面（R9–R10 已确认无自然调用点），本批改压写侧与容器构造面。

- **`ArrayList` 容量 / 预分配（命中）**：`restore-ip-addresses`（93，结果 `new(4)`、码点缓冲
  `new(total + 3)`）、`diagonal-traverse-ii`（1424，桶表 `rows + cols`、每桶 `new(0)`）、
  `spiral-matrix-iii`（885，`new(rows * cols)` + 每个坐标行 `new(2)`）、
  `letter-combinations-of-a-phone-number`（17，每层 `new(combos.length() * letters)`）、
  `find-all-anagrams-in-a-string`（438，窗口表 `new(window_size)`）。容量均为题内已知上界，无缺口。
- **嵌套容器构造（命中）**：`diagonal-traverse-ii`（1424）桶式两层；`spiral-matrix-iii`（885）
  坐标行两层；`letter-combinations-of-a-phone-number`（17）`ArrayList<ArrayList<i64>>` 逐层笛卡尔积。
  两层形态没有新增缺口，只是把 2363 的用法扩展到「逐层重建」。
- **`HashMap` 删除 / 清空（命中）**：`find-all-anagrams-in-a-string`（438）计数归零时 `remove(k)`，
  显式承接 `Option<i64>`；`substring-with-concatenation-of-all-words`（30）`clear()` 与 `remove(k)`
  成对出现。两者都有等价写法（重建窗口表 / 保留零计数键），故不编号。
- **`Deque` 队首面（命中）**：`number-of-closed-islands`（1254）BFS `peek_front` / `pop_front`；
  `number-of-students-unable-to-eat-lunch`（1700）队列 `peek_front` / `pop_front` / `push_back`。
  队首侧与 back 侧一样只是 `[host_contract]` 转发，**未发现新缺口**。
- **`Utf8Builder` 多次 append（命中）**：`restore-ip-addresses`（93）每串 11 次 `append(char)` 后
  `build()`；`letter-combinations-of-a-phone-number`（17）每串 1–4 次。与 R9 的「多次 append + 一次
  build」一致，除 G4（std 自编译）外未暴露新问题。
- **`ArrayList` ↔ 定长 `Array<T>` 仍未命中**：8 题里没有一题需要把 `ArrayList` 降成 `[T]` 再交回 ——
  宿主入参已是 `[T]` / `ArrayList<T>`，返回一律 `ArrayList`，885 也特意全程只用行容器。结论不是
  「定长数组没用」，而是**没有分配型调用点**；定长 `Array<T>` 的就地无分配变换仍是正当能力，
  边界与 `sort.v` 坐标见观察 7。

### 未命中面（第 12 批探测，2026-11-04，新编号 0 条）

本批按语言构造面选题，不再重复压容器 API。

- **递归和类型（命中，但未构建）**：`parsing-a-boolean-expression`（1106）的 `BoolNode`、
  `decode-string`（394）的 `DecodedPart` 都是 `unite`；1106 的 `And` / `Or` 载荷是
  `ArrayList<BoolNode>`，即变体载荷回指自身。此前题解从未构建过递归和类型，验证窗口优先看这两题。
- **无载荷标记类型（命中）**：`crawler-log-folder`（1598）用 `enums FolderOp` 替掉 `0/1/2` 魔法值，
  `match` 三分派，属已存在语言构造，无缺口。
- **闭包作比较器 / 谓词 / 累加器（命中）**：`largest-number`（179）把内联 `micro(a, b) -> i32`
  直接传给 `merge_sort`；`partition-array-according-to-given-pivot`（2161）用 `fold` + 捕获 `pivot`
  的内联闭包。比较器形态此前只用具名函数（观察 4 的 `sorted_by` 清理遗留），本批首次压内联闭包。
- **递归 + 结果累加（命中）**：`different-ways-to-add-parentheses`（241）分治、
  `combination-sum`（39）回溯、`brace-expansion`（1087）递归展开，均未退化为纯迭代。
- **`ArrayList` 分配面（顺带）**：179 复制入参后再 `merge_sort`、39 结果行按 `path.length()` 预分配；
  没有 `reserve` 调用点 —— 容量都在构造时给定，`reserve` 仍未被真实题解需要。
- **题材问题（记账，不改数据）**：1106 的 `metadata.json` 有 3 条 `expected` 为
  `Error: list index out of range` 的用例，与题面不符。本批只写理想解、未改 metadata，验证窗口前
  需单独修正，否则该题永远无法判通过。

### 建模提示（G8 的根部，比缺 API 严重）

- 现象：无向性不是图模型的一等属性。`DirectedGraph` 只以「有向」为轴；`GraphMatrix`、`WeightedGraph`
  各自补一个 `add_undirected_edge`，同一语义在三种图上三种入口，且**没有无向图类型**
  ——无向关系只能以「双向有向图 + 调用方自律」表达，`has_edge` / `out_degree` 的语义也随之变成
  「出边」而非「邻接」。三者的 `has_edge` / 度数面也不对称：`DirectedGraph` 有单向 `has_edge` 与
  `out_degree` / `in_degree` 但无 `degree`，`GraphMatrix` 只有单向 `has_edge` 与 `neighbors`，
  `WeightedGraph` **完全没有** `has_edge` / 度数入口。
- 硬事实一：`weak_components`（`unweighted.v` L53-L107）必须**自己同时扫 `successors` 与
  `predecessors`**，才能把有向边当无向用 ⇒ 无向性是**算法现场伪造的前提**，不是类型提供的前提。
- 硬事实二：std 测试只断言「镜像单元写进去了」（`test/math/test_graph_theory.v` L210-L222），
  **没有任何测试能断言「后续写入后对称仍成立」，因为没有这条合同可断言**。
- 硬事实三：`WeightedGraph.add_undirected_edge` 是两次 `push`（`weighted.v` L124-L129），重复调用
  会产生平行边、`edge_count` 双重计，读侧无去重、也没有去重入口。
- 若只补 `add_undirected_edge`：G8 的 4 道题能写短，但 `has_edge(b, a) == false` 这类反直觉状态仍可
  构造，边方向性仍然泄漏给每道题。它只把双写约定命名化，不建立任何合同。

三方案对比（**只做分析，不选型、不排期**）：

| 方案 | 能挡住什么 | 挡不住什么 | 对现有签名与题解的影响面 |
|---|---|---|---|
| **A** 独立 `UndirectedGraph<N>` 类型 | 编译期没有单向写入口；`has_edge` 由构造即对称；度数唯一（无 in/out 分裂）；要求无向语义的算法可在签名上写该类型，把前提变成类型 | 自环 `u==v` 的计数口径仍需显式规则；加权变体的多重边语义仍需单独决策；从既有有向图迁移时「丢单向边还是补成对边」是运行时决策；不阻止调用方在类型外自建边表；`strong_components` / `topological_sort` 对该类型不适用 | 新增第 4 个图类型。`unweighted.v` 中 `weak_components` / `strong_components` / `unweighted_shortest_paths` / 私有 DFS 的签名全部钉死 `std.collection.DirectedGraph<N>`（L53 / L110 / L160 / L196），需引入图源 trait 或按类型复制一套；`possible-bipartition`、`find-center-of-star-graph`、`maximal-network-rank` 等题解需换类型 |
| **B** 方向作构造参数（`new(Direction::Undirected)`，或 `add_edge(from, to, Symmetry)`） | 运行期可按 mode 归一化 `has_edge` / 度数 / 分量的读取；每次写入可校验 mixed mode 并结构化失败 | 类型层面挡不住：无向与有向实例同型，误用的图照样通过类型检查；合同从编译期退化为运行期约定；签名仍无法表达「只接受无向图」；`DirectedGraph` 每条读路径都要加分支 | 零签名破坏，现有题解全部继续编译，但用运行期正确性换零迁移成本 |
| **C** 有向图上的只读视图 `UndirectedView<N>`（构造时校验对称闭包） | 读侧：构造成功即代表「当时状态对称」，`neighbors` / 度数归一化，视图内不再可能误用单向语义；无新增存储 | 底层是可变共享引用（`class` 是引用类型），视图只是创建时刻窗口（与 `ArrayView` 同语义，`array_view.v` L8-L10），原图后续 `add_edge` 会让对称失效；写侧仍走原图 `add_edge`；校验失败需新增 panic / `Option` 决策；`WeightedGraph` 平行边使「对称」无法用集合比较判定 | 改动面最小：只加一个视图类型 + 校验入口，`DirectedGraph` API 零改动；题解只改读侧，但保证力最弱（仅保证创建时刻） |

- 优先级判断：**改建模 > 加 API**。该判断属设计分析，不构成本轮实现任务，也不代表已选型。

## 批次状态：canonical 未构建 214 题（2026-11-04 实测）

- 范围：口径定为 496 后，扫描起点未构建的 **214 题**（分两个 107 题子块、单进程顺序构建）。
- 时点：本批构建与判题都在 **std `from_iterator` 修复前** 测得（2026-11-04 早间）。本轮不更新
  任何构建通过数或判题结果；std 修复后必须重扫这 214 题再重判，不得沿用这批数字。
- 构建：**176 `status=0` / 38 `status=1`**。
- 失败归族（只列族与题数，不逐题贴结果）：
  - G4 `Utf8Builder.append`：30 题构建失败，但该归族在 dev tip 上已不成立（见 G4「疑似失效」），
    **分类不可信**，std 修复后必须重验这 30 题再归类。
  - G2 浮点返回合同：2 题（`airplane-seat-assignment-probability`、`angle-between-hands-of-a-clock`，
    诊断 `declares no [export]`）。
  - G6 `round` 标识符误拉闭包：1 题（`sum-of-digits-of-string-after-convert`）。
  - G7 `HashMap.insert` 分支 + 嵌套 early return：1 题（`isomorphic-strings`）。
  - 写法错 4 题：`determine-if-string-halves-are-alike`（`let lower` 未声明 `mut`）；
    `find-the-winning-player-in-coin-game`（`Utf8Text::from_bytes([65, ...])` 元素默认 `i32`，
    显式 `as u8` 后 `status=0`）；`number-of-different-integers-in-a-string`、`word-pattern`
    （`builder.append(<u8>)` 无匹配候选，`append` 只收 `char` / `&Utf8Text`）。

### 判题结果（同一批 176 题）

- 176 个 `status=0` 题的导出签名全部为标量 / `utf8`，不含 `ArrayList` / `Array` / `Option` /
  `HashMap`，不存在 G3 桥阻断，逐个隔离判题。**142 题 `ok=true`**，34 题未通过：
  - 算法结果不符 14 题（如 `ugly-number-iii` 12/133、`maximum-swap` 85/119）。
  - `metadata.tests.args` 键名与导出形参名不一致 7 题（`AbiSchemaError: args.* 缺少参数`）。
  - 大整数参数超出 `i64` 表示范围 4 题（语料缺陷，如 `maximum-xor-product`）。
  - 期望异常 / 超时未触发 6 题（`Error: pow expected 2 arguments, got 3`、`negative shift count`、
    `maximum recursion depth exceeded`、`Execution timed out`）。
  - 导出名大小写不符合 `camelCase` 规则 2 题（`confusing-number-ii` 的 `confusingNumberII`、
    `preimage-size-of-factorial-zeroes-function` 的 `preimageSizeFZF`，F4 同族）。
  - 判题进程超时 1 题（`closest-fair-integer`，无 `VALKYRIE_SOLVER_RESULT`，不计通过）。
- 四字段合计：`executed_pass 13452` / `executed_fail 31` / `blocked 0` / `not_run 2092`。
- 构建通过数：**38 → 180**（+142）。176 个 `status=0` 中 34 题判题未通过，按维护口径不计入。
- 时点：以上判题与构建通过数同样是 **std 修复前** 的测量，本轮不更新、不再作为结论引用。

### 判题未通过成因复核：`metadata` 参数名 7 题（2026-11-04）

- 判定：**解法签名写错**，不是 metadata 缺陷。7 题的 `metadata.tests.args` 键与官方 `invoke`
  逐字一致；是 `solution.v` 的导出形参用了 `snake_case`，而 V 导出 micro 的形参名必须与 `args`
  键名逐字相同（`buildAbiArguments` 按 `param.name` 取 `args[param.name]`，不做 snake↔camel 归一）。
- 修法：只改 7 个 `solution.v` 的导出 micro 形参与函数体内引用，**未改 metadata、未改期望值**。

| slug | `metadata.tests.args` 键 | 修正后导出签名 |
| --- | --- | --- |
| `check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence` | `sentence`, `searchWord` | `is_prefix_of_word(sentence: utf8, searchWord: utf8)` |
| `check-if-point-is-reachable` | `targetX`, `targetY` | `is_reachable(targetX: i64, targetY: i64)` |
| `check-if-word-equals-summation-of-two-words` | `firstWord`, `secondWord`, `targetWord` | `is_sum_equal(firstWord: utf8, secondWord: utf8, targetWord: utf8)` |
| `count-the-number-of-ideal-arrays` | `n`, `maxValue` | `ideal_arrays(n: i64, maxValue: i64)` |
| `handshakes-that-dont-cross` | `numPeople` | `number_of_ways(numPeople: i64)` |
| `minimum-cost-to-set-cooking-time` | `startAt`, `moveCost`, `pushCost`, `targetSeconds` | `min_cost_set_time(startAt: i64, moveCost: i64, pushCost: i64, targetSeconds: i64)` |
| `number-of-ways-to-reach-a-position-after-exactly-k-steps` | `startPos`, `endPos`, `k` | `number_of_ways(startPos: i64, endPos: i64, k: i64)` |

- 复验：本轮不构建不判题（std 未恢复），下次重扫时随批次复验。

### 判题未通过成因复核：大整数参数 4 题（2026-11-04）

- 判定：**语料缺陷**。既不是 V 侧解法溢出 `i64`，也不是 harness 把 `bigint` 转 `Number` 丢精度。
  这几处实参在 `metadata.tests.args` 里以十进制字符串保存，字符串本身已超出 `i64` 表示范围，
  判题器在入参规整阶段按设计拒绝，V 代码根本没有执行。
- 坐标（4 题 6 处）：

| slug | 用例 | 参数 | 字符串值 | 与官方约束 |
| --- | --- | --- | --- | --- |
| `max-difference-you-can-get-from-changing-an-integer` | `tests[26]` | `num` | `"98765432109876540000"` | 约束 `1 <= num <= 10^8`；字符串是 `Number` 精度丢失后的输出（`Number('98765432109876543210').toString()` 同值） |
| `maximum-sized-array` | `tests[19]` | `s` | `"9223372036854776000"` | 约束 `s <= 10^15`；字符串恰等于 `Number(2^63).toString()` |
| `maximum-sized-array` | `tests[56]` | `s` | `"18446744073709552000"` | 同上；字符串恰等于 `Number(2^64).toString()` |
| `maximum-xor-product` | `tests[58]` | `a`, `b` | `"18446744073709552000"` | 约束 `a, b < 2^50`；两参数同值，均为 `Number(2^64)` 输出 |
| `minimum-garden-perimeter-to-collect-enough-apples` | `tests[50]` | `neededApples` | `"100000000000000000000"` | 约束 `neededApples <= 10^15`；值本身精确（10 的幂） |
| `minimum-garden-perimeter-to-collect-enough-apples` | `tests[66]` | `neededApples` | `"10000000000000000000"` | 同上 |

- 判题侧坐标（正确行为，不是缺陷）：`projects/conformance/src/isolated/v-shared.ts:30`
  `preserveI64Precision` 调 `coerceIntegerArgument(value, I64_MIN, I64_MAX, "args.<name>")`；
  拒绝点在 `projects/conformance/src/domain/integer-literal.ts:77-79`，字符串整数字面量超出
  `[min, max]` 即抛「超出表示范围」。
- 修法：修语料 —— 删除这 6 处越官方约束（同时超 `i64`）的用例，或按官方约束替换参数并重算
  `expected`。不改解法，不改判题器。本轮只登记坐标，未改 metadata。

## 批次状态：Easy 数组返回值补缺（19 题，2026-11-04 写完未构建）

- 范围：返回数组 / 矩阵的 Easy 题，此前 `solution.v` 为空或只有阻塞标记、且 `metadata.invoke`
  无 `valkyrie` 入口，因此从未进入 canonical。本批补写 19 个理想解并在各自 `metadata.json` 的
  `invoke` 块登记 `valkyrie` 入口（19/19 写入成功，JSON 全部可解析）。
- 口径影响：canonical **496 → 515**（`invoke.valkyrie` 非空且 `solution.v` 非空的交集实测 515）；
  未构建数按扫描起点口径为 214 + 19 = **233**（未构建，不新增覆盖数）。
- 签名对齐：19/19 的导出形参名与 `metadata.tests.args` 键名逐字、同序一致（本轮脚本核对）。
- 未构建 / 未判题：全部返回 `ArrayList`（`ArrayList<i64>` / `ArrayList<utf8>` /
  `ArrayList<ArrayList<i64>>`），按 G3 现状预计在 wasm JS glue 的 marshal/demarshal 处阻断；
  `convert-the-temperature` 另受 G2（浮点返回值合同）阻断。本批不计入构建通过数。
- 题（19）：`binary-watch`、`cells-in-a-range-on-an-excel-sheet`、`construct-the-rectangle`、
  `convert-integer-to-the-sum-of-two-no-zero-integers`、`convert-the-temperature`、`di-string-match`、
  `distribute-candies-to-people`、`divide-a-string-into-groups-of-size-k`、
  `find-n-unique-integers-sum-up-to-zero`、`find-the-losers-of-the-circular-game`、`flip-game`、
  `matrix-cells-in-distance-order`、`number-of-even-and-odd-bits`、`occurrences-after-bigram`、
  `pascals-triangle`、`pascals-triangle-ii`、`positions-of-large-groups`、
  `shortest-distance-to-a-character`、`uncommon-words-from-two-sentences`。

## 批次状态：未登记批次（历史题，2026-11-04 实测）

- 范围：未进入 Easy / Medium 批次表、但含形态 A 的历史题，共 56 个 `solution.v` 文件。
- 形态 A 清理：56 文件 / 176 处逐处校验后删除，复扫残留 0；形态 B 未动。
- 构建：**51/56 `status=0`**。失败 5 题：G4 4 题（`convert-a-number-to-hexadecimal`、
  `longest-common-prefix`、`sort-characters-by-frequency`、`summary-ranges`；该归族见 G4「疑似失效」，
  待 std 修复后复验）、G5 1 题
  （`baseball-game`）。另有 1 题 `shuffle-the-array` 在删除 `unwrap` 后暴露 `let limit` 未声明
  `mut` 却被赋值（**写法错、非缺口**，改为 `let mut` 后 `status=0`）。
- 判题：本块未判题，`executed_pass` / `executed_fail` / `blocked` / `not_run` 未产生实测值，
  不计入构建通过数。

## 批次状态：Easy 标量/文本池（2026-11-03）

- 范围：`metadata.tests` 的参数与期望均为 `number` / `boolean` / `string` 的 Easy 题，共 133 题。
- 状态：理想解已写。2026-11-04 完成其中 40 个含形态 A 的文件的首轮真构建（详见下一条）。
- 形态 A 清理（2026-11-04）：40 文件 / 113 处 `⁅…⁆.unwrap()` 已逐处确认后删除（每处校验
  `.unwrap()` 紧跟 `⁆` 且容器元素非 `Option`），清理后复扫残留 0 处；形态 B 一律未动。
  本批 40 题真构建 **20 `status=0` / 20 `status=1`**，20 题失败全部命中 G4（该归族见 G4
  「疑似失效」，待 std 修复后逐题复验）；另
  `minimum-string-length-after-removing-substrings` 暴露 `char` 覆盖 `u8` 的写法错误（非缺口，
  改为 `u8` 后 `status=0`）。其余 93 题本轮未构建，状态仍是未验证。
- 判题（2026-11-04）：20 个 `status=0` 题逐个隔离判题，**19 题 `ok=true`**。四字段合计
  `executed_pass 2099` / `executed_fail 1` / `blocked 0` / `not_run 170`，`testCaseTotal 2270`。
  唯一未通过为 `minimum-number-of-pushes-to-type-word-i`（`tests[31]` 期望 `64`、实得 `55`，
  已登记的 oracle 模型缺陷，非算法实现问题）。
- `single-row-keyboard` 首判 `RuntimeError: unreachable`（`tests[50]` 键盘含 `,`，`code - 97`
  下溢后越界）。该题 95 例中 11 例键盘不满足官方「26 个互异小写字母」约束，按既有语料口径
  删除这 11 例、保留理想解；剩 84 例 **84/84 通过**。此次失败不是 G3，`blocked=0`。
- 构建通过数：**19 → 38**（+19，全部是本批判题通过；`minimum-number-of-pushes-to-type-word-i`
  虽 `status=0` 但判题未通过，不计入）。
- TS 侧：133 题全部用 `run_ts_solver.ts` 实跑，**131 通过 / 2 未通过**（见「oracle 模型错误」，
  保留理想解，不改算法）。
- 缺口：当时新增 G4（后经 dev tip 复测疑似失效，见 G4 节）；`utf8` 下标读、`ArrayList`、
  `HashMap` 属既有已恢复能力。

## 批次状态：Medium 三组（2026-11-03 实测）

- 范围：`ArrayList 表` 12 题 + `位运算` 13 题 + `纯递推 / 序列生成` 12 题，共 37 题。
- 构建：**37/37 通过**。逐题走 `resolveCompileTargetPlan` → `legionBuildProject`，canonical
  target 为 `wasm32-unknown-unknown-wasm`（由各题 `legion.von` 的 `build[].target` 经 `legionPlan`
  规范化，无本地默认值），单题 0.56–1.26 s。逐题证据见 `valkyrie-unverified-batches.md`
  的「批次 M-2026-11-03」每行实测列。
- 判题：**1/37 通过**（`number-of-dice-rolls-with-target-sum` 108/108）；36 题在 wasm JS glue
  ABI 边界被 G3 阻断（25 题入参 marshal、11 题返回值 demarshal），**0 题因算法结果不符而失败**。
- 构建通过数：**18 → 19**。唯一增量为 `number-of-dice-rolls-with-target-sum`（签名全标量，
  108/108 实跑通过）；其余 36 题虽有 `build=0` 产物，但判题未通过，按维护口径不计入覆盖数。
- TS 侧：37 题全部用 `run_ts_solver.ts` 实跑，**37/37 通过**；跑红后修的是语料与两处算法
  （`minimum-impossible-or` 判定规则、`numbers-with-same-consecutive-differences` BFS 子节点顺序），
  未为通过而改期望值。

编译期失败族（均已修复，不再是当前失败项）：

| 族 | 命中 | 最小复现 | 诊断与坐标 |
| --- | --- | --- | --- |
| F1 下标值再调 `.unwrap()` | 18 题 / 58 处 | `nums⁅i⁆.unwrap()` | 非缺口（`⁅ ⁆` 返回裸 `T`，见 G0）；`error[valkyrie.hir.unresolved_call]`，无 `unwrap` 方法候选；例 `house-robber-ii/solution.v:8:22`、`spiral-matrix-ii/solution.v:26:13` |
| F2 `i32` 字面量移位越界 | 1 题 | `return 1 << 32` | `error[valkyrie.hir.unresolved_call]`，`minimum-impossible-or/solution.v:18:12`；字面量 `1` 取默认 `i32`，改为字面量 `4294967296` 后 `build=0` |
| F4 导出名与 `invoke.valkyrie` 不一致 | 2 题 | `subarray_bitwise_o_r_s` 导出 `subarrayBitwiseORS` | 运行期找不到 export；按 `snake_case_to_camel_case` 只大写 `_` 后首字符的规则，改为 `subarray_bitwise_o_rs` / `get_maximum_xor`，同步后 `build=0` |

F1、F2、F4 均为**非缺口、是我写错**：`⁅ ⁆` 返回裸 `T`，`.unwrap()` 属非法写法；改越界字面量、
按导出规则命名，未为凑通过数改算法或期望。F4 的两题修名后落入 G3（marshal），
不再作为独立族存在。

全仓 `.unwrap()` 形态拆分（`projects/problems/**/solvers/valkyrie/solution.v` 实测）：

| 形态 | 次数 | 文件数 | 合法性 |
| --- | --- | --- | --- |
| A 下标值再调：`nums⁅i⁆.unwrap()` | 289 | 96 | **非法**：`⁅ ⁆` 返回裸 `T`，非缺口 |
| B 可选取值：`nums.get(i).unwrap()` | 22 | 13 | **合法**：`get` 返回 `Option<T>`，`Option::unwrap` 存在 |
| B 其它可选值：`Option` 变量 / 返回 `Option` 的访问器再 `.unwrap()` | 7 | 2 | **合法**：`third-maximum-number` 5 处、`valid-palindrome` 的 `ascii_alnum_key(): Option<i64>` 2 处 |

先前「287 处」是简单正则口径，漏掉了 `sort-characters-by-frequency` 同一行嵌套下标的
2 处外层 `.unwrap()`，按形态归并后 A 为 **289 处 / 96 个文件**。B 形态 29 处 / 15 个文件
（其中 13 个文件是 `.get()`，2 个是其它可选值），均不属缺口、不需要改写。Medium 37 题
本窗口只清理了 A 形态；Easy 批次复跑前须先按 A 形态清理，否则首轮构建会再次报
`error[valkyrie.hir.unresolved_call]`。B 形态在 Easy 批次中保留原样，未做任何改写。

4 类「待复验」写法的实测结论：

| 探针 | 命中题 | 实测结果 | 结论 |
| --- | --- | --- | --- |
| 变量右移 `x >> bit` | `single-number-ii` | `build=0`；`x`、`bit` 均为 `i64` 变量 | 编译器已支持，非缺口。仅字面量 `1 << 32` 受 `i32` 默认类型限制（F2） |
| `ArrayList` 变量整体赋值 | `number-of-dice-rolls-with-target-sum` | `build=0` 且判题 108/108 | 编译器与运行期均支持，非缺口 |
| `ArrayList<bool>` 下标读写 | `prime-pairs-with-target-sum`、`closest-prime-numbers-in-range` | `build=0`；筛法体执行至返回值边界，随后才在 demarshal 处报 G3 | 语言与运行期支持，非缺口；断言被 G3 阻断 |
| `HashMap` 批量插入 | `maximum-xor-of-two-numbers-in-an-array` | `build=0`；`insert` 在循环内批量写入 | 编译期支持，非缺口；运行期未执行（marshal 先阻断） |

## 语料缺陷（corpusDefect，2026-11-03 实测）

此前报告里「语料无缺陷 / 0 条」的说法只覆盖超安全整数扫描
（`valkyrie-lane-coverage.md` 的 `fits_i64=0 / fits_u64=0 / beyond_u64=0`），不覆盖期望类型、
占位值、签名串与越界输入。本批 133 题实测有 30 题含这类缺陷，该泛化结论被证伪，以本节为准。

修复原则：只修明显错误（类型错、`null` 占位、`Error:` 签名串、违反官方约束的输入），
语义有争议的保持原样并保留理想解。下列题此前都没有 V 构建产物，未参与任何覆盖统计，
改动不影响已判结果；但用例数变化后，其它 lane 的历史绿灯不可直接沿用。

| 形态 | 题 | 修法 |
| --- | --- | --- |
| 期望类型错（数值代替字符串） | `find-valid-pair-of-adjacent-digits-in-string`、`license-key-formatting`、`reformat-the-string`、`reverse-only-letters`、`reformat-phone-number`、`calculate-digit-sum-of-a-string`、`largest-3-same-digit-number-in-string` | 数值期望改为对应字符串；`largest-3...` 的 `0` 还原为 `"000"` |
| `null` 占位 | `find-the-difference`、`first-letter-to-appear-twice`、`latest-time-you-can-obtain-after-replacing-characters` | 删除占位用例 |
| `Error:` 签名串混入 | `first-bad-version`、`clear-digits`、`decrypt-string-from-alphabet-to-integer-mapping`、`merge-strings-alternately`、`permutation-difference-between-two-strings`、`reformat-phone-number`、`replace-all-digits-with-characters`、`single-row-keyboard`、`sum-of-digits-of-string-after-convert`、`hexspeak`、`sorting-the-sentence`、`check-if-numbers-are-ascending-in-a-sentence` | 删除签名串用例；`first-bad-version` 的期望改为 `args.bad` 并删缺参用例 |
| 违反官方约束的输入 | `determine-if-string-halves-are-alike`、`greatest-common-divisor-of-strings`、`check-if-all-characters-have-equal-number-of-occurrences`、`latest-time-by-replacing-hidden-digits`、`latest-time-you-can-obtain-after-replacing-characters`、`reverse-words-in-a-string-iii`、`sorting-the-sentence`、`check-if-numbers-are-ascending-in-a-sentence`、`calculate-digit-sum-of-a-string`、`minimum-number-of-operations-to-convert-time` | 删除越界用例（奇长度、空串、非 5 字符、多空格、序号 0/10、`0` 词元、`k=1`、负区间） |
| oracle 模型错误（未改期望） | `minimum-number-of-pushes-to-type-word-i`、`calculate-digit-sum-of-a-string`、`rearrange-spaces-between-words`、`find-the-difference`、`maximum-difference-between-even-and-odd-frequency-i` | 保留理想解；仅删除无法自洽的个别用例。`pushes` 的 oracle 用「按字符位置分槽」，与官方按字母频次计价不符，故该题 TS 仍红 |
| 键盘不是 26 个互异小写字母（长度 25–31、含 `,`/空格/重复字母） | `single-row-keyboard` | 删除 11 条越约束用例 | 11 |

### Medium 批次（37 题）实测缺陷

本批 37 题里有 8 题在提交前实跑暴露出语料缺陷，全部按「只删明显非法用例、不改期望语义」处理：

| 形态 | 题 | 删除/修法 | 数量 |
| --- | --- | --- | --- |
| 期望为 `Error:` 签名串，且入参形状非法（三角数组行宽不等） | `triangle` | 删除该用例 | 6 |
| 期望为 `Error: ... missing 1 required positional argument`，入参缺键 | `incremental-memory-leak` | 删除该用例 | 1 |
| 违反官方频次约束（「其余元素恰出现三次」） | `single-number-ii` | 删除该用例 | 11 |
| 输入越官方约束 `abs(nums[i]) <= 10^9`，且需要超 32 位异或 | `single-number-iii` | 删除越界用例 | 51 |
| 输入越官方约束 `nums[i] <= 10^9` | `bitwise-xor-of-all-pairings` | 删除越界用例 | 5 |
| 输入越官方约束 `nums[i] < 2^maximumBit` | `maximum-xor-for-each-query` | 删除越界用例 | 1 |
| 输入越官方约束 `nums[i] <= 10^9` | `maximum-xor-after-operations` | 删除越界用例 | 15 |
| 输入越官方约束 `nums[i] <= 10^9` | `find-xor-beauty-of-array` | 删除越界用例 | 15 |

实现缺陷（非语料，已修且 TS 转绿）：

- `minimum-impossible-or`：首版按「所有元素按位或后缺失的最低位」判定，`[5,3,2]` 会得 8，正确规则是
  「不在数组中的最小 2 的幂」，得 1。V/TS 同步改为集合查表。
- `numbers-with-same-consecutive-differences`：BFS 子节点顺序必须是先 `last + k` 后 `last - k`，
  否则与语料期望顺序相反。

结论：`valkyrie-lane-coverage.md` 曾以超安全整数扫描得出「corpusDefect 0 条」，仅覆盖数值越界一种形态；
Easy 133 题实测 30 题有缺陷、Medium 37 题实测 8 题有缺陷，该「全库零缺陷」结论在类型、占位值、签名串、
约束四个维度上均已被证伪，以本节与上一节表格为准。

`count-the-number-of-special-characters-i` 的失败是实现缺陷而非语料：非字母字符参与
`1 << (code - 65)` 位运算产生伪重叠，已改为只对 `A-Z` / `a-z` 置位。

### 大整数精度扫描（全库，2026-11-04 实测）

- 范围：全部 2842 个 `projects/problems/*/metadata.json`（2869 目录 − 27 个无 metadata），
  `tests[].args` 与 `tests[].expected` 中的整数字面量和纯十进制整数字符串，阈值 `|v| > 2^53-1`。
  候选 **17,545 行 / 182 题**。工作区里 `palindrome-partitioning/metadata.json` 是 0 字节
  （成因见本节末尾的完整性扫描），因此实际可解析 2841 个。
- 判定规则（不靠「尾零」观感，靠可表示性）：
  - 十进制整数 `v` 能被 double 精确表示，当且仅当 `bitlen(v) <= 53` 或 `v % 2^(bitlen-53) == 0`；
  - JSON number 不满足该条件 → `JSON.parse` 得到的已不是文本里的值（文本 ≠ 运行值）；
  - 字符串不满足该条件且 `String(Number(s)) === s` → 该串本身是 double 的十进制输出（抹平痕迹）；
  - 参数是否数值型：优先取 V 导出签名类型，无解法的题用「同一 key 在任一用例中出现过 JSON number」；
  - 纯二进制文本串（`^[01]+$`）与 `utf8` 参数一律按文本，不参与数值判定。
- 分类结果（缺陷行 180 条）：

| 类 | 含义 | 行 | 题 |
| --- | --- | --- | --- |
| A | args 精度丢失，用例无法表达，V 根本没跑 | 127 | 21 |
| B | expected 精度丢失，会制造假失败 | 24 | 8 |
| C | 精确大整数但超出 `i64` 表示 / 官方约束 | 4 | 3 |
| S | 语义性语料错误（不是精度问题） | 25 | 1 |
| D | 无精度损失（精确整数 / 文本 / 二进制串 / 无类型串） | 17365 | 171 |

- 逐条坐标与证据在 `valkyrie-corpus-precision-defects.json`（本目录），**metadata 与 expected 数值一行未改**。

#### quarantine 落地与覆盖率剔除（2026-11-04 落定）

- 清单：本目录 `valkyrie-corpus-precision-defects.json`，坐标是 `cases[].field`（如
  `tests[85].expected`、`tests[51].args.changed[60]`）。缺陷类 A/B/C/S 全部参与隔离，D 不参与。
- 执行单位：`metadata.tests` 下标（整条用例）。180 条缺陷行收敛为 **99 条用例 / 25 题**
  （同一用例内多个元素命中只隔离一次；单个 args 元素无法单独执行，不能按元素隔离）。
- 解析与扣减：`projects/conformance/src/reporting/corpus-quarantine.ts`；
  矩阵报告 `valkyrie-lane-matrix.ts` 新增 `quarantine` 选项；CLI `src/cli/valkyrie-matrix.ts`
  读取清单。扣减同时作用于行级分母 `testCaseTotal` 与 `executed_pass / executed_fail / blocked / not_run`。
- 归类重建规则：`blocked` 行整行记 blocked；`ok` 行整行记通过；其余行
  `firstFailureIndex` 之前记通过、该下标记失败、其后记未运行。用 176 条判题记录逐行核对，
  **0 失配**；越界下标（清单与当前 metadata 不一致）不扣减。
- 可整体撤销：清单文件缺失时 `loadCorpusQuarantine` 返回 `null`，隔离整体失效；回滚一笔提交
  即可恢复原分母。未新增 metadata 字段、未动生成器、未动判题器。
- 不越权：`green / runtimeOk` 仍是实测值，剔除只改行级分母与四字段；不把未复判的题算成通过。

剔除前 → 剔除后的分母：

| 维度 | 剔除前 | 剔除后 | 说明 |
| --- | --- | --- | --- |
| 题级（矩阵报告 `hasValkyrieSolver`，2869 题） | 2869 | 2869 | 无整题用例全被隔离（0 题） |
| 题级（canonical 515 题） | 515 | 515 | 同上 |
| 题级（本批判题集 176 题） | 176 | 176 | 同上 |
| 行级（本批 176 题 `testCaseTotal`） | 15575 | 15504 | −71 条用例 |
| 行级（canonical 515 题 `metadata.tests` 总数） | 46534 | 46460 | −74 条用例 |

- 四字段：`executed_pass` 13452 → 13424，`executed_fail` 31 → 24，`blocked` 0 → 0，
  `not_run` 2092 → 2056。

#### 对「176 通过 / 38 失败」的影响

- 构建：**176 / 38 不变**。构建与判题都以「题」为单位，隔离只作用于行级用例，不改变任何 `status`。
- 判题：实测仍是 **142 `ok=true`**。剔除后，7 题的 `firstFailureIndex` 正好落在隔离坐标，
  是纸面上的翻绿候选；其首个失败之后的 `not_run` 用例没有复判，**不能直接算通过**，
  账本通过数保持 142，std 修复后整批复判再改：

| slug | 首个失败 | 用例总数 | 隔离坐标 |
| --- | --- | --- | --- |
| `max-difference-you-can-get-from-changing-an-integer` | 26 | 81 | 26 |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | 20 | 88 | 20,21,43,45,58,60,71,73,75,77,78,80 |
| `maximum-sized-array` | 19 | 69 | 19,28,38,56 |
| `maximum-swap` | 85 | 119 | 32,54,85 |
| `maximum-xor-product` | 58 | 74 | 58 |
| `minimum-garden-perimeter-to-collect-enough-apples` | 50 | 68 | 50,66 |
| `numbers-with-repeated-digits` | 23 | 59 | 23 |

- 归族纠正：`maximum-swap`（85/119）此前记在「算法结果不符 14 题」，实为 B 类期望污染
  （重算差 800），不是算法错；`minimum-garden-perimeter` / `maximum-xor-product` 也是语料缺陷。

#### A 类逐坐标（127 行 / 21 题）

每行 = `tests[下标].args` 内的精确坐标 + 存储值 + 无法表达原因。数组元素保留 `[k]` 下标。

- `binary-trees-with-factors`（2）：
  - `tests[89].args.arr[7]` = `63842579163398340` —— double 抹平（bitlen=56，ulp=8，低位非零）
  - `tests[89].args.arr[8]` = `112840242932266120000` —— 超 i64（存储值 112840242932266120000，bitlen=67）
- `count-special-integers`（1）：
  - `tests[19].args.n` = `102030405060708100` —— double 抹平（bitlen=57，ulp=16，低位非零）
- `count-the-number-of-powerful-integers`（4）：
  - `tests[51].args.start` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[51].args.finish` = `9876543210987655000` —— 超 i64（存储值 9876543210987655000，bitlen=64）
  - `tests[85].args.finish` = `987654321987654300` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[92].args.finish` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
- `find-original-array-from-doubled-array`（55）：
  - `tests[51].args.changed[60]` = `20266198323167230` —— double 抹平（bitlen=55，ulp=4，低位非零）
  - `tests[51].args.changed[61]` = `40532396646334460` —— double 抹平（bitlen=56，ulp=8，低位非零）
  - `tests[51].args.changed[62]` = `81064793292668930` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[51].args.changed[63]` = `162129586585337860` —— double 抹平（bitlen=58，ulp=32，低位非零）
  - `tests[51].args.changed[64]` = `324259173170675700` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[51].args.changed[65]` = `648518346341351400` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[51].args.changed[66]` = `1297036692682702800` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[51].args.changed[67]` = `2594073385365405700` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[51].args.changed[68]` = `5188146770730811000` —— double 抹平（bitlen=63，ulp=1024，低位非零）
  - `tests[51].args.changed[69]` = `10376293541461623000` —— 超 i64（存储值 10376293541461623000，bitlen=64）
  - `tests[51].args.changed[70]` = `20752587082923246000` —— 超 i64（存储值 20752587082923246000，bitlen=65）
  - `tests[51].args.changed[71]` = `41505174165846490000` —— 超 i64（存储值 41505174165846490000，bitlen=66）
  - `tests[51].args.changed[72]` = `83010348331692980000` —— 超 i64（存储值 83010348331692980000，bitlen=67）
  - `tests[51].args.changed[73]` = `166020696663385960000` —— 超 i64（存储值 166020696663385960000，bitlen=68）
  - `tests[122].args.changed[163]` = `43998436091802430` —— double 抹平（bitlen=56，ulp=8，低位非零）
  - `tests[122].args.changed[164]` = `46474474833634210` —— double 抹平（bitlen=56，ulp=8，低位非零）
  - `tests[122].args.changed[167]` = `81348611215888540` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[122].args.changed[170]` = `139342930911092290` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[122].args.changed[174]` = `253068831957584770` —— double 抹平（bitlen=58，ulp=32，低位非零）
  - `tests[122].args.changed[175]` = `306386488715214100` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[122].args.changed[176]` = `323015096392658900` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[122].args.changed[177]` = `386797763385011500` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[122].args.changed[179]` = `484522644589988200` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[122].args.changed[181]` = `719158822845642200` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[122].args.changed[182]` = `726783966884982300` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[122].args.changed[183]` = `875809045506491500` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[122].args.changed[184]` = `1078318430193856300` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[122].args.changed[185]` = `1090175950327473400` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[122].args.changed[186]` = `1313710568259737300` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[122].args.changed[187]` = `1617491260261184500` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[122].args.changed[188]` = `1635263925491210000` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[122].args.changed[189]` = `1970565852389606000` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[122].args.changed[190]` = `2434982520522369000` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[122].args.changed[191]` = `2452895888236815000` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[122].args.changed[192]` = `2956131704779212000` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[122].args.changed[193]` = `3669965041044738000` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[122].args.changed[194]` = `3679343832355222500` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[122].args.changed[195]` = `4434197557168817700` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[122].args.changed[196]` = `5539930082089476000` —— double 抹平（bitlen=63，ulp=1024，低位非零）
  - `tests[122].args.changed[197]` = `5519015748532833000` —— double 抹平（bitlen=63，ulp=1024，低位非零）
  - `tests[122].args.changed[198]` = `6651296335753226000` —— double 抹平（bitlen=63，ulp=1024，低位非零）
  - `tests[122].args.changed[199]` = `8303893443132714000` —— double 抹平（bitlen=63，ulp=1024，低位非零）
  - `tests[122].args.changed[200]` = `8278523622799250000` —— double 抹平（bitlen=63，ulp=1024，低位非零）
  - `tests[122].args.changed[201]` = `10666592671504839000` —— 超 i64（存储值 10666592671504839000，bitlen=64）
  - `tests[122].args.changed[202]` = `13338186886263570000` —— 超 i64（存储值 13338186886263570000，bitlen=64）
  - `tests[122].args.changed[203]` = `13317785434198876000` —— 超 i64（存储值 13317785434198876000，bitlen=64）
  - `tests[122].args.changed[204]` = `16000189007257258000` —— 超 i64（存储值 16000189007257258000，bitlen=64）
  - `tests[122].args.changed[205]` = `20450915848351430000` —— 超 i64（存储值 20450915848351430000，bitlen=65）
  - `tests[122].args.changed[206]` = `20423678151298314000` —— 超 i64（存储值 20423678151298314000，bitlen=65）
  - `tests[122].args.changed[207]` = `24000378014514516000` —— 超 i64（存储值 24000378014514516000，bitlen=65）
  - `tests[122].args.changed[208]` = `30676373772527140000` —— 超 i64（存储值 30676373772527140000，bitlen=65）
  - `tests[122].args.changed[209]` = `30635517226947470000` —— 超 i64（存储值 30635517226947470000，bitlen=65）
  - `tests[122].args.changed[211]` = `46014560658790710000` —— 超 i64（存储值 46014560658790710000，bitlen=66）
  - `tests[122].args.changed[212]` = `46002688140418460000` —— 超 i64（存储值 46002688140418460000，bitlen=66）
  - `tests[122].args.changed[213]` = `54000850532657660000` —— 超 i64（存储值 54000850532657660000，bitlen=66）
- `find-the-k-th-character-in-string-game-ii`（1）：
  - `tests[73].args.k` = `9223372036854776000` —— 超 i64（存储值 9223372036854776000，bitlen=64）
- `find-the-sum-of-encrypted-integers`（1）：
  - `tests[97].args.nums[2]` = `112233445566778900` —— double 抹平（bitlen=57，ulp=16，低位非零）
- `max-difference-you-can-get-from-changing-an-integer`（1）：
  - `tests[26].args.num` = `98765432109876540000` —— 超 i64（存储值 98765432109876540000，bitlen=67）
- `maximum-number-that-makes-result-of-bitwise-and-zero`（11）：
  - `tests[20].args.n` = `576460752303423500` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[21].args.n` = `4611686018427388000` —— double 抹平（bitlen=63，ulp=1024，低位非零）
  - `tests[43].args.n` = `144115188075855870` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[45].args.n` = `9223372036854776000` —— 超 i64（存储值 9223372036854776000，bitlen=64）
  - `tests[58].args.n` = `72057594037927940` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[60].args.n` = `288230376151711740` —— double 抹平（bitlen=58，ulp=32，低位非零）
  - `tests[71].args.n` = `2305843009213694000` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[73].args.n` = `1152921504606847000` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[75].args.n` = `36028797018963970` —— double 抹平（bitlen=56，ulp=8，低位非零）
  - `tests[77].args.n` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[78].args.n` = `18446744073709552000` —— 超 i64（存储值 18446744073709552000，bitlen=65）
- `maximum-sized-array`（4）：
  - `tests[19].args.s` = `9223372036854776000` —— 超 i64（存储值 9223372036854776000，bitlen=64）
  - `tests[28].args.s` = `987654321987654300` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[38].args.s` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[56].args.s` = `18446744073709552000` —— 超 i64（存储值 18446744073709552000，bitlen=65）
- `maximum-swap`（3）：
  - `tests[32].args.num` = `98877665544332210` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[54].args.num` = `987654321987654300` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[85].args.num` = `112233445566778900` —— double 抹平（bitlen=57，ulp=16，低位非零）
- `maximum-xor-product`（2）：
  - `tests[58].args.a` = `18446744073709552000` —— 超 i64（存储值 18446744073709552000，bitlen=65）
  - `tests[58].args.b` = `18446744073709552000` —— 超 i64（存储值 18446744073709552000，bitlen=65）
- `minimum-addition-to-make-integer-beautiful`（18）：
  - `tests[25].args.n` = `345678901234567900` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[30].args.n` = `9876543210987655000` —— 超 i64（存储值 9876543210987655000，bitlen=64）
  - `tests[32].args.n` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[34].args.n` = `987654321098765400` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[36].args.n` = `2222222222222222300` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[37].args.n` = `111111111111111100` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[46].args.n` = `555555555555555600` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[50].args.n` = `123456789123456780` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[52].args.n` = `3333333333333333500` —— double 抹平（bitlen=62，ulp=512，低位非零）
  - `tests[57].args.n` = `1111111111111111200` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[64].args.n` = `505050505050505000` —— double 抹平（bitlen=59，ulp=64，低位非零）
  - `tests[66].args.n` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[67].args.n` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
  - `tests[70].args.n` = `9876543210987655000` —— 超 i64（存储值 9876543210987655000，bitlen=64）
  - `tests[72].args.n` = `12345678901234567000` —— 超 i64（存储值 12345678901234567000，bitlen=64）
  - `tests[76].args.n` = `112233445566778900` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[92].args.n` = `1111111111111111200` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[101].args.n` = `2222222222222222300` —— double 抹平（bitlen=61，ulp=256，低位非零）
- `minimum-cost-to-make-array-equalindromic`（2）：
  - `tests[66].args.nums[1]` = `98765432123456780` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[66].args.nums[4]` = `65432109890123460` —— double 抹平（bitlen=56，ulp=8，低位非零）
- `number-of-subarrays-with-lcm-equal-to-k`（2）：
  - `tests[55].args.k` = `1046527167431103500` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[76].args.k` = `1046527167431103500` —— double 抹平（bitlen=60，ulp=128，低位非零）
- `numbers-with-repeated-digits`（1）：
  - `tests[23].args.n` = `1234567890123456800` —— double 抹平（bitlen=61，ulp=256，低位非零）
- `reordered-power-of-2`（1）：
  - `tests[62].args.n` = `112233445566778900` —— double 抹平（bitlen=57，ulp=16，低位非零）
- `separate-the-digits-in-an-array`（1）：
  - `tests[48].args.nums[2]` = `112233445566778900` —— double 抹平（bitlen=57，ulp=16，低位非零）
- `smallest-number-with-given-digit-product`（3）：
  - `tests[21].args.n` = `111111111111111100` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[23].args.n` = `888888888888888800` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[30].args.n` = `222222222222222200` —— double 抹平（bitlen=58，ulp=32，低位非零）
- `sort-the-jumbled-numbers`（5）：
  - `tests[28].args.nums[2]` = `112233445566778900` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[55].args.nums[1]` = `102030405060708100` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[55].args.nums[2]` = `98765432109876540000` —— 超 i64（存储值 98765432109876540000，bitlen=67）
  - `tests[106].args.nums[2]` = `112233445566778900` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[106].args.nums[3]` = `223344556677889900` —— double 抹平（bitlen=58，ulp=32，低位非零）
- `string-transformation`（7）：
  - `tests[22].args.k` = `123456789123456800000` —— 超 i64（存储值 123456789123456800000，bitlen=67）
  - `tests[26].args.k` = `123456789123456780` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[33].args.k` = `111111111111111110000` —— 超 i64（存储值 111111111111111110000，bitlen=67）
  - `tests[43].args.k` = `987654321987654300` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[45].args.k` = `666666666666666600` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[82].args.k` = `654321987654322000` —— double 抹平（bitlen=60，ulp=128，低位非零）
  - `tests[85].args.k` = `222222222222222230000` —— 超 i64（存储值 222222222222222230000，bitlen=68）
- `ugly-number`（2）：
  - `tests[17].args.n` = `72057594037927940` —— double 抹平（bitlen=57，ulp=16，低位非零）
  - `tests[68].args.n` = `72057594037927940` —— double 抹平（bitlen=57，ulp=16，低位非零）

#### C 类逐坐标（4 行 / 3 题）

值本身精确，但超出 `i64` 表示或官方约束；这三题无论精度与否都不该进入语料。

| slug | 坐标 | 存储值 | 官方约束（`readme.md` 原文） | 判定 |
| --- | --- | --- | --- | --- |
| `find-original-array-from-doubled-array` | `tests[122].args.changed[210]` | `36000567021771776000` | `0 <= changed[i] <= 10^5` | 超 `i64`（bitlen=65）且超官方约束 |
| `string-transformation` | `tests[13].args.k` | `100000000000000000000` | `1 <= k <= 10^15` | 超 `i64`（bitlen=67）且超官方约束 |
| `minimum-garden-perimeter-to-collect-enough-apples` | `tests[50].args.neededApples` | `100000000000000000000` | `1 <= neededApples <= 10^15` | 超 `i64`（bitlen=67）且超官方约束 |
| `minimum-garden-perimeter-to-collect-enough-apples` | `tests[66].args.neededApples` | `10000000000000000000` | `1 <= neededApples <= 10^15` | 超 `i64`（bitlen=64）且超官方约束 |

#### B 类逐坐标（24 行 / 8 题，保留存储值 / ulp / 精确重算）

| slug | 坐标 | 存储值 | bitlen | ulp | 精确重算 | 差异 |
| --- | --- | --- | --- | --- | --- | --- |
| `arithmetic-slices-ii-subsequence` | `tests[59].expected` | `1152921504606845200` | 60 | 128 | `1152921504606845145` | 重算差 55（正确解法必被判错） |
| `find-the-array-concatenation-value` | `tests[58].expected` | `1780022446776676900` | 61 | 256 | — | —（未重算，按官方约束判定期望不可信） |
| `find-the-sum-of-encrypted-integers` | `tests[97].expected` | `1000000003111111200` | 60 | 128 | — | —（未重算，按官方约束判定期望不可信） |
| `max-difference-you-can-get-from-changing-an-integer` | `tests[26].expected` | `81000000008100000000` | 67 | 16384 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[20].expected` | `288230376151711740` | 58 | 32 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[21].expected` | `2305843009213694000` | 62 | 512 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[43].expected` | `72057594037927940` | 57 | 16 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[45].expected` | `4611686018427388000` | 63 | 1024 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[58].expected` | `36028797018963970` | 56 | 8 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[60].expected` | `144115188075855870` | 57 | 16 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[71].expected` | `1152921504606847000` | 61 | 256 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[73].expected` | `576460752303423500` | 60 | 128 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[77].expected` | `1152921504606847000` | 61 | 256 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[78].expected` | `9223372036854776000` | 64 | 2048 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `tests[80].expected` | `576460752303423500` | 60 | 128 | — | —（未重算，按官方约束判定期望不可信） |
| `maximum-swap` | `tests[32].expected` | `98877665544332210` | 57 | 16 | `98877665544332210` | 重算与存储一致，未被证明有差异，按保守口径一并隔离 |
| `maximum-swap` | `tests[54].expected` | `997654321887654300` | 60 | 128 | `997654321887654300` | 重算与存储一致，未被证明有差异，按保守口径一并隔离 |
| `maximum-swap` | `tests[85].expected` | `912233445566778900` | 60 | 128 | `912233445566778100` | 重算差 800（正确解法必被判错） |
| `minimum-cost-to-make-array-equalindromic` | `tests[66].expected` | `340740252914814800` | 59 | 64 | — | —（未重算，按官方约束判定期望不可信） |
| `sort-the-jumbled-numbers` | `tests[28].expected[2]` | `112233445566778900` | 57 | 16 | — | —（未重算，按官方约束判定期望不可信） |
| `sort-the-jumbled-numbers` | `tests[55].expected[1]` | `102030405060708100` | 57 | 16 | — | —（未重算，按官方约束判定期望不可信） |
| `sort-the-jumbled-numbers` | `tests[55].expected[2]` | `98765432109876540000` | 67 | 16384 | — | —（未重算，按官方约束判定期望不可信） |
| `sort-the-jumbled-numbers` | `tests[106].expected[2]` | `112233445566778900` | 57 | 16 | — | —（未重算，按官方约束判定期望不可信） |
| `sort-the-jumbled-numbers` | `tests[106].expected[3]` | `223344556677889900` | 58 | 32 | — | —（未重算，按官方约束判定期望不可信） |

#### S 类：语义性语料错误（25 行 / 1 题）

`paint-fence` 的 25 条 `expected` 不是「精度丢失」，而是**语料算错了语义**：存的是未取模的计数，再被 double 抹平。题目要求答案 `mod 10^9+7`，所以“存储值 → 正确值”不能用 double 舍入解释，这 25 条整体标为语义性语料错误（`S`），不并入 `B`。

有精确重算证明的 4 条：

| 坐标 | 存储值 | 正确值 `mod 10^9+7` | 判定 |
| --- | --- | --- | --- |
| `tests[5].expected` | `4865562720460260000` | `401321198` | 存储值是未取模计数，超答案上界 |
| `tests[23].expected` | `999306098405019900` | `409877263` | 存储值是未取模计数，超答案上界 |
| `tests[26].expected` | `1591919797017362000` | `873923505` | 存储值是未取模计数，超答案上界 |
| `tests[28].expected` | `6249999995000050000` | `250050343` | 存储值是未取模计数，超答案上界 |

其余 21 条同型（`tests[34].expected`、`tests[40].expected`、`tests[45].expected`、`tests[48].expected`、
`tests[57].expected`、`tests[62].expected`、`tests[63].expected`、`tests[68].expected`、`tests[74].expected`、
`tests[75].expected`、`tests[80].expected`、`tests[82].expected`、`tests[85].expected`、`tests[86].expected`、
`tests[87].expected`、`tests[88].expected`、`tests[91].expected`、`tests[97].expected`、`tests[99].expected`、
`tests[101].expected`、`tests[102].expected`），存储值同样是未取模计数的 double 抹平物，未逐条做 128 位模幂重算。

B 复核时已排除的 6 题（输出本就是字符串或浮点，不构成 B，已归 D）：`maximum-value-after-insertion`、
`calculate-digit-sum-of-a-string`、`largest-multiple-of-three`、`largest-number-after-mutating-substring`、
`lexicographically-smallest-string-after-a-swap`、`powx-n`（浮点按容差比较）。

D 对照（证明扫描器不把正常值当污染）：`permutations-iv` 的 `k` = `2432902008176640000`（20!）
与 `minimum-garden-perimeter-to-collect-enough-apples` 的 `neededApples` = `18014398509481984`（`2^54`）
都被判 D —— 二者都满足精确可表示性，未因「值大 / 尾零多」被误报。误报口径：候选 17,545 行里
标 A/B/C/S 共 180 行（1.03%），其中可表示性判定本身零误报；语义层（文本串 vs 数值字面量）误报
经人工复核为 0，B 侧另有 11 行因输出类型是字符串/浮点被移出，已单列在上。

#### metadata 完整性扫描（2026-11-04）

- `palindrome-partitioning/metadata.json` 的 0 字节**不是生成器写到一半中断，也不是上游数据源缺失**：
  HEAD 里的 blob 完整（4146 行 / 233,318 字符，可正常解析）；0 字节只存在于工作区未提交改动
  （`git diff` 是 4146 行全删除）。它是本轮 22 个既有 dirty metadata 之一，按纪律不 stage、不还原；
  扫描器读到工作区文件才把它记成 `metadataParseErrors: 1`。
- 全库 2869 个题目目录：无 metadata 27 个，有 metadata 2842 个；其中 0 字节 1 个（上条，且仅工作区）、
  `< 400` 字节 0 个、`JSON.parse` 失败 0 个（0 字节文件不参与解析）、其余 2841 个全部可解析。
  半截 / 截断文件 0 个。清单：`palindrome-partitioning`（1 个）。


## 已恢复

### G0 `ArrayList` 运行期长度 + 下标读写

- 状态：已恢复（2026-11-03 复测）
- 证据：探针工程（`ArrayList::new(n)` + `push` + `⁅usize⁆` 读 / 赋值）`status=0`。
- 用法：下标必须是 `usize` 变量或 `expr as usize`；字面量 `⁅0⁆` 会解析到 `Nominal(ItemId(17))`。
- 结论（2026-11-04 实测）：`⁅ ⁆` 返回**裸 `T`**，不是 `Option<T>`，因此 `arr⁅i⁆.unwrap()`
  是在裸值上多调一次 `unwrap`，**属非法写法，非缺口**。证据：
  - `valkyrie.v/projects/std/source/collection/ArrayList.v:205`：
    `suffix `⁅ `(self, offset: usize): T`
  - `Array.v:54`、`array_view.v:38`、`cardinal.v:23` 同样返回裸元素类型；`Utf8Text.v:372` 返回 `u8`
  - 对照：`ArrayList.v:261` `get(self, ordinal: isize): Option<T>` 返回 `Option`；
    `Option.v:49` `unwrap(self): T` 存在，所以 `.get(i).unwrap()` 是合法惯用写法
  - `Option` 无 `expect` 成员（`std/source` 检索 0 命中）；语料 0 处使用 `.expect()`，暂不构成缺口
- 最小复现（3 行）：

```v
micro probe(nums: ArrayList<i64>, i: usize) -> i64 {
    return nums⁅i⁆.unwrap()
}
```

  完整诊断：`error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>.unwrap` in probe:
  no method candidate named `unwrap` exists for receiver type `Nominal(ItemId(9))`，
  `--> solution.v:5:12`，`error: aborting due to 1 previous error`。
- `.get(...).unwrap()` 正例（3 行）构建 `status=0`，无诊断：

```v
micro probe(nums: ArrayList<i64>) -> i64 {
    return nums.get(0).unwrap()
}
```

  `get(self, ordinal: isize): Option<T>`（`ArrayList.v:261`）与 `unwrap(self): T`
  （`Option.v:49`）组合成立，故 B 形态无需任何改写。
- 说明：`HashMap<K,V>` 作为递归参数时未见缓存生效（`can-i-win` 曾 240s 超时）；
  改用 `ArrayList<i64>` 三态记忆表后 75/75 通过。该条按待验证项保留，不单列缺口。
