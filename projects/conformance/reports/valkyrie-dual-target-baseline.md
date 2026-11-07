# Valkyrie 双 target 基线

判题绿只证明「与 `metadata.tests[].expected` 一致」，不证明「与题面一致」。

## 范围

- 分母：1161 题（V canonical）。
- `wasm` 与 `ovm` 各自独立构建、独立真跑、独立记账；任一 target 绿不能替代另一个。
- 超时、runtime pending、skipped 单列「未验证」；子进程崩溃与题解缺失单列 `blocked`。

## 环境前提

- `@nyar/valkyrie` 的 `dist/` 必须与源码一致。当前源码已把 OVM 产物入口从 `.nyar` 迁到 `.odin`；旧 `dist` 仍只查 `.nyar`，会把全部 `ovm` 记成「build 成功但未落盘可执行产物入口」。
- `ovm` 输出目录里的旧 `.nyar` 会让 `legion build` 拒绝重建；基线在每题构建前只删除本目录内的 `.nyar` 文件。
- 本次 native 产物：`E:\victory 胜利女神\nyar-vm.rs\projects\nyar.ts\platforms\valkyrie-win32-x64\lib\valkyrie.win32-x64-msvc.node`（36288000 bytes，mtime 2026-11-06T23:37:30.643Z，sha256 `19ab115a412bd2d27a3a03d6b1b2644aa1bd1590ee507ceb0032049c89e7ecbe`）。
- 该 native 是本地工具链实测产物，可能包含兄弟仓未提交改动；数字只代表本次本地环境，不等同已发布 pin 复验。

## wasm

| 指标 | 数量 |
| --- | --- |
| 范围总数（分母） | 1161 |
| 实际尝试 | 200 |
| 通过（真实执行计数完整） | 172 |
| 失败（已执行但不一致） | 27 |
| blocked（无法执行） | 0 |
| 未验证（超时 / runtime pending / skipped） | 1 |
| 未尝试（runner 未覆盖） | 961 |

### 失败分类

- assert-mismatch: 9
- test-data: 2
- build-failure: 11
- skipped-not-pass: 1
- runtime-crash: 1
- validator-required: 1
- entry-contract: 1
- order-only-mismatch: 2

### 批次

| 范围 | Attempted | Pass | Fail | Blocked | Unverified | CaseTotal | ExecutedPass | Seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0-50 | 50 | 41 | 9 | 0 | 0 | 3855 | 3544 | 396 |
| 50-100 | 50 | 42 | 7 | 0 | 1 | 3317 | 3206 | 313 |
| 100-150 | 50 | 46 | 4 | 0 | 0 | 4631 | 4265 | 365 |
| 150-200 | 50 | 43 | 7 | 0 | 0 | 3795 | 3599 | 475 |

## ovm

| 指标 | 数量 |
| --- | --- |
| 范围总数（分母） | 1161 |
| 实际尝试 | 200 |
| 通过（真实执行计数完整） | 34 |
| 失败（已执行但不一致） | 131 |
| blocked（无法执行） | 1 |
| 未验证（超时 / runtime pending / skipped） | 34 |
| 未尝试（runner 未覆盖） | 961 |

### 失败分类

- runtime-crash: 2
- abi-contract: 117
- build-failure: 11
- timeout: 4
- runtime-pending: 30
- validator-required: 1
- assert-mismatch: 1

### 批次

| 范围 | Attempted | Pass | Fail | Blocked | Unverified | CaseTotal | ExecutedPass | Seconds |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0-50 | 50 | 7 | 34 | 1 | 8 | 3288 | 420 | 819 |
| 50-100 | 50 | 6 | 35 | 0 | 9 | 2944 | 400 | 649 |
| 100-150 | 50 | 10 | 31 | 0 | 9 | 3954 | 752 | 795 |
| 150-200 | 50 | 11 | 31 | 0 | 8 | 3092 | 760 | 781 |

## 跨 target

