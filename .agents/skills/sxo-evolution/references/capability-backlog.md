# SXO 能力 backlog（leetcode 驱动）

活文档：由 `sxo-evolution` 维护。仅列 **open / partial**；`@sxo/*` **0.0.8** 及此前已关闭项不入表。

| ID | 能力簇 | 状态 | 动机（题 / 场景） | 上游落点 | 备注 |
|----|--------|------|-------------------|----------|------|
| S-003 | 数组 Part / 下标读取 | partial | 一般数组题 | `@sxo/mathematica` | 基础 `[[i]]` / `Length` 可用，复杂 Part 仍待补 |
| S-004 | 循环与早退（Medium 题骨架） | partial | 双指针、嵌套扫描 | dialect | catalog 前 50：**Wolfram/MATLAB 各 5 绿**（锚点 + `search-insert-position`）；`floor` 在 `function` 内仍 open |
| S-005 | Windows native optional dep 一键可装 | open | 本机 bench CI | `@sxo/sxo-win32-x64` | 与 `loadNative()` 诊断对齐 |
| S-007 | Wolfram 嵌套 `Table` / `Flatten` 配对枚举 | open | 函数式枚举 | Athena VM | `ATHENA_UNSUPPORTED_OPERATION` op=234 |
| S-009 | Wolfram `:=` 用户函数 + 标量 `While`/`Module` | partial | `reverse-integer`、`palindrome-number`（绿） | `@sxo/mathematica` `@0.0.8` | `IntegerDigits` 路径；超大 metadata 浮点见 S-018 harness 容错 |
| S-010 | 字符串 `Characters` / `StringTake` / `strlength` | open | `longest-common-prefix`、`valid-parentheses` | `@sxo/mathematica` / `@sxo/matlab` | 字符级 Part 与拼接 |
| S-011 | MATLAB 用户 `function` 体（含 `while`） | partial | 标量 / 数组题 | `@sxo/matlab` `@0.0.8` | `palindrome-number`（数值半反转）、`search-insert-position`（二分 `while`）已绿；`floor` 在 `function` 内仍 open |
| S-012 | 链表（数组模拟下标） | open | `add-two-numbers` 等 | dialect | batch 多题 `term_not_json_surface` 或求值未绿 |
| S-013 | 排序 + 多指针 | partial | `3sum`、`search-insert-position` | `@sxo/*` | `search-insert-position` 二分 `while` 双端绿；`Sort` / 多指针仍 open |
| S-014 | 二维矩阵 | open | `rotate-image`、`valid-sudoku` | dialect | 矩阵下标与变异 |
| S-015 | 回溯 / 递归 DFS | open | `generate-parentheses` 等 | Athena VM | 深度与组合枚举 |
| S-016 | 哈希 / `Association` / `containers.Map` | open | `roman-to-integer`、`group-anagrams` | frontend | 映射构造与查表 |
| S-017 | 正则 / 通配 / DP 表 | open | `regular-expression-matching` 等 | dialect | Hard 题簇 |
| S-018 | harness `termToJson` 结果投影 | partial | 多数 batch 题 | `sxo-napi` `json.rs` + `sxo-runner` | metadata 超大浮点 VM fail 时 `expected: false` 映射为 `false`；根因 bind 精度仍 open |
| S-019 | Wolfram 函数式题解求值 | open | 全量 `solution.wl` | `@sxo/mathematica` | 题解已一律 `Fold`/`NestWhile`/`Association` 等；禁止 `Do`/`For`/`While` 掩盖缺口 |

## 批量补题 Gap 报告

**`projects/conformance/reports/sxo-batch-gap.md`** — 生成：`node scripts/sxo-batch-rollout.mjs`（`LEETCODE_BATCH_LIMIT` 默认 50）。

## 看板与 bench

- `@sxo/*` 未安装或旧版时 bench JSON `rows: []`；安装 **≥ 0.0.8** 后重跑 `LEETCODE_BENCH_LANG=wolfram-sxo,matlab-sxo pnpm bench`。
- sxo 题解须逐题补 `solution.wl` / `solution.m` 且上游能力绿；与 Python/TS batch 独立。

### S-007 最小复现

```text
Flatten[Table[{i-1,j-1},{i,1,2},{j,2,2}],1]
→ ATHENA_UNSUPPORTED_OPERATION op=234
```

## 新增条目模板

```markdown
| S-0xx | 简短名 | open | <slug> 或 matrix case | @sxo/<pkg> 或 dialect 路径 | 阻塞原文 |
```

## 标签约定

- 看板、bench JSON：**Wolfram (Sxo)**、**MATLAB (Sxo)**（npm 包名仍小写）
- SXO frontend，**不是** Wolfram Engine / MATLAB Runtime
