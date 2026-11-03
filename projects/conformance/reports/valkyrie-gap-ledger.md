# Valkyrie 能力缺口账本

本文件是本仓 Valkyrie 解题能力的唯一手工缺口清单。新增缺口必须同时写最小复现坐标；
未验证批次按能力分组登记在 `valkyrie-unverified-batches.md`，本表不重复题目清单。

维护口径：
- 「已构建通过」= `legionBuildProject` 返回 `status=0` 且隔离判题 `ok=true`。
- 仅写完未编译的题不计入覆盖数，也不标 `blocked`；按能力分组登记在
  `valkyrie-unverified-batches.md`，等对应能力复跑。
- 每题有且只有两个状态：已构建通过 / 未验证。未验证不等于通过。
- 每条缺口只保留一个最小复现；题内触发点写在对应 `solution.v` 的 `# 题内触发点:`。

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

## 批次状态：Easy 标量/文本池（2026-11-03）

- 范围：`metadata.tests` 的参数与期望均为 `number` / `boolean` / `string` 的 Easy 题，共 133 题。
- 状态：理想解已写，**未构建验证**。本轮不跑 `legionBuildProject`，这 133 题不计入覆盖数。
- TS 侧：133 题全部用 `run_ts_solver.ts` 实跑，**131 通过 / 2 未通过**（未通过的 2 题见下节
  「oracle 模型错误」，保留理想解，不改算法）。
- 缺口：本批未新增编译器/std 坐标。`utf8` 下标读、`Utf8Builder`、`ArrayList`、`HashMap`
  属既有已恢复能力，按理想写法直接使用，不写降级实现。

## 批次状态：Medium 三组（2026-11-03）

- 范围：`ArrayList 表` 12 题 + `位运算` 13 题 + `纯递推 / 序列生成` 12 题，共 37 题。
- 状态：理想解已写，**未构建验证**，不计入覆盖数；清单见 `valkyrie-unverified-batches.md`
  的「批次 M-2026-11-03」。
- TS 侧：37 题全部用 `run_ts_solver.ts` 实跑，**37/37 通过**；跑红后修的是语料与两处算法
  （`minimum-impossible-or` 判定规则、`numbers-with-same-consecutive-differences` BFS 子节点顺序），
  未为通过而改期望值。
- 缺口：本批未新增已确认编译器/std 坐标。以下写法只有历史单点证据、尚无构建验证，登记为
  「待复验」而不是缺口：变量右移 `x >> bit`、`ArrayList` 变量整体重新赋值、`ArrayList<bool>`
  下标读写、`HashMap` 批量插入后跨循环查询。

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

## 已恢复

### G0 `ArrayList` 运行期长度 + 下标读写

- 状态：已恢复（2026-11-03 复测）
- 证据：探针工程（`ArrayList::new(n)` + `push` + `⁅usize⁆` 读 / 赋值）`status=0`。
- 用法：下标必须是 `usize` 变量或 `expr as usize`；字面量 `⁅0⁆` 会解析到 `Nominal(ItemId(17))`。
- 说明：`HashMap<K,V>` 作为递归参数时未见缓存生效（`can-i-win` 曾 240s 超时）；
  改用 `ArrayList<i64>` 三态记忆表后 75/75 通过。该条按待验证项保留，不单列缺口。
