# Valkyrie 待验证批次清单

口径：本清单只登记**理想解已写、尚未构建验证**的批次。构建通过数不等同于本清单题数，
见 `valkyrie-gap-ledger.md` 的「批次状态」小节。

复跑方式：对应能力恢复后，按下面的 slug 列表批量跑 `legionBuildProject` +
隔离判题；TS 侧已在 `projects/conformance/scripts/run_ts_solver.ts` 实跑，结果列在每题行内。

## 批次 E-2026-11-03（Easy 标量/文本池，133 题）

| 组 | 题数 | 依赖能力 | 解锁前置条件 |
| --- | --- | --- | --- |
| 集合状态（`ArrayList` / `HashMap`） | 48 | `ArrayList<T>` 的 `new/push/下标读写`、`HashMap<K,V>` 的 `contains_key/get/insert`、`utf8` 下标读 | G0 已恢复；待一次批量构建复验缓存与泛型实例化 |
| 单遍文本扫描（`utf8` 下标） | 52 | `utf8::length`、`utf8⁅usize⁆` 取 `char`、`char as u32`、整数比较 | G0 已恢复；无需新能力 |
| 文本重建（`Utf8Builder`） | 32 | `Utf8Builder::new/append/build`、`char::from(u32)`、`utf8` 下标读 | G0 已恢复；待复验 builder 容量增长路径 |
| 纯标量算术 | 1 | `i64` 加减乘除、`while`、整数比较 | 无缺口，可直接复跑 |

TS 实跑：131/133 通过。未通过 2 题：`calculate-digit-sum-of-a-string`（大用例 oracle 与题面规则不符）、`minimum-number-of-pushes-to-type-word-i`（oracle 用「按字符位置分槽」模型，与官方按字母频次计价不符）。两题 V/TS 均保留理想解，不为缺陷改算法。

