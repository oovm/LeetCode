# Most Common Word

- **LeetCode**：[#819 Most Common Word](https://leetcode.com/problems/most-common-word/)
- **难度**：Easy
- **标签**：Hash Table · String · Counting

## 题目

Given a paragraph and a list of banned words, return the most frequent word that is not in the list of banned words. It is guaranteed there is at least one word that is not banned, and that it is the most common word.

Words are case-insensitive and the answer should be returned in lowercase. Words are separated by spaces or punctuation `!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`.

**Example 1**：

**Input**：paragraph = "Bob hit a ball, the hit BALL flew far after it was hit.", banned = ["hit"]
**Output**："ball"

**Example 2**：

**Input**：paragraph = "a.", banned = []
**Output**："a"

## 约束

- `1 <= paragraph.length <= 1000`
- `paragraph` 由英文字母、空格和标点组成
- `0 <= banned.length <= 100`
- `1 <= banned[i].length <= 10`
- 答案唯一
