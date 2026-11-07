# Valkyrie 能力缺口账本

本文件是本仓 Valkyrie 解题能力的唯一手工缺口清单。新增缺口必须同时写最小复现坐标；
未验证批次按能力分组登记在 `valkyrie-unverified-batches.md`，本表不重复题目清单。

维护口径：
- 「已构建通过」= `legionBuildProject` 返回 `status=0` 且隔离判题 `ok=true`。
- 仅写完未编译的题不计入覆盖数，也不标 `blocked`；按能力分组登记在
  `valkyrie-unverified-batches.md`，等对应能力复跑。
- 每题有且只有两个状态：已构建通过 / 未验证。未验证不等于通过。
- 「已构建通过」必须拆成两个数字记账：**编译通过数**（`legionBuildProject` `status=0`）与
  **端到端通过数**（`status=0` 且隔离判题 `ok=true`）。只报一个合数时必须注明是哪一个，
  并注明实测窗口；编译通过不等于通过。
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

真缺口（8）：G2 / G3 / G10 / G16 / G22 / G25 / G26 / G28。

| 编号 | 判据 | 摊派面 |
| --- | --- | --- |
| G2 浮点返回值合同 | c | 返回类型即题面合同，绕路必须改返回类型（1227 / 1344） |
| G3 wasm JS glue 的 `ArrayList` ABI | c | ABI 边界由题面固定，题解改不了结构（36 题） |
| G9 二分图判定 | **已恢复**（2026-11-07）：`std.math.graph_theory.bipartition` 已提供，两题改用 std 入口；真跑 179/181 用例 PASS（余 2 条为 F6 语料宿主异常文本） | `valkyrie.v` 提交 `59a4acad`；消费者 `is-graph-bipartite` / `possible-bipartition` |
| G10 `DisjointSet` 分量聚合 | b | 3 处 × 重写 DSU 内部聚合 |
| G11 `sorted_by` | **已恢复**（2026-11-07 实测）：`std.collection.sort` 的 `sorted_by<T>(items: ArrayList<T>, cmp): ArrayList<T>`（`3e02e7d`）已提供，8 题改用它后真跑 **767/767** 用例 PASS，另删除 4 处副本脚手架；残余 `[T]` 带比较器入口见 G11 小节 | `maximum-subsequence-score` / `maximum-number-of-events-that-can-be-attended` / `the-k-weakest-rows-in-a-matrix` / `find-subsequence-of-length-k-with-the-largest-sum` / `high-five` / `array-of-doubled-pairs` / `advantage-shuffle` / `the-k-strongest-values-in-an-array` / `meeting-rooms` / `remove-covered-intervals` / `minimum-moves-to-equal-array-elements-ii` / `merge-similar-items` |
| G13 `utf8` 字典序比较 | **已恢复**（2026-11-07）：`Utf8Text` 的 `Comparable` 合同已提供，5 处消费者改用 `natural_order` 比较器；真跑 420/420 用例 PASS | `accounts-merge` / `reorder-data-in-log-files` / `top-k-frequent-words` / `find-smallest-letter-greater-than-target` / `phone-number-prefix` |
| G16 `BTreeSet` / `BTreeMap` 界查询 | b | 3 处 × O(k) 物化 + 手写二分（其中 1 处为按秩查询；`nth` 已销案） |
| G17 `char` 缺 `Hash` | **已恢复**（2026-11-07 实测）：`HashPrimitives.v:53` 的 `imply char: Hash` 已随 addon 生效，8 题以 `HashMap<char, i64>` / `DisjointSet<char>` 真跑 **778/778** 用例 PASS；另 3 题仍红但均非 `Hash` 阻塞（详见 G17 小节） | `custom-sort-string` / `find-words-that-can-be-formed-by-characters` / `longest-repeating-character-replacement` / `longest-substring-with-at-most-k-distinct-characters` / `word-subsets` / `permutation-in-string` / `sort-characters-by-frequency` / `task-scheduler` |
| G22 整数位元查询 | b | 5 处 × 重复位运算 |
| G25 `BitSet` 基数 / 复制 | b | 4 处 × 手写 O(bits) 计数，丢掉位并行 |
| G26 序关系无可用合同 | b | 14 处 × 同一套序逻辑 |
| G28 `BinaryHeap` 的 `Comparable` 义务传播 | c | 13 处调用点（5 处裸 `i64`、1 处自定义元素、7 处按提案入口写） |

观察（13）：G1 / G4 / G8 / G12 / G14 / G15 / G18 / G19 / G20 / G21 / G23 / G24 / G27。
均为判据 a（换等价 API，零重复），或尚无已证实调用点。

编译器缺陷（5，属实但不归 std 线管）：G5 / G6 / G7 / G29 / G30。见下一节指向条目。

## 编译器缺陷（不归 std 线）

| 条目 | 现状 | 归口 |
| --- | --- | --- |
| G5 分支内丢弃 `Option<T>`（SMIR007） | 已恢复（2026-11-07 实测）：`origin/dev` 上 `baseball-game` legion wasm 构建通过，3 条用例真跑 PASS | 编译器 MIR 降级，不在 std / leetcode 线 |
| G6 标识符 `round` 误拉 adaptor | 已恢复（2026-11-07 实测）：`origin/dev` 上 `sum-of-digits-of-string-after-convert` 构建通过，`getLucky` 真跑 PASS | 编译器名字解析 / 闭包装配 |
| G7 `HashMap.insert` 作 `else` 尾 + 嵌套 return | 已恢复（2026-11-07 实测）：`origin/dev` 上 `isomorphic-strings` 构建通过，`isIsomorphic` 3 条用例真跑 PASS | 编译器 MIR 合流 |
| G29 `i64` / `u64` → `f64` 精确转换编码缺失 | `wasm 后端缺少 i64 → f64 的精确表示转换编码（acorn_wasm 未提供对应 opcode），不得退化为近似转换`；最小复现 `micro f(x: i64) -> f64 { return x as f64 }`，`u64` 同样报错。`597ecdd5`（2026-11-05 18:45）已在 wasm lane 编码精确整数↔浮点转换；2026-11-07 已按 `origin/dev` `dcb49a6a` 重建 `platforms/valkyrie-win32-x64/lib/valkyrie.win32-x64-msvc.node`，两坐标题均构建通过，`largestSumOfAverages` 3 条用例真跑 PASS | 编译器 wasm 编码；坐标 `largest-sum-of-averages/solvers/valkyrie/solution.v:23`、`sliding-window-median/solvers/valkyrie/solution.v:58` |
| G30 零参候选对多参调用「空匹配」 | `match_call_candidate` 对无 `param_specs` 的候选直接取全部实参，随后 `zip` 静默截断：零参候选对一参调用「空匹配」，与真实候选并列后判 Ambiguous，最终退化成「无一候选」；arity 不符还会漏到 SMIR007。2026-11-06 已在 `nyar-vm.rs/projects/nyar.rs/languages/rusty-valkyrie/src/compiler/hir/overload/call_resolver/core.rs` 加「实参绑定结果与签名槽位等长」守卫，不等长即不匹配。正例：同一 `imply` 块内 `new()` / `new(capacity)` 均解析；反例：零参构造收一参在 HIR `unresolved_call` 失败 | 编译器调用解析；最小复现 `.cache/probes/two-constructors`、`.cache/probes/arity-bad-call`；回归测试 `tests/frontend/hir/hir_overload_identity_tests.rs`（`same_owner_constructors_with_distinct_arity_both_resolve`、`nullary_constructor_rejects_extra_argument_at_call_boundary`） |

- 五条均已由 `origin/dev` 的编译器提交覆盖（G5/G6/G7/G29 于 2026-11-07 复验恢复，G30 修复已进 `dev`），
  不占 std 缺口名额，也不进第 18 批选题面。
- 本节只作指向，详细证据留在各自 G 条内。

## 判题夹具与导出 ABI 缺口（不归 std 线，F 编号）

2026-11-05 R29 首次压设计类题（多方法 + 内部状态 + 操作序列式样例）时暴露，两处都在
判题 / 装配侧，不在 std。

| 编号 | 缺口 | 实测原文 | 坐标 |
| --- | --- | --- | --- |
| F1 设计类操作序列无法判题 | `TestCase` 只有 `args` / `expected`，没有「多操作序列 + 每步返回」；TS 候选只认单入口单调用，导出类被当成函数直接调用 | `TypeError: Class constructor LRUCache cannot be invoked without 'new'`（6/6 题同一形态） | `src/domain/problem.ts:2-5`；`src/adapters/typescript-node/ref.ts:48-71`（`makeTsCandidate` 的 `const exported = mod[expr]` 分支）；同文件 `:82-88`（`runTsSolverOnce` 每用例单次调用）；`scripts/run_v_solver.ts:55`（取单一 wasm export 符号）与 `:168`（逐用例单次调用） |
| F2 设计类实例无 wasm 导出 / 实例句柄 ABI | **已恢复**（2026-11-07 实测）：6 题全部 `legion build --target wasm` 构建通过；`run_v_solver.ts` 真跑 **12/12 用例 PASS**。导出面由构造入口（类名）+ 逐操作入口组成，实例以不透明 GC 引用跨调用保持同一身份 | ~~`source group closure failed: entry source group 'leetcode-min-stack' declares no [export], [main] or [test] entry`（6/6 题同一形态）~~ | 编译器：`nyar-vm.rs` 提交 `d7c65e6b` 的 `WasmAbiType::InstanceHandle` + JS glue 不透明句柄（`abi_schema.rs` / `library_invoke.rs` / `wasm_js_glue`）；题侧：`imply` 成员 `[export(name: ...)]` + `scripts/run_v_solver.ts` 操作序列执行 |
| F3 库导出 `Utf8` 返回值缺宿主句柄物化 | **已恢复**（2026-11-07 实测）：`convert-a-number-to-hexadecimal`、`integer-to-roman`、`decode-the-message`、`capitalize-the-title` 均构建通过，`callExport` 真跑返回值与期望一致 | ~~`TypeError: Cannot convert object to primitive value`（26 题，全部为字符串返回题）~~ | 修复提交 `d3a8f0b7`（宿主边界物化 frozen `utf8` carrier）；原缺口位置 `nyar-emitter/src/lowering/backends/wasm/mir/entry.rs`（形参物化 vs 返回透传） |
| F4 导出名缩写大小写漂移 | **已恢复**（2026-11-05 harness 侧修复，现有 dev 已包含）：`matchWasmExportSymbol` 先精确命中，失败后按归一化符号匹配 | ~~`wasm 里找不到 metadata.invoke 对应的 export "preimageSizeFZF"（已有: preimageSizeFzf ...）`（4 题）~~ | `src/adapters/valkyrie-node/abi.ts` 的 `matchWasmExportSymbol`；题侧 `solution.v` 导出声明 + `metadata.invoke` |
| F5 schema 形参名与 metadata 键不一致 | **已恢复**（2026-11-07 实测）：三题 `solution.v` 形参已按题面命名，生成的 `params[].name` 与 metadata 键逐字相等，构建通过且真跑一致 | ~~`AbiSchemaError: args.s: metadata.tests.args 缺少参数 "s"`（2 题；另 1 题报 `prime_factors`）~~ | 已对齐：`excel-sheet-column-number`（`columnTitle`）、`ransom-note`（`ransomNote, magazine`）、`maximize-number-of-nice-divisors`（`primeFactors`）；历史定位 `src/adapters/valkyrie-node/abi.ts:422-437` |
| F6 `expected` 存宿主异常文本 | metadata 期望值是 Python 参考实现的宿主异常文本，但判题驱动不设递归上限，V / TS 也不产生该文本 | `expected "Error: maximum recursion depth exceeded", no exception raised`（5 题） | 5 题见下；`scripts/isolated_python_child.py` 无 `setrecursionlimit`，TS / Bun / V lane 同样无递归上限 |
| F7 数值答案错 22 条未分类 | **已处置**（2026-11-05 完整逐题复判，2026-11-07 复验）：15 条分桶为 10 题真实现错 + 5 题语料非法，均已在题解/语料侧闭环；仅 `minimum-addition-to-make-integer-beautiful` 仍红并归精度清单（args 超 i64，真值不可恢复） | ~~逐题见分桶小节~~ | 分桶与逐题结果见「F7 跟进」小节；`.cache/judge-failures.json`、`.cache/probe-numeric.ts` |
| F8 计时轮污染实参 | 子进程多轮复用同一 args 对象，题解原地改写（排序 / 去重 / 填充）污染收集轮 | `tests[0]: expected "1", got "0"`（`remove-duplicates-from-sorted-array`、`remove-element` 的 TS lane） | `src/isolated/child-loops.ts`、`scripts/isolated_python_child.py`；已修：`structuredClone` / `copy.deepcopy`，克隆在计时窗口外 |

- F1 不是「题面写法问题」：操作序列（`["LRUCache", "put", "get", ...]` 加每步返回）是题面本身，
  压成单函数调用等于改题。R29 的 `metadata.tests` 保持 `operations` / `arguments` / 每步
  `expected` 原形，判题夹具缺执行路径，因此 6 题**端到端 0**。
- F2 不是 `ClassBodyMethodDeclared`：R29 按架构结论把方法全部写在 `imply` 块，没有触发该诊断；
  停点在更前面的**入口闭包**——设计类没有可导出的逐方法入口，也没有实例句柄。
  `[export]` 文档只覆盖函数 / 模块符号（`documentation/pages/zh-hans/language/attributes.md:257` 起），
  未定义类方法导出。
- 两者独立：修 F1 只让 TS 侧可跑序列；修 F2 只让 V 侧有可调用入口。任一未落地，设计题都只能
  记「写完未验证」。
- F3 与 F1 同属「对象 / 实例被当标量」，但层不同：F1 是 `TestCase` 缺操作序列，修在 harness；
  F3 是 wasm 返回值物理载体与 ABI 声明不符，修在 emitter。两族分开落地，没有共用一处改动。

### F1 修复落地（2026-11-05，判题侧）

`TestCase` 已引入显式操作序列形态，不把类压成单函数：

- 领域模型：`src/domain/problem.ts` 的 `TestCase = CallTestCase | OperationSequenceCase`；
  `OperationSequenceCase.args = { operations, arguments }`，`expected` 与 `operations` 等长。
  识别只认 `metadata.tests` 原形（恰好这两个键、`operations[0]` 是类名、`arguments` 等长数组），
  见 `src/domain/operation-sequence.ts`。
- 执行：TS（`src/isolated/ts-entry.ts`、`src/adapters/typescript-node/ref.ts`、
  `src/adapters/typescript-bun/runtime.ts`）与 Python（`scripts/python_design_sequence.py`、
  `scripts/isolated_python_child.py`、`scripts/run_python_solver.py`）统一「`new` 构造一次 + 逐操作调用」。
  构造参数只喂 `arguments[0]`，不混入首个操作；void 返回归一为 `null`，与 Python `None`、
  metadata `null` 对齐。
- 断言：逐步比较，失败定位到 `tests[i].step[j] (op)` 并给出期望 vs 实际，不再只报用例整体失败。
- 验证：6 题 × 2 用例，**TS 12/12、Python 12/12**（`scripts/run_ts_solver.ts` /
  `scripts/run_python_solver.py`）；定向 `npx vitest run tests/operation-sequence.test.ts
  tests/wasm-export-name.test.ts tests/isolated-judge.test.ts` = **21 passed**。
- V 侧：**已恢复**（2026-11-07）。设计类入口在 `imply` 成员声明
  `[export(name: ...)]`（构造入口用类名，操作入口用题面方法名），编译器按
  `InstanceHandle` 返回不透明实例句柄；`scripts/run_v_solver.ts` 构造一次句柄后
  逐操作调用并逐步断言，6 题 **12/12 用例 PASS**。

### F3 / F4 / F6 / F8 实测与处理

- **F3（26 条，编译器侧，2026-11-07 已恢复）**：26 题 26/26 的 ABI schema 都声明 `returns.kind=Utf8`
  （全部为字符串返回题，如 `integer-to-roman`、`decode-the-message`、`capitalize-the-title`），
  但 `wasm-tools print` 实测导出物理签名是 `(param i64) (result anyref)`，返回的是 prototype 为 null
  的 wasm GC struct。glue 的 `demarshalLibraryReturn` 在 Utf8 分支对 raw 调 `describeValue(raw)`，
  半路 `String(value)` 抛出 `Cannot convert object to primitive value`，把本应报的
  「expected a valid host string handle」掩盖掉。emitter 已有形参侧
  `host_handle_to_managed_utf8` wrapper，却没有返回值侧的 managed → i32 句柄物化；
  **修点在 `nyar-vm.rs`，不是 harness 的 marshal 递归**（`preserveI64Precision` /
  `normalizeResultByAbiType` 对 Utf8 均按原值透传，且它们不调 `String`）。
  修复已随 `d3a8f0b7` 落地；2026-11-07 复验同族 4 个代表题（`convert-a-number-to-hexadecimal`、
  `integer-to-roman`、`decode-the-message`、`capitalize-the-title`）均构建通过并真跑返回正确字符串。
- **F4（4 条，已在 harness 修）**：归一化放在 `matchWasmExportSymbol`：精确命中优先；仅当精确失败
  且候选里恰有一个大小写变体时接受，多候选或无候选都失败闭合。**不改题库、不改 `solution.v`**
  ——题面命名是唯一权威，若反过来要求编译器 / 题库接受 `Fzf` / `Iii` 这类压平名，会把
  `snake_case_to_camel_case` 的缩写歧义扩散到 800+ 题的公开导出面。验证：`preimage-size-of-factorial-zeroes-function`
  104/104、`spiral-matrix-iii` 78/78、`confusing-number-ii` 60/60 通过；
  `sort-array-by-parity-ii` 过了导出门后在 `tests[7]` 暴露 `RuntimeError: unreachable`（G3
  `ArrayList` 返回 bridge，归编译器，另行移交）。
- **F6（5 题，语料缺陷，待题库侧删用例）**：`closest-fair-integer`、`handshakes-that-dont-cross`、
  `number-of-strings-which-can-be-rearranged-to-contain-substring`、
  `number-of-ways-to-reach-a-position-after-exactly-k-steps`、`student-attendance-record-ii`。
  判题驱动任何 lane 都没有递归上限，Python 参考的 `maximum recursion depth exceeded` 是宿主实现事实，
  不是题目答案；按本账本「用例数据清洗规则」应删该用例，不逼实现复刻宿主异常文本。
  同类宿主异常文本还有 `list assignment index out of range`（`merge-sorted-array`、
  `can-make-arithmetic-progression-from-sequence`）、`pow expected 2 arguments, got 3`（
  `count-the-number-of-arrays-with-k-matching-adjacent-elements`）、`negative shift count`（
  `find-kth-bit-in-nth-binary-string`）、`Execution timed out`（`prime-palindrome`），同规则处理。
- **F8（harness 已修）**：`executeRun` 每轮 / 收集都从 `structuredClone(entry.args)` 开始，
  克隆在计时窗口外；Python 侧对应 `copy.deepcopy`。验证：TS lane `remove-duplicates-from-sorted-array`
  **127/127**、`remove-element` **112/112** 全通过；新增 `inplace-dedup` fixture 与
  `iterations:3 warmup:1` 的回归用例。

### F7 数值答案错 22 条分桶（只分类，未改题解）

| 桶 | 条数 | 代表题 |
| --- | --- | --- |
| 确属题解算法错（移交题解线） | 15 | `best-time-to-buy-and-sell-stock`、`domino-and-tromino-tiling`、`find-minimum-in-rotated-sorted-array`、`find-the-minimum-possible-sum-of-a-beautiful-array`、`k-th-symbol-in-grammar`、`kth-smallest-element-in-a-sorted-matrix`、`majority-element`、`maximum-number-that-sum-of-the-prices-is-less-than-or-equal-to-k`、`minimum-factorization`、`minimum-number-of-pushes-to-type-word-i`、`non-negative-integers-without-consecutive-ones`、`single-number`、`ugly-number-iii`、`minimum-cost-to-set-cooking-time`、`smallest-number-with-given-digit-product` |
| 编译器 / ABI（移交 `nyar-vm.rs`） | 2 | `remove-duplicates-from-sorted-array`、`remove-element` —— V lane 仍报 `expected 1 / 9, got 0`，guest 收到的是默认空 `ArrayList`（容器本身构造正确，原始导出仍返回 `0n`） |
| 语料 args / expected 缺陷（待题库侧清洗） | 5 | `maximum-swap`（expected 尾数 `...900`，真值 `...100`）、`maximum-number-that-makes-result-of-bitwise-and-zero`（args / expected 均被 double 抹平）、`numbers-with-repeated-digits`（args `1234567890123456800` 已失真）、`minimum-array-end`（真值 `...999999999`，expected `...000`）、`minimum-addition-to-make-integer-beautiful`（expected `787`，暴力真值 `788`） |
| 精度 / 序列化（harness 侧） | 0 | 大整数用例上 V 输出与 Python 参考逐位一致，i64 判题链本身没有精度损失 |

- `minimum-array-end` 未被 `valkyrie-corpus-precision-defects.json` 捕获：`107374182400000000`
  = `2^38 × 5^8`，可被 double 精确表示（class D），扫描器只找「不可精确表示」，抓不到「精确但语义错」。
- `minimum-addition` 在该 JSON 里只记了 class A 的 `args.n`，`tests[20].expected` 的语义错没有对应条目。
- 建议后续把上述 5 题补进 `valkyrie-corpus-precision-defects.json` / `valkyrie-quarantine.json`，
  本轮未改题库数据。

### F7 跟进：题解线处置与语料清洗（2026-11-05，实测）

判题线分桶的 15 条「题解算法错」逐题复判后分成两族：真实现错 10 题、语料非法 5 题。语料侧另按
「用例数据清洗规则」清了三类。清洗宿主文本后又暴露 2 题残余问题（1 题实现错、1 题非法输入），
一并处置。V lane 结果以 `run_v_solver.ts` 为准，当前 addon，未重建。

A. 参数名对齐（`AbiSchemaError` 的真因是 schema `params[].name` 取自 V 形参名，harness 按名严格匹配）：

| 题 | 形参改名 | 结果 |
| --- | --- | --- |
| `excel-sheet-column-number` | `s` → `columnTitle` | 201/201 |
| `ransom-note` | `ransom_note` → `ransomNote` | 142/142 |
| `maximize-number-of-nice-divisors` | `prime_factors` → `primeFactors`，77 条宿主文本由参考实现重算 | 80/80 |

B. 真实现错 10 题（改 `solution.v`，无样例特判）：

| 题 | 缺陷 | 结果 |
| --- | --- | --- |
| `best-time-to-buy-and-sell-stock` | `loop ... in` 零迭代，改显式索引 | 99/99 |
| `domino-and-tromino-tiling` | 递推起点 `i=4`，n=3 错返 5 | 30/30 |
| `majority-element` | `loop ... in` 零迭代 | 45/45 |
| `single-number` | `loop ... in` 零迭代 | 108/108 |
| `maximum-number-that-sum-of-the-prices-is-less-than-or-equal-to-k` | `pow2(63)` 溢出 i64，上限改 62 | 126/126 |
| `minimum-factorization` | 位数拼接降序 + 漏 `>2^31-1` 保护 | 52/52 |
| `non-negative-integers-without-consecutive-ones` | 斐波那契项偏移 1 | 26/26 |
| `smallest-number-with-given-digit-product` | 无解应为 `-1`，并补 i64 溢出保护 | 41/41 |
| `minimum-cost-to-set-cooking-time` | `m==0` 时秒位补零多算位数 | 116/116 |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | `p*2` 溢出成 0 死循环，改 `p <= n/2` | 86/86 |
| `closest-fair-integer`（清洗后暴露） | 奇数位长区间内没有公平数，逐个数上探会穿越整个 9 位区间挂起；按位长跳到 `10^d` 再上探 | 67/67 |

其余 5 题不是实现错，改判语料（见 C）：`find-minimum-in-rotated-sorted-array` 87/87、
`kth-smallest-element-in-a-sorted-matrix` 86/86、`k-th-symbol-in-grammar` 50/50、
`minimum-number-of-pushes-to-type-word-i` 182/182、`ugly-number-iii` 123/123。
`find-the-minimum-possible-sum-of-a-beautiful-array` 两侧都有问题：30 条 expected 是 int32 溢出污染
（BigInt 重算），实现另修 `m` 取值，91/91。

C. 用例删除与回补（旧/新 `tests` 数由 `git show HEAD~2:`（R29 前基线）与工作区逐题机械比对得到）：

| 判据 | 原始移除 | 当前删除 | 题数 | 逐题（旧→新，二次处置后） |
| --- | --- | --- | --- | --- |
| `expected` 是宿主异常文本（递归超限、超时、越界 / index、KeyError、`inf` 等），语义不可判定 | 392 | 61 | 10 | `decode-the-message` 230→204、`number-of-strings-which-can-be-rearranged-to-contain-substring` 31→31、`prime-palindrome` 62→52、`cells-in-a-range-on-an-excel-sheet` 183→93（8 宿主 + 82 越界）、`merge-sorted-array` 86→80、`sort-array-by-parity-ii` 85→74（4 宿主 + 7 越界，重叠不重复计）、`can-make-arithmetic-progression-from-sequence` 164→161、`closest-fair-integer` 70→70、`find-kth-bit-in-nth-binary-string` 87→85、`minimum-cost-to-set-cooking-time` 118→116 |
| `args` 违反题面约束（非旋转数组、非 n×n、`k > 2^(n-1)`、字母重复或长度越界、答案超 2e9 保证、`n` 超 i64、列/行非单字符） | 167 | 167 | 7 | `cells-in-a-range-on-an-excel-sheet` 82、`k-th-symbol-in-grammar` 36、`minimum-number-of-pushes-to-type-word-i` 20、`ugly-number-iii` 10、`find-minimum-in-rotated-sorted-array` 8、`kth-smallest-element-in-a-sorted-matrix` 2、`maximum-number-that-makes-result-of-bitwise-and-zero` 2 |
| 偶奇数量不等 / 长度奇数，且同时是宿主文本（已计入第一行） | 4 | 4 | 1 | `sort-array-by-parity-ii` |

