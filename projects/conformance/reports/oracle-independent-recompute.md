# oracle 独立重算（2026-11-07）

本报告回应「参考解生成 / 派生重算的 expected 未被独立验证」问题。重算实现与判绿实现
（`solvers/python`、`solvers/typescript`、`solvers/valkyrie`）完全分离，不复用其中任何算法代码。

- 证据 JSON：[`oracle-independent-recompute.json`](./oracle-independent-recompute.json)
- 脚本：`.cache/audit/oracle-recompute.mjs`（工作区中间产物，未纳入版本库）
- 复核范围：台账「oracle 未独立验证」段列出的 14 题**全部用例**，不只原先记账的 331 条

## 结果

| 指标 | 数值 |
| --- | --- |
| 题目 | 14 |
| 用例总数 | 1131 |
| 与独立重算一致 | 1131 |
| 不一致 | 0 |
| 重算方法自检 | 通过（各题小规模域与暴力枚举逐点对齐） |

分类：

| 来源 | 题目数 | 用例数 | 一致 |
| --- | --- | --- | --- |
| 参考解生成 | 7 | 510 | 510 |
| 派生重算 | 7 | 621 | 621 |

## 逐题口径

| 题 | 来源 | 独立口径 | 用例 |
| --- | --- | --- | --- |
| `count-the-number-of-arrays-with-k-matching-adjacent-elements` | 参考解生成 | 组合恒等式 `C(n-1,k)·m·(m-1)^(n-1-k)`；`n<=6,m<=4` 全域暴力枚举自检 | 158/158 |
| `maximize-number-of-nice-divisors` | 参考解生成 | 整数拆分精确 DP（`p<=60`）+ 已验证周期 3 公式；逐 `p` 与 DP 对齐 | 80/80 |
| `student-attendance-record-ii` | 参考解生成 | 6 状态线性 DP；`n<=8` 三字母暴力枚举自检 | 41/41 |
| `number-of-ways-to-reach-a-position-after-exactly-k-steps` | 参考解生成 | 无限直线二项式闭式 `C(k,(k+end-start)/2)`；`k<=12` 全部起点终点暴力自检 | 91/91 |
| `handshakes-that-dont-cross` | 参考解生成 | Catalan 闭式 `C(2m,m)/(m+1)`；`m<=10` 递推自检 | 39/39 |
| `number-of-strings-which-can-be-rearranged-to-contain-substring` | 参考解生成 | 按 `e` 出现次数容斥求和 `Σ C(n,e)(25^r-2·24^r+23^r)`；`n<=6` 暴力自检 | 31/31 |
| `closest-fair-integer` | 参考解生成 | 逐位构造最小 `>= n` 的偶数位、奇偶各半数字（不做线性递增） | 70/70 |
| `subsets` | 派生重算 | 位掩码枚举全部子集，按集合（排序后）比较 | 93/93 |
| `hamming-distance` | 派生重算 | `BigInt` 异或后逐位计数 | 88/88 |
| `binary-number-with-alternating-bits` | 派生重算 | 二进制串相邻位检查 | 72/72 |
| `reverse-bits` | 派生重算 | 32 位二进制串反转 | 24/24 |
| `sum-of-square-numbers` | 派生重算 | 枚举 `a` 后整数平方根判定 | 53/53 |
| `monotone-increasing-digits` | 派生重算 | 首位下降候选枚举（保留前缀 + 降一位 + 补 9）+ 全 9 兜底 | 111/111 |
| `sum-of-number-and-its-reverse` | 派生重算 | 按定义枚举 `k` 并用算术反转 | 180/180 |

## 首轮 5 条不一致的归因

首轮重算出现 5 条不一致，全部先按缺陷排查，结论是**重算脚本自身实现错**，不是语料缺陷，
也没有覆盖原期望值：

1. `maximize-number-of-nice-divisors tests[#42]`（`primeFactors=59`）：DP 返回未取模的
   `2324522934`，原期望 `324522920` 正是其 `mod 1e9+7`。修正重算脚本对 DP 结果取模后一致。
2. `hamming-distance` 4 条（`#23/#24/#30/#78`，含 `2^32-1`）：JS 位运算把 `x ^ y` 截成有符号
   32 位，导致高位丢失。改用 `BigInt` 异或后一致。

修正后 1131 条全部一致，`selfCheck` 通过。

## 解除降级

上述 14 题的 expected 现在有独立重算证据，`oracleStatus` 可从 `unverified` 升为 `independent`，
重新计入覆盖率。台账「oracle 未独立验证」段已标注解除。

## 遗留（与 expected 来源无关）

`subsets` 原期望是深度优先枚举顺序，独立重算用位掩码顺序，集合等价但**序列顺序不同**
（`orderMatches=false`）。这属于「多解/任意顺序题的判题比较方式」问题，单列在第 5 步审计，
不与本报告的 expected 来源混淆。
