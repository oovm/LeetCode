# 宿主异常 expected 清理审计

- 日期：2026-11-07
- 口径：宿主异常文本或 Execution timed out 的 expected 不是答案：整题异常用例占比 >= 50% 判为题解未解出并 blocked；其余按生成时把异常当结果落盘，作废该条用例。
- 清理前用例：29383
- 作废用例：3878
- 清理后用例：25505
- 涉及题数：300（blocked 19，仅删用例 281，dirty 保护 3）

## 异常文本分类

| 类别 | 条数 |
| --- | --- |
| `other-error` | 1673 |
| `index` | 1397 |
| `timeout` | 432 |
| `recursion` | 409 |
| `shift` | 4 |

## blocked（整题几乎全为宿主异常，题解未解出）

| 题目 | 原用例 | 作废 | 剩余 | 首个复现用例 |
| --- | --- | --- | --- | --- |
| `check-if-dfs-strings-are-palindromes` | 95 | 56 | 39 | `tests[0]` args={"parent":[-1,0,1,2,3,4],"s":"abcdefg"} expected=`Error: list index out of range` |
| `clone-binary-tree-with-random-pointer` | 9 | 8 | 1 | `tests[0]` args={"root":[[1,1],[2,2],[3,3]]} expected=`Error: unhashable type: 'list'` |
| `construct-binary-tree-from-preorder-and-postorder-traversal` | 79 | 50 | 29 | `tests[1]` args={"preorder":[1,2,3,4,5,6,7,8],"postorder":[4,5,2,6,7,3,8,1]} expected=`Error: list index out of range` |
| `dice-roll-simulation` | 136 | 95 | 41 | `tests[6]` args={"n":1000,"rollMax":[15,15,15,15,15,15]} expected=`Error: maximum recursion depth exceeded` |
| `find-if-path-exists-in-graph` | 64 | 60 | 4 | `tests[0]` args={"n":6,"edges":[[0,1],[0,2],[3,5],[5,4],[4,3]],"source":0,"destination":5} expected=`Error: maximum recursion depth exceeded` |
| `find-the-k-th-character-in-string-game-ii` | 102 | 55 | 47 | `tests[1]` args={"k":987654321,"operations":[1,0,1,0,1,0,1,0,1]} expected=`Error: list index out of range` |
| `find-the-number-of-k-even-arrays` | 119 | 64 | 55 | `tests[0]` args={"n":750,"m":1000,"k":0} expected=`Error: maximum recursion depth exceeded` |
| `intersection-of-two-linked-lists` | 129 | 119 | 10 | `tests[0]` args={"headA":[2,6,4],"headB":[1,5],"skipA":3,"skipB":2} expected=`Error: Solution.getIntersectionNode() got an unexpected keyword argument 'skipA'` |
| `linked-list-cycle` | 123 | 117 | 6 | `tests[0]` args={"head":[3,2,0,-4],"pos":1} expected=`Error: Solution.hasCycle() got an unexpected keyword argument 'pos'` |
| `minimum-moves-to-spread-stones-over-grid` | 112 | 73 | 39 | `tests[5]` args={"grid":[[2,0,0],[0,0,0],[0,0,1]]} expected=`Execution timed out` |
| `minimum-path-cost-in-a-grid` | 60 | 32 | 28 | `tests[2]` args={"grid":[[10,15],[20,25],[30,35]],"moveCost":[[5,7],[3,4],[8,2],[6,9]]} expected=`Error: list index out of range` |
| `number-of-unique-categories` | 78 | 77 | 1 | `tests[0]` args={"n":6,"categoryHandler":[1,1,2,2,3,3]} expected=`Error: 'list' object has no attribute 'haveSameCategory'` |
| `recover-binary-search-tree` | 41 | 25 | 16 | `tests[3]` args={"root":[7,3,15,1,5,9,20]} expected=`Error: 'NoneType' object has no attribute 'val'` |
| `reverse-odd-levels-of-binary-tree` | 33 | 17 | 16 | `tests[3]` args={"root":[6,5,4,3,2,1,0,9,8,7,6,5,4,3,2,1]} expected=`Error: 'NoneType' object has no attribute 'left'` |
| `shortest-matching-substring` | 172 | 119 | 53 | `tests[0]` args={"s":"ab","p":"a*b"} expected=`Error: not enough values to unpack (expected 3, got 2)` |
| `sort-an-array` | 122 | 117 | 5 | `tests[0]` args={"nums":[-4,-2,-3,-1]} expected=`Error: name 'randint' is not defined` |
| `stone-game-iv` | 66 | 42 | 24 | `tests[2]` args={"n":100000} expected=`Error: maximum recursion depth exceeded` |
| `ternary-expression-parser` | 59 | 34 | 25 | `tests[3]` args={"expression":"F?T?F?T?F?9:8:7:6:5"} expected=`Error: list index out of range` |
| `zuma-game` | 330 | 329 | 1 | `tests[0]` args={"board":"RRR","hand":"RRR"} expected=`Error: name 're' is not defined` |