原始移除合计 **559** 条 = 当前净删 **228**（宿主文本 392 − 318 前轮回补 − 13 本轮回补 = 61，另 167 条越界输入，4 条重叠不重复计）+ 318 前轮回补用例 + 13 本轮回补用例。
前两轮把 316 条四题宿主文本与 `handshakes` 2 条由参考实现真实运行重算；本轮把 `number-of-strings...` 10 条、`closest-fair-integer` 3 条重算恢复。R29 批次 `expected` 变更合计 **393** = 380（前两轮）+ 13（本轮）。
`cells-in-a-range-on-an-excel-sheet` 从 183 降到 93：先删 8 条宿主文本，再删 82 条「两字母列 / 两位行」的越界输入（官方格式是单字母列 + 单数字行，`expected` 多为 `[]`，无合法答案）。

C 清洗后结果：

| 题 | 处置 | 结果 |
| --- | --- | --- |
| `cells-in-a-range-on-an-excel-sheet` | 删 82 条越界输入后余量 | 93/93 |
| `closest-fair-integer` | 奇数位长跳段（见 B） | 67/67 |

`expected` 修复 62 条（未删用例）：

| 题 | 改法 | 结果 |
| --- | --- | --- |
| `find-the-minimum-possible-sum-of-a-beautiful-array` | 30 条 int32 溢出值 → BigInt 真值 | 91/91 |
| `maximum-number-that-makes-result-of-bitwise-and-zero` | 11 条 → `2^(bitlen-1)-1` | 86/86 |
| `convert-a-number-to-hexadecimal` | 17 条数值 → 字符串 | 见下 |
| `maximum-swap` | `...900` → `...100` | 119/119 |
| `numbers-with-repeated-digits` | `...200` → `...110` | 59/59 |
| `minimum-array-end` | `107374182400000000` → `107374182399999999` | 106/106 |
| `minimum-addition-to-make-integer-beautiful` | `787` → `788` | 30/103，仍红 |

追加两条语料的处置：

- `convert-a-number-to-hexadecimal`：17 条 `expected` 由 number 改回字符串，语料错消失；判题错误形态从
  `tests[7] expected: 0` 变为 `TypeError: Cannot convert object to primitive value` —— ABI schema 仍把
  `utf8` 返回标成 `I32`，属 26 题 `Utf8` 返回值修复，不是 V 算法错。2026-11-07 已按 `origin/dev` 重建 addon 复验：`toHex(26/-1/0)` 真跑返回 `"1a"/"ffffffff"/"0"` 正确，该形态消失。
- `sort-array-by-parity-ii`：删 11 条偶奇数量不等 / 长度奇数的非法用例（含 4 条
  `Error: list index out of range`）。余下用例存在多解而 harness 精确比较落序，按规则改解法为
  Python 同款原地双指针，74/74，`RuntimeError: unreachable` 不再出现。

`minimum-addition-to-make-integer-beautiful` 仍红，定级精度缺陷：`tests[30]` 的 `n` 已超 i64，
另有 13 条 expected 对应「舍入前原 n」而 args 已双精度舍入，真值不可恢复；两处已并入精度清单。

`decode-the-message` 同为 `utf8` 返回值 marshal 的 `TypeError`，属 26 题 `Utf8` 修复面，
与 `convert-a-number-to-hexadecimal` 一起，2026-11-07 重建 addon 后复验：`decodeMessage` 真跑返回正确字符串。

### C-1 覆盖率塌陷的逐题定性（2026-11-05 二次处置，实测）

结论先行：四题全部属 **(iii) 参考实现自身失败**，不是 (i) 生成器造非法输入，也不是 (ii) 校验过严。
抽检的 `args` 全部落在题面约束内（`n <= 10^5`、`primeFactors <= 10^9`、`|startPos|,|endPos| <= 1000`、
`k <= 1000`），参考实现分别在 3 参 `pow` 与递归深度上失败。

| 题 | 旧→删后→现 | 根因定性 | 被删用例抽检（`args` → 参考实测重算值，stored 均为宿主文本） |
| --- | --- | --- | --- |
| `count-the-number-of-arrays-with-k-matching-adjacent-elements` | 158→1→158 | (iii) 共享 Python 头 `from math import *` 把内置 `pow` 覆盖为 2 参 `math.pow`，参考的 3 参调用抛 `TypeError` | `tests[0] n=100000,m=100000,k=50000` → `509990004`、`[1] 100/10/50` → `251177542`、`[2] 3/2/1` → `4`、`[3] 5/5/3` → `80`、`[4] 10/5/3` → `1720320`（157 条 stored 均为 `Error: pow expected 2 arguments, got 3`） |
| `maximize-number-of-nice-divisors` | 80→3→80 | (iii) 同一 `pow` 遮蔽 | `[0] primeFactors=8` → `18`、`[1] 1000000000` → `897135186`、`[3] 100` → `703522804`、`[4] 10` → `36`、`[5] 5` → `6`（77 条同错误文本） |
| `student-attendance-record-ii` | 41→11→41 | (iii) 递归 `@cache dfs` 深度随 `n` 增长，`n >= 1000` 即 `RecursionError` | `[1] n=100000` → `749184020`、`[3] 10101` → `183236316`、`[4] 10000` → `67802379`、`[7] 50000` → `320634376`、`[8] 1000` → `250434094`（30 条 stored 均为 `Error: maximum recursion depth exceeded`） |
| `number-of-ways-to-reach-a-position-after-exactly-k-steps` | 91→39→91 | (iii) 同一递归深度 | `[9] 1000/995/1000` → `0`、`[11] 750/250/500` → `1`、`[13] 0/500/501` → `0`、`[14] 300/700/999` → `0`、`[15] 0/-500/501` → `0`（52 条同错误文本） |

参考实现修法（本仓源代码改动，随本批提交）：

| 文件 | 改动 |
| --- | --- |
| `count-the-number-of-arrays-with-k-matching-adjacent-elements/solvers/python/solution.py` | 删无用的 `from sortedcontainers import SortedList`（本机缺包，阻塞本地参考运行），`import builtins` 后 2 处 `pow` → `builtins.pow` |
| `maximize-number-of-nice-divisors/solvers/python/solution.py` | `import builtins` 后 3 处 `pow` → `builtins.pow` |
| `student-attendance-record-ii/solvers/python/solution.py` | 递归 `dfs` 改迭代 DP（状态 = 是否用过 A × 结尾连续 L 数） |
| `number-of-ways-to-reach-a-position-after-exactly-k-steps/solvers/python/solution.py` | 递归 `dfs` 改迭代 DP（`f[i]` = 距终点 `i` 步、剩余步数的方案数） |
| `count-k-subsequences-of-a-string-with-maximum-beauty/solvers/python/solution.py` | 同类 `pow` 遮蔽，顺手修（不在塌陷四题内） |

迭代 DP 与原递归对照：`student` 300 例、`ways` 7236 例（穷举小参数）mismatch=0。

重新生成（新 `expected` 全部由参考实现真实运行产出，`run_python_solver.py` 四题 RC=0）：

| 题 | 重算条数 | 现用例数 | V lane |
| --- | --- | --- | --- |
| `count-the-number-of-arrays-with-k-matching-adjacent-elements` | 157 | 158 | 158/158 |
| `maximize-number-of-nice-divisors` | 77 | 80 | 80/80 |
| `student-attendance-record-ii` | 30 | 41 | 41/41 |
| `number-of-ways-to-reach-a-position-after-exactly-k-steps` | 52 | 91 | 91/91 |

### C-2 生成器缺口记账

- 全库检索确认 `leetcode.v` 内没有写入 `metadata.tests` 的语料生成脚本（`scripts/sxo-batch-rollout.mjs`
  只补 `invoke.wolframSxo` / `matlabSxo`，不改 `tests`）。生成器不在本仓，本轮无法在本仓修生成逻辑。
- 归因证据表明问题不在生成器：四题 316 条 `args` 全部落在题面约束内，非法性来自参考实现（`pow` 遮蔽 /
  递归深度）。
- 处置原则：`expected` 为宿主异常文本时，先判「在题面约束内参考实现能否给出答案」。能 → 修参考实现并
  真实重算；不能（如 `prime-palindrome` 的 `n >= 2e8` 超出 `1e8` 约束且超时、
  `minimum-cost-to-set-cooking-time` 的 `targetSeconds=9999` 超出 `6039` 且答案为非有限数）→ 删除该组
  输入并在本账本写不可判理由。禁止用「生成后过滤」掩盖参考实现缺陷。

### C-3 其它个位数用例的题

- 本批没有任何题掉到 `<10`（受影响题最低为 `prime-palindrome` 52 条）。
- 全库现有 29 题 `<10` 条均非本批清洗造成：6 个设计类（`lru-cache` / `lfu-cache` /
  `implement-trie-prefix-tree` / `design-hashset` / `design-hashmap` / `min-stack`）为 2 条
  `OperationSequenceCase` 结构性用例；其余为二叉树 / 链表结构题 2~6 条（`merge-k-sorted-lists` 3、
  `trim-a-binary-search-tree` 5、`binary-tree-right-side-view` 6 等）。
- 豁免清单（2026-11-05 快照）：`design-hashmap:2`、`design-hashset:2`、`implement-trie-prefix-tree:2`、
  `lfu-cache:2`、`lowest-common-ancestor-of-a-binary-tree:2`、`lru-cache:2`、`min-stack:2`、
  `merge-k-sorted-lists:3`、`find-all-the-lonely-nodes:5`、`trim-a-binary-search-tree:5`、
  `binary-tree-right-side-view:6`、`find-the-divisibility-array-of-a-string:6`、
  `height-of-special-binary-tree:6`、`longest-zigzag-path-in-a-binary-tree:6`、`print-binary-tree:6`、
  `construct-string-from-binary-tree:7`、`maximum-width-of-binary-tree:7`、
  `statistics-from-a-large-sample:7`、`binary-tree-upside-down:8`、`boundary-of-binary-tree:8`、
  `check-if-move-is-legal:8`、`generate-parentheses:8`、`largest-palindrome-product:8`、
  `minimum-cost-to-connect-two-groups-of-points:8`、`clone-binary-tree-with-random-pointer:9`、
  `find-leaves-of-binary-tree:9`、`maximize-amount-after-two-days-of-conversions:9`、`n-queens:9`、
  `n-queens-ii:9`。这些题不属于「清洗造成变薄」，不触发下限门禁。

### C-4 覆盖下限规则（清洗硬门禁）

- 定义：`历史中位数` = 该题本轮清洗前（`HEAD~1`）的 `tests` 条数；`下限 = max(10, ceil(历史中位数 × 0.5))`。
- 依据：全库 2847 题分布 min=2、p10=52、p25=76、median=98、p75=115、max=451。p10=52 说明 90% 题
  `>=52` 条，10 条是「仍是覆盖来源」的绝对地板（1 条等于没有覆盖，个位数通常只剩单一规模 / 边界）；
  50% 相对线防大题塌陷——本批四题一次掉到 1/158、3/80、11/41、39/91 即反例。
- 规则：清洗后单题可用用例数低于下限时，**必须**重新生成 / 修复参考实现后重算，或显式隔离该组输入并在
  本账本写判据；不允许静默变薄。天然低量的结构性题（设计序列 2 条、树 / 链表 2~6 条）入上方豁免清单，
  逐题写明理由，不计入塌陷。

### C-5 宿主文本删除抽检（392 条中抽 10 条，实测）

| # | 题 | `args` | stored | 参考实测 |
| --- | --- | --- | --- | --- |
| 1 | `can-make-arithmetic-progression-from-sequence` | `{"arr":[1]}` | `Error: list index out of range` | `IndexError: list index out of range` |
| 2 | `decode-the-message` | `{"key":"jump quickly on this yellow pig",...}` | `Error: 'f'` | `KeyError: 'f'` |
| 3 | `decode-the-message` | `{"key":"move forward zippy vim",...}` | `Error: 'q'` | `KeyError: 'q'` |
| 4 | `find-kth-bit-in-nth-binary-string` | `{"n":16,"k":131071}` | `Error: negative shift count` | `ValueError: negative shift count` |
| 5 | `prime-palindrome` | `{"n":999999999}` | `Execution timed out` | `TIMEOUT >25s` |
| 6 | `prime-palindrome` | `{"n":80779853381}` | `Execution timed out` | `TIMEOUT >25s` |
| 7 | `merge-sorted-array` | `nums1` 长 14、`m=10`、`nums2` 长 10、`n=10`（缓冲不足） | `Error: list assignment index out of range` | `IndexError: list assignment index out of range` |
| 8 | `closest-fair-integer` | `{"n":1000000000}` | `Error: maximum recursion depth exceeded` | `RecursionError: maximum recursion depth exceeded` |
| 9 | `number-of-strings...` | `{"n":100000}` | `Error: maximum recursion depth exceeded` | `RecursionError: maximum recursion depth exceeded` |
| 10 | `cells-in-a-range-on-an-excel-sheet` | `{"s":"AA1:AZ5"}` | `Error: invalid literal for int() with base 10: 'A'` | `ValueError: invalid literal for int() with base 10: 'A'` |

结论：10/10 与 stored 同型复现（IndexError / KeyError / ValueError / 超时 / RecursionError），没有把判题或
语料生成的其它缺陷误归类为「宿主异常」。另抽 `minimum-cost-to-set-cooking-time` 的 `inf` 类 1 条：
`startAt=1,moveCost=5,pushCost=1,targetSeconds=9999`，stored `"inf"`，参考实地返回 `inf`，同属「无有限答案」。
误伤复核：`handshakes-that-dont-cross` 的 2 条（`numPeople=1000` / `998`，stored 递归超限）当前参考实测返回
`591137401` / `948528453`，属误删，已按原顺序恢复，39/39。`closest-fair-integer` 的 3 条后经迭代化救回
（见 C-7）。

### C-6 `pow` 遮蔽全库普查（2026-11-05，实测）

扫描全部 2847 个 `solvers/python/solution.py`：通配导入只有标准库（`typing` / `functools` / `collections` /
`itertools` / `heapq` / `bisect` / `string` / `operator` / `math`），没有 `from random/os/numpy import *`；
与内置名冲突的只有 `math` 的 `pow`。裸 `pow(` 共 7 个文件、10 处调用：

| 题 | 调用 | 原行为 | 实测 | 处置 |
| --- | --- | --- | --- | --- |
| `count-the-number-of-arrays-with-k-matching-adjacent-elements` | 2 处 3 参 | `Error: pow expected 2 arguments, got 3` | 157/158 宿主文本 | 上一提交修参考 + 157 条重算 |
| `maximize-number-of-nice-divisors` | 3 处 3 参 | 同上报错 | 77/80 宿主文本 | 上一提交修参考 + 77 条重算 |
| `count-k-subsequences-of-a-string-with-maximum-beauty` | 1 处 3 参 | 同上报错 | 44/46 宿主文本 | 本轮修参考 + 44 条实测重算 |
| `final-array-state-after-k-multiplication-operations-ii` | 1 处 3 参 | 同上报错 | 107/109 宿主文本 | 本轮修参考 + 107 条实测重算 |
| `count-the-number-of-square-free-subsets` | 1 处 2 参 | **静默浮点** | 103/103 返回 `float`，与精确整数逐位差 `max_abs=0.0`（最大正确值 949480668） | 本轮改 `builtins.pow`，expected 无需改 |
| `number-of-distinct-binary-strings-after-applying-operations` | 1 处 2 参 | 静默浮点 | 111/111 `float`，逐位差 0（最大 949480669） | 同上 |
| `the-number-of-good-subsets` | 1 处 2 参 | 静默浮点 | 104/108 `float`，逐位差 0（最大 72693241） | 同上 |

结论：三个静默点当前**没有被污染成近似值**（所有正确值 `< 2^53`，逐位差为 0），但返回值类型是 `float`，
`%` 也走浮点，属潜在精度缺陷（指数 `> 2^53` 或 `> 1023` 时会丢位 / `OverflowError`）。已统一改为
`import builtins` + `builtins.pow`，未改语言 / harness。`powx-n` 只有函数名 `qpow`，无裸 `pow` 调用。
修复后 `run_python_solver.py`：6 题 RC=0；`count-k` 46/46、`final-array` 109/109（两题 `solution.v`
为空，无 V lane）。

### C-7 剩余 74 条宿主文本逐题处置（2026-11-05，实测）

救回 **13 条**（参考实现迭代化，`expected` 由真实运行重算）：

| 题 | 条数 | 修法 | 等价性验证 | 现用例数 / lane |
| --- | --- | --- | --- | --- |
| `number-of-strings-which-can-be-rearranged-to-contain-substring` | 10 | 递归 `@cache dfs` → 迭代 DP（24 状态） | `n=1..400` 与旧递归 mismatch=0 | 31/31，Python RC=0，V 31/31 |
| `closest-fair-integer` | 3 | 尾递归 `closestFair(n+1)` → 迭代循环，逻辑不变 | `n=1..5000` 与旧递归 mismatch=0 | 70/70，Python RC=0，V 70/70 |

维持删除 **61 条**（全部是 `args` 违反题面约束，没有可判答案；宿主异常只是症状）：

| 题 | 条数 | 被删 `args` 证据 | 违反的题面约束 | 判据 |
| --- | --- | --- | --- | --- |
| `decode-the-message` | 26 | `key="jump quickly on this yellow pig"`, `message` 含 `f` → `KeyError: 'f'` | `key` 必须含全部 26 字母；`message` 字符必须在 `key` 中 | 无映射定义，不可判 |
| `prime-palindrome` | 10 | `n=999999999` / `80779853381` / `765432123456789` | `1 <= n <= 10^8` | 超约束 + 试除超时 |
| `cells-in-a-range-on-an-excel-sheet` | 8 | `s="AA1:AZ5"` → `invalid literal 'A'` | `s.length == 5`，两侧各单字母 + 单数字 | 格式非法，无合法答案 |
| `merge-sorted-array` | 6 | `nums1` 长 14、`m+n=20` | `len(nums1) == m + n` | 缓冲不足，越界不可判 |
| `sort-array-by-parity-ii` | 4 | `[8,6,4,2,1,3,...]` 仅 4 偶 12 奇 | 偶奇各半 | 无解 |
| `can-make-arithmetic-progression-from-sequence` | 3 | `arr=[1]` / `[10]` / `[42]` | `2 <= len(arr)` | 单元素无公差 |
| `find-kth-bit-in-nth-binary-string` | 2 | `n=16,k=131071`（上限 65535）；`n=4,k=24`（上限 15） | `1 <= k <= 2^n - 1` | 越界，负移位 |
| `minimum-cost-to-set-cooking-time` | 2 | `targetSeconds=9999` | `1 <= targetSeconds <= 6039` | 超约束，答案为 `inf`（非有限数） |

覆盖下限复核：受影响题的现用例数全部达到 `max(10, ceil(历史中位数 × 0.5))`。最紧的是
`cells-in-a-range-on-an-excel-sheet` 93 条 vs 下限 92（183 × 0.5 向上取整）；最低的是
`prime-palindrome` 52 条 vs 下限 31。无题因本轮清洗低于下限。

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
- **当前构建停点（R20 实测，2026-11-04）**：**addon 二进制基线过期**，不是语言 / 标准库回归。
  `legion` / `legionBuildProject` 实际加载的是
  `nyar-vm.rs/projects/nyar.ts/platforms/valkyrie-win32-x64/lib/valkyrie.win32-x64-msvc.node`
  （构建时间 2026-11-03 19:14，内嵌 oak ≤ `1e601f51`）；而 `trait` 成员带默认体、带 `infix`
  修饰的语法要到 oak `5c39f0f4`（2026-11-04 14:36）才支持，`nyar-vm.rs` 在 14:45 才提 pin。
  实测同一旧 addon 下 ovm 与 wasm 两个 target 都是 131/131 命中
  `std/source/operator/comparable.v:169:26`（`trait Comparable` 的 `infix \`<\`` 成员），
  错误码 `valkyrie.frontend.parse.syntax`，失败在语法阶段。`valkyrie.v` `d48011b` 只是
  **首个触发者**，不是引入回归的提交。
  `comparable.v` 不为旧 grammar 降级改写，它在 oak `555798a8` 下合法。
  该停点不归本题库，也未被计入任何 `G` 编号；**待 addon 重建到含 oak `5c39f0f4` 的基线后关闭**，
  之后 R20 的 25 题按 `valkyrie-unverified-batches.md` 的 slug 复跑即可产出覆盖数。
- 后续增量（2026-11-04，文本 / 哈希 / 树批次 R21 后）：canonical 实测 **727**（R21 前 698；本批 29 题，
  新编号 0 条）。本批**构建通过 0 题**，全部 `authored-unverified`；构建停点与 R20 相同
  （同一 addon 基线过期，非 std 回归）。
- 后续增量（2026-11-04，Medium 哈希 / 排序 / 滑动窗口批次 R22 后）：canonical 实测 **753**
  （R22 前 727；本批 26 题，新编号 0 条）。本批**构建通过 0 题**，全部 `authored-unverified`；
  构建停点与 R20 / R21 相同（同一 addon 基线过期，非 std 回归）。
- 后续增量（2026-11-04，Medium 双指针 / 前缀和 / 二分答案批次 R23 后）：canonical 实测 **781**
  （R23 前 753；本批 28 题，新编号 0 条）。本批**构建通过 0 题**，全部 `authored-unverified`；
  构建停点与 R20 / R21 / R22 相同（同一 addon 基线过期，非 std 回归）。
- 后续增量（2026-11-04，Medium 单调栈 / 队列 / 堆 + 贪心批次 R24 后）：canonical 实测 **809**
  （R24 前 781；本批 28 题，新编号 0 条）。本批**构建通过 0 题**，全部 `authored-unverified`；
  构建停点与 R20 / R21 / R22 / R23 相同（同一 addon 基线过期，非 std 回归）。
- 后续增量（2026-11-04，Medium 图 / 并查集 / 拓扑排序批次 R25 后）：canonical 实测 **832**
  （R25 前 809；本批 23 题，新编号 0 条）。本批**构建通过 0 题**，全部 `authored-unverified`；
  构建停点与 R20–R24 相同（同一 addon 基线过期，非 std 回归）。
- 后续增量（2026-11-05，数据结构 / 堆 / 闭包 / 字符串构造批次 R28 后）：canonical 实测 **881**
  （R28 前 853；本批 28 题，**新编号 0 条**）。addon 重建窗口内不跑 V：
  **编译通过 0 题、端到端通过 0 题、写完未验证 28 题**；TS 参考解 **28/28** 通过。
  本批压到的新面与既有编号指向见 `valkyrie-unverified-batches.md` 的 R28 小节。
- 后续增量（2026-11-05，设计类批次 R29 后）：canonical 实测 **887**（R29 前 881；本批 6 题，
  **新编号 1 条**：G28；另新增 F1 / F2 两条夹具与导出 ABI 缺口，不占 G 名额）。
  **编译通过 0 题、端到端通过 0 题、写完未验证 6 题**；TS 官方夹具 0/6（F1），
  同一 `metadata.tests` 用临时序列驱动实跑 TS **6/6**、Python **6/6**（非官方夹具，只作实现证据）。
  F1 / F2 见「判题夹具与导出 ABI 缺口」。
- 后续增量（2026-11-05，f64 / 按秩查询批次 R30 后）：canonical 实测 **1039**（R29 记录 887，
  差额含其它线并行写入；本轮自身新增 3 条 `invoke.valkyrie`：`largest-sum-of-averages`、
  `minimum-cost-tree-from-leaf-values`、`largest-1-bordered-square`）。
  **V lane：编译通过 2 题、端到端通过 2 题；TS lane 4/4 题全通过**：
  - `minimum-cost-tree-from-leaf-values` V **108/108**、TS **108/108**。
  - `largest-1-bordered-square` V **64/64**、TS **64/64**。
  - `largest-sum-of-averages` TS **102/102**、V **编译失败**（G29，`firstFailureIndex=null`）。
    参考实现是后缀递推，前序实现因浮点求和次序在 `tests[5]` 差 1 ulp；改为后缀 DP 后
    TS 全过，V 侧算法相同、复杂度不变。
  - `sliding-window-median` TS **115/115**、V **编译失败**（G29，`firstFailureIndex=null`）。
  - `sliding-window-median` 前两处诊断已在本轮销账：`unresolved call fenwick_add` 由两参
    `fenwick_add` / `fenwick_remove` 签名对齐消除，`infix -` 歧义由
    `(0 as i64) - index` 消除。证据：临时把返回类型改为 `ArrayList<i64>` 的变体**构建成功**
    并跑进断言（`firstFailureIndex=0`，差异只是 i64 截断语义）；恢复 `ArrayList<f64>` 后
    只剩 G29 一条。其余代码不再登记为缺口。