### 集合状态（`ArrayList` / `HashMap`）（48 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `find-the-index-of-the-first-occurrence-in-a-string` | `build_failure(pattern: utf8)` → `ArrayList<i64>` | 通过 |
| `isomorphic-strings` | `is_isomorphic(s: utf8, t: utf8)` → `bool` | 通过 |
| `valid-anagram` | `is_anagram(s: utf8, t: utf8)` → `bool` | 通过 |
| `palindrome-permutation` | `can_permute_palindrome(s: utf8)` → `bool` | 通过 |
| `word-pattern` | `word_pattern(pattern: utf8, s: utf8)` → `bool` | 通过 |
| `reverse-vowels-of-a-string` | `is_vowel(code: u32)` → `bool` | 通过 |
| `ransom-note` | `can_construct(ransom_note: utf8, magazine: utf8)` → `bool` | 通过 |
| `longest-palindrome` | `longest_palindrome(s: utf8)` → `i64` | 通过 |
| `repeated-substring-pattern` | `prefix_table(pattern: utf8)` → `ArrayList<i64>` | 通过 |
| `rotate-string` | `build_failure(pattern: utf8)` → `ArrayList<i64>` | 通过 |
| `buddy-strings` | `buddy_strings(s: utf8, goal: utf8)` → `bool` | 通过 |
| `reverse-only-letters` | `is_letter_code(code: u32)` → `bool` | 通过 |
| `remove-all-adjacent-duplicates-in-string` | `remove_duplicates(s: utf8)` → `utf8` | 通过 |
| `single-row-keyboard` | `abs_i64(x: i64)` → `i64` | 通过 |
| `maximum-number-of-balloons` | `max_number_of_balloons(text: utf8)` → `i64` | 通过 |
| `hexspeak` | `to_digits(num: utf8)` → `ArrayList<i64>` | 通过 |
| `increasing-decreasing-string` | `sort_string(s: utf8)` → `utf8` | 通过 |
| `reformat-the-string` | `is_digit_code(code: u32)` → `bool` | 通过 |
| `path-crossing` | `encode_point(x: i64, y: i64)` → `i64` | 通过 |
| `make-the-string-great` | `abss(x: i64)` → `i64` | 通过 |
| `thousand-separator` | `thousand_separator(n: i64)` → `utf8` | 通过 |
| `replace-all-s-to-avoid-consecutive-repeating-characters` | `modify_string(s: utf8)` → `utf8` | 通过 |
| `rearrange-spaces-between-words` | `reorder_spaces(text: utf8)` → `utf8` | 通过 |
| `largest-substring-between-two-equal-characters` | `max_length_between_equal_characters(s: utf8)` → `i64` | 通过 |
| `reformat-phone-number` | `reformat_number(number: utf8)` → `utf8` | 通过 |
| `latest-time-by-replacing-hidden-digits` | `maximum_time(time: utf8)` → `utf8` | 通过 |
| `number-of-different-integers-in-a-string` | `num_different_integers(word: utf8)` → `i64` | 通过 |
| `rings-and-rods` | `count_points(rings: utf8)` → `i64` | 通过 |
| `calculate-digit-sum-of-a-string` | `digit_sum(s: utf8, k: i64)` → `utf8` | 未通过（语料缺陷） |
| `check-if-number-has-equal-digit-count-and-digit-value` | `digit_count(num: utf8)` → `bool` | 通过 |
| `rearrange-characters-to-make-target-string` | `rearrange_characters(s: utf8, target: utf8)` → `i64` | 通过 |
| `greatest-english-letter-in-upper-and-lower-case` | `empty_text()` → `utf8` | 通过 |
| `first-letter-to-appear-twice` | `empty_text()` → `utf8` | 通过 |
| `remove-letter-to-equalize-frequency` | `equal_frequency(word: utf8)` → `bool` | 通过 |
| `minimum-string-length-after-removing-substrings` | `min_length(s: utf8)` → `i64` | 通过 |
| `lexicographically-smallest-palindrome` | `make_smallest_palindrome(s: utf8)` → `utf8` | 通过 |
| `minimize-string-length` | `minimized_string_length(s: utf8)` → `i64` | 通过 |
| `faulty-keyboard` | `final_string(s: utf8)` → `utf8` | 通过 |
| `minimum-number-of-pushes-to-type-word-i` | `minimum_pushes(word: utf8)` → `i64` | 未通过（语料缺陷） |
| `existence-of-a-substring-in-a-string-and-its-reverse` | `pair_slot(first: u32, second: u32)` → `usize` | 通过 |
| `maximum-length-substring-with-two-occurrences` | `maximum_length_substring(s: utf8)` → `i64` | 通过 |
| `count-the-number-of-special-characters-i` | `number_of_special_chars(word: utf8)` → `i64` | 通过 |
| `permutation-difference-between-two-strings` | `find_permutation_difference(s: utf8, t: utf8)` → `i64` | 通过 |
| `clear-digits` | `clear_digits(s: utf8)` → `utf8` | 通过 |
| `convert-date-to-binary` | `digit_at(s: utf8, at: usize)` → `i64` | 通过 |
| `find-valid-pair-of-adjacent-digits-in-string` | `find_valid_pair(s: utf8)` → `utf8` | 通过 |
| `maximum-difference-between-even-and-odd-frequency-i` | `max_difference(s: utf8)` → `i64` | 通过 |
| `check-if-digits-are-equal-in-string-after-operations-i` | `has_same_digits(s: utf8)` → `bool` | 通过 |

