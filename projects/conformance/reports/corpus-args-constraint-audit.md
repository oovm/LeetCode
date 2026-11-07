# R34 题面约束审计（2026-11-07）

判题前先校验 `metadata.tests[].args` 是否落在题面约束内。R34 原先只发现两条越界用例，
本次把 26 题全部用例按题面 Constraints 逐条校验，结论是**共 227 条越界，分布在 19 题**。

- 证据 JSON：[`corpus-args-constraint-audit.json`](./corpus-args-constraint-audit.json)
- 约束登记与校验器：`src/domain/args-constraints.ts`
- 触发位置：`tests/problem-coverage.test.ts` 中每题三通道判题之前；未登记约束的题直接失败
- 基线：`git HEAD` 的 26 题 2599 条用例
- 处理后：2374 条（修复 2 条，作废 225 条）

## 处置规则

1. 越界用例的 expected 是在非法输入上算出来的，不能作为判题证据。
2. 能在不改变期望语义的前提下就地修正的，修数据（本轮只有明确授权的两条）。
3. 其余一律作废该用例（从 `metadata.tests` 删除），原坐标与原因留在 JSON 证据里；
   不把非法用例改成「blocked 长期挂账」。

## 就地修复（2 条）

| 题 | 原坐标 | 原数据问题 | 修正 | 期望 |
| --- | --- | --- | --- | --- |
| `check-if-every-row-and-column-contains-all-numbers` | `tests[16]`（现 `tests[14]`） | 10x10 矩阵取值 7..16，违反 `1 <= matrix[i][j] <= n` | 整体 `-6`，变为 1..10 的循环拉丁方 | `true` 不变 |
| `two-out-of-three` | `tests[60]` | `nums2` 含 125/150、`nums3` 含 150/200，违反 `1 <= nums[i] <= 100` | `nums2=[50,100,60,70]`、`nums3=[100,80,90,25]`；新增值只出现在单个数组内 | `[25,50,100]` 不变 |

两条修复后均通过题面约束校验；`verified-problems.json` 中对应题目的 `oracleStatus`
由 `unverified` 升为 `cross-checked`，重新计入覆盖率。

## 作废（225 条，19 题）

| 题 | 作废条数 | 典型越界原因 |
| --- | --- | --- |
| `lucky-numbers-in-a-matrix` | 27 | 元素不唯一；取值 0 或 100001 超出 1..10^5 |
| `check-if-every-row-and-column-contains-all-numbers` | 5 | 取值超出 1..n；非方阵/行长不一致 |
| `matrix-similarity-after-cyclic-shifts` | 13 | 元素 0/30 超出 1..25；`k` 为 0 或 100 超出 1..50 |
| `largest-unique-number` | 3 | `-1`、`1001`、`1011` 超出 0..1000 |
| `divide-array-into-equal-pairs` | 8 | 长度为奇数；取值 0/505/600 超出 1..500 |
| `number-of-beautiful-pairs` | 36 | 含 10 的倍数（100/10/3210）；取值 12345 超出 1..9999 |
| `find-the-xor-of-numbers-which-appear-twice` | 40 | 取值超出 1..50；同一值出现次数超过 2 |
| `two-out-of-three` | 3 | 取值 125/108/111 超出 1..100 |
| `longest-strictly-increasing-or-strictly-decreasing-subarray` | 1 | 取值 0 超出 1..50 |
| `longest-even-odd-subarray-with-threshold` | 3 | 取值 0 超出 1..100 |
| `shortest-subarray-with-or-at-least-k-i` | 36 | 取值 63/4095 超出 0..50；`k` 为 100/1023 超出 0..63 |
| `count-partitions-with-even-sum-difference` | 15 | 取值 101/109 超出 1..100；长度 101 超出 2..100 |
| `minimum-difference-between-highest-and-lowest-of-k-scores` | 6 | `-10`、`222222`、`1000000` 超出 0..10^5 |
| `longest-subsequence-with-limited-sum` | 10 | 取值 0 或 1.99e6 超出 1..10^6 |
| `kth-missing-positive-number` | 1 | 取值 1597 超出 1..1000 |
| `maximum-product-difference-between-two-pairs` | 3 | 取值 0/12000 超出 1..10^4；长度 3 小于 4 |
| `determine-the-winner-of-a-bowling-game` | 1 | `player1` 与 `player2` 长度不一致 |
| `min-max-game` | 13 | 取值 9/25/65 超出 1..10^9；长度不是 2 的幂 |
| `minimum-number-of-operations-to-make-elements-in-array-distinct` | 1 | 取值 0 超出 1..100 |

## 结论

- 之前 R34 的「26 题全绿」里混有 227 条非法输入用例；这些绿同样只证明「实现与 expected 一致」，
  不证明「与题面一致」。
- 本轮只修复了用户明确指出的两条；其余 225 条按「非法输入不是答案」作废，逐条坐标留证。
- 以后再往 `verified-problems.json` 加题，必须同时在 `src/domain/args-constraints.ts` 登记题面约束，
  否则覆盖测试在判题前就失败。