- 后续增量（2026-11-06，R31 + R32 纯整数占位题 48 题分组复跑）：构建窗口单独复跑，单进程、逐题独立产物目录、
  单条 ≤300 秒。**编译通过 47 题、端到端通过 47 题、用例 4512/4512**；1 题
  （`sign-of-the-product-of-an-array`）的 3 条 `nums` 含小数（#18 的 `-12.5`、`6.25`），转语料缺陷，不计通过。
  相对 2026-11-04 验证窗口的「端到端通过 136」口径 **+47 → 183**（分母仍按该窗口 832）；R30 后 canonical 1039
  的全库重算待下一次全窗口复跑。
  - G1 矩阵 R31 8/8（687 用例）、G2 矩阵 R32 12/12（1028）、G3 一维重建 8/8（898）、
    G4 单数组扫描 R31 12/13（1175，1 题转缺陷）、G5 单数组扫描 R32 7/7（724）。
  - `create-target-array-in-the-given-order` 首次运行的 `args.positions` 缺参是实现侧形参名错误，不是语言缺口；
    同日修 `positions → index` 并按参照钳制语义实现逐位插入后 115/115 通过，不新增 G 编号。
  - **std 缺陷登记（不属本批题解缺口，待 std 线统一处理）**：`ArrayList::insert` 对空表不增长。
    `ArrayList::new(hint)` 后调用 `insert(0, value)` 是 no-op，返回空表（`create-target-array-in-the-given-order`
    的 `tests[0]` 期望 `[1]` 实得 `[]`）。当前调用点用 `push(0)` + 显式右移绕过，`valkyrie.v` 未改；
    本项仅登记，不并入验证缺口。
- 后续增量（2026-11-06，R33 纯整数占位题第三批分组复跑）：写入后构建窗口复跑，单进程、逐题独立产物目录
  （复跑前全部不存在）、单条 ≤300 秒。**编译通过 27 题、端到端通过 27 题、用例 3123/3123**；1 题
  `count-subarrays-of-length-three-with-a-condition` 因 3 条非整数输入（#28 的 `37.5`、#33 的 `10.5`、
  #124 的 `148.5/247.5`）转语料缺陷，不计通过。相对上文「183」口径 **+27 → 210**（分母仍按 832）；
  R30 后 canonical 1039 的全库重算待下一次全窗口。
  - S1 9/9（1017 用例）、S2 8/9（992，1 题转缺陷）、R 10/10（1114）。
- 后续增量（2026-11-06，R34 纯整数占位题第四批 + R31/R32/R33 整池复验）：新 addon
  `addon-fixed.node` 下按能力组单进程复跑 **102 题**，**端到端通过 100 题、2 题语料缺陷**，
  执行 10198 条用例全部通过（R31/R32 4509、R33 3090、R34 2599）。R34 26 题编译与端到端全通过。
  首跑暴露两处实现缺陷并已修复（`find-the-xor-of-numbers-which-appear-twice` 的 `bit_xor`
  自由调用、`shortest-subarray-with-or-at-least-k-i` 的 `usize` 移位导致 `bit_and` 候选歧义）。
  同批收尾：`accounts-merge` 改为本地按规模合并（同规模取右根，与参照解一致）后 **85/85**；
  `path-with-maximum-probability` 因 8 条 `edges` / `succProb` 长度不一致转语料缺陷，原用例与期望未改。
  逐组明细见 `valkyrie-unverified-batches.md`。

### 验证窗口实测（2026-11-04 23:50 addon 重建后：编译关破碎 + marshal 夹具修复）

本节数字**取代** R20–R25 各增量行里「构建通过 0 题」的表述；那几句是旧 addon 停点下的历史测量。

- 时点：addon 重建 `2026-11-04 23:50:58`（13,341,184 B，oak pin `555798a8`）；`comparable.v:169`
  的解析停点消失，编译关破碎。
- **marshal 夹具缺陷（已修；不是语言缺口，不新增 G 编号）**：
  - 边界坐标：`projects/conformance/scripts/run_v_solver.ts` 与
    `projects/conformance/src/isolated/v-shared.ts` 的 `preserveI64Precision` 只转换**顶层**
    `I64` 形参；`ArrayList<i64>` 在 ABI schema 里是 `Array<I64>`，元素仍是 JS `Number`，
    glue 在 `arg0[0]` 处报 `Cannot marshal I64 from number N. I64 requires a BigInt or a
    decimal string`。产物 glue 本身接受 `BigInt` 或十进制字符串，两个方向都没问题。
  - 修法：`preserveI64Precision(type, value, path)` 按 `Array` / `FixedArray` / `Option` / `Tuple`
    递归，只在 `I64` 叶节点规整为十进制字符串；返回值侧 `normalizeResultByAbiType` 补
    `Option` / `Tuple`（`Option<Array<I64>>` 的元素是 `BigInt`，不规整会让 `JSON.stringify` 抛错）。
    两份实现收敛到 `v-shared.ts`，判题脚本删掉本地副本，不再维护第二套 marshal 规则。
  - 复验（全用例真跑）：`two-sum` 80/80、`teemo-attacking` 120/120、`array-partition` 112/112。
- **Q11 复核（2026-11-05，判定：旧 addon 测量误判，不是语言缺口）**：
  - oak pin 已是 `555798a8`（`projects/nyar.rs/Cargo.toml`）；该 rev 的 `oak-valkyrie` 词法产出
    `LessEqGreater`（`<=>`），旧 rev `1e601f5` 无此 token。
  - `nyar-vm.rs` 全仓 grep 无 `<=>` / `LessEqGreater` 第二套词法；解析/打印均委托
    `oak_valkyrie`（`frontend::ast`、`utilities::text::valkyrie`）。
  - `legion` 实际解析到 `nyar.ts/emulators/valkyrie/node_modules/@nyar/valkyrie-win32-x64`
    （Junction → `platforms/valkyrie-win32-x64`），该 addon `2026-11-04 23:50:58`、含
    `555798a8` 与 `LessEqGreater`；`projects/nyar.ts/node_modules/...` 的 11-02 0.0.0 副本
    无此 token，但不在解析首选项。
  - 当前 HEAD 源码编译的探针二进制真跑：`1 <=> 2 = -1`、`2 <=> 1 = 1`、`7 <=> 7 = 0`（ovm）。
  - 判据：旧结论来自 `2026-11-03 19:14` 旧 addon 的测量窗口；`<=>` 不新增工作项。
- 本次窗口覆盖 **206 题**（R20 25 + R22 26 + R23 28 + R24 28 + R25 23 + R21 29 + R19 9 +
  M-2026-11-03 37 + 基线 `two-sum` 1），单进程顺序跑，约 190 s，超时即报不重试。
  首轮测量（修复前）：**编译通过 137 / 编译失败 69**，**端到端通过 106 / 判题未通过 31**；
  30 条题解缺陷于 2026-11-05 销账后的口径见本节末尾「判题缺口销账」。
- 覆盖口径改写（替换此前的「累计已构建通过 18」，下列为**销账后**口径）：
  - 累计端到端通过 **136 / 832**（canonical 832）；
  - 累计编译通过 **136 / 832**；
  - 未编译（未验证）**626**。
  R21 / R22 / R23 / R24 / R25 表格里的 `authored-unverified` 现在只表示「未在本轮预算内复跑」，
  不代表失败；已复跑的题以本节与批次报告为准。
- 编译失败归族（70 题，按诊断首行归并；`advantage-shuffle`、`the-k-strongest-values-in-an-array`
  同时命中两族，去重后 70；末行为 2026-11-05 销账时新增）：

| 归族 | 题数 | 最小诊断 |
| --- | --- | --- |
| `sort(ArrayList<T>)` 无法解析 | 20 | `unresolved call \`sort\` ... none matches the argument types` |
| `BinaryHeap` 的 `where` 证据被拒 | 13 | `self.sift_up` / `sift_down`：`where evidence rejected the concrete substitution` |
| `[export]` 写在类方法上 | 9 | `valkyrie.frontend.parse.syntax: 此处需要表达式` |
| 嵌套 `ArrayList::new(0)` 推断失败 | 6 | `unresolved call \`adjacency.push\` / \`insert\` ... none matches` |
| `infix -` 候选歧义 | 5 | `0 - 1`、`u8` 减法多候选同优先级 |
| `<fn value>` 不在作用域 | 4 | 链表节点字段读取 `no callable with this name is in scope` |
| `sorted_by` 不存在 | 3 | 同上 |
| SMIR007 语义 MIR 合同失败 | 3 | `union` i32/i64 跳转实参不一致、`jump arity differs` |
| `char` 面运算 / `is_vowel` 候选不匹配 | 2 | `infix +` / `infix -` / `char_cost` 无匹配候选 |
| `let` 初始化为 `u8`，声明为 `char` | 2 | `initializer type \`u8\` is incompatible with declared type \`char\`` |
| `String` 类型名不存在 | 1 | `unknown type name \`String\`` |
| host contract 缺 `__u8_add` | 1 | `has a resolved call but no host provider is bound` |
| std `from_list` 内 `list.iter` | 1 | `unresolved call \`list.iter\`` |
| `mut` 出现在形参类型位 | 1 | `micro order_monsters(items: mut ArrayList<Monster>)` |
| 浮点 ↔ 整数精确转换 opcode 缺失 | 1 | `i64 as f64`：`wasm 后端缺少 i64 → f64 的精确表示转换编码` |

- 判题缺口销账（2026-11-05 复核）：31 条里 **30 条已修并通过全用例**，1 条转为编译阻断。
  - 30 条的共同根因是 **`loop <var> in <ArrayList>` 静默零迭代**：编译不报未解析，运行时一次也不进循环，
    于是成批出现 `expected "X", got "0"`；`delete-and-earn` 的 `RuntimeError: unreachable` 同因
    （`max_val` 停在 0，随后构造 0 长数组再取下标）。修法：全部改为显式
    `while index < list.length()` + `list⁅index⁆`。逐题销账时另修两处算法错：
    `single-number-ii` 的 32 位无符号重构需补符号扩展，`maximum-xor-of-two-numbers-in-an-array`
    的 `bit = -1` 会把外层位循环一并打断。**loop 静默零迭代是语言侧证据，建议并入迭代协议缺口，
    不计为本批失败。**
  - `closest-binary-search-tree-value`（270）：题面 `target` 本就是浮点（17 条语料里 12 条是小数），
    不是语料缺陷。题解按理想签名 `target: f64` 写，但 wasm 后端**两个方向都缺精确转换 opcode**：
    `i64 as f64` 报「缺少 i64 → f64 的精确表示转换编码」，`f64 as i64` 报「缺少 f64 → i64 …」。
    该题计入编译失败，新增缺口候选（浮点 ↔ 整数精确转换）；不删用例、不改断言。
- 口径重算（同一窗口 206 题）：编译通过 **136**、端到端通过 **136**、编译失败 **70**、判题未通过 **0**；
  累计端到端 **136 / 832**、累计编译 **136 / 832**、未编译 **626**。

### 依赖未实现特性的调用点（R25）

- `Queue<T>`（**名字有、宿主实现无**）：`Queue.v` 的 `new` / `enqueue` / `dequeue` / `peek` /
  `length` / `clear` 全是 `[host_contract]` 声明；`is_empty` 有体但内部调用宿主 `length`。
  空壳 `enqueue` 的体写的是 `self.data.push(value)`，而 `Deque` 只有 `push_back` / `push_front`，
  说明这个壳自身没进过编译。本批 **0 题使用**（全部 BFS 用 `Deque` + `pop_front`），保留工单。
- `DisjointSet<i64>`（**真实实现，不是空壳**）：`DisjointSet.v` 用 `HashMap<T, T>` 父指针 +
  `HashMap<T, usize>` 秩 + `_count` 计数，`find` 带路径压缩，`union` 按秩合并；约束
  `T: Equal & Hash`，`i64` 已满足。本批 **3 题**：`redundant-connection`（684，`connected` 判环）、
  `regions-cut-by-slashes`（959，`group_count` 数区域）、
  `number-of-operations-to-make-network-connected`（1319，`group_count` + `connected`）。
- `DirectedGraph<N>` / `topological_sort`（**真实实现，不是空壳**）：`DirectedGraph.v` 提供
  `add_node` / `add_edge` / `successors` / `predecessors` / `out_degree` / `in_degree` / `clone`；
  `topological_sort.v` 是真实 Kahn（`HashMap` 入度 + `ArrayList` 当队列 + `head` 游标，有环返回空表）。
  本批 **0 题调用**：题面给的是 0..n-1 稠密节点和边表，`ArrayList<ArrayList<i64>>` 直接按下标建表
  比逐点 `add_node` 更省；`find-eventual-safe-states`（802）要的是「全部安全节点」而不是拓扑序，
  故手写反向 Kahn + 出度递减。结论只进工单，不算缺口。
- `HashMap` 缺可变取值（**无 `get_mut` / `upsert`**）：`HashMap.v` 只有
  `micro \`get\`(self, key: K): Option<V>`，返回的是副本。邻接表追加必须
  `get` → 改副本 → `insert` 回写，每处 4 行。本批 **2 题**：`minimum-score-of-a-path-between-two-cities`
  （2492）、`reorder-routes-to-make-all-paths-lead-to-the-city-zero`（1466），
  均为 `HashMap<i64, ArrayList<ArrayList<i64>>>` 的边表追加。按判据 b 记账。
- `char: Hash`（**已落地，纠正 G17**）：`std/source/collection/hashed/HashPrimitives.v:53` 已有
  `imply char: Hash`（`hash` 返回 `self as usize`）。R22 / R24 记的「`char` 缺 `Hash`」前提已不成立，
  `longest-repeating-character-replacement`（424）、
  `longest-substring-with-at-most-k-distinct-characters`（340）、`task-scheduler`（621）
  转入「阻塞解除」复跑组，与 `sort(list)` 组同样只等 addon 重建。
- G2 浮点返回值合同：`path-with-maximum-probability`（1514）导出 `-> f64`，返回类型即题面合同，
  绕不开（现有 G2 的第三处调用点）。
- 其余面只用**已有真实实现**的签名（不算缺口，但仍未经编译验证）：`ArrayList` 构造 / `push` /
  `set` / `get` / `length` / `is_empty`；`Deque::new` / `push_back` / `pop_back` / `pop_front` /
  `length` / `is_empty`；`HashMap::new` / `get` / `insert` / `contains_key` / `keys`；
  `DisjointSet` 见上；`i64` / `f64` 算术、整除与取模。

### API 工单（R25 压面结果：图面基础设施）

签名为「照着就能写实现」的形态。`T` 指并查集元素 / 队列元素类型，`N` 指图节点类型，
`K` / `V` 指哈希表键值类型。`index` 的 1-based ordinal 约定与 `ArrayList::set` 一致。

| API | 理想签名 | 当前 std | 影响的题（本批） |
| --- | --- | --- | --- |
| `DisjointSet::new` | `micro new(): Self` | 有（真实实现） | 684 / 959 / 1319 |
| `DisjointSet::add` | `micro add(mut self, value: T): bool where T: Equal & Hash` | 有 | 959 / 1319 |
| `DisjointSet::union` | `micro union(mut self, left: T, right: T): bool where T: Equal & Hash` | 有（按秩合并） | 684 / 959 / 1319 |
| `DisjointSet::connected` | `micro connected(mut self, left: T, right: T): bool where T: Equal & Hash` | 有 | 684 / 1319 |
| `DisjointSet::find` | `micro find(mut self, value: T): Option<T> where T: Equal & Hash` | 有（路径压缩） | 684（`connected` 间接） |
| `DisjointSet::group_count` | `micro group_count(self): usize` | 有 | 959 / 1319 |
| `DisjointSet::length` | `micro length(self): usize` | 有 | 未用（保留工单） |
| `DisjointSet::is_empty` | `micro is_empty(self): bool` | 有 | 未用（保留工单） |
| `DisjointSet::elements` | `micro elements(self): ArrayList<T>` | 有 | 未用（保留工单） |
| `DirectedGraph::add_node` | `micro add_node(mut self, node: N): unit where N: Equal & Hash` | 有（真实实现） | 未用（保留工单） |
| `DirectedGraph::add_edge` | `micro add_edge(mut self, from: N, to: N): unit where N: Equal & Hash` | 有 | 未用（保留工单） |
| `DirectedGraph::successors` | `micro successors(self, node: N): ArrayList<N>` | 有 | 未用（保留工单） |
| `DirectedGraph::out_degree` | `micro out_degree(self, node: N): usize` | 有 | 未用（保留工单） |
| `DirectedGraph::in_degree` | `micro in_degree(self, node: N): usize` | 有 | 未用（保留工单） |
| `DirectedGraph::topological_sort` | `micro topological_sort(self): ArrayList<N> where N: Equal & Hash` | 有（真实 Kahn；有环返回空表） | 未用（802 手写反向 Kahn） |
| `Queue::new` | `micro new(): Self` | **名字有、宿主实现无** | 未用（保留工单） |
| `Queue::enqueue` | `micro enqueue(mut self, value: T): unit` | **名字有、宿主实现无**（壳内调用不存在的 `Deque::push`） | 未用（保留工单） |
| `Queue::dequeue` | `micro dequeue(mut self): Option<T>` | **名字有、宿主实现无** | 未用（保留工单） |
| `Queue::peek` | `micro peek(self): Option<T>` | **名字有、宿主实现无** | 未用（保留工单） |
| `Queue::length` | `micro length(self): usize` | **名字有、宿主实现无** | 未用（保留工单） |
| `Queue::is_empty` | `micro is_empty(self): bool` | 有体，但依赖宿主 `length` | 未用（保留工单） |
| `Queue::clear` | `micro clear(mut self): unit` | **名字有、宿主实现无** | 未用（保留工单） |
| `HashMap::new` | `micro new(capacity: usize): Self` | 有 | 1976 / 2492 / 1466 |
| `HashMap::get` | `micro \`get\`(self, key: K): Option<V>` | 有（返回值副本） | 1976 / 2492 / 1466 |
| `HashMap::insert` | `micro insert(mut self, key: K, value: V): Option<V>` | 有 | 1976 / 2492 / 1466 |
| `HashMap::contains_key` | `micro contains_key(self, key: K): bool` | 有 | 1976 / 2492 / 1466 |
| `HashMap::keys` | `micro keys(self): ArrayList<K>` | 有 | 1976 |
| `HashMap::upsert` | `micro upsert(mut self, key: K, fallback: V, update: micro(V) -> V): V`（[提案]；若语言支持引用则等价 `get_mut(mut self, key: K): Option<&mut V>`） | **无** | 2492 / 1466 |
| `Deque::new` | `micro new(): Self` | 有 | 802 / 1020 / 994 / 2658 / 1905 / 851 / 2492 / 1466 / 1129 / 1376 / 1091 / 2477 / 2812 |
| `Deque::push_back` | `micro push_back(mut self, value: T): unit` | 有 | 同上 13 题 |
| `Deque::pop_front` | `micro pop_front(mut self): Option<T>` | 有 | 802 / 994 / 1129 / 1376 / 1091 / 2477 / 2812 |
| `Deque::pop_back` | `micro pop_back(mut self): Option<T>` | 有 | 1020 / 2658 / 1905 / 851 / 2492 / 1466 |
| `Deque::peek_front` | `micro peek_front(self): Option<T>` | 有 | 未用（保留工单） |
| `Deque::peek_back` | `micro peek_back(self): Option<T>` | 有 | 未用（保留工单） |
| `Deque::length` | `micro length(self): usize` | 有 | 994 / 1091 / 2477 / 2812（按层推进） |
| `Deque::is_empty` | `micro is_empty(self): bool` | 有 | 全部用 `Deque` 的 13 题 |
| `ArrayList::new` | `micro new(capacity: usize): Self` | 有 | 全部 23 题 |
| `ArrayList::push` | `micro push(mut self, value: T): unit` | 有 | 全部 23 题 |
| `ArrayList::set` | `micro set(mut self, index: isize, value: T): unit`（1-based ordinal） | 有 | 全部 23 题 |
| `ArrayList::get` | `micro get(self, index: isize): Option<T>`（1-based ordinal） | 有 | 1-based 取值处 |
| `ArrayList::length` | `micro length(self): usize` | 有 | 全部 23 题 |
| 浮点返回值 | `micro maxProbability(n: i64, edges: ArrayList<ArrayList<i64>>, succProb: ArrayList<f64>, start_node: i64, end_node: i64) -> f64` | 签名已写，合同归 G2 | 1514 |

### 工单（R26 压面结果：`DisjointSet` 的 `union` 与 `utf8` 哈希，2026-11-05 实测）

本批 21 题实测暴露两个**编译期硬停点**：std 里签名和实现都在，但当前工具链拒绝生成代码。
两者都不改变 206 题窗口的旧口径（136/136/70/0），只影响本批新题。

| 停点 | 影响 | 首错原文（节选） | 判定 |
| --- | --- | --- | --- |
| `DisjointSet<T>::union` 跳转类型不符 | 所有并查集题 | `(SMIR007): function=std::union#210, location=block 8 terminator, actual=Nominal{ItemId(48),[Integer32{unsigned}]}, expected=Nominal{ItemId(48),[Integer64{signed}]}` | **已修（`57992125`）**：`std::union` 内部 `u32` 下标与 `i64` 块参数的宽度不再不一致；旧 addon 上的反例现为结构化拒绝，不再是编译阻断 |
| `HashMap<utf8, V>` 键 | 所有字符串哈希题 | `调用实例 ItemInstanceId(4) 没有定义或显式导入合同；callers=["std::hash#445"]` | `utf8: Hash` 合同缺失；`HashMap<utf8, i64>` 的 `==` 另会落到 `std::infix ==#449`（缺 `__u8_eq`） |

- 交叉验证（不是本批写法问题）：此前已通过的 `redundant-connection`、
  `most-stones-removed-with-same-row-or-column`、`number-of-operations-to-make-network-connected`
  当时同样停在 `std::union`；`is-graph-bipartite` 的 `DirectedGraph::nodes()` 另停在
  `HashSet::from_list` 的 `list.iter` 未解析。**2026-11-06 更新（`57992125`）**：`std::union`
  宽度不符已修，上述反例不再报 SMIR007；`list.iter` 一项仍按原状保留。
- `sentence-similarity-ii`：`DisjointSet<i64>` + `HashMap<utf8, i64>`，先被 `std::hash#445`
  拦住，未到达 `std::union`。
- `find-all-possible-recipes-from-given-supplies`：为过全用例临时回退到
  `ArrayList<utf8>` + 逐码元比较（非理想写法），待 `utf8: Hash` / `__u8_eq` 落地后还原
  `HashMap<utf8, i64>`。
- 夹具缺陷（报错文本层）：`scripts/run_v_solver.ts:172` 用
  `assertTestCase(idx, expected, () => { void runCandidate(...) })`，未 `await` 异步
  `callExport`，`expected: "Error: ..."` 的用例恒报 `no exception raised`，真实 trap 以
  unhandled rejection 逸出。结果判定不受影响，属可修夹具 bug（本批未动）。

### 依赖未实现特性的调用点（R24）

- `BinaryHeap<T>::new_by(compare)`（**提案，std 无此入口**）：`BinaryHeap` 只有 `new()`
  一个 `Comparable` 最小堆构造，没有比较器构造。本批 **6 题 6 处**：
  `remove-stones-to-minimize-the-total`（1962）、`furthest-building-you-can-reach`（1642）、
  `minimum-operations-to-halve-array-sum`（2208，`f64` 非 `Comparable`）、
  `maximal-score-after-applying-k-operations`（2530）、`total-cost-to-hire-k-workers`
  （2462，下标堆，比较器捕获 `costs`）、`task-scheduler`（621）。
- `PriorityQueue<T>`（**名字有、宿主实现无**）：`PriorityQueue.v` 的 `new` / `push` / `pop` /
  `peek` / `length` / `clear` 全是 `[host_contract]` 声明，`nyar-vm.rs` 无宿主实现。
  本批 **4 题**：`maximum-product-after-k-increments`（2233）、`maximum-subsequence-score`
  （2542）、`minimum-cost-to-connect-sticks`（1167）、`maximum-number-of-events-that-can-be-attended`
  （1353）。按 i64 最小堆形态书写，未临时造替代结构。
- `sorted_by(list, cmp)`（G11，2026-11-07 已提供）：`maximum-subsequence-score`（2542，按 `nums2`
  降序且比较器捕获 `nums2`）、`maximum-number-of-events-that-can-be-attended`（1353，按开始日升序），
  **2 题 2 处**。
- `Comparable` / `<=>` 派生（**阻塞**）：`maximum-number-of-eaten-apples`（1705，`Fruit` 按到期日）、
  `eliminate-maximum-number-of-monsters`（1921，`Monster` 按 `dist / speed` 交叉相乘）。
  `sort.v` 的执行路径是 `a.compare(b)` + `match Ordering`，而 `Ordering.Less` / `Greater` / `Equal`
  当前不可达（Q10 裸 `Equal` 撞名；Q11 已复核为旧 addon 测量误判，非语言缺口），故不写「只实现 `infix <`」的绕过形态。
- `char: Hash`（G17，2026-11-07 已恢复）：`task-scheduler`（621）的 `HashMap<char, i64>` 任务频次表。
- `sort(list)`（**已落地**，`ArrayList<T>` 形态）：`reveal-cards-in-increasing-order`（950）、
  `minimum-increment-to-make-array-unique`（945）、`eliminate-maximum-number-of-monsters`（1921）
  直接调用，不再计入未实现特性依赖。
- 其余面只用**已有真实实现**的签名（不算缺口，但仍未经编译验证）：`BinaryHeap::new` / `push` /
  `pop` / `peek` / `length` / `is_empty`；`Deque::new` / `push_back` / `push_front` / `pop_front` /
  `pop_back` / `peek_front` / `peek_back` / `length` / `is_empty`；`ArrayList` 构造 / `push` /
  `pop` / `last` / `get` / `set` / `length` / `is_empty`；`i64` / `f64` 算术与取模。