### 单遍文本扫描（`utf8` 下标）（52 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `strobogrammatic-number` | `mirror_digit(code: u32)` → `i64` | 通过 |
| `valid-word-abbreviation` | `valid_word_abbreviation(word: utf8, abbr: utf8)` → `bool` | 通过 |
| `number-of-segments-in-a-string` | `is_blank(code: u32)` → `bool` | 通过 |
| `longest-uncommon-subsequence-i` | `find_l_u_slength(a: utf8, b: utf8)` → `i64` | 通过 |
| `robot-return-to-origin` | `judge_circle(moves: utf8)` → `bool` | 通过 |
| `count-binary-substrings` | `count_binary_substrings(s: utf8)` → `i64` | 通过 |
| `long-pressed-name` | `is_long_pressed_name(name: utf8, typed: utf8)` → `bool` | 通过 |
| `count-substrings-with-only-one-distinct-letter` | `count_letters(s: utf8)` → `i64` | 通过 |
| `remove-palindromic-subsequences` | `remove_palindrome_sub(s: utf8)` → `i64` | 通过 |
| `maximum-score-after-splitting-a-string` | `max_score(s: utf8)` → `i64` | 通过 |
| `consecutive-characters` | `max_power(s: utf8)` → `i64` | 通过 |
| `check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence` | `is_prefix_of_word(sentence: utf8, search_word: utf8)` → `i64` | 通过 |
| `maximum-nesting-depth-of-the-parentheses` | `max_depth(s: utf8)` → `i64` | 通过 |
| `determine-if-string-halves-are-alike` | `is_vowel_code(code: u32)` → `bool` | 通过 |
| `minimum-changes-to-make-alternating-binary-string` | `min_operations(s: utf8)` → `i64` | 通过 |
| `check-if-binary-string-has-at-most-one-segment-of-ones` | `check_ones_segment(s: utf8)` → `bool` | 通过 |
| `check-if-one-string-swap-can-make-strings-equal` | `are_almost_equal(s1: utf8, s2: utf8)` → `bool` | 通过 |
| `second-largest-digit-in-a-string` | `second_highest(s: utf8)` → `i64` | 通过 |
| `determine-color-of-a-chessboard-square` | `square_is_white(coordinates: utf8)` → `bool` | 通过 |
| `check-if-the-sentence-is-pangram` | `check_if_pangram(sentence: utf8)` → `bool` | 通过 |
| `longer-contiguous-segments-of-ones-than-zeros` | `check_zero_ones(s: utf8)` → `bool` | 通过 |
| `substrings-of-size-three-with-distinct-characters` | `count_good_substrings(s: utf8)` → `i64` | 通过 |
| `check-if-word-equals-summation-of-two-words` | `word_value(word: utf8)` → `i64` | 通过 |
| `check-if-string-is-decomposable-into-value-equal-substrings` | `is_decomposable(s: utf8)` → `bool` | 通过 |
| `check-if-all-characters-have-equal-number-of-occurrences` | `are_occurrences_equal(s: utf8)` → `bool` | 通过 |
| `sum-of-digits-of-string-after-convert` | `get_lucky(s: utf8, k: i64)` → `i64` | 通过 |
| `minimum-time-to-type-word-using-special-typewriter` | `min_time_to_type(word: utf8)` → `i64` | 通过 |
| `minimum-moves-to-convert-string` | `minimum_moves(s: utf8)` → `i64` | 通过 |
| `check-if-numbers-are-ascending-in-a-sentence` | `are_numbers_ascending(s: utf8)` → `bool` | 通过 |
| `number-of-valid-words-in-a-sentence` | `is_letter(code: i64)` → `bool` | 通过 |
| `count-vowel-substrings-of-a-string` | `vowel_bit(code: i64)` → `i64` | 通过 |
| `check-whether-two-strings-are-almost-equivalent` | `check_almost_equivalent(word1: utf8, word2: utf8)` → `bool` | 通过 |
| `check-if-all-as-appears-before-all-bs` | `check_string(s: utf8)` → `bool` | 通过 |
| `minimum-number-of-operations-to-convert-time` | `to_minutes(t: utf8)` → `i64` | 通过 |
| `strong-password-checker-ii` | `strong_password_checker_i_i(password: utf8)` → `bool` | 通过 |
| `minimum-recolors-to-get-k-consecutive-black-blocks` | `minimum_recolors(blocks: utf8, k: i64)` → `i64` | 通过 |
| `number-of-valid-clock-times` | `count_time(time: utf8)` → `i64` | 通过 |
| `find-the-longest-balanced-substring-of-a-binary-string` | `find_the_longest_balanced_substring(s: utf8)` → `i64` | 通过 |
| `furthest-point-from-origin` | `furthest_distance_from_origin(moves: utf8)` → `i64` | 通过 |
| `check-if-strings-can-be-made-equal-with-operations-i` | `can_be_equal(s1: utf8, s2: utf8)` → `bool` | 通过 |
| `make-three-strings-equal` | `find_minimum_operations(s1: utf8, s2: utf8, s3: utf8)` → `i64` | 通过 |
| `number-of-changing-keys` | `normalize(code: u32)` → `u32` | 通过 |
| `score-of-a-string` | `score_of_string(s: utf8)` → `i64` | 通过 |
| `valid-word` | `is_vowel(code: u32)` → `bool` | 通过 |
| `minimum-number-of-chairs-in-a-waiting-room` | `minimum_chairs(s: utf8)` → `i64` | 通过 |
| `count-substrings-that-satisfy-k-constraint-i` | `count_k_constraint_substrings(s: utf8, k: i64)` → `i64` | 通过 |
| `check-if-two-chessboard-squares-have-the-same-color` | `square_parity(coordinate: utf8)` → `i64` | 通过 |
| `find-the-original-typed-string-i` | `possible_string_count(word: utf8)` → `i64` | 通过 |
| `check-balanced-string` | `is_balanced(num: utf8)` → `bool` | 通过 |
| `substring-matching-pattern` | `segment_from(s: utf8, p: utf8, begin: usize, end: usize, from: usize)` → `i64` | 通过 |
| `find-special-substring-of-length-k` | `has_special_substring(s: utf8, k: i64)` → `bool` | 通过 |
| `reverse-degree-of-a-string` | `reverse_degree(s: utf8)` → `i64` | 通过 |

