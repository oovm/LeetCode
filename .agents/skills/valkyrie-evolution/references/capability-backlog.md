# Valkyrie 能力 backlog（leetcode 驱动）

活文档：由 `valkyrie-evolution` 维护。状态：`open` | `planned` | `upstream` | `done` | `wont`。

| ID    | 能力簇                              | 状态 | 动机（题 / 场景） | 上游落点                              | 备注                     |
|-------|-------------------------------------|------|-------------------|---------------------------------------|--------------------------|
| V-001 | 链表 `ListNode` 互操作              | open | 多数链表题        | `std.collection` 或题面专用类型       | phase-1 暂缓             |
| V-002 | 二叉树 / N 叉树节点                 | open | 树遍历、路径题    | `std.collection` 或 `std.tree`        | 需与 JSON 测例互操作设计 |
| V-003 | `BinaryHeap` / 优先队列可用性       | done | TopK、合并 K 路   | `std.collection/BinaryHeap.v` + `test_core_collection.v` | min-heap API 与 `PriorityQueue` 已验收 |
| V-004 | 并查集 `DisjointSet`                | open | 连通分量类        | `std.collection/DisjointSet.v` + test | 同上                     |
| V-005 | 二维 DP 表 / 矩阵                   | open | 路径、编辑距离    | `Array` 嵌套或 `ArrayList`            | 语法 + std 边界          |
| V-006 | `legion build --target wasm` 题解 harness | upstream | coach 批次 11 题 | `valkyrie.rs` legion + `legions.von` 含 `std.adaptors._` | 2026-09：workspace 缺 adaptor 已修 |
| V-009 | `char.lowercase_ascii_index` | done | `valid-anagram` | `core::text::char` | 配合 `Utf8Text.char_at`（V-010） |
| V-010 | `Utf8Text.char_at`（0-based 逻辑下标） | done | `valid-anagram`、下标字符串题 | `std.text.Utf8Text` | 与 `count_char` / `byte_offset` 一致 |
| V-007 | 字符串切片与 `Utf8Text` 互操作      | open | 字符串题          | `std.text`                            | 对照 TS `string` 语义    |
| V-008 | 递归深度 / 栈溢出策略               | open | DFS 题            | nyar / core                           | 文档化限制或尾调用       |
| V-011 | `unite` 强制 tagged + 缺省 tag 自动派生 | planned | `Option`/`Result`、全部 ADT | `valkyrie.rs` nyar/HIR/backend；`core::types` | 见 `type-taxonomy.md` §unite |
| V-012 | named `union Name { ... }`（untagged） | open | 大整数（参考 `athena.rs`）、C 互操作 payload | `valkyrie.rs` + `std`（待定） | parser 有 `SumTypeKind::Union`；语义/布局未完备 |
| V-013 | 匿名 `A \| B \| C` 类型联合           | open | 泛型约束、测例多形参数 | `valkyrie.rs` typechecker | `TypeExpression::Union` 已解析 |

### V-011–V-013 专家评估后的工作包（2026-09-23）

- **U-W1 / V-011，owner: nyar-language：** 保留三种 sum 身份，规范核对缺省 tag、显式 tag 混用与重值诊断；验证 GADT、match 穷尽性和跨包 tag 表。`nyar-vm.rs` `dev` 已落地：named `union` AST 拒绝、三种 sum 重名诊断、`resolve_sum_variant_tag` 统一校验与 layout、跨包 `imported_semantic_exports` 判别校验与 layout（`sum_discriminator_tests` 13 例 + `spec::nominal` 3 例）、GADT 变体 `result_type` 与穷尽性 lib 回归（`nominal_contract_tests` 5 例）、`--test valkyrie` 已恢复编译且 `spec::nominal` 37 例全过。全量 valkyrie 仍有 74 例失败（多为 control flow / MIR smoke，非 U-W1 合同）。端到端 Node runtime 验收未闭合。
- **U-W2 / V-011，owner: core：** Option/Result 暂保留显式 tag；待 U-W1 和 Node runtime 验证后再评估移除，零回归为门禁。
- **U-W3 / V-012，owner: nyar-language + Representation Planner：** named union 身份、活跃成员检查和无 GC ref 的固定 overlay 布局；错误成员读取须诊断失败。
- **U-W4 / V-012，owner: nyar-emitter：** 各 target 先对无合同的 untagged union fail-fast；Wasm 编码仅在 U-W3 语义、布局及 GC trace 合同完整后实施。
- **U-W5 / V-013，owner: nyar-language typechecker：** 匿名 union 的子类型、共同成员访问与有证据的控制流收窄；未收窄专属访问须报错。`T | null` 单列 nullable 设计，不等同 Option。
- **U-W6 / V-012，owner: std + conformance：** 核实大整数 limb 需求后设计 BigInt；超 JS 安全整数的 metadata JSON 还需独立 harness 合同。
- **U-W7，owner: leetcode.v：** phase-1 保留 digit 数组、显式 overload 或题面专用类型，禁止匿名 `|` 与提前使用 named union 绕过类型门禁；记录 golden 正反例。

