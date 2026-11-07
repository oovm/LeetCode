# 多解题判题与比较方式审计（2026-11-07）

> 结论先说：**“绿”只证明输出与 expected 一致，不证明与题面一致。** 对题面允许多个合法答案或任意顺序的题目，JSON 精确相等本身就会把正确解判红、也可能把不合法输出判绿。expected 来源（本仓 `expectedProvenance`）与比较方式是两个独立错误源，本文只处理比较方式。

## 1. 当前比对方式（整改前）

三通道与两个附加 lane 全部使用顺序敏感的精确相等：

| lane | 文件 | 位置 | 整改前行为 |
| --- | --- | --- | --- |
| Python 参考解 | `scripts/run_python_solver.py` | `_compare` | 顺序敏感递归比较 |
| TypeScript 参考解 | `src/domain/assert.ts` | `assertTestCase` | `JSON.stringify` 精确相等（含 bigint / 超安全整数特判） |
| Valkyrie wasm | `scripts/run_v_solver.ts` | 单入口比较 | `JSON.stringify` 精确相等 |
| Valkyrie backend / isolated | `src/isolated/judge.ts` | `assertScriptOutcome` / `assertValkyrieOutcome` / `assertNumericTextOutcome` | `JSON.stringify` 精确相等 |
| Valkyrie managed backend | `src/adapters/valkyrie-backend/managed-runner.ts` | 整数/结构比较 | `compareIntegerResult ?? JSON.stringify` |

操作序列（设计类）用例仍按逐步精确比较，不套用输出多解模式。

## 2. 盘点口径与数量

- 扫描全部 `projects/problems/*/readme.md`：`2876` 题（有 metadata 且可读题面）。
- 命中“any order / 任意顺序 / 任意一个”等措辞：`223` 题。
- 其中句子明确 `返回/输出 ... 任意顺序` 的输出顺序自由题：`95` 题；其余为输入顺序、去重语义等噪声。
- 题面允许多个合法答案（顺序之外还有值选择）：单独登记 `15` 题。
- 比较模式登记总数：`131`（覆盖清单 26 题全部显式登记，未登记题默认 strict）：

| 模式 | 题数 | 含义 |
| --- | --- | --- |
| `strict` | 26 | JSON 精确相等（含精确整数文本），题面要求唯一输出 |
| `unordered-1d` | 61 | 顶层列表任意顺序，元素值仍精确比较 |
| `unordered-2d` | 12 | 内层元素先排序，外层再排序（组合/子集/排列类） |
| `outer-only` | 15 | 外层任意顺序，内层顺序保持（路径、棋盘、坐标类） |
| `nested-1d` | 2 | 外层结构固定，各内层列表分别排序 |
| `validator-required` | 15 | 多合法解，规范化比较仍错误，必须题面语义校验 |

登记表：`coverage/compare-modes.json`；机器可读审计：`reports/multi-answer-compare-audit.json`。

## 3. 顺序自由题清单（已换规范化比较）

### `unordered-1d`（61）

`all-divisions-with-the-highest-score-of-a-binary-array`, `ambiguous-coordinates`, `binary-tree-paths`, `binary-watch`, `closest-binary-search-tree-value-ii`, `closest-divisors`, `different-ways-to-add-parentheses`, `find-all-anagrams-in-a-string`, `find-all-lonely-numbers-in-the-array`, `find-all-people-with-secret`, `find-all-possible-recipes-from-given-supplies`, `find-all-the-lonely-nodes`, `find-and-replace-pattern`, `find-common-characters`, `find-indices-of-stable-mountains`, `find-mode-in-binary-search-tree`, `find-original-array-from-doubled-array`, `find-servers-that-handled-most-number-of-requests`, `find-the-peaks`, `find-words-containing-character`, `flip-binary-tree-to-match-preorder-traversal`, `flip-game`, `generalized-abbreviation`, `generate-binary-strings-without-adjacent-zeros`, `high-access-employees`, `intersection-of-two-arrays`, `intersection-of-two-arrays-ii`, `invalid-transactions`, `kill-process`, `letter-case-permutation`, `letter-combinations-of-a-phone-number`, `linked-list-frequency`, `lucky-numbers-in-a-matrix`, `maximum-number-of-non-overlapping-substrings`, `maximum-split-of-positive-even-integers`, `minimum-height-trees`, `minimum-index-sum-of-two-lists`, `minimum-number-of-vertices-to-reach-all-nodes`, `most-frequent-subtree-sum`, `numbers-with-same-consecutive-differences`, `palindrome-permutation-ii`, `powerful-integers`, `remove-methods-from-project`, `remove-sub-folders-from-the-filesystem`, `repeated-dna-sequences`, `restore-ip-addresses`, `simplified-fractions`, `single-number-iii`, `string-matching-in-an-array`, `strobogrammatic-number-ii`, `subdomain-visit-count`, `substring-with-concatenation-of-all-words`, `the-k-strongest-values-in-an-array`, `the-two-sneaky-numbers-of-digitville`, `top-k-frequent-elements`, `two-out-of-three`, `two-sum`, `uncommon-words-from-two-sentences`, `web-crawler-multithreaded`, `word-break-ii`, `word-subsets`