## 仅作废异常用例（其余用例保留）

| 题目 | 原用例 | 作废 | 剩余 |
| --- | --- | --- | --- |
| `block-placement-queries` | 226 | 95 | 131 |
| `find-array-given-subset-sums` | 166 | 77 | 89 |
| `check-if-a-parentheses-string-can-be-valid` | 126 | 45 | 81 |
| `palindrome-rearrangement-queries` | 94 | 43 | 51 |
| `maximize-active-section-with-trade-ii` | 84 | 41 | 43 |
| `find-subtree-sizes-after-changes` | 101 | 40 | 61 |
| `generalized-abbreviation` | 94 | 40 | 54 |
| `find-all-duplicates-in-an-array` | 96 | 35 | 61 |
| `minimum-unique-word-abbreviation` | 100 | 35 | 65 |
| `shortest-distance-after-road-addition-queries-ii` | 72 | 35 | 37 |
| `slowest-key` | 72 | 34 | 38 |
| `parse-lisp-expression` | 143 | 32 | 111 |
| `swim-in-rising-water` | 65 | 32 | 33 |
| `construct-binary-tree-from-inorder-and-postorder-traversal` | 73 | 31 | 42 |
| `element-appearing-more-than-25-in-sorted-array` | 114 | 31 | 83 |
| `palindrome-permutation-ii` | 137 | 31 | 106 |
| `evaluate-boolean-binary-tree` | 99 | 30 | 69 |
| `minimum-cost-for-cutting-cake-i` | 85 | 30 | 55 |
| `smallest-missing-genetic-value-in-each-subtree` | 68 | 30 | 38 |
| `find-all-possible-stable-binary-arrays-ii` | 95 | 29 | 66 |
| `different-ways-to-add-parentheses` | 217 | 28 | 189 |
| `length-of-the-longest-increasing-path` | 127 | 26 | 101 |
| `non-decreasing-subsequences` | 129 | 26 | 103 |
| `shuffle-string` | 87 | 26 | 61 |
| `find-number-of-coins-to-place-in-tree-nodes` | 72 | 25 | 47 |
| `find-the-maximum-sequence-value-of-array` | 90 | 25 | 65 |
| `longest-path-with-different-adjacent-characters` | 73 | 24 | 49 |
| `k-similar-strings` | 69 | 22 | 47 |
| `restore-the-array-from-adjacent-pairs` | 101 | 22 | 79 |
| `couples-holding-hands` | 102 | 21 | 81 |
| `count-substrings-that-satisfy-k-constraint-ii` | 92 | 20 | 72 |
| `count-the-number-of-k-big-indices` | 105 | 20 | 85 |
| `find-all-good-strings` | 49 | 20 | 29 |
| `number-of-nodes-in-the-sub-tree-with-the-same-label` | 64 | 20 | 44 |
| `solve-the-equation` | 273 | 20 | 253 |
| `apply-substitutions` | 58 | 19 | 39 |
| `longest-special-path-ii` | 60 | 19 | 41 |
| `number-of-same-end-substrings` | 81 | 19 | 62 |
| `number-of-ways-to-form-a-target-string-given-a-dictionary` | 167 | 19 | 148 |
| `check-if-an-original-string-exists-given-two-encoded-strings` | 213 | 18 | 195 |
| `maximum-number-of-removable-characters` | 100 | 18 | 82 |
| `new-21-game` | 81 | 18 | 63 |
| `arithmetic-subarrays` | 146 | 17 | 129 |
| `count-paths-that-can-form-a-palindrome-in-a-tree` | 66 | 17 | 49 |
| `find-missing-and-repeated-values` | 86 | 17 | 69 |
| `can-make-palindrome-from-substring` | 109 | 16 | 93 |
| `longest-arithmetic-subsequence` | 175 | 16 | 159 |
| `keys-and-rooms` | 101 | 15 | 86 |
| `minimum-time-to-finish-the-race` | 115 | 15 | 100 |
| `most-profitable-path-in-a-tree` | 65 | 15 | 50 |
| `paint-house-iii` | 82 | 15 | 67 |
| `palindrome-partitioning` | 143 | 15 | 128 |
| `construct-binary-tree-from-preorder-and-inorder-traversal` | 75 | 14 | 61 |
| `equal-rational-numbers` | 169 | 14 | 155 |
| `flip-game-ii` | 151 | 14 | 137 |
| `largest-color-value-in-a-directed-graph` | 98 | 14 | 84 |
| `maximize-the-number-of-target-nodes-after-connecting-trees-ii` | 63 | 14 | 49 |
| `analyze-user-website-visit-pattern` | 74 | 13 | 61 |
| `decoded-string-at-index` | 114 | 13 | 101 |
| `equal-row-and-column-pairs` | 77 | 13 | 64 |
| `minimum-edge-reversals-so-every-node-is-reachable` | 55 | 13 | 42 |
| `number-of-paths-with-max-score` | 108 | 13 | 95 |
| `removing-stars-from-a-string` | 78 | 13 | 65 |
| `smallest-string-with-swaps` | 87 | 13 | 74 |
| `split-a-string-into-the-max-number-of-unique-substrings` | 115 | 13 | 102 |
| `maximum-points-after-collecting-coins-from-all-nodes` | 67 | 12 | 55 |
| `minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix` | 65 | 12 | 53 |
| `number-of-ways-to-stay-in-the-same-place-after-some-steps` | 77 | 12 | 65 |
| `word-break-ii` | 71 | 12 | 59 |
| `check-knight-tour-configuration` | 65 | 11 | 54 |
| `lexicographically-smallest-equivalent-string` | 109 | 11 | 98 |
| `maximize-sum-of-weights-after-edge-removals` | 76 | 11 | 65 |
| `minimum-number-of-people-to-teach` | 84 | 11 | 73 |
| `construct-2d-grid-matching-graph-layout` | 45 | 10 | 35 |
| `count-unguarded-cells-in-the-grid` | 93 | 10 | 83 |
| `k-th-smallest-prime-fraction` | 61 | 10 | 51 |
| `reverse-substrings-between-each-pair-of-parentheses` | 103 | 10 | 93 |
| `shifting-letters-ii` | 104 | 10 | 94 |
| `shortest-path-to-get-all-keys` | 71 | 10 | 61 |
| `time-taken-to-mark-all-nodes` | 64 | 10 | 54 |
| `tree-of-coprimes` | 41 | 10 | 31 |
| `count-connected-components-in-lcm-graph` | 100 | 9 | 91 |
| `count-different-palindromic-subsequences` | 88 | 9 | 79 |
| `count-unhappy-friends` | 46 | 9 | 37 |
| `divide-array-into-arrays-with-max-difference` | 104 | 9 | 95 |
| `longest-cycle-in-a-graph` | 118 | 9 | 109 |
| `longest-substring-of-one-repeating-character` | 89 | 9 | 80 |
| `make-costs-of-paths-equal-in-a-binary-tree` | 59 | 9 | 50 |
| `maximum-hamming-distances` | 81 | 9 | 72 |
| `minimum-time-to-make-rope-colorful` | 100 | 9 | 91 |
| `find-the-maximum-length-of-valid-subsequence-ii` | 133 | 8 | 125 |
| `height-of-binary-tree-after-subtree-removal-queries` | 30 | 8 | 22 |
| `letter-tile-possibilities` | 82 | 8 | 74 |
| `maximum-segment-sum-after-removals` | 98 | 8 | 90 |
| `minimum-number-of-removals-to-make-mountain-array` | 115 | 8 | 107 |
| `movement-of-robots` | 118 | 8 | 110 |
| `pyramid-transition-matrix` | 81 | 8 | 73 |
| `baseball-game` | 83 | 7 | 76 |
| `cat-and-mouse-ii` | 64 | 7 | 57 |
| `count-all-possible-routes` | 103 | 7 | 96 |
| `divide-an-array-into-subarrays-with-minimum-cost-ii` | 200 | 7 | 193 |
| `evaluate-reverse-polish-notation` | 104 | 7 | 97 |
| `find-the-shortest-superstring` | 103 | 7 | 96 |
| `maximum-number-of-achievable-transfer-requests` | 78 | 7 | 71 |
| `minimum-incompatibility` | 98 | 7 | 91 |
| `minimum-score-after-removals-on-a-tree` | 62 | 7 | 55 |
| `longest-common-suffix-queries` | 90 | 6 | 84 |
| `making-a-large-island` | 87 | 6 | 81 |
| `maximum-number-of-moves-to-kill-all-pawns` | 103 | 6 | 97 |
| `maximum-score-after-applying-operations-on-a-tree` | 53 | 6 | 47 |
| `minimum-operations-to-make-numbers-non-positive` | 110 | 6 | 104 |
| `count-the-number-of-good-subarrays` | 121 | 5 | 116 |
| `count-visited-nodes-in-a-directed-graph` | 96 | 5 | 91 |
| `delete-columns-to-make-sorted-ii` | 210 | 5 | 205 |
| `delete-columns-to-make-sorted-iii` | 105 | 5 | 100 |
| `distance-between-bus-stops` | 73 | 5 | 68 |
| `find-the-number-of-subsequences-with-equal-gcd` | 111 | 5 | 106 |
| `first-day-where-you-have-been-in-all-the-rooms` | 115 | 5 | 110 |
| `longest-common-subsequence-between-sorted-arrays` | 101 | 5 | 96 |
| `maximize-the-number-of-target-nodes-after-connecting-trees-i` | 63 | 5 | 58 |
| `maximum-points-inside-the-square` | 105 | 5 | 100 |
| `minimum-edge-weight-equilibrium-queries-in-a-tree` | 35 | 5 | 30 |
| `minimum-number-game` | 96 | 5 | 91 |
| `points-that-intersect-with-cars` | 90 | 5 | 85 |
| `product-of-two-run-length-encoded-arrays` | 104 | 5 | 99 |
| `range-addition` | 115 | 5 | 110 |
| `robot-collisions` | 143 | 5 | 138 |
| `similar-string-groups` | 62 | 5 | 57 |
| `sudoku-solver` | 28 | 5 | 23 |
| `super-ugly-number` | 100 | 5 | 95 |
| `time-taken-to-cross-the-door` | 102 | 5 | 97 |
| `cells-with-odd-values-in-a-matrix` | 79 | 4 | 75 |
| `create-components-with-same-value` | 53 | 4 | 49 |
| `decompress-run-length-encoded-list` | 90 | 4 | 86 |
| `delete-columns-to-make-sorted` | 103 | 4 | 99 |
| `find-anagram-mappings` | 85 | 4 | 81 |
| `find-the-closest-marked-node` | 78 | 4 | 74 |
| `maximum-subtree-of-the-same-color` | 86 | 4 | 82 |
| `number-of-substrings-with-fixed-ratio` | 101 | 4 | 97 |
| `relocate-marbles` | 101 | 4 | 97 |
| `scramble-string` | 113 | 4 | 109 |
| `shifting-letters` | 92 | 4 | 88 |
| `shortest-distance-to-target-color` | 93 | 4 | 89 |
| `sort-array-by-moving-items-to-empty-space` | 165 | 4 | 161 |
| `sort-items-by-groups-respecting-dependencies` | 76 | 4 | 72 |
| `spiral-matrix-iv` | 104 | 4 | 100 |
| `closest-equal-element-queries` | 96 | 3 | 93 |
| `combination-sum` | 118 | 3 | 115 |
| `construct-binary-tree-from-string` | 113 | 3 | 110 |
| `continuous-subarray-sum` | 124 | 3 | 121 |
| `cracking-the-safe` | 22 | 3 | 19 |
| `delete-tree-nodes` | 79 | 3 | 76 |
| `distribute-repeating-integers` | 65 | 3 | 62 |
| `friends-of-appropriate-ages` | 105 | 3 | 102 |
| `intersection-of-multiple-arrays` | 96 | 3 | 93 |
| `longest-subsequence-repeated-k-times` | 92 | 3 | 89 |
| `make-the-xor-of-all-segments-equal-to-zero` | 116 | 3 | 113 |
| `maximize-value-of-function-in-a-ball-passing-game` | 112 | 3 | 109 |
| `maximum-employees-to-be-invited-to-a-meeting` | 130 | 3 | 127 |
| `maximum-points-tourist-can-earn` | 55 | 3 | 52 |
| `maximum-score-from-grid-operations` | 78 | 3 | 75 |
| `minimum-array-changes-to-make-differences-equal` | 104 | 3 | 101 |
| `minimum-falling-path-sum-ii` | 86 | 3 | 83 |
| `minimum-number-of-operations-to-satisfy-conditions` | 111 | 3 | 108 |
| `minimum-time-takes-to-reach-destination-without-drowning` | 89 | 3 | 86 |
| `minimum-time-to-complete-all-tasks` | 115 | 3 | 112 |
| `search-suggestions-system` | 112 | 3 | 109 |
| `sequence-reconstruction` | 86 | 3 | 83 |
| `sliding-subarray-beauty` | 109 | 3 | 106 |
| `special-array-ii` | 86 | 3 | 83 |
| `winner-of-the-linked-list-game` | 98 | 3 | 95 |
| `amount-of-new-area-painted-each-day` | 107 | 2 | 105 |
| `available-captures-for-rook` | 60 | 2 | 58 |
| `bricks-falling-when-hit` | 157 | 2 | 155 |
| `car-fleet-ii` | 97 | 2 | 95 |
| `closest-subsequence-sum` | 100 | 2 | 98 |
| `count-good-triplets-in-an-array` | 102 | 2 | 100 |
| `count-number-of-maximum-bitwise-or-subsets` | 115 | 2 | 113 |
| `count-subarrays-with-median-k` | 81 | 2 | 79 |
| `count-words-obtained-after-adding-a-letter` | 70 | 2 | 68 |
| `difference-between-maximum-and-minimum-price-sum` | 60 | 2 | 58 |
| `disconnect-path-in-a-binary-matrix-by-at-most-one-flip` | 83 | 2 | 81 |
| `find-substring-with-given-hash-value` | 98 | 2 | 96 |
| `fruits-into-baskets-ii` | 109 | 2 | 107 |
| `is-graph-bipartite` | 105 | 2 | 103 |
| `jump-game-viii` | 117 | 2 | 115 |
| `kill-process` | 68 | 2 | 66 |
| `longest-unequal-adjacent-groups-subsequence-i` | 209 | 2 | 207 |
| `maximize-subarrays-after-removing-one-conflicting-pair` | 74 | 2 | 72 |
| `maximize-the-minimum-game-score` | 97 | 2 | 95 |
| `maximum-number-of-darts-inside-of-a-circular-dartboard` | 132 | 2 | 130 |
| `maximum-path-quality-of-a-graph` | 91 | 2 | 89 |
| `maximum-sum-with-at-most-k-elements` | 92 | 2 | 90 |
| `minimized-maximum-of-products-distributed-to-any-store` | 110 | 2 | 108 |
| `minimum-cost-to-convert-string-ii` | 93 | 2 | 91 |
| `minimum-operations-to-make-elements-within-k-subarrays-equal` | 82 | 2 | 80 |
| `minimum-processing-time` | 87 | 2 | 85 |
| `number-of-ways-of-cutting-a-pizza` | 74 | 2 | 72 |
| `partition-array-into-two-arrays-to-minimize-sum-difference` | 90 | 2 | 88 |
| `powx-n` | 85 | 2 | 83 |
| `redundant-connection-ii` | 96 | 2 | 94 |
| `sell-diminishing-valued-colored-balls` | 90 | 2 | 88 |
| `semi-ordered-permutation` | 101 | 2 | 99 |
| `shopping-offers` | 92 | 2 | 90 |
| `snakes-and-ladders` | 74 | 2 | 72 |
| `sum-of-distances-in-tree` | 42 | 2 | 40 |
| `sum-of-remoteness-of-all-cells` | 100 | 2 | 98 |
| `take-k-of-each-character-from-left-and-right` | 131 | 2 | 129 |
| `word-squares` | 62 | 2 | 60 |
| `xor-queries-of-a-subarray` | 79 | 2 | 77 |
| `battleships-in-a-board` | 102 | 1 | 101 |
| `build-a-matrix-with-conditions` | 86 | 1 | 85 |
| `build-array-from-permutation` | 82 | 1 | 81 |
| `car-fleet` | 125 | 1 | 124 |
| `check-if-all-the-integers-in-a-range-are-covered` | 106 | 1 | 105 |
| `check-if-there-is-a-valid-path-in-a-grid` | 78 | 1 | 77 |
| `count-pairs-of-connectable-servers-in-a-weighted-tree-network` | 93 | 1 | 92 |
| `count-substrings-that-can-be-rearranged-to-contain-a-string-i` | 107 | 1 | 106 |
| `count-the-number-of-vowel-strings-in-range` | 100 | 1 | 99 |
| `count-unreachable-pairs-of-nodes-in-an-undirected-graph` | 56 | 1 | 55 |
| `earliest-second-to-mark-indices-i` | 114 | 1 | 113 |
| `find-building-where-alice-and-bob-can-meet` | 112 | 1 | 111 |
| `find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree` | 56 | 1 | 55 |
| `find-missing-observations` | 119 | 1 | 118 |
| `find-the-index-of-permutation` | 98 | 1 | 97 |
| `find-the-k-sum-of-an-array` | 106 | 1 | 105 |
| `finding-the-users-active-minutes` | 109 | 1 | 108 |
| `first-completely-painted-row-or-column` | 72 | 1 | 71 |
| `gcd-sort-of-an-array` | 169 | 1 | 168 |
| `get-biggest-three-rhombus-sums-in-a-grid` | 119 | 1 | 118 |
| `get-watched-videos-by-your-friends` | 68 | 1 | 67 |
| `graph-connectivity-with-threshold` | 64 | 1 | 63 |
| `group-shifted-strings` | 88 | 1 | 87 |
| `jump-game-iii` | 112 | 1 | 111 |
| `largest-component-size-by-common-factor` | 99 | 1 | 98 |
| `largest-plus-sign` | 92 | 1 | 91 |
| `longest-word-with-all-prefixes` | 116 | 1 | 115 |
| `match-alphanumerical-pattern-in-matrix-i` | 97 | 1 | 96 |
| `maximum-coin-collection` | 95 | 1 | 94 |
| `maximum-consecutive-floors-without-special-floors` | 94 | 1 | 93 |
| `maximum-number-of-k-divisible-components` | 79 | 1 | 78 |
| `maximum-points-after-enemy-battles` | 105 | 1 | 104 |
| `maximum-population-year` | 92 | 1 | 91 |
| `maximum-profitable-triplets-with-increasing-prices-i` | 124 | 1 | 123 |
| `maximum-score-words-formed-by-letters` | 77 | 1 | 76 |
| `maximum-strength-of-a-group` | 124 | 1 | 123 |
| `maximum-vacation-days` | 71 | 1 | 70 |
| `maximum-value-sum-by-placing-three-rooks-i` | 145 | 1 | 144 |
| `maximum-xor-score-subarray-queries` | 59 | 1 | 58 |
| `minimum-absolute-difference-queries` | 91 | 1 | 90 |
| `minimum-cost-to-divide-array-into-subarrays` | 109 | 1 | 108 |
| `minimum-distance-to-type-a-word-using-two-fingers` | 451 | 1 | 450 |
| `minimum-division-operations-to-make-array-non-decreasing` | 117 | 1 | 116 |
| `minimum-falling-path-sum` | 80 | 1 | 79 |
| `minimum-moves-to-make-array-complementary` | 113 | 1 | 112 |
| `minimum-moves-to-move-a-box-to-their-target-location` | 83 | 1 | 82 |
| `minimum-number-of-operations-to-sort-a-binary-tree-by-level` | 64 | 1 | 63 |
| `minimum-number-of-taps-to-open-to-water-a-garden` | 94 | 1 | 93 |
| `minimum-operations-to-make-array-equal-to-target` | 118 | 1 | 117 |
| `minimum-swaps-to-arrange-a-binary-grid` | 72 | 1 | 71 |
| `number-of-black-blocks` | 73 | 1 | 72 |
| `number-of-good-paths` | 83 | 1 | 82 |
| `number-of-great-partitions` | 102 | 1 | 101 |
| `number-of-valid-words-for-each-puzzle` | 71 | 1 | 70 |
| `number-of-ways-to-wear-different-hats-to-each-other` | 84 | 1 | 83 |
| `number-of-wonderful-substrings` | 78 | 1 | 77 |
| `paint-house-iv` | 92 | 1 | 91 |
| `parallel-courses-ii` | 93 | 1 | 92 |
| `queries-on-a-permutation-with-key` | 98 | 1 | 97 |
| `rearrange-array-elements-by-sign` | 100 | 1 | 99 |
| `remove-max-number-of-edges-to-keep-graph-fully-traversable` | 66 | 1 | 65 |
| `remove-nth-node-from-end-of-list` | 80 | 1 | 79 |
| `sort-integers-by-the-power-value` | 94 | 1 | 93 |
| `the-earliest-moment-when-everyone-become-friends` | 90 | 1 | 89 |
| `the-wording-game` | 154 | 1 | 153 |
| `unique-email-addresses` | 105 | 1 | 104 |
| `unique-morse-code-words` | 83 | 1 | 82 |
| `valid-sudoku` | 20 | 1 | 19 |
| `word-abbreviation` | 100 | 1 | 99 |
| `word-pattern-ii` | 151 | 1 | 150 |
| `word-search-ii` | 84 | 1 | 83 |

## dirty 保护（未改动，等待其改动方落地后再清理）

| 题目 | 原用例 | 待作废 |
| --- | --- | --- |
| `all-paths-from-source-to-target` | 92 | 13 |
| `circular-permutation-in-binary-representation` | 92 | 15 |
| `letter-case-permutation` | 126 | 9 |