### API 工单（R24 压面结果：std 落地依据）

签名为「照着就能写实现」的形态。`T` 一律指堆 / 队列元素类型；比较器统一
`micro(T, T) -> i32`，约定与 `sorted_by` 一致：返回负数表示 `a` 先出。

| API | 理想签名 | 当前 std | 影响的题（本批） |
| --- | --- | --- | --- |
| `BinaryHeap::new` | `micro new(): Self`（`Comparable` 最小堆） | 有 | 3066 / 2599 / 2462（构造） |
| `BinaryHeap::push` | `micro push(mut self, value: T): unit` | 有 | 1962 / 1642 / 2208 / 2530 / 3066 / 2599 / 2462 / 1705 |
| `BinaryHeap::pop` | `micro pop(mut self): Option<T>` | 有 | 1962 / 1642 / 3066 / 2599 / 2462 / 1705 |
| `BinaryHeap::peek` | `micro peek(self): Option<T>` | 有 | 3066 / 2599 / 1705 |
| `BinaryHeap::length` | `micro length(self): usize` | 有 | 1642 / 3066 / 2599 / 621 |
| `BinaryHeap::is_empty` | `micro is_empty(self): bool` | 有 | 621 / 1705 |
| `BinaryHeap::new_by` | `micro new_by(compare: micro(T, T) -> i32): Self` | **无** | 1962 / 1642 / 2208 / 2530 / 2462 / 621 |
| `PriorityQueue::new` | `micro new(): Self` | **名字有、宿主实现无**（`[host_contract]`） | 2233 / 2542 / 1167 / 1353 |
| `PriorityQueue::push` | `micro push(mut self, value: T): unit` | **名字有、宿主实现无** | 2233 / 2542 / 1167 / 1353 |
| `PriorityQueue::pop` | `micro pop(mut self): Option<T>` | **名字有、宿主实现无** | 2233 / 2542 / 1167 / 1353 |
| `PriorityQueue::peek` | `micro peek(self): Option<T>` | **名字有、宿主实现无** | 2542 |
| `PriorityQueue::length` | `micro length(self): usize` | **名字有、宿主实现无** | 2542 / 1167 / 1353 |
| `Queue::is_empty` | `micro is_empty(self): bool` | **名字有、宿主实现无**（与 `PriorityQueue` 同批） | 2542 / 1167 / 1353 |
| `Deque::new` | `micro new(): Self` | 有 | 950 / 1696 / 2944 / 3191 |
| `Deque::push_front` | `micro push_front(mut self, value: T): unit` | 有（本批未使用，保留工单） | 无 |
| `Deque::push_back` | `micro push_back(mut self, value: T): unit` | 有 | 950 / 1696 / 2944 / 3191 |
| `Deque::pop_front` | `micro pop_front(mut self): Option<T>` | 有 | 950 / 1696 / 2944 / 3191 |
| `Deque::pop_back` | `micro pop_back(mut self): Option<T>` | 有（本批未使用，保留工单） | 无 |
| `Deque::peek_front` | `micro peek_front(self): Option<T>` | 有 | 1696 / 2944 / 3191 |
| `Deque::peek_back` | `micro peek_back(self): Option<T>` | 有 | 1696 / 2944 |
| `Deque::length` | `micro length(self): usize` | 有 | 950 / 3191（间接） |
| `Deque::is_empty` | `micro is_empty(self): bool` | 有 | 950 / 1696 / 2944 / 3191 |
| `ArrayList` 作栈：`push` | `micro push(mut self, value: T): unit` | 有 | 739 / 907 / 1856 / 2104 / 1673 / 2216 / 1762 / 946 |
| `ArrayList` 作栈：`last` | `micro last(self): Option<T>` | 有 | 907 / 1856 / 2104 / 1673 / 2216 / 946 |
| `ArrayList` 作栈：`pop` | `micro pop(mut self): Option<T>` | 有 | 907 / 1856 / 2104 / 1673 / 2216 / 1762 / 946 |
| `ArrayList::length` | `micro length(self): usize` | 有 | 全部 28 题 |
| `ArrayList::is_empty` | `micro is_empty(self): bool` | 有 | 739 / 907 / 1856 / 2104 / 1673 / 1762 / 946 |
| `ArrayList::get` | `micro get(self, index: isize): Option<T>`（1-based ordinal） | 有 | 1-based 取值处 |
| `ArrayList::set` | `micro set(mut self, index: isize, value: T): unit`（1-based ordinal） | 有 | 739 / 907 / 1856 / 950 / 945 |
| `sort(list)` | `micro sort<T>(mut list: ArrayList<T>) where T: std::operator::Comparable` | 有（`sort.v` 已落地，稳定归并） | 950 / 945 / 1921 |
| `sorted_by(list, cmp)` | `micro sorted_by<T>(items: ArrayList<T>, compare: micro(T, T) -> i32): ArrayList<T>` | 有（`3e02e7d`，返回新序列） | 2542 / 1353（另 R22 的 954 / 870） |
| `Comparable` 派生 | `imply X: std::operator::Comparable { micro compare(self, other: X): std::operator::Ordering }` | **阻塞**（Q10 裸 `Equal` 撞名；Q11 已复核） | 1705 / 1921 |
| `char: Hash` | `imply char: std::hash::Hash`（`HashMap<char, V>` 可建） | 有（`HashPrimitives.v:53`，2026-11-07 复跑） | 621（另 R22 的 424 / 340） |

### 依赖未实现特性的调用点（R23）

- `sort(list)` 单参入口（**已落地**：`valkyrie.v` `projects/std/source/collection/sort.v`，
  `micro sort<T>(mut list: ArrayList<T>) where T: std::operator::Comparable`）：本批 **9 处调用点、8 题**，
  只等 addon 重建后复跑验证。`maximum-tastiness-of-candy-basket`（2517）、
  `magnetic-force-between-two-balls`（1552）、
  `minimize-the-maximum-difference-of-pairs`（2616）、`the-k-strongest-values-in-an-array`（1471）、
  `valid-triangle-number`（611）、`minimize-maximum-pair-sum-in-array`（1877）、
  `divide-players-into-teams-of-equal-skill`（2491）、`maximum-matching-of-players-with-trainers`
  （2410，两处：球员表与教练表各一次）。
- `sorted_by(list, cmp)`（G11，2026-11-07 已提供）：`the-k-strongest-values-in-an-array`（1471，
  按「与中位数距离降序、值降序」排序）；比较器捕获外层 `median`（闭包捕获，待验证，见观察 8）。
- 其余面只用源码已有签名：`HashMap<i64, i64>`（974 / 1248 的余数 / 奇偶前缀频次表）、
  `Deque<i64>`（962 的单调递减下标栈）、`ArrayList` 构造 / `push` / `length` / `set`、与 `i64` 算术。
  这些面**未经编译验证**（全局停点在前），不算缺口。

### 依赖未实现特性的调用点（R22）

- `sorted_by(list, cmp)`（G11，2026-11-07 已提供）：`array-of-doubled-pairs`（954，按绝对值排序）、
  `advantage-shuffle`（870，按 `nums2` 的值排序索引）；870 的比较器还捕获外层 `nums2`
  （闭包捕获，待验证，见观察 8）。
- `sort(list)` 单参入口（**已落地**：`valkyrie.v` `projects/std/source/collection/sort.v`，
  `micro sort<T>(mut list: ArrayList<T>) where T: std::operator::Comparable`）：以下 10 题直接依赖
  单参 `sort(list)`、不传比较器：
  `advantage-shuffle`（870）、`boats-to-save-people`（881）、`destroying-asteroids`（2126）、
  `max-number-of-k-sum-pairs`（1679）、`least-number-of-unique-integers-after-k-removals`（1481）、
  `hand-of-straights`（846）、`divide-array-in-sets-of-k-consecutive-numbers`（1296）、
  `find-the-value-of-the-partition`（2740）、`maximize-greatness-of-an-array`（2592）、
  `frequency-of-the-most-frequent-element`（1838）。`i64` 的 `Comparable` 实现已在
  `std/source/operator/comparable_primitives.v`，入口与 `where` 约束均已齐备，
  只等 addon 重建后复跑验证。
  **归集见下方「汇聚组」**，工具链刷新后一次性复跑。
- `HashMap<char, i64>`（G17，2026-11-07 已恢复）：`longest-repeating-character-replacement`（424）、
  `longest-substring-with-at-most-k-distinct-characters`（340）。
  **归集见下方「汇聚组」**，`char: Hash` 落地后一次性复跑。
- 其余面只用源码已有签名：`HashMap::new` / `contains_key` / `get` / `insert` / `keys` / `remove`、
  `ArrayList::new` / `push` / `length` / `set`、`Deque::new` / `push_back` / `pop_back` /
  `peek_front` / `peek_back` / `pop_front` / `is_empty`、`char as u32` / `as i64` / `as usize`。
  这些面**未经编译验证**（全局停点在前），不算缺口。

### 待还原组：`loop in ArrayList` 后端 `Cast` 未 lowering（30 题，R26 产出；已由 `172b944a` 修复，2026-11-05 全部还原）

现象：`loop <var> in <ArrayList>` 的失败点不在 for-in 协议，而在 OVM 后端。`IntoIterator for
ArrayList` 已实现（`std/source/collection/ArrayList.v:291` 的
`imply ArrayList<T>: std::iterator::IntoIterator`、`:319` 的 `ArrayListIterator: Iterator`），
HIR 层证据是通的。真机制是 OVM 后端把 `Cast` 静默跳过（`_ => {}`）：`std::next` 里的
`(self._index + 1) as isize` 拿不到值，索引算术落在空槽，循环一次不进。该静默已改为 fail-closed
（`f4c42372`），所以现在同一形态**编译期在后端失败**，历史上则表现为**运行期零迭代**（`Cast`
被静默跳过时）。29 条 `expected "X", got "0"` 与 `delete-and-earn` 的 `RuntimeError: unreachable`
（零迭代后构造 0 长数组再取下标）都同源于此。坐标：`std/source/collection/ArrayList.v:331`。

当前实跑失败文本：`OVM 后端未实现指令 Cast { ... ty: Integer64 { signed: true } }（symbol=\`std::next\`）`。

处置：为不阻塞判题，本轮把循环改成显式索引 `while`。这是**临时绕过，不是题解的正确形态**；
每份 `solution.v` 顶部已加一行 `# 临时绕过：…` 注释，与
`find-all-possible-recipes-from-given-supplies` 的标注同一格式。**OVM 后端 `Cast` lowering
落地后**，下列 30 题一次性还原为 `loop <var> in <list>`，其余逻辑不动。

**2026-11-05 复核结论：缺陷已修，30 题已还原（`172b944a` 修复块退出写回）。**
验收量具为 addon 副本 `25132ccf`（`projects/conformance/.cache/valkyrie-forin.node`，
`VALKYRIE_NATIVE` 指向它），逐题 `legion build` + 全量 `metadata.tests` 真跑，全部通过：
`binary-subarrays-with-sum` 72/72、`bitwise-ors-of-subarrays` 93/93、`bitwise-xor-of-all-pairings` 96/96、
`capacity-to-ship-packages-within-d-days` 80/80、`count-nice-pairs-in-an-array` 107/107、
`count-number-of-nice-subarrays` 68/68、`cutting-ribbons` 100/100、`delete-and-earn` 115/115、
`find-the-smallest-divisor-given-a-threshold` 78/78、`find-xor-beauty-of-array` 81/81、`house-robber` 117/117、
`house-robber-iv` 100/100、`last-stone-weight-ii` 100/100、`maximum-candies-allocated-to-k-children` 82/82、
`maximum-product-subarray` 91/91、`maximum-xor-after-operations` 101/101、`maximum-xor-for-each-query` 79/79、
`maximum-xor-of-two-numbers-in-an-array` 102/102、`minimum-average-difference` 94/94、
`minimum-limit-of-balls-in-a-bag` 99/99、`minimum-number-of-days-to-make-m-bouquets` 93/93、
`minimum-time-to-complete-trips` 103/103、`number-of-sub-arrays-with-odd-sum` 87/87、
`number-of-ways-to-split-array` 105/105、`range-addition-ii` 112/112、`single-number-ii` 86/86、
`single-number-iii` 50/50、`subarray-sums-divisible-by-k` 108/108、
`sum-of-absolute-differences-in-a-sorted-array` 69/69、`total-hamming-distance` 98/98。
同批还有 3 题带同一注释的还原：`best-time-to-buy-and-sell-stock` 99/99、`majority-element` 45/45、
`single-number` 108/108。残留 `while` 的 4 题（`house-robber-iv`、`maximum-xor-for-each-query`、
`minimum-average-difference`、`number-of-ways-to-split-array`）是算法本身需要下标，不是绕法。

| slug | 题目录 |
| --- | --- |
| `binary-subarrays-with-sum` | `projects/problems/binary-subarrays-with-sum` |
| `bitwise-ors-of-subarrays` | `projects/problems/bitwise-ors-of-subarrays` |
| `bitwise-xor-of-all-pairings` | `projects/problems/bitwise-xor-of-all-pairings` |
| `capacity-to-ship-packages-within-d-days` | `projects/problems/capacity-to-ship-packages-within-d-days` |
| `count-nice-pairs-in-an-array` | `projects/problems/count-nice-pairs-in-an-array` |
| `count-number-of-nice-subarrays` | `projects/problems/count-number-of-nice-subarrays` |
| `cutting-ribbons` | `projects/problems/cutting-ribbons` |
| `delete-and-earn` | `projects/problems/delete-and-earn` |
| `find-the-smallest-divisor-given-a-threshold` | `projects/problems/find-the-smallest-divisor-given-a-threshold` |
| `find-xor-beauty-of-array` | `projects/problems/find-xor-beauty-of-array` |
| `house-robber` | `projects/problems/house-robber` |
| `house-robber-iv` | `projects/problems/house-robber-iv` |
| `last-stone-weight-ii` | `projects/problems/last-stone-weight-ii` |
| `maximum-candies-allocated-to-k-children` | `projects/problems/maximum-candies-allocated-to-k-children` |
| `maximum-product-subarray` | `projects/problems/maximum-product-subarray` |
| `maximum-xor-after-operations` | `projects/problems/maximum-xor-after-operations` |
| `maximum-xor-for-each-query` | `projects/problems/maximum-xor-for-each-query` |
| `maximum-xor-of-two-numbers-in-an-array` | `projects/problems/maximum-xor-of-two-numbers-in-an-array` |
| `minimum-average-difference` | `projects/problems/minimum-average-difference` |
| `minimum-limit-of-balls-in-a-bag` | `projects/problems/minimum-limit-of-balls-in-a-bag` |
| `minimum-number-of-days-to-make-m-bouquets` | `projects/problems/minimum-number-of-days-to-make-m-bouquets` |
| `minimum-time-to-complete-trips` | `projects/problems/minimum-time-to-complete-trips` |
| `number-of-sub-arrays-with-odd-sum` | `projects/problems/number-of-sub-arrays-with-odd-sum` |
| `number-of-ways-to-split-array` | `projects/problems/number-of-ways-to-split-array` |
| `range-addition-ii` | `projects/problems/range-addition-ii` |
| `single-number-ii` | `projects/problems/single-number-ii` |
| `single-number-iii` | `projects/problems/single-number-iii` |
| `subarray-sums-divisible-by-k` | `projects/problems/subarray-sums-divisible-by-k` |
| `sum-of-absolute-differences-in-a-sorted-array` | `projects/problems/sum-of-absolute-differences-in-a-sorted-array` |
| `total-hamming-distance` | `projects/problems/total-hamming-distance` |

判据：这 30 题改前都有 `<var> in <list>` 形式的循环，改后不含 `loop … in …`；文件顶部注释是
还原锚点。还原后需按原批次逐题复跑，不重新分配题号。

### 待还原组：`phone-number-prefix` 的 utf8 序面（1 题，R28 产出）

理想写法是把号码按字典序排序后逐对检查「前一个是否为后一个的真前缀」（与 TS / Python
参考实现一致）。**2026-11-05 复核（addon `25132ccf`）：仍阻断，绕法保留并真跑 97/97。**
两条实测诊断：

- `sorted_by(numbers, compare_text)`：`WASM ABI carrier mismatch in std::collection::is_less_or_equal: slot=i32 actual=anyref operand=%0 (Utf8)`。
- `sort(sorted)`（`utf8: Comparable` 已存在于 `std/source/text/Utf8Text.v:555`）：
  `WASM pre-emission verifier: std::collection::natural_order at SSA value 2 携带无身份名义类型 Ordering；declaration / TypeId 缺失时不得按短名解析存储类`。

因此保留 `HashSet<utf8>` 枚举真前缀的绕法。**同时更正旧结论**：`utf8: Hash` 与
`std::hash#` 合同实例在该 addon 上已可用（`HashSet<utf8>` 的 `insert`/`contains` 编译与运行均通过，
本题 97/97 即证据），旧记录的「`std::hash#` 合同实例仍缺」不再成立。
坐标：`projects/problems/phone-number-prefix/solvers/valkyrie/solution.v:3`（注释）与 `:16`（`HashSet<utf8>` 建集）。

### 汇聚组（签名落地后一次性复跑）

**`sort` 组：拆成两条独立记录（题解侧形态 vs 编译器侧名义类型）**

调用点清单（13 题，R22 + R24 产出；另 R23 8 题同族，共 **21 处调用**）：

| 题号 | slug | 入口 | 复跑状态 |
| --- | --- | --- | --- |
| 870 | `advantage-shuffle` | `advantageCount` | 编译失败（`sort` 无候选 + `sorted_by` 不存在） |
| 881 | `boats-to-save-people` | `numRescueBoats` | 编译失败（见 ②，`ArrayList` 实参） |
| 2126 | `destroying-asteroids` | `asteroidsDestroyed` | 编译失败（`sort` 无候选） |
| 1679 | `max-number-of-k-sum-pairs` | `maxOperations` | 编译失败（`sort` 无候选） |
| 1481 | `least-number-of-unique-integers-after-k-removals` | `findLeastNumOfUniqueInts` | 编译失败（`sort` 无候选） |
| 846 | `hand-of-straights` | `isNStraightHand` | 编译失败（`sort` 无候选） |
| 1296 | `divide-array-in-sets-of-k-consecutive-numbers` | `isPossibleDivide` | 编译失败（`sort` 无候选） |
| 2740 | `find-the-value-of-the-partition` | `findValueOfPartition` | 编译失败（`sort` 无候选） |
| 2592 | `maximize-greatness-of-an-array` | `maximizeGreatness` | 编译失败（`sort` 无候选） |
| 1838 | `frequency-of-the-most-frequent-element` | `maxFrequency` | 编译失败（`sort` 无候选） |
| 950 | `reveal-cards-in-increasing-order` | `deckRevealedIncreasing` | 编译失败（`sort` 无候选） |
| 945 | `minimum-increment-to-make-array-unique` | `minIncrementForUnique` | 编译失败（`sort` 无候选） |
| 1921 | `eliminate-maximum-number-of-monsters` | `eliminateMaximum` | 编译失败（`mut` 出现在形参类型位，另一错误） |

**① 实参形态不匹配：`Array` 实参 vs `ArrayList` 形参（题解侧）**

- 签名只有 `micro sort<T>(mut list: ArrayList<T>): unit where T: std::operator::Comparable`
  （`sort.v:82`），只收 `ArrayList`，不收 `Array`。
- 可复现证据：`maximum-gap`（164）形参就是 `nums: [i64]`，直接 `sort(nums)`，报
  `unresolved call "sort"：1 candidate(s) share the name, but none matches the argument types`。
  报错的 21 处里，可复现的实参是 `[i64]`（`Array`）。
- 题解侧结论：**不是签名缺失，也不是 `ArrayList<T>` 实例化不闭合**。把容器对齐到
  `ArrayList<i64>` 即可解析——形参声明成 `ArrayList<i64>`，或先把 `[i64]` 逐元素拷入
  `ArrayList<i64>` 再调用。`i64: Comparable` 已存在（`comparable_primitives.v:68`），签名不改。
  题解保持一行 `sort(...)`，不改成内联排序。

**② `ArrayList` 实参的真正停点：`Ordering` 在 SSA 层无身份（编译器侧；已由 `9d51ad08` 修复）**

- 原停点：`std::collection::is_less_or_equal at SSA value 2 携带无身份名义类型 Ordering；declaration / TypeId 缺失时不得按短名解析存储类`。
- 修复：`9d51ad08` 🐛 `Give non-generic sum declarations a tagged aggregate layout`。
- **2026-11-05 复核（按 `9d51ad08` 独立 worktree 重建的 addon 副本，`VALKYRIE_NATIVE` 指向
  `projects/conformance/.cache/valkyrie-ordering.node`）：已修，六题全绿**：
  `advantage-shuffle` 99/99、`boats-to-save-people` 89/89、`destroying-asteroids` 88/88、
  `max-number-of-k-sum-pairs` 68/68、`least-number-of-unique-integers-after-k-removals` 69/69、
  `hand-of-straights` 81/81；同量具下 `last-stone-weight` 124/124、`furthest-building-you-can-reach` 118/118。
- 题解保持理想写法（`ArrayList<i64>` 直接 `sort`），不再记「编译阻断」。

`sorted_by(list, cmp)` 仍是独立缺口（870、954、1471），不并入以上两条。

**复跑结果（2026-11-04 23:50 addon 重建后）：`char: Hash` 成立，失败点已不在 `Hash`**（3 题，R22 + R24 产出）

| 题号 | slug | 入口 | 复跑状态 |
| --- | --- | --- | --- |
| 424 | `longest-repeating-character-replacement` | `characterReplacement` | 编译失败（`s⁅i⁆` 出来是 `u8`，声明为 `char`） |
| 340 | `longest-substring-with-at-most-k-distinct-characters` | `lengthOfLongestSubstringKDistinct` | 编译失败（同上） |
| 621 | `task-scheduler` | `leastInterval` | 编译失败（`BinaryHeap` 的 `where` 证据被拒） |

同组判据：`HashMap<char, i64>` / `HashSet<char>` 需要 `char: Hash`。`HashPrimitives.v:53` 的
`imply char: Hash` 成立；复跑显示失败点已不在 `Hash`：424 / 340 报
`initializer type u8 is incompatible with the declared type char`（`s⁅i⁆` 按 `u8` 出来），
621 卡在 `BinaryHeap`。`char: Hash` 不再计入未实现特性依赖。

**阻塞于同一签名：`BinaryHeap<T>::new_by(compare)` 缺比较器构造**（6 题，R24 产出）

| 题号 | slug | 入口 | 状态 |
| --- | --- | --- | --- |
| 1962 | `remove-stones-to-minimize-the-total` | `minStoneSum` | `authored-unverified`（未复验） |
| 1642 | `furthest-building-you-can-reach` | `furthestBuilding` | **已改为最小堆直接用法，118/118 通过（`9d51ad08`）** |
| 2208 | `minimum-operations-to-halve-array-sum` | `halveArray` | `authored-unverified`（`f64` 元素，未复验） |
| 2530 | `maximal-score-after-applying-k-operations` | `maxKelements` | `authored-unverified`（未复验） |
| 2462 | `total-cost-to-hire-k-workers` | `totalCost` | `authored-unverified`（下标堆，比较器捕获 `costs`，未复验） |
| 621 | `task-scheduler` | `leastInterval` | `authored-unverified`（未复验） |

同组判据：均写 `BinaryHeap<T>::new_by(compare: micro(T, T) -> i32)`（比较器负数先出堆）。
`BinaryHeap.v` 只有 `new()` 的无比较器最小堆构造，`sift_up` / `sift_down` 的 `where` 锁在
`T: Comparable` 上。`Ordering` 布局缺口（`9d51ad08`）修复后，最小序堆本身已可用；
`furthest-building-you-can-reach` 不再需要 `new_by`（梯子保留最大几跳、砖块付最小几跳，直接最小堆），
已在 `9d51ad08` addon 副本上真跑 118/118。`new_by` 仍缺，其余 5 题需按各自算法重写并复跑。

**阻塞于同一实现：`PriorityQueue<T>` 无宿主实现**（4 题，R24 产出）

| 题号 | slug | 入口 | 状态 |
| --- | --- | --- | --- |
| 2233 | `maximum-product-after-k-increments` | `maximumProduct` | `authored-unverified` |
| 2542 | `maximum-subsequence-score` | `maxScore` | `authored-unverified`（另见 `sorted_by` 组） |
| 1167 | `minimum-cost-to-connect-sticks` | `connectSticks` | `authored-unverified` |
| 1353 | `maximum-number-of-events-that-can-be-attended` | `maxEvents` | `authored-unverified`（另见 `sorted_by` 组） |

同组判据：`PriorityQueue.v` 只给 `[host_contract]` 声明，`nyar-vm.rs` 没有宿主实现。
签名本身不缺口，缺的是运行时落地。宿主实现落地后按本组 slug 一次性复跑。

**阻塞于 `Comparable` / `<=>` 派生（`Ordering` 三态不可达）**（2 题，R24 产出）

| 题号 | slug | 入口 | 状态 |
| --- | --- | --- | --- |
| 1705 | `maximum-number-of-eaten-apples` | `eatenApples` | `authored-unverified`（未复验） |
| 1921 | `eliminate-maximum-number-of-monsters` | `eliminateMaximum` | `authored-unverified`（未复验，同时依赖 `sort(list)`） |

同组判据：`structure` + `imply X: std::operator::Comparable { micro compare ... }`，返回
`std::operator::Ordering`。`Ordering` 的声明级 tagged 布局已由 `9d51ad08` 落地
（🐛 `Give non-generic sum declarations a tagged aggregate layout`），
`is_less` / `is_less_or_equal` 的 `match Ordering` 不再停在无身份名义类型。
**本组仍未复验**：上述六题证据证明的是 `sort(ArrayList<i64>)` 路径，自定义 `Comparable`
结构体 + `<=>` 派生尚未在同一 addon 副本上真跑；按纪律记「未复验」，不记「已修」。

