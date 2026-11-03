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

- 范围：全部 2841 个可解析的 `projects/problems/*/metadata.json`（2869 目录 − 27 个无 metadata
  − 1 个解析失败），`tests[].args` 与 `tests[].expected` 中的整数字面量和纯十进制整数字符串，
  阈值 `|v| > 2^53-1`。候选 **17,545 行 / 182 题**。
  扫描期间顺带发现 `palindrome-partitioning` 的 `metadata.json` 是 **0 字节空文件**（另一类语料缺陷，
  本节不处理，仅登记坐标）。
- 判定规则（不靠「尾零」观感，靠可表示性）：
  - 十进制整数 `v` 能被 double 精确表示，当且仅当 `bitlen(v) <= 53` 或 `v % 2^(bitlen-53) == 0`；
  - JSON number 不满足该条件 → `JSON.parse` 得到的已不是文本里的值（文本 ≠ 运行值）；
  - 字符串不满足该条件且 `String(Number(s)) === s` → 该串本身是 double 的十进制输出（抹平痕迹）；
  - 参数是否数值型：优先取 V 导出签名类型，无解法的题用「同一 key 在任一用例中出现过 JSON number」；
  - 纯二进制文本串（`^[01]+$`）与 `utf8` 参数一律按文本，不参与数值判定。
- 分类结果：

| 类 | 含义 | 行 | 题 |
| --- | --- | --- | --- |
| A | args 精度丢失，用例无法表达，V 根本没跑 | 127 | 21 |
| B | expected 精度丢失，会制造假失败 | 49 | 9 |
| C | 精确大整数但超出 `i64` 表示 / 官方约束 | 4 | 3 |
| D | 无精度损失（精确整数 / 文本 / 二进制串 / 无类型串） | 17365 | 171 |

- 逐条坐标与证据在 `valkyrie-corpus-precision-defects.json`（本目录），每条 case 就是一条
  quarantine 记录，**metadata 与 expected 数值一行未改**。

A（21 题，127 行；括号为该题行数）：`find-original-array-from-doubled-array`（55）、
`minimum-addition-to-make-integer-beautiful`（18）、`maximum-number-that-makes-result-of-bitwise-and-zero`
（11）、`string-transformation`（7）、`sort-the-jumbled-numbers`（5）、`count-the-number-of-powerful-integers`
（4）、`maximum-sized-array`（4）、`maximum-swap`（3）、`smallest-number-with-given-digit-product`（3）、
`binary-trees-with-factors`（2）、`maximum-xor-product`（2）、`minimum-cost-to-make-array-equalindromic`（2）、
`number-of-subarrays-with-lcm-equal-to-k`（2）、`ugly-number`（2）、`count-special-integers`、
`find-the-k-th-character-in-string-game-ii`、`find-the-sum-of-encrypted-integers`、
`max-difference-you-can-get-from-changing-an-integer`、`numbers-with-repeated-digits`、
`reordered-power-of-2`、`separate-the-digits-in-an-array`。

C（3 题，4 行，值本身精确但超 i64 且越官方约束）：`find-original-array-from-doubled-array`
（`tests[122].args.changed[210]` = `36000567021771776000`）、`string-transformation`
（`tests[13].args.k` = `100000000000000000000`，约束 `k <= 10^15`）、
`minimum-garden-perimeter-to-collect-enough-apples`（`neededApples` = `10^20` / `10^19`，约束 `<= 10^15`）。

B（9 题，49 行）**不改 expected，等裁定**。已重算证明的三处：

| slug | 用例 | 存储 expected | 精确重算 | 差异 / 约束 |
| --- | --- | --- | --- | --- |
| `paint-fence` | `tests[5]` | `4865562720460260000` | `401321198` | 存储值是未取模计数的 double 抹平物，答案本应 `mod 10^9+7` |
| `paint-fence` | `tests[23]` | `999306098405019900` | `409877263` | 同上 |
| `paint-fence` | `tests[26]` | `1591919797017362000` | `873923505` | 同上 |
| `paint-fence` | `tests[28]` | `6249999995000050000` | `250050343` | 同上 |
| `maximum-swap` | `tests[85]` | `912233445566778900` | `912233445566778100` | **差 800**，正确解法必被判错 |
| `arithmetic-slices-ii-subsequence` | `tests[59]` | `1152921504606845200` | `1152921504606845145` | **差 55**，正确解法必被判错 |

其余 6 题以官方约束判定（期望超出答案上界即不可信）：`maximum-number-that-makes-result-of-bitwise-and-zero`
（11 行，期望 ≥ `2.3×10^18`，约束 `n <= 10^15`）、`sort-the-jumbled-numbers`（5 行，期望 `10^17`，
约束 `nums[i] < 10^9`）、`maximum-swap`（另 2 行，约束 `num <= 10^8`）、
`find-the-array-concatenation-value`（1 行，期望 `1.78×10^18`，答案上界 `~10^11`）、
`find-the-sum-of-encrypted-integers`（1 行，期望 `10^18`，答案上界 `~5×10^4`）、
`max-difference-you-can-get-from-changing-an-integer`（1 行，约束 `num <= 10^8`）、
`minimum-cost-to-make-array-equalindromic`（1 行，代价上界 `~10^14`）。

B 复核时已排除的 6 题（输出本就是字符串或浮点，不构成 B，已归 D）：`maximum-value-after-insertion`、
`calculate-digit-sum-of-a-string`、`largest-multiple-of-three`、`largest-number-after-mutating-substring`、
`lexicographically-smallest-string-after-a-swap`、`powx-n`（浮点按容差比较）。

quarantine 形态选型：不用在 `metadata.json` 里加 `defect` 字段，改用**侧车清单**
`valkyrie-corpus-precision-defects.json`。理由：metadata 由生成器/校验链按固定 schema 产出，
就地加未登记字段会被下游当未知字段或需同步改 schema 与生成器；侧车文件不动数据、不动期望、
不动判题器，且与 `reports/` 既有 JSON 报告同构，能逐条带坐标与证据，便于裁定后再决定修复。

D 对照（证明扫描器不把正常值当污染）：`permutations-iv` 的 `k` = `2432902008176640000`（20!）
与 `minimum-garden-perimeter-to-collect-enough-apples` 的 `neededApples` = `18014398509481984`（`2^54`）
都被判 D —— 二者都满足精确可表示性，未因「值大 / 尾零多」被误报。误报口径：候选 17,545 行里
标 A/B/C 共 180 行（1.03%），其中可表示性判定本身零误报；语义层（文本串 vs 数值字面量）误报
经人工复核为 0，B 侧另有 11 行因输出类型是字符串/浮点被移出，已单列在上。

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