顺序：U-W1 先闭合身份和 tag 合同；U-W3、U-W5 随后可并行设计；U-W4、U-W6 依赖 U-W3。V-011 仍 planned，V-012/V-013 仍 open；parser 或 shape 单测不能改变状态。
| V-014 | `char` ASCII 字母数字 / 元音判定   | done | `valid-palindrome`、`reverse-vowels-of-a-string` | `core::text::char` | `is_ascii_alphanumeric`、`ascii_alnum_key`、`is_ascii_vowel` |
| V-015 | `char as u32` / `As<u32>` 原语转换   | done | `valid-palindrome`、`lowercase_ascii_index` | `core::text::char` + `core::types::conversion` | `char as u32` 已可用；已移除 `to_u32()` shim |
| V-016 | `Utf8Builder.append_i64` 十进制格式化 | done | `summary-ranges` 等需输出数字字符串的题 | `std.text.Utf8Builder` + `test_utf8_builder.v` | 含 `0` 与 `-2147483648` 边界 |
| V-017 | **leetcode wasm invoke harness（P0）** | upstream | `vRuntimeMs`、跑飞检测、三语言对比 | `valkyrie.rs` legion/nyar-emitter：① Windows `\\?\` 路径下 package 须能收集 `solution.v`（`path_for_local_fs`）② 仅 `[export]` 顶层 `micro` 进 MIR/wasm（`snake_case` 实现，`[export(case: "camelCase")]` 导出 `twoSum`）③ glue `callExport`/`invokeLeetCode` + JSON 编解码 | leetcode `run_v_solver.ts` + `resolveWasmExportSymbol` 已就绪 |

### V-017 分阶段交付（2026-09-27 复核）

工作区评估：`内部决策/08-V-017-LeetCode库模式评估.md`。方案 A；方案 B = V-017e。

- **V-017a / W1：** `entry` + `artifact: library` + `path_for_local_fs` **已落地骨架**；仍须 cache key 含 export/layout ABI，并保留 Windows 根目录回归。
- **V-017b / W2：** `wasm_export_names` **已接线**；缺非法 `case` 诊断与可核验 `spy wasm --list`（`twoSum`）。可执行 MIR 仍被 S-W2/S-W3（`ArrayList.new` SMIR010）挡住。
- **V-017c / W3：** library `callExport` + 无 auto-main **已落地**；**缺**签名驱动 JSON↔GC。禁止 harness 合成 `_impl`/witness。
- **V-017d / W4–W5：** 无解 `null` vs 空 `ArrayList` 未统一；无全绿 `run_v_solver` / 非 null `vRuntimeMs`。
- **V-017e，post-0.0.x：** class/方法 export；不阻断方案 A。

**派发顺序：** S-W2/S-W3 → V-017b′ → V-017c′ → V-017d。条目仍为 upstream；骨架 ≠ 端到端通过。

### 字符串 identity 整改（ADR 0013，2026-09-26）

| ID | 工作包 | Owner | 状态 | 备注 |
|----|--------|-------|------|------|
| S-W1 | 冻结合同：`OperatorId` / `IntrinsicId` / `AttributeKind` + CI string gate | `nyar-types` + CI | planned | 见工作区 `内部决策/10-字符串identity整改方案.md` |
| S-W2 | HIR / overload：OperatorId、删除全局 `new` fallback、`AttributeKind` | `nyar-language` | planned | 与 V-017c identity 同链 |
| S-W3 | MIR / executable：`Self` 代入、nominal `Option`/`Result`、`IntrinsicId` | `nyar-language` | planned | 阻塞 `ArrayList.new` SMIR010 正式修复 |
| S-W4 | Emitter：删除 path/类型名特判；nyar 后端 `CallImport` | `nyar-emitter` | planned | 依赖 S-W3 |
| S-W5 | VM + bytecode v2：删除 `CallNative` | `nyar-vm` + `vcc-data` | planned | 与 N-W2 联动 |
| S-W6 | 删旧路径、全量门禁 | 两仓 | planned | 无 compat 转发 |

### 原生栈 VM 三包（ADR 0014，2026-09-26）

| ID | 工作包 | Owner | 状态 | 备注 |
|----|--------|-------|------|------|
| N-W0 | 冻结合同：bytecode v2、legacy PE 废弃声明 | `vcc-data` + `legacy-vm.rs` | planned | 见 `内部决策/11-原生栈VM三包方案.md` |
| N-W1 | `nvm` → `nyar-vm` + `nyar-gc` 实装 + JIT `Unsupported` | `nyar-vm.rs` | **done** | 2026-09-26：`nyar-vm` / `nyar-gc` / `nyar-jit` 三包拆分；mark-sweep GC；`DisabledJit` → `JitError::Unsupported`；`Executor::try_jit_compile` 钩子 |
| N-W2 | bytecode v2 + verify + 语义事实下沉表 | `vcc-data` + `nyar-vm` | planned | ADR 0015；`CallImport`、layout/witness section；依赖 S-W5 |
| N-W3 | Emitter nyar 后端对齐 v2 | `nyar-emitter` | planned | 依赖 N-W2、S-W4 |
| N-W4 | `legion build --target nyar-vm` | `valkyrie.rs` | planned | 不替代 Wasm capability gate |
| N-W5 | legacy 深协议残余 → 共同 bytecode；删 PE 双轨 | `legacy-vm.rs` | planned | ADR 0016 三件套；不要求 guest → Valkyrie MIR |

## 和类型 taxonomy

`unite`（始终 tagged，可自动派生 tag） vs named `union`（untagged） vs 匿名 `A|B|C`（untagged）见 [type-taxonomy.md](type-taxonomy.md)。

## 新增条目模板

```markdown
| V-0xx | 简短名 | open | <slug> 或测试命令 | valkyrie.v 路径 | 阻塞原文或 coach 算法需求 |
```

## 与 phase-1 的关系

已覆盖（通常 **不** 进 backlog，除非 API 损坏）：`ArrayList`、`HashMap`、标量异或、滚动变量、双指针、摩尔投票、小计数表。见
`leetcode-implement/references/v-phase1-capabilities.md`。