**阻塞于 `sorted_by(list, cmp)`（G11，2026-11-07 已恢复）**（7 题，R22 + R24 + R28 产出）

| 题号 | slug | 入口 | 状态 |
| --- | --- | --- | --- |
| 954 | `array-of-doubled-pairs` | `canReorderDoubled` | 复跑通过 112/112（2026-11-07） |
| 870 | `advantage-shuffle` | `advantageCount` | 复跑通过 99/99（2026-11-07） |
| 2542 | `maximum-subsequence-score` | `maxScore` | 复跑通过 114/114（2026-11-07） |
| 1353 | `maximum-number-of-events-that-can-be-attended` | `maxEvents` | 复跑通过 93/93（2026-11-07） |
| 1337 | `the-k-weakest-rows-in-a-matrix` | `kWeakestRows` | 复跑通过 80/80（2026-11-07） |
| 2099 | `find-subsequence-of-length-k-with-the-largest-sum` | `maxSubsequence` | 复跑通过 99/99（2026-11-07） |
| 1086 | `high-five` | `highFive` | 复跑通过 79/79（2026-11-07） |

同组判据：`sorted_by<T>(items: ArrayList<T>, cmp: micro(T, T) -> i32): ArrayList<T>` 已由
`3e02e7d` 提供（返回新序列，入参不改动），上表 7 题合计 **676/676** 用例 PASS；R23 的
`the-k-strongest-values-in-an-array`（1471）同批复跑 **91/91** PASS。
`sort.v` 的 `merge_sort` 已是非私有入口，比较器排序不再依赖题内手写实现。

**阻塞于 G2 浮点返回值合同**（1 题，R25 产出）

| 题号 | slug | 入口 | 状态 |
| --- | --- | --- | --- |
| 1514 | `path-with-maximum-probability` | `maxProbability` | `authored-unverified` |

同组判据：导出 `-> f64`，返回值即题面合同（0..1 的概率），与 1227 / 1344 属同一组。
G2 关闭后按本组 slug 一次性复跑。

**阻塞于 `HashMap` 邻接 upsert（[提案] `upsert` / `get_mut`）**（2 题，R25 产出）

| 题号 | slug | 入口 | 状态 |
| --- | --- | --- | --- |
| 2492 | `minimum-score-of-a-path-between-two-cities` | `minScore` | `authored-unverified` |
| 1466 | `reorder-routes-to-make-all-paths-lead-to-the-city-zero` | `minReorder` | `authored-unverified` |

同组判据：`HashMap<i64, ArrayList<ArrayList<i64>>>` 的边表追加。`HashMap` 只有返回副本的
`micro \`get\`(self, key: K): Option<V>`，每个追加点都要 `get` → 改副本 → `insert` 回写（4 行），
按判据 b 记账。`upsert`（或等价引用型 `get_mut`）落地后按本组 slug 一次性复跑。

### 依赖未实现特性的调用点（R21）

- `Option<ArrayList<i64>>` 作为导出返回类型（空链表对应 `metadata.expected: null`）：
  `merge-two-sorted-lists`（21）、`remove-duplicates-from-sorted-list`（83）、
  `remove-linked-list-elements`（203）、`reverse-linked-list`（206）。
  这是 G3 返回值方向的扩展：除 `ArrayList` 本体外，还要求 ABI 能 marshal `Option` 的 `None`。
  标「依赖未实现的特性」，不标题目 blocked；文件照常计入 authored-unverified 产出。
- 其余调用点只用源码已有签名：`ArrayList` 构造 / `push` / `clear` / `length`、`HashMap::new` /
  `contains_key` / `get` / `insert` / `keys`、`HashSet::new` / `insert` / `length`、
  `Utf8Builder::new` / `append` / `append_i64` / `build`、`utf8.concat` / `equals` / `length`、
  `char as u32`。这些面**未经编译验证**（全局停点在前），不算缺口，也不再新增纸面 API。

### 批量编译入口（备用，树绿后复跑）

- R20 / R21 的逐题「编译 + 隔离判题」入口（在 `leetcode.v` 根目录，slug 取自
  `valkyrie-unverified-batches.md` 的对应表格）：

```powershell
$slugs = @('teemo-attacking', 'array-partition')   # 其余 slug 按表补齐
foreach ($slug in $slugs) {
    node --import tsx projects/conformance/scripts/run_isolated_judge.ts `
        "projects/problems/$slug" --lang valkyrie-wasm `
        --iterations 1 --warmup 0 `
        --artifact-dir ".cache/$slug-bench-node"
}
```

- 全树矩阵入口（`projects/conformance` 下）：`pnpm matrix:valkyrie`，等价于
  `node --import tsx src/cli/valkyrie-matrix.ts`；单题用 `--id <questionId>`，批量上限用
  `$env:LEETCODE_MATRIX_LIMIT`，报告默认写 `reports/valkyrie-dual-matrix.json`。

### 工具链新鲜度守卫（建议，先不实现）

- 现象：addon 的构建时间 / 内嵌 oak rev 早于 `Cargo.lock` 里 pin 的 oak rev 时，
  `legionBuildProject` 会在语法阶段报 `valkyrie.frontend.parse.syntax`，位置落在 std 源码里，
  极易被误记成「std 前端回归」。R20 / R21 的停点就是这种情况。
- 建议在构建入口（`legion` / `legionBuildProject` 包装层）增加前置自检：
  1) 读取实际加载的 addon 路径与文件构建时间；
  2) 从 addon 元数据 / 构建清单取内嵌 oak commit（取不到时用 addon 文件 mtime 作代理）；
  3) 与仓库 `Cargo.lock` 里的 oak `rev` 比对。
- 不一致时**结构化失败**：错误码 `valkyrie.toolchain.stale`，消息同时给出
  「addon 构建时间 / 内嵌 commit / 期望 rev / 重建命令」，不再继续解析 std 源码。
- 目的：把工具链问题稳定归因为工具链，避免再被记成语言 / 标准库缺口。
  本条只作建议，实现落点在工具链侧，不在 `leetcode.v`。

## 依赖未实现特性的调用点（R28 后：`ArrayList::iter`）

- `ArrayList<T>` 缺回调式遍历成员（**源码不存在，调用点已假设存在**）：
  `ArrayList.v` 的 `imply ArrayList<T>` 没有 `iter`；全库 21 处 `micro iter` 无一落在
  `ArrayList.v` / `Array.v`。四个真实调用点（均为集合族的 `from_list`）：
  - `valkyrie.v/projects/std/source/collection/hashed/HashSet.v:61`
  - `valkyrie.v/projects/std/source/collection/sorted/BTreeSet.v:141`
  - `valkyrie.v/projects/std/source/collection/sorted/SortedSet.v:59`
  - `valkyrie.v/projects/std/source/collection/ordered/OrderedSet.v:64`

  构建报 `no-viable-overload`（`unresolved call "iter"`），属调用点假设了不存在的
  API，不是编译器缺陷；fail-closed 是正确行为。
- 落地判据：`std.collection::ArrayList::iter(self, f: micro(T) -> unit) -> unit`
  在同一 `imply ArrayList<T>` 内以 `loop item in self` 复用现有
  `IntoIterator` / for-in 协议，不另造遍历协议。
- 回收判据：补 `iter` 后，R28 的 **22 题**「`from_list` → `ArrayList.iter`」族可回收编译；
  其中 `BTreeSet` 的 **3 题**仍阻塞在 `insert_non_full` 的 `instance-not-closed`
  （编译器 where 证据闭合问题，归编译器线，不在 std 线处理）。
- 复跑口径：与 addon 重建同窗口、按 `valkyrie-unverified-batches.md` 的 R28 组一次性复跑；
  源码线不单独跑 V。
- 源码线定向验证（2026-11-05）：`HashSet<i32>::from_list(ArrayList<i32>)` 最小用例已越过 HIR
  （`list.iter` 不再 `unresolved`），但在 SMIR 报
  `SMIR003: function reference identity is absent from the Compiler identity table`，
  触发点是 `from_list` 传入 `iter` 的捕获 lambda
  （`micro(value: T) -> unit { result.insert(value) }`）。故 22 题在补 `iter` 后还需编译器侧补齐
  捕获 lambda 的函数引用身份；std 线不再为此复制遍历实现。
- 同时观察到的编译器侧阻塞（均非 std 回退范围，归编译器线）：
  - `where T: std::operator::Comparable` 在**具体实参**调用点仍报 `no-viable-overload`；
    HEAD 的 `sort` / `sort_unstable` 同样复现，与 `BTreeSet::insert_non_full` 的
    `instance-not-closed` 同属 where 证据闭合问题。
  - `HashSet<utf8>` 仍不可编译：`std::hash#466`（`hash_utf8`）引用的宿主合同实例未进依赖导入
    清单（`ItemInstanceId(4)`），与 `utf8: Comparable` 无关；
    `phone-number-prefix` 的还原继续挂起。

## 系统性问题（观察，非编号）

> 本节只记观察，不占 `G` 编号；缺口本身仍按 G1–G27 计。

### 观察 1：trait 实现面按需堆，没有「类型 × 核心 trait」矩阵

G13（`[utf8]` 无 `<`，2026-11-07 已恢复）、G15（无 `Comparable` 合同）、G17（`char` 无 `Hash`）、G24（`MultiSet`
无 `Equal`）四条合起来指向同一件事：每个类型只零散实现了 `{Equal, Comparable, Hash}` 的任意
子集，没有任何机制声明「这个类型实现了哪些核心 trait」。现状：
- `i64`：`Equal` + `Hash` + 裸 `<`（无 `Comparable` 合同）
- `utf8`：`Equal` + `Hash` + `Comparable`（G13，2026-11-07 已补）
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
1) 先补真缺口里有合同骨架的一档（G26 序关系、G16 的有界查询，G13 / G17 已于 2026-11-07 恢复）；
2) 再补其余真缺口 API（G10 / G22 / G25）；
3) 观察档（G8 / G12 / G14 / G15 / G18–G21 / G23 / G24 / G27）随修复窗口顺带处理，不单独排期。
理由：真缺口是「每个调用点都在重复付成本」，优先修；观察档都有零重复的等价 API。

### 观察 4：未验证语料里混入了「按提案签名写的纸面 API」（R9 静态核对发现，已清）

缺口账本里 G11 / G16 / G13 / G12 的「期望签名」是提案，不是现有 API。R4–R8 的解法中有 10 个文件
直接按提案签名写，源码层并不存在这些入口。逐条坐标：

| 调用 | 实际 std | 文件 |
| --- | --- | --- |
| `sorted_by(list, cmp)` ×9 | 已提供（2026-11-07，`sorted_by` 返回新序列） | `accounts-merge`、`custom-sort-string`、`group-anagrams`、`height-checker`、`largest-perimeter-triangle`、`meeting-rooms`、`queue-reconstruction-by-height`、`smallest-string-with-swaps`、`top-k-frequent-words` |
| `BTreeSet.floor` / `ceiling` | 不存在（G16 提案） | `contains-duplicate-iii` |
| `utf8.compare` | 不存在（G13 提案；`Utf8Text` 只有 `equals`） | `accounts-merge`（`compare_text`） |
| `HashSet::new(capacity)` | 已提供（G12，2026-11-06） | `accounts-merge` |

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

- 状态：**已恢复**（2026-11-07 实测）。`-> f64` 现接受浮点字面量与 `i64 → f64` 精确转换；
  两题已补真实解并通过全量用例：`airplane-seat-assignment-probability`（`nthPersonGetsNthSeat`，32/32）、
  `angle-between-hands-of-a-clock`（`angleClock`，72/72），legion wasm 构建 `status=0`。
- 最小复现（历史）：

```v
micro half() -> f64 {
    return 0.5
}
```

- 期望：`-> f64` 直接返回浮点字面量。
- 实际：`return` value type `f64` is incompatible with the function return type `Nominal(ItemId(3))`；
  尝试 `let one: f64 = 1.0`、`1.0 as f64`、`-> std::primitive::f64` 均失败（`浮点常量没有 canonical 形状`）。
- 影响题：`airplane-seat-assignment-probability`（1227）、`angle-between-hands-of-a-clock`（1344）。
- 判定：**已恢复**（2026-11-07）；原判定为真缺口（判据 c），恢复后本案只留档，不再作为失败归族依据。

### G3 wasm JS glue 的 `ArrayList` ABI bridge 缺失（入参 marshal / 返回值 demarshal）

- 状态：**已恢复**（2026-11-04 23:50 addon 重建后实测；glue 已按 `Array` schema 编组）。入参方向残留在
  harness 侧的 `Array<I64>` 元素未规整缺陷已修，见「验证窗口实测」节；不再算语言缺口。
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
- 影响（历史）：本批 36 题判题 0 通过（25 marshal + 11 demarshal）。**2026-11-04 23:50 addon
  重建后该 bridge 已具备**：payload 直接是 `Array` / `Array<I64>`，M-2026-11-03 的 37 题里 24 题
  端到端通过（`spiral-matrix-ii` 20/20、`sequential-digits` 88/88、
  `moving-stones-until-consecutive` 130/130），R20 25 题全通过。
- R21 扩展面（`Option<ArrayList<i64>>` 返回，空链表 → `null`）：`merge-two-sorted-lists`、
  `remove-duplicates-from-sorted-list`、`remove-linked-list-elements`、`reverse-linked-list`。
  复跑结果：这 4 题**未走到返回值边界**，先卡在 `<fn value>` 不在作用域（链表节点字段读取），
  归「编译失败」而非 G3；`Option` 负载的 `null` 语义待这 4 题编译通过后再验证，不另开编号。
- 判定：**已恢复**（2026-11-04 23:50 addon 重建时由 glue 侧补齐 `Array` 编组 / 解组）。
  原判定为真缺口（判据 c），恢复后本案只留档，不再作为失败归族依据。

### G4 std `Utf8Builder.append(char)` 在 std 模块自编译时无法实例化（疑似失效，待复验）

- 状态：**已复验为非阻塞**（2026-11-07 实测）：使用 `Utf8Builder` 的
  `repeated-dna-sequences`、`largest-time-for-given-digits` 均 legion wasm 构建 `status=0`；
  `append` / `infix +` / `bit_shift_right` 一条错误都没有，G4 不再作为失败归族依据。
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

- 状态：已恢复（2026-11-07 实测，未登记批次 1 题）。`baseball-game` legion wasm 构建 `status=0`，
  3 条用例经 `callExport("calPoints", operations)` 真跑 PASS（9 / 210 / -37）。
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

- 状态：已恢复（2026-11-07 实测，canonical 未构建 214 题扫块 1 题）。
  `sum-of-digits-of-string-after-convert` legion wasm 构建 `status=0`，
  `callExport("getLucky", s, k)` 真跑 PASS（`iiii`/1→36、`leetcode`/2→6、`zbax`/2→8）。
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

- 状态：已恢复（2026-11-07 实测，canonical 未构建 214 题扫块 1 题）。
  `isomorphic-strings` legion wasm 构建 `status=0`，
  `callExport("isIsomorphic", s, t)` 3 条用例真跑 PASS（egg/add、foo/bar、paper/title）。
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

- 状态：**已提供**（2026-11-07，`valkyrie.v` 提交 `57e784a`，隔离探针 2/2 PASS）。
  定级仍为**观察**（判据 a：一行转发两次 `add_edge`，不随调用点膨胀），不占真缺口名额。
- 现有签名（源码为准，返回 `unit`，与 `GraphMatrix` / `WeightedGraph` 同名入口同形）：

```v
# std/source/collection/graph/DirectedGraph.v（与 add_edge 同形）
micro add_undirected_edge(mut self, a: N, b: N): unit
    where N: Equal & Hash
```

- 影响题（4，已清理 2026-11-07）：`is-graph-bipartite`（785）、`maximal-network-rank`（1615）、
  `possible-bipartition`（886）、`find-center-of-star-graph`（1791）均由「同一关系双写 `add_edge`」
  改为单次 `add_undirected_edge`（`leetcode.v` 提交 `8831ec08b`）。
- 验证路径：题仓 `legions.von` 的 workspace 成员写死主工作树 `../valkyrie.v/projects/std`，
  主树 std 尚未含 `57e784a`；因此四题副本放在 `.wt-std/.cache/g8-consumers/<slug>`，以 `.wt-std`
  为调用目录执行 `legion build`（workspace 解析到 `.wt-std` 的 std），再用 `VALKYRIE_PIN_*`
  注入产物、从 `conformance` 目录跑 canonical `metadata.tests`。主工作树未改。
- 真跑证据：`maximal-network-rank` 40/40 PASS；`possible-bipartition` 76/76 PASS；
  `is-graph-bipartite` 15 pass，首个失败 `tests[15]`（期望宿主异常文本，F6 类语料）；
  `find-center-of-star-graph` 18 pass，首个失败 `tests[18]`（50 环输入期望 2，非星形约束）。
  两处失败均在上游 `HEAD` 解法上复现，与本次消费者清理无关。
- `find-center-of-star-graph` 原 `metadata.invoke` 缺 `valkyrie` 键，本轮补 `"valkyrie": "findCenter"`
  （与相邻图题「裸 camelCase 函数名」口径一致），否则 harness 以 `ValkyrieEntryContractError` 拒跑。
- 不对称点：`std.math.graph_theory.GraphMatrix.add_undirected_edge`（`matrix.v` L49-L52）、
  `WeightedGraph.add_undirected_edge`（`weighted.v` L124-L129）均存在（类型名是 `GraphMatrix`，
  此前记为 `MatrixGraph` 属笔误）；`DirectedGraph` 已补同名入口（`57e784a`）。
  两处「无向边」实现均只是两次 `add_edge` 转发，只命名了约定，不建立合同。
- 判定：**观察**（判据 a：双写两条 `add_edge`，一行，不随调用点膨胀）。
- 修复初判：**加 API**（一行转发两次 `add_edge`）。更根本的是建模问题，见本节末尾「建模提示」。

### G9 `std.math.graph_theory` 缺二分图判定（二色着色）

- 状态：**已恢复**（2026-11-07 实测）。`std/source/math/graph_theory/unweighted.v`
  已新增 `bipartition`，两题消费者已改用 std 入口（`valkyrie.v` 提交 `59a4acad`）。
- 现有签名（已存在，源码为准）：

```v
# std/source/math/graph_theory/unweighted.v（与 weak_components 同形）
micro bipartition<N>(graph: std.collection.DirectedGraph<N>) -> Option<HashMap<N, i64>>
    where N: Equal & Hash
```

  `Some(coloring)`（每点 0/1 着色）表示二分；`None` 表示存在冲突边。有向边按无向处理，
  与 `weak_components` 同口径；分量按节点插入序、分量内按 BFS 发现序，结果确定。
- 影响题（2）：`is-graph-bipartite`（785）、`possible-bipartition`（886），两题已删除题内
  手写 BFS 着色，改为「装图 → `bipartition(...).is_some()`」。
- 验证证据：隔离 std 探针 **6/6**（`--target ovm`，偶环正例 / 奇环反例 / 单向边 / 空图）；
  两题 wasm 构建通过，`metadata.tests` 真跑 **179/181**。余 2 条
  （`is-graph-bipartite` tests[15] / tests[35]）期望值是宿主异常文本
  `Error: list index out of range`，属 F6 语料缺陷，按裁决暂缓处理，不计入 G9 残留。
- 原判断（2026-11-04）：真缺口（模块内空洞：std 的 graph 模块已提供 `cycle` /
  `topological_sort` / 连通分量等**同类**图算法，唯独缺二分图判定）。

### G10 `DisjointSet<T>` 缺分量规模 / 成员聚合

- 状态：**已提供（2026-11-06 源码复核）**。`std/source/collection/DisjointSet.v` 现有
  `group_members(mut self, root: T): ArrayList<T>` 与 `group_sizes(mut self, root: T) -> usize`
  （按根查询，非整表聚合）。全部 12 项「find_root + 自建 HashMap 累加」的调用点可以改成逐分量查询。
- 残余缺口：没有一次调用返回 `HashMap<T, usize>` 的整表聚合入口；本批调用点均只关心
  「某节点的分量规模」，不阻断。
- 原判断（2026-11-04，现已过时）：该组能力当时未提供。

- 影响题（3）：`count-unreachable-pairs-of-nodes-in-an-undirected-graph`（2316）、
  `count-the-number-of-complete-components`（2685）、`largest-component-size-by-common-factor`（952）。
  三题都出现「`find_root` + `HashMap<i64, i64>` 累加」的同一段手写聚合。
- 不对称点：`group_count()` 已提供、`length()` 是元素总数，二者都拿不到单个分量的规模。
- 判定：**真缺口**（判据 b：3 处 × 重写 DSU 内部聚合，缺失被摊派给每个调用点）。
- 修复初判：**加 API**（`group_sizes` 一次遍历即可，且与路径压缩共用）。

### G11 `std.collection.sort` 缺返回新序列的 `sorted_by`

- 状态：**已恢复（2026-11-07 实测）**。`std/source/collection/sort.v` 现有
  `sorted_by<T>(items: ArrayList<T>, cmp: micro(T, T) -> i32): ArrayList<T>`（`3e02e7d`，返回新序列，不再要求调用方自建副本），
  另有公开 `merge_sort<T>(mut list: ArrayList<T>, cmp)` / `quick_sort<T>(mut list: ArrayList<T>, cmp)` 与
  `sort<T>(mut values: [T])`（固定数组按自然序就地排序）。
  - 2026-11-07 复跑：8 题合计 **767/767** 用例 PASS（2542 114、1353 93、1337 80、2099 99、1086 79、954 112、870 99、1471 91）。
  - 2026-11-07 消费者清理：删除 4 处「副本 + 就地排序」脚手架（`meeting-rooms` 101/101、
    `remove-covered-intervals` 111/111、`minimum-moves-to-equal-array-elements-ii` 79/79、
    `merge-similar-items` 100/100，改前改后同口径）。
- 残余缺口（2026-11-06 登记，**待排期，本轮不纳入**）：`[T]` **没有带比较器的排序入口**。
  `sort.v` 现有比较器入口全部收 `ArrayList`（`merge_sort` `:106`、`quick_sort` `:231`、`sorted_by` `:143`）；
  `[T]` 侧只有自然序 `sort`（`:116`），没有 `merge_sort` / `quick_sort` / `sorted_by` 的 `[T]` 重载。
  按自定义比较器排固定数组仍需先物化成 `ArrayList`。`Array<T>` 同样为 0 个排序入口。
  本项是独立 API 增补，不并入 `sorted_by`（`ArrayList` 版）已交付部分，留待排期。
- 原判断（2026-11-04，现已过时）：`sorted_by` 与数组排序入口都不存在。

- 影响题（18）：`groups-of-special-equivalent-strings`（893，even/odd 两个副本）、
  `reorder-data-in-log-files`（937，整表副本）、`height-checker`（1051，批次 R4 曾直接按 `[提案]`
  的 `sorted_by(Array<T>)` 写）、`largest-perimeter-triangle`（976，批次 R6 同上）；
  另有 7 题（`accounts-merge` / `custom-sort-string` / `group-anagrams` / `meeting-rooms` /
  `queue-reconstruction-by-height` / `smallest-string-with-swaps` / `top-k-frequent-words` 中的
  7 处调用）在 2026-11-04 更正提交清理，见观察 4。第 10 批又有 7 题走「副本 + `merge_sort`」：
  `remove-covered-intervals`（1288）、`sort-even-and-odd-indices-independently`（2164）、
  `sort-array-by-increasing-frequency`（1636）、`relative-ranks`（506）、`sort-the-people`（2418）、
  `merge-similar-items`（2363）、`minimum-moves-to-equal-array-elements-ii`（462）。
  R22 追加 2 处：`array-of-doubled-pairs`（954，`sorted_by(arr, cmp_abs)`）、
  `advantage-shuffle`（870，`sorted_by(order, 比较 nums2 的内联比较器)`）。
- 现状入口（2026-11-05 复核时的状态，**现已过时**：`sorted_by` 已由 `3e02e7d` 提供、公开
  `merge_sort` 已由 `a01804a` 提供，比较器排序可直接调用公共入口）。
- 不对称点：`ArrayList` 有 **7 个**排序函数（`quick_sort` / `quick_sort_range` / `partition` / `swap` /
  `merge_sort` / `merge_sort_range` / `merge`；此前记为 6 个，漏了 `merge`），`Array<T>` 为 **0 个**
  排序入口；此前没有任何一个返回新序列（`sorted_by` 已于 `3e02e7d` 补齐）。另：std 测试目录下无 `quick_sort` / `merge_sort` 用例，
  「就地改容器」目前只有源码证据（`class` 是引用类型，`swap` 经 `list.set` 写穿）。
- 判定：**已恢复**（2026-11-07）。原判真缺口（判据 b：18 处 × 副本 + `merge_sort`）；
  `sorted_by` 落地后调用点改用返回新序列入口，其中 8 题 767/767 真跑通过。
- 修复落地：**加 API**（`sorted_by`，在副本上调 `merge_sort` 的薄封装）。

### G12 `HashSet::new()` 无容量参数