- 已对比（两 target 都有记录）：200
- wasm 与 ovm 都通过：34
- 仅 wasm 通过：138
- 仅 ovm 通过：0
- 两者未通过：28
- 未对比（任一 target 无记录）：961

## 失败原因簇

### wasm

- 1 × [fail] Error: tests[4]: expected "aba", got "bab"（compareMode=strict）
- 1 × [fail] AbiSchemaError: args.num_rows: metadata.tests.args 缺少参数 "num_rows"
- 1 × [fail] legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `height.get` in max_area: 3 candidate(s) share the name, but none matches the argument types --> solution.v:13:25 | 13 | let left:…
- 1 × [fail] Error: tests[3]: expected ["w","x","y","z"], got ["z","{","|","}"]（compareMode=unordered-1d）
- 1 × [fail] legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in mergeTwoLists: no callable with this name is in scope --> solution.v:8:16 | 8 | return option_none::<ArrayList<i64…
- 1 × [fail] executed_pass=117/119（skipped=2）
- 1 × [fail] Error: <--- Last few GCs ---> [39816:000002D08874A000] 48085 ms: Scavenge (interleaved) 4062.3 (4079.4) -> 4052.9 (4114.6) MB, pooled: 0 MB, 22.76 / 0.00 ms (average mu = 0.283, current mu = 0.245) allocation failure; [39816:000002D08874A000] 51093 ms: Mark-Co…
- 1 × [fail] legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): compile pipeline rejected module `leetcode-merge-intervals` (valkyrie.mir.diagnostic_rejected): MIR lowering unresolved callable identity `construct missing HIR callable contract`
- 1 × [fail] Error: tests[90]: expected ["All the world’s a","stage, And all the","men and women merely","players. "], got ["All the world’s a","stage, And all the","men and women merely","players. "]（compareMode=strict）
- 1 × [fail] legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in deleteDuplicates: no callable with this name is in scope --> solution.v:8:16 | 8 | return option_none::<ArrayList<…
- 1 × [fail] Error: 多解题 gray-code 需要题面语义校验，禁止 JSON/规范化比较（题面允许任意合法 Gray 码序列，相邻只差一位是序列属性，排序会破坏合法性）
- 1 × [unverified] ValkyrieEntryContractError: Valkyrie entry contract failure：metadata.invoke.valkyrie 缺失，禁止回退到 metadata.invoke.typescript

### ovm

- 62 × [fail] Error: parse args-json: unsupported feature: JSON array export type/layout contract
- 30 × [unverified] OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- 14 × [fail] Error: serialize result: unsupported feature: JSON object export type/layout contract
- 4 × [unverified] 子进程超时 180000ms
- 2 × [fail] Error: run entry `longestPalindrome`: type mismatch: expected object, got string
- 1 × [blocked] 子进程崩溃（3221226505）：note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace | thread '<unnamed>' panicked at ffis\valkyrie-napi\src\product_api.rs:181:25: | legion build thread panicked: Any { .. }
- 1 × [fail] Error: run entry `lengthOfLongestSubstring`: type mismatch: expected object, got string
- 1 × [fail] Error: run entry `convert`: type mismatch: expected object, got string
- 1 × [fail] Error: run entry `myAtoi`: type mismatch: expected object, got string
- 1 × [fail] legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `height.get` in max_area: 3 candidate(s) share the name, but none matches the argument types --> solution.v:13:25 | 13 | let left:…
- 1 × [fail] Error: run entry `romanToInt`: type mismatch: expected object, got string
- 1 × [fail] Error: run entry `letterCombinations`: type mismatch: expected object, got string

## 逐题失败清单

### wasm