### 文本重建（`Utf8Builder`）（32 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `find-the-difference` | `find_the_difference(s: utf8, t: utf8)` → `utf8` | 通过 |
| `add-strings` | `add_strings(num1: utf8, num2: utf8)` → `utf8` | 通过 |
| `license-key-formatting` | `license_key_formatting(s: utf8, k: i64)` → `utf8` | 通过 |
| `reverse-string-ii` | `reverse_str(s: utf8, k: i64)` → `utf8` | 通过 |
| `reverse-words-in-a-string-iii` | `reverse_words(s: utf8)` → `utf8` | 通过 |
| `similar-rgb-color` | `hex_digit_value(code: u32)` → `i64` | 通过 |
| `goat-latin` | `is_vowel_code(code: u32)` → `bool` | 通过 |
| `greatest-common-divisor-of-strings` | `same_text(a: utf8, b: utf8)` → `bool` | 通过 |
| `remove-vowels-from-a-string` | `is_vowel(code: u32)` → `bool` | 通过 |
| `decrypt-string-from-alphabet-to-integer-mapping` | `freq_alphabets(s: utf8)` → `utf8` | 通过 |
| `generate-a-string-with-characters-that-have-odd-counts` | `generate_the_string(n: i64)` → `utf8` | 通过 |
| `reformat-date` | `month_number(code0: u32, code1: u32, code2: u32)` → `i64` | 通过 |
| `maximum-repeating-substring` | `contains_text(hay: utf8, needle: utf8)` → `bool` | 通过 |
| `longest-nice-substring` | `longest_nice_substring(s: utf8)` → `utf8` | 通过 |
| `merge-strings-alternately` | `merge_alternately(word1: utf8, word2: utf8)` → `utf8` | 通过 |
| `truncate-sentence` | `truncate_sentence(s: utf8, k: i64)` → `utf8` | 通过 |
| `replace-all-digits-with-characters` | `replace_digits(s: utf8)` → `utf8` | 通过 |
| `sorting-the-sentence` | `sort_sentence(s: utf8)` → `utf8` | 通过 |
| `largest-odd-number-in-string` | `largest_odd_number(num: utf8)` → `utf8` | 通过 |
| `delete-characters-to-make-fancy-string` | `make_fancy_string(s: utf8)` → `utf8` | 通过 |
| `reverse-prefix-of-word` | `reverse_prefix(word: utf8, ch: utf8)` → `utf8` | 通过 |
| `capitalize-the-title` | `capitalize_title(title: utf8)` → `utf8` | 通过 |
| `remove-digit-from-number-to-maximize-result` | `remove_digit(number: utf8, digit: utf8)` → `utf8` | 通过 |
| `largest-3-same-digit-number-in-string` | `empty_text()` → `utf8` | 通过 |
| `categorize-box-according-to-criteria` | `word_both()` → `utf8` | 通过 |
| `remove-trailing-zeros-from-a-string` | `remove_trailing_zeros(num: utf8)` → `utf8` | 通过 |
| `maximum-odd-binary-number` | `maximum_odd_binary_number(s: utf8)` → `utf8` | 通过 |
| `latest-time-you-can-obtain-after-replacing-characters` | `find_latest_time(s: utf8)` → `utf8` | 通过 |
| `find-the-encrypted-string` | `get_encrypted_string(s: utf8, k: i64)` → `utf8` | 通过 |
| `lexicographically-smallest-string-after-a-swap` | `get_smallest_string(s: utf8)` → `utf8` | 通过 |
| `find-the-winning-player-in-coin-game` | `alice_text()` → `utf8` | 通过 |
| `find-the-k-th-character-in-string-game-i` | `kth_character(k: i64)` → `utf8` | 通过 |

### 纯标量算术（1 题）

| slug | V 入口签名 | TS 实跑 |
| --- | --- | --- |
| `first-bad-version` | `first_bad_version(n: i64, bad: i64)` → `i64` | 通过 |

## 复跑命令

```powershell
node --import tsx projects/conformance/scripts/run_ts_solver.ts projects/problems/<slug>
```

V 侧复跑：对表中 slug 逐个跑 `legionBuildProject`，产物落 `leetcode.v/.cache/build-<slug>`，再用隔离判题。