- 状态：**已提供（2026-11-06 构建复核）**。`std/source/collection/hashed/HashSet.v` 在**保留既有
  `new()`** 的同时新增 `new(capacity: usize): Self`（转发 `SwissSet::new(capacity)`）。
  wasm 正例三种构造共存：旧 `new()`、`new(64)`、`new(0)`，insert(2) 重复插入后 `length() == 1`、
  `contains` 均通过（build 0 / run 0）；反例 `HashSet::new("text")` 结构化报
  5 candidate(s) / none matches（build 1）。此前「加容量构造连旧 `new()` 一起崩」是旧 addon 的
  arity 缺陷（G30），已由编译器 `1bee7bff` 修复。
- 现签名（2026-11-06 已提供）：

```v
# std/source/collection/hashed/HashSet.v
micro new(): Self                       # 既有，固定 SwissSet::new(16)
micro new(capacity: usize): Self        # 新增，直传容量
# with_capacity 仍未提供（本批无调用点）
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

- 状态：**已恢复（2026-11-07 实测）**。`std/source/text/Utf8Text.v` 的
  `compare(self, other: Self): std::operator::Ordering` 按 UTF-8 字节序比较（与码位序一致），
  消费者通过 `std.collection.natural_order` 转成 `i32` 比较器。5 题全部构建通过并真跑：
  `accounts-merge` 85/85、`reorder-data-in-log-files` 53/53、`top-k-frequent-words` 92/92、
  `find-smallest-letter-greater-than-target` 93/93、`phone-number-prefix` 97/97（合计 420/420）。
  反例：比较器第二参数改成 `i64` 后 `sorted_by` 报
  `error[valkyrie.hir.unresolved_call]` 的结构化失败，不静默接受。
- 原状态（2026-11-06 源码复核）：`compare` 已提供，但 5 处消费者仍手写逐字节比较或绕开排序。
- 原判断（2026-11-04，现已过时）：`utf8` 只有 `equals` / `not_equals`。

- 影响题（5）：`reorder-data-in-log-files`（937，题内 `compare_text`）、
  `find-smallest-letter-greater-than-target`（744，上界二分对 `utf8` 直接写 `<=`）、
  `accounts-merge`（721，题内 `compare_text`）、`top-k-frequent-words`（692，题内 `compare_text`）、
  `phone-number-prefix`（3491，R29：以 `HashSet<utf8>` 枚举每个号码的真前缀绕开排序与比较，
  见「待还原组：`phone-number-prefix` 的 utf8 序面」）。
  `accounts-merge` 与 `top-k-frequent-words` 两题 R4–R8 曾按 `[提案]` 写 `left.compare(right)`，
  2026-11-04 更正为 `byte_length` / `byte_at` 逐字节比较。
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

- 状态：**已提供（2026-11-06 源码复核）**。`std/source/text/Utf8Text.v` 现有
  `micro split_once(self, separator: utf8) -> Option<SplitParts>`，`SplitParts` 承载 head / tail。
- 原判断（2026-11-04，现已过时）：`split_once` 不存在，只能 `index_of` + `slice` 组合。

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

- 状态：**已提供（2026-11-06 源码复核）**。`BTreeSet.v` 现有 `floor(self, value: T) -> Option<T>`
  与 `ceiling(self, value: T) -> Option<T>`；`BTreeMap.v` 现有 `floor_key` / `ceiling_key`
  与 `nth_key(rank: usize): Option<K>`。影响题的界查询与按秩查询均有直接入口。
- 原判断（2026-11-04，现已过时）：容器只有「插入 / 存在性 / 删除 / 全量物化」，没有界查询。
- 现状签名（2026-11-06 已提供）：

```v
# std/source/collection/sorted/BTreeSet.v、BTreeMap.v
# 约束随 G15 收敛为 T: Equal & Comparable
micro floor(self, value: T) -> Option<T>
micro ceiling(self, value: T) -> Option<T>
micro first(self) -> Option<T>
micro last(self) -> Option<T>
micro range(self, low: T, high: T) -> ArrayList<T>
micro nth_key(self, rank: usize) -> Option<K>    # BTreeMap，按秩取键（需节点子树规模，当前节点无该字段）
micro ceiling_key(self, value: K) -> Option<K>   # BTreeMap，最小 >= value 的键（下界查询）
micro floor_key(self, value: K) -> Option<K>     # BTreeMap，最大 <= value 的键（上界查询）
```

- 影响题（3，`nth` 销案后）：`contains-duplicate-iii`（220，`solvers/valkyrie/solution.v:33-42`
  为 `window.to_list()` 快照 + 手写 `lower_bound`，语义是前驱/后继的值查找，即 `floor` / `ceiling`）、
  `find-right-interval`（436，`:26` 调用 `starts.ceiling_key(end)`，语义是「最小 >= 终点的键」）、
  `sliding-window-median`（480，`:27/30/31` 调用 `counts.nth_key(size / 2)`，语义是**按秩取第 k 小**，
  计数表必须保留重复值，`BTreeSet` 的去重语义不可替代）。
- 不属 `nth` 影响面（全量物化即可，转观察）：`k-diff-pairs-in-an-array`（532，`:22` 起
  `distinct.to_list()` 后双指针扫描，实际无 `nth` 调用）、`rank-transform-of-an-array`
  （1331，`:15` 起 `distinct.to_list()` 后用 `⁅index⁆` 建名次表；这里是 `ArrayList` 的
  `Cardinal`，不是有序容器的按秩查询）。
- 核对补充（2026-11-05 代码事实，订正批次 R9 / R10 的 `nth` 表述）：
  - `BTreeSet` / `BTreeMap` **都没有 `imply Cardinal`**（全 std 只有 `ArrayList` / `Array` /
    `ArrayView` / `Utf8Text` / `Utf16Text` 实现），`⁅ ⁆` 对有序容器不可用。
  - 迭代器 `nth` **已存在**：`std/source/iterator/iterator_terminal.v:99`，
    `micro nth<I, T>(self: I, index: usize): Option<T> where I: Iterator<Item = T>`，线性
    `has_next` / `next` 扫描，不是 O(log n) 的按秩查询。
  - `BTreeSet` / `BTreeMap` **未实现 `IntoIterator`**（全 std 只有 `ArrayList` / `Array` /
    `AsciiText` / `Utf8Text` / `Utf16Text` 实现），`into_iterator().nth(k)` 无法直接用于有序容器，
    只能 `to_list().into_iterator().nth(k)`，先付 O(n) 物化。
  - `BTreeSetNode`（`BTreeSet.v:3-8`）与 `BTreeNode`（`BTreeMap.v:8-14`）只有
    `keys` / `children` / `next`，**没有子树规模字段**，当前结构做不了 O(log n) 的 rank。
  - 全库 `solvers/valkyrie/**` **0 处 `.nth(`**，唯一真按秩调用是 480 的 `nth_key`。
  - `minimum-moves-to-equal-array-elements-ii`（462）要中位数但必须保留重复值，`BTreeSet` 去重
    语义不适用，故不计入。
- 不对称点：`HashMap` 有 `keys` / `values`，`BTreeSet` 有 `to_list`，但有序容器只能被全量物化后
  线性扫描；`floor` / `ceiling` / `first` / `last` / `range` 全部缺失，「有序」只剩存储形态。
  `Cardinal` 是另一条独立路线（位置语义），与界查询不重叠；且需先给节点补子树规模，不能替代
  `nth_key`（`BTreeMap` 的 `Index` 语义是键，不是秩）。
- 判定：**真缺口**（判据 b：3 处 × O(k) 物化 + 手写二分，其中 1 处为按秩查询）。
  `nth` 作为「`BTreeSet` 取第 k 个」的 API **销案**：迭代器 `nth` 已存在，容器侧 `to_list()⁅k⁆`
  即可；`nth_key` 保留，但表述改为「按秩（order-statistic）查询」，实现前提是节点补子树规模。
  `floor` / `ceiling` / `range` 是值查找语义，与 `Cardinal` 不重叠，独立保留。
- 修复初判：**加 API**（底层节点已按序，查询不需新模型）。**实现前提是 G15 的 `Comparable`
  先落地，否则等于在无约束类型上裸调 `<`，和 `BTreeSet<T: Equal>` 那个不健全容器是同一个病。**

### G17 `char` 缺 `Hash` impl

- 状态：**已恢复（2026-11-07 实测）**。`std/source/collection/hashed/HashPrimitives.v:53` 的
  `imply char: Hash`（`micro hash(self) -> usize { return self as usize }`）已随 addon 生效。
  2026-11-07 复跑 `HashMap<char, i64>` / `DisjointSet<char>` 消费者 8 题，合计 **778/778** 用例 PASS：
  `custom-sort-string` 117、`find-words-that-can-be-formed-by-characters` 134、
  `longest-repeating-character-replacement` 105、
  `longest-substring-with-at-most-k-distinct-characters` 118、`word-subsets` 69、
  `permutation-in-string` 95、`sort-characters-by-frequency` 54、`task-scheduler` 86。
  同批 3 题仍红，均与 `char: Hash` 无关：`shortest-completing-word` 1/85（首败
  `tests[1]: expected null, got "these"`，语义）、`satisfiability-of-equality-equations` 0/83
  （首败 `tests[0]: expected false, got true`，语义）、`find-resultant-array-after-removing-anagrams`
  构建失败 `unresolved call infix ==`（`solution.v:38`，`MultiSet<char>` 无 `equals`，G24）。
- 原状态（R22 / R24 记账时的静态核对）：未提供（**std 缺口**；2026-11-04 核对
  `std/source/text/char.v` 与 `std/source/collection/hashed/hash.v` 时尚未有实现）
- 定性：**该有但当时没有**。`char` 只定义了 `==` / `!=`，没有 `Hash`，于是不能作
  `HashMap` / `HashSet` / `DisjointSet` 的键；同样表示一个小写字母，用 `utf8` 可以入表，
  用 `char` 不行。
- 期望签名（已按此落地，实现位置在 `HashPrimitives.v`）：

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
  R22 追加 2 处：`longest-repeating-character-replacement`（424）、
  `longest-substring-with-at-most-k-distinct-characters`（340），均为 `HashMap<char, i64>`。
- 不对称点：`utf8`、`i8`–`u64`、`f32` / `f64` 都有 `Hash`；`char` 有 `Ordinal`（可转 `u32`）
  却没有派生 `Hash`，因此「码位可排序」与「码位可哈希」只实现了一半。
- 判定：**已恢复**（2026-11-07）。原判真缺口（判据 b：7 处 × 每次调用点换键型 `utf8` / `as u32`）；
  `char: Hash` 落地后调用点直接以 `char` 为键，8 题 778/778 真跑通过。
- 修复落地：**加 API**（补一个 impl，语义与 `Ordinal` 一致）。
- 本批验证情况（R25，2026-11-04）：`Hash` 已补（`HashPrimitives.v:53`），上面 9 处调用点
  不必再换键型；本批 `task-scheduler`（621）的 `HashMap<char, i64>` 与 R22 的 424 / 340
  一并转入「阻塞解除」复跑组，只等 addon 重建。`char` 的 `Comparable` 仍缺，归 G15 / G26。
- 与 G15 的交叉引用：`char` 同时缺 `Comparable`。**这两条不是孤立缺 impl，而是同一个 primitive 的
  类型能力面没设计完**——`Ordinal` 视图 / `Comparable` / `Hash` 三条腿一条都没在 `char` 上落地，
  只剩 `==` / `!=`，于是它既进不了有序容器也进不了哈希容器。

### G18 `utf8` 缺 `split_whitespace`

- 状态：**已提供（2026-11-06 源码复核）**。`std/source/text/Utf8Text.v` 现有
  `micro split_whitespace(self) -> [utf8]`，按 Unicode 空白码位切分。
- 原判断（2026-11-04，现已过时）：只有精确分隔符 `split`，按词切分需题内状态机。

- 影响题（2）：`reverse-words-in-a-string`（151，多次空格与前导/尾随空格的切词）、
  `maximum-number-of-words-found-in-sentences`（2114，逐句求词数）。
- 不对称点：`split` / `slice` / `try_slice` / `index_of` 都有，`split` 却只覆盖「固定分隔符 +
  保留空段」一种语义；空白类与空段折叠没有入口。
- 判定：**观察**（判据 a：`split` 加空段过滤，2 处）。
- 修复初判：**加 API**（内部复用 `split` 后过滤空段即可，不引入新类型）。

### G19 `ArrayView` 缺区间窗口构造

- 状态：**已提供（2026-11-06 源码复核）**。`std/source/collection/array_view.v:24` 现有
  `array_view<T>(source: [T], offset: usize, count: usize) -> ArrayView<T>`（越界直接 panic），
  另有 `ArrayList::view(self): ArrayView<T>` 从表头建窗。`_offset` 可非零，区间语义可表达。
- 原判断（2026-11-04，现已过时）：唯一入口是 `array_view(source)` 全窗，`_offset` 恒为 0。

- 影响题（1）：`rotate-array`（189，三次反转各自需要 `[0, shift)` / `[shift, n)` 子窗口并写穿）。
- 不对称点：读侧 `length` / `is_empty` / `Cardinal` 都在，写侧 `⁅ ⁆=` 也在，唯独
  「窗口从哪开始、多长」没有入口。
- 判定：**观察**（判据 a：下标循环替一下，1 处）。
- 修复初判：**加 API**。模型不是缺的：`ArrayView` 已经就是这个模型，缺的是把非零 `offset`
  造出来的构造器，因此**不归入表达力缺口档**。

### G20 数值归约只有手写 fold（整数域缺席）

- 状态：**部分已提供（2026-11-06 构建复核）**。
  `std/source/iterator/iterator_terminal.v` 已提供并验证通过
  `std::iterator::max<I, T>(iter)` / `min<I, T>(iter)`（`I: Iterator<Item = T>`，`T: Comparable`，
  空迭代器返回 `None`）：wasm 正例 build 0 / run 0，空序列与 3/9/4 序列断言均通过。
  `i64` 重载**已提供并验证通过**：`std/source/math/integer.v`（同 `std.math` 命名空间）新增
  `abs` / `max` / `min` / `clamp` 的 `i64` 重载。正例 `abs(-5)==5`、`max(3,9)==9`、`min(3,9)==3`、
  `clamp(9,3,7)==7`、`clamp(-3,0,7)==0`，wasm build 0 / run 0；反例 `max("left","right")`
  结构化报 2 candidate(s) / none matches（build 1）。
  落码位置说明：把 `i64` 重载与 `f64` 体放在同一文件时，同文件函数组分析会互相污染
  （`f64` 体报 `infix <` / `infix >` 全候选不匹配，坐标 `basic.v:6/7/14/22/64/68`）；
  拆到 `integer.v` 后同命名空间可正常解析。
- 残余缺口：`sum` / `product` 仍未提供（需 `Additive` / `Multiplicative` 合同，合同级，留待 01）。
- 现签名（2026-11-06 已提供）：

```v
# std/source/iterator/iterator_terminal.v
micro max<I, T>(iter: I) -> Option<T> where I: Iterator<Item = T>, T: Comparable
micro min<I, T>(iter: I) -> Option<T> where I: Iterator<Item = T>, T: Comparable
```

- 影响题（1）：`kids-with-the-greatest-number-of-candies`（1431，糖果最大值）。
- 2026-11-06 复跑：该题 V 解**仍不编译**，报 `unresolved call '<fn value>.fold'`（`solution.v:9`）
  与 `unresolved call '<fn value>.map'`、`collect_array_list`（`solution.v:16`），接收者为数组
  `into_iterator()` 产出的 `Nominal<i64>`；在 **pristine HEAD std** 上同样复现，与本轮改动无关。
  同一迭代器改用自由函数形式 `std::iterator::max(iter)` 可通过，说明调用点用的是方法式
  `iter.fold(...)`，需改成 `std::iterator::fold(iter, ...)` 的自由函数形式。
- 不对称点：`f64` 有 `abs` / `max` / `min`，整数没有；迭代器有能表达一切的 `fold`，
  却没有最常用的 `max`。前者是重载缺失，后者是终端缺失，根因同一：数值归约没有按
  「整数 / 浮点」分行。
- 判定：**观察**（判据 a：一行手写 fold，1 处）。
- 修复初判：**加 API**。`max` / `min` 的泛型约束依赖 G15 的 `Comparable`；在此之前只能
  先定 `i64` 重载。

### G21 序列反向没有一等入口

- 状态：**部分已提供（2026-11-06 构建复核）**。
  `ArrayList::reverse(mut self): unit` 已提供并验证通过（空表 / 单元素 / 4 元素 / 连续两次翻面，
  wasm build 0 / run 0）。逆序适配入口以**自由函数** `std::iterator::rev<I, T>(source)` 提供
  （`ReverseIterator` 结构 + `Iterator` 实现），同样验证通过（6/5/4→None、空→None，build 0 / run 0）；
  它不是 `Iterator` 的 trait 默认成员——默认成员里用关联类型 `Item` 构造泛型容器
  （`ArrayList<Item>`）目前过不了类型检查，坐标见本轮报告。
  `Utf8Builder::prepend` 仍缺（本批无调用点）。
- 现签名（2026-11-06 已提供）：

```v
# std/source/collection/ArrayList.v
micro reverse(mut self): unit

# std/source/iterator/ReverseIterator.v
micro rev<I, T>(source: I) -> ReverseIterator<T> where I: Iterator<Item = T>

# std/source/text/Utf8Builder.v（仍缺）
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

- 状态：**部分已提供（2026-11-06 源码复核）**。`i8` / `i16` / `i32` / `i64` / `u8` / `u16` / `u32` / `u64`
  八个定宽原始类型均已提供 `count_ones` / `leading_zeros` / `trailing_zeros`（返回 `u32`），
  影响题的位元计数与位段扫描可直接调用。
- 残余缺口：`i128` / `u128` 仍无这三个查询（`std/source/primitive/i128.v`、`u128.v` 为 0 处）。
- 原判断（2026-11-04，现已过时）：位运算算子齐全但位元查询为零。

- 影响题（5，均已写、均以手写循环表达）：`number-of-1-bits`（191，模 2 循环计 1）、
  `hamming-distance`（461，异或后逐位计数）、`minimum-bit-flips-to-convert-number`（2220，
  异或后计 1）、`reverse-bits`（190，逐位搬运）、`binary-gap`（868，扫描连续 0 段）。
- 消费者清理（2026-11-07，`leetcode.v` 提交 `638bda250`，`.wt-std` 构建 + pin 产物真跑）：
  `number-of-1-bits` 139/139 PASS、`hamming-distance` 88/88 PASS、
  `minimum-bit-flips-to-convert-number` 85/85 PASS、`binary-gap` 61/61 PASS。
  `binary-gap` 的语料期望是「两个 1 的位置差」（连续 1 记 1，非 0），改写以
  `count_ones` + `trailing_zeros` 保留该语义，基线解同口径 61/61 A/B 一致。
  `reverse-bits`（190）未清理：位序反转没有对应入口，`count_ones` / `trailing_zeros` 无法表达，
  仍是手写逐位搬运；残余 API 需求与 `i128` / `u128` 查询并列。
- 不对称点：位运算算子齐全但位元查询为零；`BitSet` 在容器层有 `get` / `set`，标量层却没有
  等价的「数 1 的个数」。这与 G20 同族（标量数值能力面只做了算子、没做归约），但作用对象是
  位而不是数值大小，故单列。
- 判定：**真缺口**（判据 b：5 处 × 重复位运算）。
- 修复初判：**加 API**（逐 primitive 一个 host contract 或纯循环实现）。
- 表达力档位：**不属于表达力缺口**——有近似物（手写循环）。

### G23 `std.math` 缺整数 gcd / lcm（数论面整体缺席）

- 状态：**已提供（2026-11-06 源码复核）**。`std/source/math/number_theory.v` 现有
  `micro gcd(a: i64, b: i64) -> i64` 与 `micro lcm(a: i64, b: i64) -> i64`。
- 残余缺口：`is_prime` / `factorize` 仍未提供（本批无调用点）。
- 原判断（2026-11-04，现已过时）：`std.math` 没有数论模块，`gcd` / `lcm` 都不存在。

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

- 状态：**已提供（2026-11-06 源码复核）**。`std/source/collection/BitSet.v` 现有
  `count(self): usize`（置位数）、`bit_length(self): usize`、`length(self): usize`、
  `clone(self): Self`、`iter(self) -> BitSetIterator` 与 `into_iterator(self)`，
  以及原有的 `new` / `with_capacity` / `set` / `clear_bit` / `get` / `toggle` /
  `intersect` / `union` / `difference` / `xor` / `is_empty` / `clear_all`。
- 残余缺口：没有 `[u64]` / `[bool]` 互转，也没有 `Equal` / `Hash`；本批调用点不依赖。
- 原判断（2026-11-04，现已过时）：只有按已知下标 `get` / `set`，无法计基数、无法枚举置位。
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
  - R22 追加 10 处 `sort(list)` 单参调用点（见「依赖未实现特性的调用点（R22）」），
    写法与 C4 定稿签名对齐，同样依赖该入口落地；`i64` 的 `Comparable` 实现已在
    `std/source/operator/comparable_primitives.v`。

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

### G28 `BinaryHeap` 的 `where T: Comparable` 义务传播到每个调用点

- 状态：**部分已提供（2026-11-06 源码复核）**。`std/source/collection/BinaryHeap.v` 现有
  `new_by(cmp: micro(T, T) -> i32): Self`，比较器随实例走，不再要求 `T: Comparable`；
  另有 `max()` 与 `new()` 的高阶堆构造。
- 残余缺口：`new()` 与 `max()` 仍带 `where T: std::operator::Comparable`（`:17`、`:38`），
  即「默认自然序」路径仍把义务落到类型上；按自定义序必须显式走 `new_by`。
- 原判断（2026-11-05，现已部分过时）：没有任何把比较器绑进构造的入口。
- 现状签名（2026-11-06）：
  - `micro new_by(cmp: micro(T, T) -> i32): Self`（已提供，比较器随实例走，义务不落到 `T`）
  - `micro max(): Self`（已提供，最大序实例，仍带 `where T: Comparable`）
- 真实调用点（13 处，2026-11-05 扫描 `projects/problems/**/solution.v`）：
  - 裸 `i64`、义务由 `i64: Comparable` 消解，但仍无法逐实例换序（5 处）：
    `find-k-pairs-with-smallest-sums/solution.v:37`、
    `make-the-prefix-sum-non-negative/solution.v:8`、
    `minimum-operations-to-exceed-threshold-value-ii/solution.v:8`、
    `rearrange-string-k-distance-apart/solution.v:28`、
    `take-gifts-from-the-richest-pile/solution.v:23`。
  - 自定义元素、义务必须由题内 `imply Fruit: Comparable` 补齐（1 处）：
    `maximum-number-of-eaten-apples/solution.v:20`（`BinaryHeap<Fruit>`）。
  - 已按提案入口写、源码不存在（7 处，静态纸面调用，需与观察 4 同口径复核）：
    `furthest-building-you-can-reach/solution.v:10`、
    `maximal-score-after-applying-k-operations/solution.v:8`、
    `minimum-operations-to-halve-array-sum/solution.v:9`、
    `remove-stones-to-minimize-the-total/solution.v:10`、
    `total-cost-to-hire-k-workers/solution.v:10`、
    `task-scheduler/solution.v:18`（以上 `new_by`）、
    `last-stone-weight/solution.v:9`（`max`）。
- 判定：**真缺口**（判据 c：绕路改变堆的语义归属——要么给元素类型挂全局序，要么把比较键
  编码进 `i64`，两种都改变题解的数据结构）。
- 与 G26 的关系：G26 解决「类型给不出三态序」，本条解决「堆入口不接受逐实例序」。
  只补 G26 不定本条：`i64` 已有 `Comparable`，但 `BinaryHeap<i64>` 仍无法指定最大序。
- 修复初判：**加 API**（`new_by` 保存比较器，`push` / `pop` 的义务改挂到构造参数）。

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
- **`BTreeSet` 取第 k 个（G16 复核后销案）**：`k-diff-pairs-in-an-array`（532）只需有序遍历，
  `to_list()` 后下标访问即可；`BTreeSet` / `BTreeMap` 未实现 `Cardinal` 与 `IntoIterator`，
  迭代器 `nth` 与 `to_list()⁅k⁆` 都要先付 O(n) 物化。真按秩需求只剩 480 的 `nth_key`，见 G16。
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
- **`BTreeSet.nth` 销案（2026-11-05 复核）**：`rank-transform-of-an-array`（1331）要「值 → 名次」，
  `to_list()` + 一次线性建表已是 O(n log n)，`nth` 帮不上；`minimum-moves-to-equal-array-elements-ii`
  （462）要中位数，但 `BTreeSet` 会去重、破坏重复值语义，必须保留多重集。`nth` 由迭代器
  `nth`（`iterator_terminal.v:99`）与 `to_list()⁅k⁆` 覆盖，影响面订正为 3（220 / 436 / 480），
  其中 480 的 `nth_key` 是真按秩需求，保留在 G16。
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

- 逐条坐标与证据在 `valkyrie-corpus-precision-defects.json`（本目录），本表是 2026-11-04 扫描基线；
  R29 清洗后的增量见下（S 类 25/1 → 27/3，quarantine 180/99/25 → 182/99/26）。

| 类 | 基线行 | 基线题 | R29 后行 | R29 后题 |
| --- | --- | --- | --- | --- |
| A | 127 | 21 | 127 | 21 |
| B | 24 | 8 | 24 | 8 |
| C | 4 | 3 | 4 | 3 |
| S | 25 | 1 | 27 | 3 |
| D | 17365 | 171 | 17365 | 171 |

- R29 增量：`minimum-array-end`（`tests[28].expected`，精确但语义错）与
  `minimum-addition-to-make-integer-beautiful`（`tests[20].expected`，`787` 应为 `788`）两条 class S 行。
- `maximum-number-that-makes-result-of-bitwise-and-zero` 删除 `tests[45]`/`[78]`（`n` 超 i64）后，
  quarantine 坐标已按新下标重排为 `20,21,43,57,59,70,72,74,76,78`；被删两条的 `cases[]` 行保留为删除证据。

#### quarantine 落地与覆盖率剔除（2026-11-04 落定）

- 清单：本目录 `valkyrie-corpus-precision-defects.json`，坐标是 `cases[].field`（如
  `tests[85].expected`、`tests[51].args.changed[60]`）。缺陷类 A/B/C/S 全部参与隔离，D 不参与。
- 执行单位：`metadata.tests` 下标（整条用例）。180 条缺陷行收敛为 **99 条用例 / 25 题**
  （同一用例内多个元素命中只隔离一次；单个 args 元素无法单独执行，不能按元素隔离）。
  R29 清洗后为 182 行 / 99 条用例 / 26 题：新增两条 S，bitwise 删掉的两条坐标退出。
  注意清单坐标是**当前** `metadata.tests` 下标，清洗造成的偏移必须同步重排。
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

## 特性定向批次（2026-11-05）：`sorted_by` / `BinaryHeap` / `utf8` 序

选题口径：先查 canonical。13 题中 12 题已存在（`k-closest-points-to-origin`、
`longest-word-in-dictionary` 是 1 字节空 stub），仅 `most-common-word` 缺失，已补齐三件套
（`readme.md` + `metadata.json` 20 条用例 + TS/Python 参考 + `solvers/valkyrie/solution.v`）。
全部 V 解改走 std 公共入口 `sorted_by`；手写排序与 `merge_sort`（std 已私有化）均已移除。
Python/TS 参考 13/13 全通过（`run_python_solver.py`、`run_ts_solver.py` RC=0）。

| 题目 | 特性标签 | 实测结论（共享 addon `07b625aa`，全量判题） |
|---|---|---|
| `sort-integers-by-the-number-of-1-bits` | `sorted_by` + multi-key | **96/96 通过** |
| `sort-array-by-increasing-frequency` | `sorted_by` + packed-key | **117/117 通过** |
| `k-closest-points-to-origin` | `sorted_by` + nested-array cmp | **98/98 通过**（空 stub 已补） |
| `sort-characters-by-frequency` | `sorted_by` + frequency | build=0；判题 0/54，`TypeError: Cannot convert object to primitive value`（F3） |
| `largest-number` | `sorted_by` + utf8 拼接/序 | build 阻断：`std::primitive::__u8_add` 无 host provider |
| `reorder-data-in-log-files` | `sorted_by` + multi-key utf8 | 编译器 panic：`nyar-emitter` `wasm/mir/calls.rs:245`（`std::adaptor::wasm::text::host_slice` 槽冲突） |
| `top-k-frequent-words` | `sorted_by` + utf8 ordering | build 阻断：`WASM ABI carrier mismatch in std::collection::is_less_or_equal`（slot=i32 actual=anyref operand=`utf8`） |
| `group-anagrams` | `sorted_by` + utf8 canonical key | build 阻断：`std::hash#` 合同实例未进 consumer_imports（`HashMap<utf8,_>`） |
| `longest-word-in-dictionary` | `sorted_by` + utf8 ordering | build 阻断：同上（`HashSet<utf8>`，空 stub 已补） |
| `most-common-word`（新增） | utf8 扫描 + multi-key | build 阻断：`std::new#287` / `std::grow_to#300` 合同实例缺失（`Utf8Builder`） |
| `last-stone-weight` | `BinaryHeap` + `Comparable` | **已修（`9d51ad08`）**：真跑 124/124；原 build 阻断 `T: Comparable` 义务未消解属 `Ordering` 布局缺口 |
| `furthest-building-you-can-reach` | `BinaryHeap` + `Comparable` | **已修（`9d51ad08`）**：最小堆正确策略重写后 118/118（原解把最大跳交给砖块，方向错误） |
| `minimum-operations-to-halve-array-sum` | `BinaryHeap<f64>` | **`57992125` 后仅剩 `new_by` 提案入口**：`f64` 序与宽度阻断已消失；`BinaryHeap::new_by` 仍无定义 |