- longest-palindromic-substring [fail/assert-mismatch] pass=4/124 Error: tests[4]: expected "aba", got "bab"（compareMode=strict）
- zigzag-conversion [fail/test-data] pass=0/104 AbiSchemaError: args.num_rows: metadata.tests.args 缺少参数 "num_rows"
- container-with-most-water [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `height.get` in max_area: 3 ca…
- letter-combinations-of-a-phone-number [fail/assert-mismatch] pass=3/76 Error: tests[3]: expected ["w","x","y","z"], got ["z","{","|","}"]（compareMode=unordered-1d）
- merge-two-sorted-lists [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in mergeTwoLists:…
- search-insert-position [fail/skipped-not-pass] pass=117/119 executed_pass=117/119（skipped=2）
- combination-sum [fail/runtime-crash] pass=0/0 Error: <--- Last few GCs ---> [39816:000002D08874A000] 48085 ms: Scavenge (interleaved) 4062.3 (4079.4) -> 4052.9 (4114.6) MB, pooled: 0 MB, 22.76 / 0.00 ms (av…
- merge-intervals [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): compile pipeline rejected module `leetcode-merge-intervals` (valkyrie.mir.diagnosti…
- text-justification [fail/assert-mismatch] pass=90/102 Error: tests[90]: expected ["All the world’s a","stage, And all the","men and women merely","players. "], got ["All the world’s a","stage, And all the","men and…
- remove-duplicates-from-sorted-list [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in deleteDuplicat…
- gray-code [fail/validator-required] pass=0/0 Error: 多解题 gray-code 需要题面语义校验，禁止 JSON/规范化比较（题面允许任意合法 Gray 码序列，相邻只差一位是序列属性，排序会破坏合法性）
- longest-consecutive-sequence [unverified/entry-contract] pass=0/0 ValkyrieEntryContractError: Valkyrie entry contract failure：metadata.invoke.valkyrie 缺失，禁止回退到 metadata.invoke.typescript
- max-points-on-a-line [fail/assert-mismatch] pass=95/108 Error: tests[95]: expected "14", got "10"（compareMode=strict）
- two-sum-ii-input-array-is-sorted [fail/assert-mismatch] pass=29/89 Error: tests[29]: expected null, got []（compareMode=strict）
- excel-sheet-column-title [fail/test-data] pass=0/38 AbiSchemaError: args.column_number: metadata.tests.args 缺少参数 "column_number"
- largest-number [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): compile pipeline rejected module `leetcode-largest-number` (SMIR007): Semantic MIR …
- remove-linked-list-elements [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in removeElements…
- isomorphic-strings [fail/assert-mismatch] pass=53/131 Error: tests[53]: expected true, got false（compareMode=strict）
- reverse-linked-list [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in reverseList: n…
- sliding-window-maximum [fail/assert-mismatch] pass=3/104 Error: tests[3]: expected ["9","8","7","6","5","4"], got ["9","9","8","7","6","5"]（compareMode=strict）
- different-ways-to-add-parentheses [fail/assert-mismatch] pass=2/189 Error: tests[2]: expected [], got ["9159","9165"]（compareMode=unordered-1d）
- rearrange-string-k-distance-apart [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): compile pipeline rejected module `leetcode-rearrange-string-k-distance-apart` (SMIR…
- find-k-pairs-with-smallest-sums [fail/order-only-mismatch] pass=0/102 Error: tests[0]: expected [["1","3"],["2","3"]], got [["2","3"],["1","3"]]（compareMode=strict）
- decode-string [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): compile pipeline rejected module `leetcode-decode-string` (CAN054): sum 物理 payload …
- convert-a-number-to-hexadecimal [fail/assert-mismatch] pass=22/60 Error: tests[22]: expected "", got "10000000000"（compareMode=strict）
- third-maximum-number [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): compile pipeline rejected module `leetcode-third-maximum-number` (SMIR007): Semanti…
- non-overlapping-intervals [fail/build-failure] pass=0/0 legion build --target wasm32-unknown-unknown-wasm failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `sort` in order_items: candida…
- find-all-duplicates-in-an-array [fail/order-only-mismatch] pass=5/61 Error: tests[5]: expected ["5","6","9"], got ["9","5","6"]（compareMode=strict）

### ovm

- two-sum [blocked/runtime-crash] pass=0/0 子进程崩溃（3221226505）：note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace | thread '<unnamed>' (43996) panicked at ffis\valkyrie-napi\src\…
- add-two-numbers [fail/abi-contract] pass=0/59 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- longest-substring-without-repeating-characters [fail/abi-contract] pass=0/36 Error: run entry `lengthOfLongestSubstring`: type mismatch: expected object, got string
- longest-palindromic-substring [fail/abi-contract] pass=0/124 Error: run entry `longestPalindrome`: type mismatch: expected object, got string
- zigzag-conversion [fail/abi-contract] pass=0/104 Error: run entry `convert`: type mismatch: expected object, got string
- string-to-integer-atoi [fail/abi-contract] pass=0/185 Error: run entry `myAtoi`: type mismatch: expected object, got string
- container-with-most-water [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `height.get` in max_area: 3 ca…
- integer-to-roman [fail/abi-contract] pass=0/77 Error: serialize result: unsupported feature: JSON object export type/layout contract
- roman-to-integer [fail/abi-contract] pass=0/94 Error: run entry `romanToInt`: type mismatch: expected object, got string
- longest-common-prefix [fail/abi-contract] pass=0/148 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- 3sum [fail/abi-contract] pass=0/104 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- letter-combinations-of-a-phone-number [fail/abi-contract] pass=0/76 Error: run entry `letterCombinations`: type mismatch: expected object, got string
- valid-parentheses [fail/abi-contract] pass=0/148 Error: run entry `isValid`: type mismatch: expected object, got string
- merge-two-sorted-lists [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in mergeTwoLists:…
- generate-parentheses [unverified/timeout] pass=0/0 子进程超时 180000ms
- remove-duplicates-from-sorted-array [fail/abi-contract] pass=0/127 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- remove-element [fail/abi-contract] pass=0/112 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- find-the-index-of-the-first-occurrence-in-a-string [fail/abi-contract] pass=0/144 Error: run entry `strStr`: type mismatch: expected object, got string
- substring-with-concatenation-of-all-words [fail/abi-contract] pass=0/94 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- next-permutation [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- find-first-and-last-position-of-element-in-sorted-array [fail/abi-contract] pass=0/137 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- search-insert-position [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- valid-sudoku [fail/abi-contract] pass=0/19 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- count-and-say [fail/abi-contract] pass=0/28 Error: run entry `countAndSay`: type mismatch: expected object, got string
- combination-sum [fail/abi-contract] pass=0/115 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- first-missing-positive [fail/abi-contract] pass=0/126 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- trapping-rain-water [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- multiply-strings [fail/abi-contract] pass=0/72 Error: run entry `multiply`: type mismatch: expected object, got i64
- jump-game-ii [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- rotate-image [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- group-anagrams [fail/abi-contract] pass=0/69 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- n-queens [fail/abi-contract] pass=0/9 Error: serialize result: unsupported feature: JSON object export type/layout contract
- maximum-subarray [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- spiral-matrix [fail/abi-contract] pass=0/53 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- jump-game [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- merge-intervals [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): compile pipeline rejected module `leetcode-merge-intervals` (valkyrie.mir.diagnosti…
- length-of-last-word [fail/abi-contract] pass=0/48 Error: run entry `lengthOfLastWord`: type mismatch: expected object, got string
- spiral-matrix-ii [fail/abi-contract] pass=0/20 Error: serialize result: unsupported feature: JSON object export type/layout contract
- minimum-path-sum [fail/abi-contract] pass=0/77 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- plus-one [fail/abi-contract] pass=0/77 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- add-binary [fail/abi-contract] pass=0/86 Error: run entry `addBinary`: type mismatch: expected object, got string
- text-justification [fail/abi-contract] pass=0/102 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- simplify-path [fail/abi-contract] pass=0/198 Error: run entry `simplifyPath`: type mismatch: expected object, got string
- set-matrix-zeroes [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- sort-colors [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- combinations [fail/abi-contract] pass=0/60 Error: serialize result: unsupported feature: JSON object export type/layout contract
- subsets [fail/abi-contract] pass=0/93 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- remove-duplicates-from-sorted-array-ii [fail/abi-contract] pass=0/128 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- remove-duplicates-from-sorted-list [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in deleteDuplicat…
- merge-sorted-array [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- gray-code [fail/validator-required] pass=0/0 Error: 多解题 gray-code 需要题面语义校验，禁止 JSON/规范化比较（题面允许任意合法 Gray 码序列，相邻只差一位是序列属性，排序会破坏合法性）
- restore-ip-addresses [fail/abi-contract] pass=0/143 Error: run entry `restoreIpAddresses`: type mismatch: expected object, got string
- binary-tree-inorder-traversal [fail/abi-contract] pass=0/24 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- same-tree [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- symmetric-tree [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- maximum-depth-of-binary-tree [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- balanced-binary-tree [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- minimum-depth-of-binary-tree [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- pascals-triangle [fail/abi-contract] pass=0/16 Error: serialize result: unsupported feature: JSON object export type/layout contract
- pascals-triangle-ii [fail/abi-contract] pass=0/20 Error: serialize result: unsupported feature: JSON object export type/layout contract
- triangle [fail/abi-contract] pass=0/88 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- best-time-to-buy-and-sell-stock [fail/abi-contract] pass=0/99 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- best-time-to-buy-and-sell-stock-ii [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- valid-palindrome [fail/abi-contract] pass=0/21 Error: run entry `isPalindrome`: type mismatch: expected object, got string
- word-ladder [fail/abi-contract] pass=0/13 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- longest-consecutive-sequence [fail/abi-contract] pass=0/138 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- single-number [fail/abi-contract] pass=0/108 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- single-number-ii [fail/abi-contract] pass=0/86 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- word-break [fail/abi-contract] pass=0/87 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- binary-tree-preorder-traversal [fail/abi-contract] pass=0/12 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- binary-tree-postorder-traversal [fail/abi-contract] pass=0/20 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- max-points-on-a-line [fail/abi-contract] pass=0/108 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- reverse-words-in-a-string [fail/abi-contract] pass=0/44 Error: run entry `reverseWords`: type mismatch: expected object, got string
- maximum-product-subarray [fail/abi-contract] pass=0/91 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- find-minimum-in-rotated-sorted-array [fail/abi-contract] pass=0/87 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- missing-ranges [fail/abi-contract] pass=0/127 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- maximum-gap [fail/abi-contract] pass=0/127 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- two-sum-ii-input-array-is-sorted [fail/abi-contract] pass=0/89 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- excel-sheet-column-title [fail/abi-contract] pass=0/38 Error: serialize result: unsupported feature: JSON object export type/layout contract
- majority-element [fail/abi-contract] pass=0/45 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- excel-sheet-column-number [fail/abi-contract] pass=0/201 Error: run entry `titleToNumber`: type mismatch: expected object, got string
- largest-number [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): compile pipeline rejected module `leetcode-largest-number` (SMIR007): Semantic MIR …
- reverse-words-in-a-string-ii [fail/abi-contract] pass=0/59 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- repeated-dna-sequences [fail/abi-contract] pass=0/137 Error: run entry `findRepeatedDnaSequences`: type mismatch: expected object, got string
- rotate-array [fail/abi-contract] pass=0/118 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- house-robber [fail/abi-contract] pass=0/117 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- remove-linked-list-elements [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in removeElements…
- count-primes [unverified/timeout] pass=0/0 子进程超时 180000ms
- isomorphic-strings [fail/abi-contract] pass=0/131 Error: run entry `isIsomorphic`: type mismatch: expected object, got string
- reverse-linked-list [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `<fn value>` in reverseList: n…
- house-robber-ii [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- kth-largest-element-in-an-array [fail/abi-contract] pass=0/78 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- combination-sum-iii [fail/abi-contract] pass=0/62 Error: serialize result: unsupported feature: JSON object export type/layout contract
- contains-duplicate [fail/abi-contract] pass=0/94 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- contains-duplicate-ii [fail/abi-contract] pass=0/106 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- contains-duplicate-iii [fail/abi-contract] pass=0/238 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- count-complete-tree-nodes [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- basic-calculator-ii [fail/abi-contract] pass=0/171 Error: run entry `calculate`: type mismatch: expected object, got string
- summary-ranges [fail/abi-contract] pass=0/120 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- palindrome-linked-list [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- sliding-window-maximum [fail/abi-contract] pass=0/104 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- different-ways-to-add-parentheses [fail/abi-contract] pass=0/189 Error: run entry `diffWaysToCompute`: type mismatch: expected object, got string
- valid-anagram [fail/abi-contract] pass=0/107 Error: run entry `isAnagram`: type mismatch: expected object, got string
- shortest-word-distance [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- strobogrammatic-number [fail/abi-contract] pass=0/180 Error: run entry `isStrobogrammatic`: type mismatch: expected object, got string
- meeting-rooms [fail/abi-contract] pass=0/101 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- meeting-rooms-ii [fail/abi-contract] pass=0/107 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- factor-combinations [fail/abi-contract] pass=0/58 Error: serialize result: unsupported feature: JSON object export type/layout contract
- verify-preorder-sequence-in-binary-search-tree [fail/abi-contract] pass=0/97 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- binary-tree-paths [fail/abi-contract] pass=0/14 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- single-number-iii [fail/abi-contract] pass=0/50 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- palindrome-permutation [fail/abi-contract] pass=0/105 Error: run entry `canPermutePalindrome`: type mismatch: expected object, got string
- palindrome-permutation-ii [fail/abi-contract] pass=0/106 Error: run entry `generatePalindromes`: type mismatch: expected object, got string
- missing-number [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- closest-binary-search-tree-value [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- paint-fence [fail/assert-mismatch] pass=7/103 Error: tests[7]: expected "8544194047146303810", got 8544194047146303000
- move-zeroes [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- find-the-duplicate-number [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- word-pattern [fail/abi-contract] pass=0/147 Error: run entry `wordPattern`: type mismatch: expected object, got string
- flip-game [fail/abi-contract] pass=0/129 Error: run entry `generatePossibleNextMoves`: type mismatch: expected object, got string
- bulls-and-cows [fail/abi-contract] pass=0/115 Error: run entry `getHint`: type mismatch: expected object, got string
- longest-increasing-subsequence [fail/abi-contract] pass=0/134 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- number-of-islands-ii [fail/abi-contract] pass=0/81 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- minimum-height-trees [fail/abi-contract] pass=0/65 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- burst-balloons [fail/abi-contract] pass=0/96 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- maximum-product-of-word-lengths [fail/abi-contract] pass=0/67 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- generalized-abbreviation [fail/abi-contract] pass=0/54 Error: run entry `generateAbbreviations`: type mismatch: expected object, got string
- coin-change [fail/abi-contract] pass=0/127 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- counting-bits [fail/abi-contract] pass=0/50 Error: serialize result: unsupported feature: JSON object export type/layout contract
- longest-substring-with-at-most-k-distinct-characters [fail/abi-contract] pass=0/118 Error: run entry `lengthOfLongestSubstringKDistinct`: type mismatch: expected object, got string
- reverse-string [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- reverse-vowels-of-a-string [fail/abi-contract] pass=0/38 Error: run entry `reverseVowels`: type mismatch: expected object, got string
- top-k-frequent-elements [fail/abi-contract] pass=0/34 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- intersection-of-two-arrays [fail/abi-contract] pass=0/124 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- intersection-of-two-arrays-ii [fail/abi-contract] pass=0/137 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- android-unlock-patterns [unverified/timeout] pass=0/0 子进程超时 180000ms
- rearrange-string-k-distance-apart [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): compile pipeline rejected module `leetcode-rearrange-string-k-distance-apart` (SMIR…
- sum-of-two-integers [fail/runtime-crash] pass=0/0 Error: thread '<unnamed>' (35172) panicked at runtimes\odin-vm\src\host.rs:520:41: attempt to multiply with overflow note: run with `RUST_BACKTRACE=1` environme…
- find-k-pairs-with-smallest-sums [fail/abi-contract] pass=0/102 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- guess-number-higher-or-lower-ii [unverified/timeout] pass=0/0 子进程超时 180000ms
- kth-smallest-element-in-a-sorted-matrix [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- ransom-note [fail/abi-contract] pass=0/142 Error: run entry `canConstruct`: type mismatch: expected object, got string
- lexicographical-numbers [fail/abi-contract] pass=0/68 Error: serialize result: unsupported feature: JSON object export type/layout contract
- first-unique-character-in-a-string [fail/abi-contract] pass=0/91 Error: run entry `firstUniqChar`: type mismatch: expected object, got string
- find-the-difference [fail/abi-contract] pass=0/85 Error: run entry `findTheDifference`: type mismatch: expected object, got string
- is-subsequence [fail/abi-contract] pass=0/69 Error: run entry `isSubsequence`: type mismatch: expected object, got string
- utf-8-validation [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- decode-string [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): compile pipeline rejected module `leetcode-decode-string` (CAN054): sum 物理 payload …
- binary-watch [fail/abi-contract] pass=0/12 Error: serialize result: unsupported feature: JSON object export type/layout contract
- sum-of-left-leaves [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- convert-a-number-to-hexadecimal [fail/abi-contract] pass=0/60 Error: serialize result: unsupported feature: JSON object export type/layout contract
- queue-reconstruction-by-height [fail/abi-contract] pass=0/101 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- valid-word-abbreviation [fail/abi-contract] pass=0/234 Error: run entry `validWordAbbreviation`: type mismatch: expected object, got string
- longest-palindrome [fail/abi-contract] pass=0/68 Error: run entry `longestPalindrome`: type mismatch: expected object, got string
- fizz-buzz [fail/abi-contract] pass=0/56 Error: serialize result: unsupported feature: JSON object export type/layout contract
- arithmetic-slices [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- third-maximum-number [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): compile pipeline rejected module `leetcode-third-maximum-number` (SMIR007): Semanti…
- add-strings [fail/abi-contract] pass=0/95 Error: run entry `addStrings`: type mismatch: expected object, got string
- maximum-xor-of-two-numbers-in-an-array [fail/abi-contract] pass=0/102 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- valid-word-square [unverified/runtime-pending] pass=0/0 OVM 产物没有可导出符号，确认 legion build --target ovm 是否成功
- longest-repeating-character-replacement [fail/abi-contract] pass=0/105 Error: run entry `characterReplacement`: type mismatch: expected object, got string
- number-of-segments-in-a-string [fail/abi-contract] pass=0/38 Error: run entry `countSegments`: type mismatch: expected object, got string
- non-overlapping-intervals [fail/build-failure] pass=0/0 legion build --target ovm-unknown-unknown-managed failed (napi:legionBuild): error[valkyrie.hir.unresolved_call]: unresolved call `sort` in order_items: candida…
- find-right-interval [fail/abi-contract] pass=0/113 Error: parse args-json: unsupported feature: JSON array export type/layout contract
- find-all-anagrams-in-a-string [fail/abi-contract] pass=0/102 Error: run entry `findAnagrams`: type mismatch: expected object, got string
- find-all-duplicates-in-an-array [fail/abi-contract] pass=0/61 Error: parse args-json: unsupported feature: JSON array export type/layout contract