### `unordered-2d`（12）

`4sum`, `combination-sum`, `combination-sum-iii`, `combinations`, `critical-connections-in-a-network`, `factor-combinations`, `group-anagrams`, `group-shifted-strings`, `permutations`, `permutations-ii`, `subsets`, `subsets-ii`

### `outer-only`（15）

`accounts-merge`, `all-paths-from-source-to-target`, `average-height-of-buildings-in-each-segment`, `delete-duplicate-folders-in-system`, `describe-the-painting`, `find-all-groups-of-farmland`, `find-duplicate-file-in-system`, `frequencies-of-shortest-supersequences`, `k-closest-points-to-origin`, `modify-graph-edge-weights`, `most-popular-video-creator`, `n-queens`, `non-decreasing-subsequences`, `queens-that-can-attack-the-king`, `word-squares`

### `nested-1d`（2）

`find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree`（critical/pseudo 两个列表各自任意顺序，边可换向）, `find-the-difference-of-two-arrays`（两个结果列表各自任意顺序）

## 4. 多合法解题清单（不可用排序/集合比较掩盖）

下列题目即使 expected 本身正确，`strict` 与规范化比较都可能是错误判定；本轮**不把它们计入绿**，登记为 `validator-required`，执行期直接以结构化错误拒绝，不静默退回严格比较：

- `advantage-shuffle`：题面允许返回任意合法重排
- `course-schedule-ii`：题面允许返回任意合法拓扑序
- `di-string-match`：题面允许返回任意满足 DI 串的排列
- `erect-the-fence`：任意合法凸包起点与绕行方向，排序会破坏多边形顺序
- `fair-candy-swap`：题面允许返回任意满足交换后等和的答案
- `find-indices-with-index-and-value-difference-i` / `-ii`：任意满足条件的下标对
- `find-missing-observations`：任意合法缺失观测数组
- `find-n-unique-integers-sum-up-to-zero`：任意合法整数集合
- `find-unique-binary-string`：任意未出现的 n 位二进制串
- `gray-code`：任意合法 Gray 码序列，相邻只差一位是序列属性
- `matrix-cells-in-distance-order`：任意满足距离递增条件的顺序，排序会掩盖违反距离条件的输出
- `restore-the-array-from-adjacent-pairs`：可能有多组合法原数组，排序会破坏相邻关系
- `smallest-sufficient-team`：最小充分团队可能不唯一
- `sort-characters-by-frequency`：频次相同时字符顺序自由，排序无法判定“按频次降序”

处理方式：这些题必须逐题写题面语义校验器（如 Gray 码相邻位校验、拓扑序合法性、团队覆盖性校验）后，才能进入覆盖率统计。

## 5. 整改实现

新增 `src/domain/compare-mode.ts`：

- `canonicalKey`：整数（数值 / `bigint` / 超安全整数字符串）统一为精确十进制文本，字符串保持原样，数组递归但不排序。
- `canonicalForm`：按模式排序（`unordered-1d` / `unordered-2d` / `outer-only` / `nested-1d`）；非数组值退化为单值键，不改变标量语义。
- `compareModeForExecution(id)`：`validator-required` 直接抛错，禁止静默降级。
- `requireCompareMode(id)`：覆盖清单每题必须显式登记，缺失即测试失败。

接入点：Python `_compare`、`assertTestCase`（第 5 个参数）、`run_v_solver.ts` 单入口、`run_nyar_solver.ts`、`isolated/judge.ts`、`managed-runner.ts`、Bun runtime 与 TS bench。TypeScript/Bun/nyar 测试入口由 `problemIdFromDir(root)` 读取 `metadata.id` 后取模式。

## 6. 验证

- `tests/compare-mode.test.ts`：strict / 四种规范化模式 / bigint 精确文本 / validator 拒绝 / 注册表抽查，全部通过。
- Python 直测：`_compare([2,1],[1,2], 'unordered-1d')=True`，`strict=False`，`unordered-2d`、`outer-only`、`nested-1d` 边界行为符合定义。
- 三通道定向运行：`lucky-numbers-in-a-matrix`、`two-out-of-three`、`subsets`、`combinations`、`n-queens`、`find-the-difference-of-two-arrays` 的 Python 与 TypeScript 参考解全部通过。
- `subsets` 在独立重算阶段出现 `orderMatches=false`，现已由 `unordered-2d` 解释为比较方式问题，不再是 expected 值问题。
- 回归：R34 批次 26 题三通道 + 题面约束前置校验全部通过。

## 7. 本次审计发现的其它缺陷（与比较方式无关，未修改）

- `permutations`：`solvers/typescript/solution.ts` 未按约定导出 `Solution`（`Error: solution.ts 未导出 export class Solution`）。该题不在覆盖清单，登记为现有缺陷。
- `combinations`：expected 出现重复组合（`[[1,1,1,2]` 重复多次），规范化比较不会掩盖重复计数，需按语料缺陷另查。