### 本批实测新增/复测缺口

- **G-utf8-byte**：`std::primitive::__u8_add` / `__u8_eq` host provider 未绑定。证据：
  `largest-number` 的 `Utf8Builder.append` 命中 `__u8_add`；`top-k-frequent-words` 未加
  `as u32` 的 `equal_text` 命中 `__u8_eq`。任何逐字节比较/拼接在 build 期失败。
  **2026-11-05 复核更正**：`Utf8Builder.append` 已可用（`phone-number-prefix` 97/97、
  `most-common-word` 20/20、`group-anagrams` 69/69，addon `25132ccf`），旧 `__u8_add` 结论不再成立；
  `__u8_eq` 未复验。
- **G-sorted-by-generic-utf8**：`sorted_by` 以 `utf8` 实例化时，`is_less_or_equal<T>` 的
  WASM 槽按 i32 预规划，实际参数是 anyref → `carrier mismatch`。对照：`i64` 与
  `ArrayList<ArrayList<i64>>` 实例化均通过（`sort-integers`、`k-closest`）。
- **G-utf8-slice-panic**：`utf8.slice`（`host_slice`）触发 emitter 断言 panic
  （`nyar-emitter ... wasm/mir/calls.rs:245`），不是可读诊断；`reorder-data-in-log-files` 命中。
- **G-hash-utf8**（2026-11-05 复核，addon `25132ccf`）：旧结论「`std::hash#` 合同实例未进
  consumer_imports，`HashMap<utf8,_>`、`HashSet<utf8>` 均不可编译」**只有一半成立**：
  `HashSet<utf8>` 已可用（`phone-number-prefix` 97/97）；`HashMap<utf8,_>` 仍阻断，但诊断变为
  `WASM ABI carrier mismatch in std::insert: slot=i32 actual=anyref operand=%1 (Utf8)`；
  `HashMap<char,i64>` 已可用（`sort-characters-by-frequency` 编译并运行）。
- **G-binaryheap**（2026-11-05 复核，**已修**）：`Ordering` 布局缺口由 `9d51ad08` 修复后，
  `BinaryHeap<i64>` 可用：`last-stone-weight` 124/124、`furthest-building-you-can-reach` 118/118
  （验收于 `.cache/valkyrie-ordering.node` 副本）。仍缺 `max()` / `new_by`，最大序需取负。
- **F3**（复核，部分修复）：utf8 返回值在 addon `25132ccf` 上不再抛
  `Cannot convert object to primitive value`（`sort-characters-by-frequency` 已跑出真实字符串），
  但多字节字符仍被截断/替换（`İ` → `����`，tests[35]）。

### 待还原组（2026-11-05 全面复核，addon `25132ccf` + `9d51ad08`）

复核量具：addon 副本 `25132ccf`（`projects/conformance/.cache/valkyrie-forin.node`）与
`9d51ad08`（`projects/conformance/.cache/valkyrie-ordering.node`）；两者均由独立 worktree 构建，
`VALKYRIE_NATIVE` 指向副本，不使用共享旧 addon、不替换共享 `.node`。

| slug | 原绕法 | 缺陷 | 当前状态 | 实测数字 / 诊断原文 | 动作 |
| --- | --- | --- | --- | --- | --- |
| `group-anagrams` | `HashMap<utf8,i64>` 按规范形分组 | `HashMap<utf8,_>.insert` ABI | 仍阻断 | `WASM ABI carrier mismatch in std::insert: slot=i32 actual=anyref operand=%1 (Utf8)` | 改回「规范形表 + 线性查表」，69/69 通过，顶部注「仍阻断」 |
| `top-k-frequent-words` | `HashMap<utf8,i64>` 计数 + `sorted_by` 桶内排序 | 同上 + `sorted_by(utf8)` | 仍阻断 | `std::insert` carrier mismatch 与 `is_less_or_equal` carrier mismatch（原文见 `solution.v` 顶部） | 保留线性计数，桶内改就地插入排序，92/92 通过 |
| `most-common-word` | `HashMap<utf8,i64>` 计数 + `HashSet<utf8>` 去重 | 同上 | 仍阻断 | 同上；另 `ArrayList<char>` + utf8 `StoreVar` 触发 `CAN015 OperationResultTypeMismatch`（已按下标记录最优词绕开） | 保留线性查表，20/20 通过 |
| `sort-characters-by-frequency` | 线性「码位表 + 计数表」替代 `HashMap<char,i64>` | `char: Hash` 缺失 | **已修** | `HashMap<char,i64>` 编译并运行，35/54；剩余掉红是多字节 ABI（`İ` → `����`），与容器无关 | **已还原 `HashMap<char,i64>`** |
| `last-stone-weight` | 取负入最小堆 | `BinaryHeap` + `Comparable` | **已修（`9d51ad08`）** | 124/124；取负保留原因改为 std 缺最大序构造（`max()` / `new_by` 仍不在 `BinaryHeap.v`） | 保留取负，顶部注释更新为「API 缺口，非编译器阻断」 |
| `furthest-building-you-can-reach` | 取负入最小堆 | 同上 | **已修（`9d51ad08`）** | 118/118；原解策略方向错误（砖块付最大跳），改为最小堆保留最大几跳、砖块付最小跳 | 重写为正确策略，不再取负 |
| `phone-number-prefix` | `HashSet<utf8>` 枚举真前缀 | `sort` / `sorted_by` 的 utf8 实例化 | 仍阻断 | `sort(utf8)` 与 `sorted_by(utf8)` 均报 `WASM ABI carrier mismatch in std::collection::is_less_or_equal: slot=i32 actual=anyref operand=%0 (Utf8)`（`Ordering` 报错已在 `9d51ad08` 消失） | 保留绕法，97/97 通过 |

- `Ordering` 布局缺口修复后，`BinaryHeap<i64>` 的 build 阻断消失，两项改判为「已修」；
  `furthest-building-you-can-reach` 的掉红是题解算法错，已按正确策略重写并全绿。
- `phone-number-prefix` 真写法与 TS / Python 参考实现一致（排序 + 相邻前缀检查），
  `Ordering` 修复后仍停在 `utf8` 的 ABI carrier mismatch。

## 参考实现精度审计（2026-11-05）

### 通配导入普查

- 语料 2841 题；`solvers/python/solution.py` 中 **2828 个文件**带同一 9 行通配导入头
  （共 25452 条导入语句）：`typing`、`functools`、`collections`、`itertools`、`heapq`、
  `bisect`、`string`、`operator`、`math`，其中 `math` 最后导入。
- 可能遮蔽的内建名只有 2 个：`pow`（被 `math.pow` 遮蔽 → 2 参、返回 float）与
  `abs`（被 `operator.abs` 遮蔽，语义与内建一致）。其余 7 个模块的导出名与内建名无交集。
- 本语料**没有** `from random import *` / `from os import *` / `numpy` 通配导入。
- 裸 `pow(` 调用点 **0 处**：上轮 7 文件 10 处已统一为 `builtins.pow`；含 3 参取模幂的
  `count-k-subsequences-of-a-string-with-maximum-beauty`、`final-array-state-after-k-multiplication-operations-ii`、
  `maximize-number-of-nice-divisors`、`count-the-number-of-arrays-with-k-matching-adjacent-elements`、
  `count-the-number-of-square-free-subsets`、`number-of-distinct-binary-strings-after-applying-operations`、
  `the-number-of-good-subsets` 均逐位差 0。

### 浮点退化形态统计

- `math.sqrt`：4 处（`arranging-coins` 取整后安全；`count-the-number-of-substrings-with-dominant-ones`
  参与 `//` 后循环上界为 float；`erect-the-fence-ii` 返回值本就是 float）。
- 真除 `/`：54 个文件；其中 expected 全整数的 19 题逐题判定如下。
- **确认风险（尚未污染，当前逐位差 0，指数变大即失真）：9 题**；假阳性 6 处；漏报 0。
  仅登记，不修参考实现（当前用例逐位一致，改动会破坏已验收的 expected）。

| # | 坐标 | 形态 | 判定 | 依据 |
|---|---|---|---|---|
| 1 | `count-the-number-of-square-free-subsets` | `builtins.pow(2, cnt[1])` | 已修 | 改后 expected 重算逐位差 0 |
| 2 | `number-of-distinct-binary-strings-after-applying-operations` | 同上 | 已修 | 同上 |
| 3 | `the-number-of-good-subsets` | 同上 | 已修 | 同上 |
| 4 | `count-k-subsequences-of-a-string-with-maximum-beauty` | 3 参模幂 | 精确 | `builtins.pow(a,b,m)` 全整数 |
| 5 | `final-array-state-after-k-multiplication-operations-ii` | 3 参模幂 | 精确 | 同上 |
| 6 | `basic-calculator-ii:95` `int(stk.pop() / v)` | 真除后截断 | 假阳性 | 操作数 \|a\|≤2^31、\|v\|≤2^31，double 精确 |
| 7 | `clumsy-factorial:86` 同形态 | 真除后截断 | 假阳性 | 同上 |
| 8 | `coordinate-with-maximum-network-quality:88` `floor(q/(1+d))` | 真除取整 | 假阳性 | q≤1e9、除数整数，正确舍入后 floor 稳定 |
| 9 | `repeated-string-match:81` `ceil(n/m)` | 真除取整 | 假阳性 | n,m≤1000，整数商正确舍入 |
| 10 | `k-th-smallest-prime-fraction:80,85` float 堆键 | 浮点排序键 | 假阳性 | 值域≤1e6，相邻分数间隙 ≫ double epsilon |
| 11 | `minimum-operations-to-halve-array-sum:80` `sum/2` | 真除 | 假阳性 | 和≤1e9 < 2^53，减半精确，比较不翻转 |
| 12 | `car-fleet:83` `(target-position)/speed` | 浮点时间比较 | **确认** | 相同到达时间可能因舍入翻转 |
| 13 | `successful-pairs-of-spells-and-potions:84` `success / v` | 浮点作 bisect 阈值 | **确认** | 阈值边界可能差 1 |
| 14 | `minimum-number-of-seconds-to-make-mountain-height-zero:83` | `sqrt(...)` 取整 | **确认** | 平方根舍入可 off-by-one |
| 15 | `minimum-operations-to-make-numbers-non-positive:84` | `ceil(浮点商)` | **确认** | 大商值下 ceil 可能偏 1 |
| 16 | `minimum-skips-to-arrive-at-meeting-on-time:87,89` | `ceil(浮点 - eps)` | **确认** | eps 掩盖不了大值舍入 |
| 17 | `minimum-speed-to-arrive-on-time:83` | 浮点时间和 | **确认** | 与整数小时比较在边界翻转 |
| 18 | `minimum-amount-of-damage-dealt-to-bob:102` | float 排序键 | **确认** | 比值相等时排序不保证原序 |
| 19 | `equal-rational-numbers:80` `1/9, 1/99, ...` | float 常量等值比较 | **确认** | 循环小数等值判断依赖 float 精确性 |
| 20 | `count-the-number-of-substrings-with-dominant-ones:84` `sqrt(...)//2` | float 循环上界 | **确认** | 上界为 float，乘方变大即失真 |

漏报判定：以 `(^|[^A-Za-z0-9_])pow\(` 全库复扫为 0，`math\.(sqrt|pow|log|exp|hypot|fabs|ceil|floor)\(`
全量枚举 4 处均已入表；未发现第二类通配导入。误报 6 处均给出操作数上界或同源比较依据。

## 特性面 × 可用性矩阵（R30，2026-11-05）

口径：共享 addon `07b625aa` 不重建，真跑 `legion build` + 判题；通过写 `N/N`，阻断写诊断原文摘要。
本批 10 题通过（818 条用例）。**2026-11-06 更新（addon `57992125`）**：`describe-the-painting`
的 `BTreeMap` 阻断面已消失，复跑 **98/98 全绿**，本批 11 题全部通过（916 条用例）。
2026-11-05 复核行以 addon 副本 `25132ccf`（`.cache/valkyrie-forin.node`）复测；
`Ordering` 相关行以 `9d51ad08` 独立 worktree 重建的副本（`.cache/valkyrie-ordering.node`）复测。

| 特性面 | 状态 | 证据题 | 阻断面（诊断原文摘要） |
|---|---|---|---|
| 整数 / `ArrayList` / 双指针 / 前缀和 / DP / 矩阵 | 可用 | `number-of-zero-filled-subarrays` 99/99、`bag-of-tokens` 103/103、`maximum-sum-score-of-array` 93/93、`partition-array-for-maximum-sum` 104/104、`uncrossed-lines` 106/106、`matrix-block-sum` 88/88 | — |
| `HashMap<i32,_>` / `BTreeMap<i32,_>` | 均可用（`57992125` 复核，改判） | `pairs-of-songs-with-total-durations-divisible-by-60` 89/89（`HashMap<i32,i64>` i32 键）、`minimum-index-of-a-valid-split` 12/12（`HashMap<i64,i64>`）、`describe-the-painting` 98/98（`BTreeMap<i64,i64>`） | `where K: Equal & std::operator::Comparable` 义务已在 `57992125` 消解，旧 `07b625aa` 的 `unresolved call ... none matches the argument types` 不再复现 |
| `sorted_by`（整型 / 嵌套 / packed-key） | 可用 | 96/96、117/117、98/98；本批 `maximum-length-of-pair-chain` 106/106（`ArrayList<i64>` 元素） | — |
| `sorted_by` 以 `utf8` 实例化 | 阻断（`25132ccf` 复核） | `top-k-frequent-words`、`phone-number-prefix` | `WASM ABI carrier mismatch in std::collection::is_less_or_equal: slot=i32 actual=anyref operand=%0 (Utf8)` |
| `sort` 以 `utf8` 实例化（`utf8: Comparable` 已存在） | 阻断（`9d51ad08` 复核，诊断更新） | `phone-number-prefix` 真写法 | `Ordering` 报错已消失；改报 `WASM ABI carrier mismatch in std::collection::is_less_or_equal: slot=i32 actual=anyref operand=%0 (Utf8)` |
| `HashSet<utf8>` | **可用**（`25132ccf` 复核，改判） | `phone-number-prefix` 97/97 | — |
| `HashMap<utf8,_>` | 阻断（`25132ccf` 复核，诊断更新） | `group-anagrams`、`most-common-word`、`top-k-frequent-words` | `WASM ABI carrier mismatch in std::insert: slot=i32 actual=anyref operand=%1 (Utf8)` |
| `HashMap<char,i64>` | **可用**（`25132ccf` 复核，改判） | `sort-characters-by-frequency` 编译并运行（35/54） | — |
| `utf8` 返回值 | 部分可用（`25132ccf` 复核） | `sort-characters-by-frequency` 35/54 | 不再抛 `Cannot convert object to primitive value`，但多字节字符被截断（`İ` → `����`） |
| `Utf8Builder` | 可用（`25132ccf` 复核） | `phone-number-prefix` 97/97、`group-anagrams` 69/69、`most-common-word` 20/20 | — |
| `BinaryHeap` + `Comparable` | **可用**（`9d51ad08` 复核，改判） | `last-stone-weight` 124/124、`furthest-building-you-can-reach` 118/118 | 原 `std::infix < ... 携带无身份名义类型 Ordering` 已由 `9d51ad08` 修复；仍缺 `max()` / `new_by`（最大序需取负） |
| 设计类（多方法 + 实例状态） | 阻断 | 6 题 | 入口闭包 + 实例句柄 ABI |
| 递归 / 深度 | 可用 | `construct-the-lexicographically-largest-valid-sequence` 18/18（递归深度 ≤ 40） | 上一轮 `RecursionError` 属 Python 语料，与 V 递归上限无关 |
| `loop` for-in 标量写回 | 可用（已由 `172b944a` 修复） | `maximum-sum-score-of-array` 93/93；同批 30 题还原全通过（逐题数字见「待还原组」） | 旧 addon `07b625aa` 与其父 `8ebc289e` 实测 `0`，`172b944a` 实测 `-150`，当前 HEAD `25132ccf` 实测 `-150`；配套 `loop` + `HashMap.insert` 从 `5` 变 `-14995`，证明迭代本身一直正确。判据输入 `[-10,-20,-30,-40,-50]` 应得 `-150`。验收必须用 `172b944a` 或更新 addon 副本/重建，不得用共享旧 addon 复跑后宣布通过 |

下一批选题依据：`Ordering` 布局缺口已修（`9d51ad08`/`57992125`），`sort(ArrayList<i64>)`、`BinaryHeap<i64>` 可用；`BTreeMap` 的 `where` 义务已在 `57992125` 消解，`describe-the-painting` 98/98 全绿，选题不再回避。优先补 `HashMap<utf8,_>` 的 wasm ABI 与 `BinaryHeap::new_by`。`HashSet<utf8>`、`HashMap<char,_>`、`Utf8Builder` 已可用，for-in 标量写回已修，不再作为缺口。避免再撞 `sort`/`sorted_by` 的 utf8 实例化、设计类。

## 理想解批次缺口登记（2026-11-05）

口径：按题面最优复杂度手写 `solution.v` + TS 参考解，真跑 `legion build --target wasm32-unknown-unknown-wasm` 与隔离判题；本批 29 题，19 题双 lane 端到端通过，10 题标注 blocked-gap。

### 阻断 A：裸整数字面量之间的 `infix -`（2026-11-06 已解决 6 题）

形如 `0 - 1` / `0 - 1000000000` 的负常量在两侧都是裸字面量时无法唯一选中 `infix -` 的 impl 见证；右侧换成有类型的值（如 `0 - arr⁅0⁆`）不受影响。首错均为：
`error[valkyrie.hir.unresolved_call]: unresolved call \`infix -\` ... : N explicit impl candidates share the same specificity, so no unique witness can be selected`

已由编译器 `nyar-vm.rs` 的 `e314ff46` 修复：并列时先按「字面量值是否落在形参范围内」、再按宽度转换次数评分；调用点有期望类型且唯一匹配返回类型时优先。真跑判题结果：

| 题号 | 状态 | 证据 |
|---|---|---|
| 690 `longest-turbulent-subarray` | 已解决，移出 blocked | 150/150 |
| 1014 `best-sightseeing-pair` | 已解决，移出 blocked | 真跑通过 |
| 1031 `maximum-sum-of-two-non-overlapping-subarrays` | 已解决，移出 blocked | 真跑通过 |
| 1131 `maximum-of-absolute-value-expression` | 已解决，移出 blocked | 94/94 |
| 1186 `maximum-subarray-sum-with-one-deletion` | 已解决，移出 blocked | 139/139 |
| 1590 `make-sum-divisible-by-p` | 已解决，移出 blocked | 76/76 |
| 1007 `minimum-domino-rotations-for-equal-row` | 保留 blocked：编译已通过，`13:20` 不再报错，剩余失败为语料缺列（见下表） | 编译通过 |
| 1073 `adding-two-negabinary-numbers` | 已解决，移出 blocked（`c34926bb` 补运算符接收者上下文） | 104/104 |

### 阻断 B：Semantic MIR 合同（1546，已解决）

| 题号 | 站点 | 首错摘要 |
|---|---|---|
| 1546 `maximum-number-of-non-overlapping-subarrays-with-sum-equals-target` | `solvers/valkyrie/solution.v` 内 `seen = HashMap::new(0)` 重赋值处（block 4 instruction 7） | `SMIR007 ... call argument type differs from declared signature (actual=Unit, expected=Nominal { ... HashMap ... })` |

2026-11-06 根因定位（最小 fixture：泛型 `class Holder<K,V>` + `imply Holder<K,V> { micro new(...): Self }`）：

- 同一 `Holder::new(4)` 在 `let` 初始化处解析为 `instance=Some(ItemInstanceId)`、返回类型已实例化为 `<i64,i64>`；
- 在 `x = Holder::new(4)` 赋值处解析为 `instance=None`、返回类型仍是 `Generic(K)/Generic(V)`，MIR 因无可调用实例把调用降为 Unit；
- `let` 侧由声明类型掩盖（`StoreVar` 带声明类型），赋值侧随 `StoreVar` 把 Unit 传播为绑定类型，后续 `seen.insert` 接收者变成 Unit。

因此修复点是 HIR 赋值值位置缺少期望类型，不是 MIR 降级（降级只是表现）。见阻断 D。

已由 `eedb98f4` 修复：`Assign` 的值位置改用左值声明类型作为期望类型（对照 `StoreField`）。真跑判题 96/96。
新增正/反例：`mir_ssa_assign_constructor_context_tests`（有声明类型必须编译通过，无声明类型必须结构化报错）。

### 阻断 D：赋值值位置与运算符实参的期望类型丢失（2026-11-06 已解决）

| 位置 | 修复 | 影响题 |
|---|---|---|
| `nyar-vm.rs` `.../hir/overload/resolve_call/resolve.rs` `HirExprKind::Assign` 分支 | `eedb98f4`：值表达式改用左值声明类型，未声明时回退外层上下文 | 1546 `seen = HashMap::new(0)`，96/96 |
| `nyar-vm.rs` `.../hir/overload/substitution.rs` `member_call_argument_contexts` | `c34926bb`：识别「单段运算符成员名 + 接收者在 `args[0]`」形态，按接收者类型归组候选并把形参位与实参位一一对齐 | 1073 `sum == 0 - 1`，104/104 |

运算符接收者类型不可推断时上下文保持为空，仍以 `unresolved call` 失败闭合（反例见 `hir_operator_literal_argument_context_tests`），不静默选宽度。

### 语料缺陷（只标注，不改用例）

| 题号 | 缺陷 | 影响 |
|---|---|---|
| 1007 `minimum-domino-rotations-for-equal-row` | 112 例中 4 例 `tops` 与 `bottoms` 长度不一致（索引 28、43、70、87）；索引 87 `tops` 全为 4 却期望 `1`，合法输入下应为 `0` | 该题无法整题验收；解法保留 |
| 1343 `number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold` | 108 例中 7 例 `threshold` 为小数（5.5、10.5、1.5、3.5、0.5），题面签名为整数；首个不合法例为索引 20 | V lane 前 20 例通过后按 ABI 整数校验拒绝，不做隐式取整 |

## 理想解批次缺口登记（第二批，2026-11-05）

口径：20 题（`questionId` 216–638），逐题真跑 `run_v_solver.ts`（`legion build` + 隔离判题）与 TypeScript lane。
V lane 14 题端到端通过，4 题撞语料缺陷，2 题在语料缺陷用例上无法结束被 kill（按命令纪律不重试）。

### 语料缺陷（F6，只标注不改用例）

| 题号 | 缺陷坐标 | 实测 |
|---|---|---|
| 267 `palindrome-permutation-ii` | `metadata.tests[34]` 期望 `"Execution timed out"` | V 在索引 34 前全部通过，该例输出规模爆炸，300 秒超时被 kill |
| 320 `generalized-abbreviation` | `metadata.tests[3]` 期望 `"Execution timed out"` | V 索引 0–2 通过，索引 3 期望超时文本，实际返回完整缩写集 |
| 553 `optimal-division` | `metadata.tests[7]` 期望数字 `10`，题面返回字符串 | V 其余用例通过，索引 7 类型不符 |
| 582 `kill-process` | `metadata.tests[20]` 期望 `"Error: maximum recursion depth exceeded"` | 该例 `pid` 与 `ppid` 长度不一致（索引 12 起 `ppid` 多一项，已按 `zip` 截断兼容），索引 20 为自环，迭代解返回 `"Error: requested new array is too large"` |
| 606 `construct-string-from-binary-tree` | `metadata.tests[3]` 期望数字 `1`，题面返回字符串 | V 其余用例通过，索引 3 类型不符 |
| 638 `shopping-offers` | `metadata.tests[84]` 期望 `"Error: maximum recursion depth exceeded"`，`special` 含全 0 且价格为 0 的包 | 记忆化搜索已跳过不改变状态的包，仍在语料用例上超时被 kill |

### 能力缺口（题内坐标）

| 缺口 | 题内触发点 | 处理 |
|---|---|---|
| `HashMap<utf8,_>` 的 wasm ABI carrier 失配（R30 已登记） | `find-duplicate-file-in-system/solvers/valkyrie/solution.v` 的 `contents` 线性扫描 | 该题 83/83 通过，但同内容判定退化为 O(组数×路径长) 比较，按 R30 原有条目记录 |
| 树返回含 `null` 的 ABI 表达缺口 | `binary-tree-longest-consecutive-sequence-ii` 之外的 536/623/654 未写 | 期望输出含 `null` 的树返回题无法用 `ArrayList<i64>` 表达可空元素，本批未选题 |

## 理想解批次缺口登记（第三批，2026-11-05）

口径：25 题（`questionId` 648–792），每题写 `solution.v` 理想解、TS 参考解并注册 `invoke.valkyrie`。
TypeScript lane 20 题整题通过，5 题仅剩语料缺陷用例失败。V lane 本批**未能验证**：环境被 `valkyrie.v` 的 std 改造阻断（见「阻断 C」），19 题在阻断前已 `BUILD_OK`，6 题修复后待重建。

### 阻断 C：std workspace 依赖缺成员（环境级，非题内）

```text
CompileTargetPlanError: plan_failed: ForcedWorkspaceDependencyMissing { project: "std", dependency: "unicode.core" }
```

随后复测变成 `dependency: "unicode.types"`。同一 `pour-water`（阻断前 `BUILD_OK`）也 `ERROR`，说明是 `valkyrie.v` 另一条线的 std 内改造（`de697ed` 引入 `projects/unicode._`，多个 std 文件 dirty/untracked），不是题解问题。按「不等 std 卡点」规则继续写作与 TS 验证。

### 能力缺口（题内坐标）

| 缺口 | 题内触发点 | 处理 |
|---|---|---|
| `sort(ArrayList<i64>)` 报 `unresolved call merge_sort in sort` | `split-array-into-consecutive-subsequences`、`number-of-longest-increasing-subsequence` | 改用 `quick_sort(arr, cmp_i64)`。账本上一节「`sort` 可用」的结论以本条实测为准 |
| `HashSet::new(capacity)` 无该 arity | `pyramid-transition-matrix` 的 `HashSet::new(0)` | 改用 `HashSet::new()` |
| `i64 as f64` 缺 opcode | `k-th-smallest-prime-fraction` 原 f64 排序方案 `BUILD_FAIL` | 改整数交叉相乘 + 手写最小堆，O((n+k) log n) |
| 局部变量名与 std 内置 `write` 冲突 | `candy-crush` 报 `utf8_to_utf16 in write` | 局部变量改名 `top` / `cursor` |
| 复合条件链触发 `SMIR007` jump arity | `asteroid-collision` 的 `continue` 前置长条件 | 抽出 `settle(stack, rock) -> bool` 消除复合条件 |
| `utf8` 形参解析点分地址（非缺口，已适配） | `ip-to-cidr` 语料 132 例 `args.ip` 均为 `"1.2.3.4"` 形式 | 改为 `ip: utf8` 手写解析字节，TS 同步，132/132 通过 |

### 语料缺陷（F6，只标注不改用例）

| 题号 | 缺陷坐标 | 实测 |
|---|---|---|
| 752 `open-the-lock` | `metadata.tests[37]` 的 `target` 同时出现在 `deadends`，仍期望 `6` | 索引 0–36 通过，索引 37 起不可达即 `-1`，与期望矛盾 |
| 756 `pyramid-transition-matrix` | `metadata.tests` 8 例（索引 31、36、38、50、56、65、72、80）期望 `"Error: too many values to unpack (expected 3)"`，`allowed` 含长度超过 3 的规则 | 其余 73 例通过。索引 39/73 曾因 `push(...next)` 展开过大数组栈溢出，已改逐步 `push` 修复 |
| 764 `largest-plus-sign` | `metadata.tests[40]` 期望 `"Error: list assignment index out of range"`，`n=10` 但 `mines` 出现下标 `10` | 索引 0–39 通过，索引 40 的 `mines` 越界属语料错误 |
| 786 `k-th-smallest-prime-fraction` | `metadata.tests[14]` 期望 `"Error: index out of range"` | 索引 0–13 通过，索引 14 期望越界异常文本 |
| 789 `escape-the-ghosts` | `metadata.tests[4]`：`ghosts=[[1,0],[0,3]]`、`target=[0,1]`，幽灵距离 1 等于玩家距离 1，期望 `true` | 索引 0–3 通过，索引 4 与「先到才逃脱」语义矛盾 |

## 理想解批次缺口登记（第四批，2026-11-05）

口径：24 题（`questionId` 794–932），每题 `solution.v` 理想解 + TS 参考解 + `invoke.valkyrie`。
TypeScript lane 18 题整题通过，6 题首错为语料缺陷。V lane 仍 **未能验证**，阻塞点与第三批「阻断 C」相同（现报 `ForcedWorkspaceDependencyMissing { project: "std", dependency: "unicode.types" }`）。

### 能力缺口（题内坐标）

| 缺口 | 题内触发点 | 处理 |
|---|---|---|
| 直接下标赋值可用 | 多题 | `arr⁅i⁆ = value` 已有多处通过用例，无需 `set` |
| `-1` 字面量可用，`0 - 1` 不可 | `walking-robot-simulation`、`find-and-replace-in-string` 初稿 | 一律写 `-1` / `-2`，不要写裸字面量减法 |
| 整数实参可能是 `string`，TS 侧被转成 `BigInt` | `binary-trees-with-factors` 的 `tests[89]`（`"63842579163398340"`、`"112840242932266120000"`） | TS 全程 `BigInt` 运算后 `Number()` 返回；V 侧该值超过 `i64` 上限，属语料越界 |
| `HashMap<utf8,_>` 载体缺口（R30）仍在 | `subdomain-visit-count` | 聚合退化为按插入序线性比对，复杂度不是理想哈希 |
| 参考解语义怪癖（需对齐才能过语料） | `car-fleet`（初始 `pre = 0`，正好在终点的车不计入车队）；`find-and-replace-pattern`（`zip` 截断，忽略长度不等）；`minimum-falling-path-sum`（非方阵时未填的 `g` 保持 0） | 按参考解实现，已在文件注释标注 |

### 语料缺陷（F6，只标注不改用例）

| 题号 | 缺陷坐标 | 实测 |
|---|---|---|
| 825 `friends-of-appropriate-ages` | `metadata.tests[66]`、`[79]`、`[99]` 年龄 `185` / `280` / `300` 越界，期望 `"Error: list index out of range"` | 索引 0–65 全通过 |
| 833 `find-and-replace-in-string` | `metadata.tests[15]` 期望 `12345`（数值），方法返回字符串 `"12345"` | 索引 0–14 全通过，其后多处同型类型错 |
| 848 `shifting-letters` | `metadata.tests[38]`：`s` 长 36，`shifts` 只有 26 项，期望 `"Error: list index out of range"` | 索引 0–37 全通过 |
| 853 `car-fleet` | `metadata.tests[117]`：`position` 49 项、`speed` 46 项，期望 `"Error: list index out of range"` | 索引 0–116 全通过 |
| 909 `snakes-and-ladders` | `metadata.tests[23]`：棋盘 `24x14`（非方阵），期望 `"Error: list index out of range"` | 索引 0–22 全通过 |
| 931 `minimum-falling-path-sum` | `metadata.tests[10]`：`matrix=[[1],[100]]` 期望 `0`（参考解非方阵残留 0） | 索引 0–9 全通过 |
| 823 `binary-trees-with-factors` | `metadata.tests[89]` 含 `112840242932266120000`，超出 `i64` | TS 用 `BigInt` 通过；V 侧该用例无法承载 |

## 理想解批次缺口登记（第五批，2026-11-05）

口径：24 题（`questionId` 939–1105），每题 `solution.v` 理想解 + TS 参考解 + `invoke.valkyrie`。
判题链路恢复后 V lane 首次可全批验证：**22 题整题通过，2 题首错为语料缺陷**。TypeScript lane 结果相同。
选题跳过 `963`（期望含浮点噪声 `2.0000000000000004`，需 `f64` 返回）与 `970`（期望顺序等于 Python `set` 迭代序，非升序），改用 `1105` 补位。

### 能力缺口（题内坐标）

| 缺口 | 题内触发点 | 处理 |
|---|---|---|
| `std` 的 `cmp_i64` 解析不到可匹配重载 | `moving-stones-until-consecutive-ii`、`longest-string-chain`、`distant-barcodes`、`largest-values-from-labels` 首版均报 `unresolved call quick_sort` | 每题自定义 `micro compare_i64(a: i64, b: i64) -> i32` 传给 `quick_sort`，四题均 BUILD_OK |
| ABI 形参名必须与 `metadata.tests.args` 键完全一致 | `interval-list-intersections`（`firstList`/`secondList`）、`largest-values-from-labels`（`numWanted`/`useLimit`）、`filling-bookcase-shelves`（`shelfWidth`）首版用 snake_case 形参 | 报 `AbiSchemaError: args.<key>: metadata.tests.args 缺少参数`；形参改为 metadata 的 camelCase 键名后三题全过 |
| 参考解 `setdefault` 首值语义 | `vowel-spellchecker` 的 `["aeiou","AEIOU"]` 小写字典 | 小写/元音两级匹配必须在首次命中即 `break`，否则会取到后插入的 `AEIOU` |
| `HashMap<utf8,_>` 载体缺口（R30）仍在 | `vowel-spellchecker`、`longest-string-chain` 的字符串比对 | 退化为线性扫描，复杂度非理想哈希 |
| 编码基数必须覆盖语料值域 | `minimum-area-rectangle` 首版 `base=20001/offset=10000`，语料坐标到 `40000` 造成键碰撞，`tests[5]` 返回 `0` | 改为 `base=80001/offset=40000`，81/81 通过 |

### 语料缺陷（F6，只标注不改用例）

| 题号 | 缺陷坐标 | 实测 |
|---|---|---|
| 955 `delete-columns-to-make-sorted-ii` | `metadata.tests[42]` 行长度 5/4 不齐，期望 `"Error: string index out of range"` | 索引 0–41 全通过；其余 167 例同类越界形状 |
| 1027 `longest-arithmetic-subsequence` | `metadata.tests[34]` 起差值超出参考解 `f[i][diff+500]` 的 1001 列，期望 `"Error: list index out of range"` | 索引 0–33 全通过；理想解用 `(下标, 公差)` 哈希键，不受该上限约束 |

## 第五批跳过题与第六批预登记（2026-11-05）

| 题号 | 类别 | 坐标/原因 | 处理 |
|---|---|---|---|
| 963 `minimum-area-rectangle-ii` | `f64` 返回 | 期望值含浮点噪声 `2.0000000000000004` | `57992125` 已解除 `f64` 入口阻断，待窗口复验后补理想解 |
| 970 `powerful-integers` | 非确定性顺序 | 期望顺序等于 Python `set` 的整数哈希迭代序，非升序，无法由标准算法复现 | blocked-gap，跳题 |
| 1058 `minimize-rounding-error-to-meet-target` | `f64` 返回 | 期望 `1.5` 等浮点值 | `57992125` 已解除 `f64` 入口阻断，待窗口复验后补理想解 |
| 1093 `statistics-from-a-large-sample` | `f64` 返回 | 期望 `[1,3,2.375,2.5,3]` 含浮点中位数 | `57992125` 已解除 `f64` 入口阻断，待窗口复验后补理想解 |
| 536/623/654/669/701/814/865/889/971/998/1008/1038/1080/1120/1123 | 树输出 | 输入是无 null 的堆式数组，无法还原「缺左留右」的非完全树；输出要求 LeetCode 层序含 `null` 序列化，仓内无权威编解码约定 | blocked-gap，待补序列化合同后统一处理 |
| 912 `sort-an-array` | 语料参考解损坏 | `metadata.tests[0]` 期望 `"Error: name 'randint' is not defined"`，全部用例期望错误文本 | blocked-corpus，未写 |

## 第六批 A 组实测（2026-11-05）

本轮 7 题：817 / 1057 / 1066 / 1072 / 1094 / 1101 / 1104，三件套齐备，双 lane 实测：

| 题号 | Valkyrie lane | TypeScript lane |
|---|---|---|
| 817 `linked-list-components` | 106/106 | 106/106 |
| 1057 `campus-bikes` | 102/102 | 102/102 |
| 1066 `campus-bikes-ii` | 89/89 | 89/89 |
| 1072 `flip-columns-for-maximum-number-of-equal-rows` | 88/88 | 88/88 |
| 1094 `car-pooling` | 112/112 | 112/112 |
| 1101 `the-earliest-moment-when-everyone-become-friends` | 70 通过，首错 idx 70 | 同左 |
| 1104 `path-in-zigzag-labelled-binary-tree` | 78/78 | 78/78 |

- 1101 的 `tests[70]` 起日志节点号大于 `n`（如 `maxNode=40, n=10`），参考解抛 `list index out of range` 并被记为期望文本；语料缺陷，F6 处理，不改用例。
- 813 `largest-sum-of-averages`：35/102 例期望含分数（`20.5`、`18.166666666666664`），`f64` 返回与 `i64 as f64` 入口已在 `57992125` 解除阻断，待窗口复验后补理想解。
- 1057 首轮 V 编译报 SMIR007（`jump argument ... actual=Integer64, expected=Integer32`）；把 `usize` 计数循环统一改成 `i64` 后通过。坐标：`campus-bikes/solvers/valkyrie/solution.v`。

## 第六批 B 组实测（2026-11-05）

本轮 6 题：1109 / 1111 / 1124 / 1738 / 1918 / 480。

| 题号 | Valkyrie lane | TypeScript lane | 首错 |
| --- | --- | --- | --- |
| 1109 `corporate-flight-bookings` | 110/110 | 110/110 | — |
| 1111 `maximum-nesting-depth-of-two-valid-parentheses-strings` | 146/146 | 146/146 | — |
| 1124 `longest-well-performing-interval` | 99/99 | 99/99 | — |
| 1738 `find-kth-largest-xor-coordinate-value` | 87/87 | 61/87 | TS idx 61：`k=25` > 单元格数 21，期望 0 为 `nlargest` 越界产物（语料缺陷，F6） |
| 1918 `kth-smallest-subarray-sum` | 12/88 | 12/88 | idx 12：`k=25` > 子数组数 15，期望 16（= 总和 + 1）；全表 20 例同类，语料缺陷 |
| 480 `sliding-window-median` | 未构建（G29） | 115/115 | V 编译报 `i64 → f64` opcode 缺失 |

- 区间能力已用于 1109 / 1111 / 1738 / 1918 的 `loop i in 0..n`，四题 V 均真构建通过；`inclusive_range` 未使用。
- 1738 的 V 快选把越界 `k` 恰好落在最小值，与期望 0 巧合一致，仍按语料缺陷记录。
- 480 用坐标压缩 + 树状数组按秩取中位数（O(n log n)）；TS 115/115，V 停在 G29。

## 合同级待定项（2026-11-06，未落码）

以下三项缺的不是 std 实现，而是语言/合同面，本轮不动：

- **`Iterator::sum` / `Iterator::product`**：需要加法/乘法 operator 合同（现无 `Additive` / `Multiplicative`）。泛型 `T + T` 无法解析，硬塞会绕过三 lane provider 机制。
- **`HashMap::get_mut`**：需要 `&mut V` 引用合同，语言暂无。当前以 `HashMap::upsert(key, fallback, update)` 覆盖读改写场景（`std/source/collection/hashed/HashMap.v`）。
- **`MultiSet` 等价语义 / 排序稳定性可声明属性（G24 / G27）**：属 `01 架构与编译合同` 级新增，按裁决留在账本，不单开块。

## 待办：`Queue` / `PriorityQueue` 去 `[host_contract]`（2026-11-06，未落码）

按 S7 影响面清单结论，本轮**不执行**，只修 `Queue::enqueue` 方法体（`push_back`），标签保留、解析面零变化。若后续执行去标签，必须同批完成下列全部动作，否则是静默死绑定：

- 同步处理 `std.adaptor.jvm` / `std.adaptor.clr` 各 12 条 `[host_provider(std::collection::Queue::*)]` / `[host_provider(std::collection::PriorityQueue::*)]` 声明（删除或改为显式本地实现），两个 adaptor 共 24 条。
- 规划器对「契约不存在的 provider」是静默跳过（`host.rs` 无 orphan 诊断），去标签后不会出现构建报错提示。
- 需在 jvm/clr target 复跑，比对 `selected_host_providers` 数量（−12）与 `host_provider_binding_hash` 变化。
- 风险面：jvm/clr SDK 消费方会从宿主原生 `Queue` / `PriorityQueue` 静默退回 Valkyrie 本地实现（`PriorityQueue` 等键顺序可能不同）。

## std 侧能力池复审（2026-11-06）

口径：扫描 `projects/problems/**/solvers/valkyrie/solution.v` 的全部 `# 阻塞：` 标记，再对其中含真实代码的题真跑 `run_v_solver.ts`（addon 为当前 tip 构建）。

阻塞标记分布：302 `std.text 文本索引/构造`、19 `std.collection 数组分配与索引`、7 `std.collection 数组参数读取`、4 `f64 浮点语义`、3 `std.collection 队列/集合`、2 `std.collection 哈希表/备忘表`、2 `浮点返回值合同`、其余 5 项各 1。

**结论：本轮没有可归因于 std 缺口的题目，`valkyrie.v` 不改。**

- 上述前六族共 335 个题解**只有注释**，没有任何 `micro` / `[export]` / `class` / `imply` 声明，属「题解未写」，不是 std 能力缺口；`f64` 两族同样只有注释占位。
- 带真实代码的阻塞题仅 3 个：`add-two-numbers`（ovm typed sum / jvm-clr lane）、`integer-to-roman`（四 lane `unresolved call <computed>`）、`reverse-string`。

真跑探针（当前 tip 构建）：

| 题 | 结果 | 判定 |
|---|---|---|
| `reverse-string` | 39/39 | 旧 `ArrayList<utf8>` ABI 阻断已消失，摘出 blocked 并删除陈旧标记 |
| `string-compression` | 25/25 | `Utf8Builder::append_i64` + `utf8.slice` 已可用 |
| `find-right-interval` | 113/113 | `BTreeMap<i64,i64>` 可用 |
| `furthest-building-you-can-reach` | 118/118 | `BinaryHeap<i64>` 可用 |
| `count-common-words-with-one-occurrence` | 103/103 | `HashMap<utf8,i64>` 可用 |
| `flip-columns-for-maximum-number-of-equal-rows` | 88/88 | `HashMap<utf8,i64>` 可用 |
| `distribute-candies` | 106/106 | `HashSet<i64>` 可用 |
| `find-k-pairs-with-smallest-sums` | `tests[0]` 输出顺序与期望相反 | 题解堆键编码逻辑，不是 std 缺口 |
| `accounts-merge` | `tests[55]` 归组人名不符 | 题解并查集逻辑，不是 std 缺口 |
| `design-hashset` | 入口闭包无 `[export]/[main]/[test]` | 设计题 harness 入口，不是 std 缺口 |

剩余待办属题库/题解侧：补齐 335 个占位题解、修 `find-k-pairs` 与 `accounts-merge` 的逻辑、给 `design-hashset` 类设计题补入口约定。std 侧下一批仍以本账本既有 G 清单为准。

## 2026-11-06 std 线三失败复验（编译器侧）

复验环境：`nyar-vm.rs` HEAD `c34926bb`（12 个在途 dirty 文件未触碰），`valkyrie.v` HEAD `eece3ee`；
`HashSet.v` / `math/basic.v` 已回滚到 HEAD，`DirectedGraph.v` 为他人 `MM` 在途（`.get(...)`）。
对照 addon 为 11-05 13:20 平台包，复验 addon 为 `.target-litbind/valkyrie-litbind-fixed.node`
（11-06 11:16，仅含 G30 守卫）。探针统一在 `projects/conformance` 下以
`node --import tsx .cache/probe-build.ts` 单进程执行，诊断上限 50。

| 失败 | 定性 | 干净对照与证据 |
| --- | --- | --- |
| `max(i64, i64)` | **既有限制**，非回归 | HEAD `math/basic.v` 只有 `max(f64, f64)`；`max(i64, i64)` 停在调用点，2 candidates（std.math 的 f64 版 + iterator terminal）none matches。改成泛型 `max<T>(a, b)` 后，`a > b` 立即在 `basic.v:14:8` 报 `unresolved call infix >`——泛型运算符没有约束证据。沙箱加 `where T: std::operator::Comparable` 后 `max(i64, i64)` 可解析（`i64: Comparable` 有 imply），但 `f64` 未实现 `Comparable`，约束路线不适用于 f64。正解是具体重载（同模块 f64 + i64 已验证可编译），不是编译器缺陷。新旧 addon 结果一致 |
| `HashSet.new`（`new(capacity)`） | **真编译器缺陷 G30**，已修 | 最小复现 `.cache/probes/two-constructors`：旧 addon 一参构造失配（零参候选空匹配），修复后两个构造均 `STATUS=0`。`.cache/probes/arity-bad-call`：旧 addon HIR 解析成功、漏到 SMIR007 `call arguments differ from declared signature arity`；修复后在 `solution.v:20:25` 结构化 `valkyrie.hir.unresolved_call`。std 侧加**增量** `new(capacity)`（保留 `new()`）后，修复版两个调用点均 `STATUS=0`；旧 addon 只有一参调用失败（5 candidates），零参调用点正常——**「既有 `new()` 调用点一起崩」只在替换/删除零参 `new` 时出现，不是加法重载的必然结果**。回归题 `contains-duplicate` / `distribute-candies` / `accounts-merge` / `keys-and-rooms` / `is-graph-bipartite` 全部 `STATUS=0` |
| `DirectedGraph<i64>`（`remove_edge` 的 `unwrap`） | **在途修复，非回归** | HEAD `DirectedGraph.v` 仍按 `self._forward[from]` 返回 `Option` 写 `.unwrap()`，与 `HashMap.v` 的 `suffix [ ](key): V` 裸值合同冲突；干净 HEAD 沙箱精确复现 `127/130/150/165` 共 6 条 `<fn value>.unwrap` none matches。把该处换成 `.get(...)`（即工作树在途 `MM`）后编译通过，`keys-and-rooms` / `is-graph-bipartite` 在修复版 addon 上 `STATUS=0`。编译器无动作 |

- 账本修正：`is-graph-bipartite` 的停点不是 `HashSet::from_list` 的 `list.iter`，而是 HEAD
  `DirectedGraph.v` 的提取器合同；`possible-bipartition` 在 DG 修复后停在 F2（类方法 `[export]`
  无入口闭包，`artifact: library requires at least one resolved export`），不是 G9 / DG。
- G12 已落地（`HashSet::new(capacity)` 2026-11-06 已提供并验证），阻断它的编译器 arity 缺陷
  已由 G30 修复（`1bee7bff`）；
  std 线可在保留 `new()` 的前提下增量落地 `new(capacity)`，既有调用点已验证不受影响。
- Rust 回归：`cargo test -j 4 -p rusty-valkyrie --test frontend` = **572 passed / 0 failed / 11 ignored**，
  含新增正反例（`same_owner_constructors_with_distinct_arity_both_resolve` /
  `nullary_constructor_rejects_extra_argument_at_call_boundary`）。
