namespace leetcode.kth_distinct_string_in_an_array;

using std.collection;

# 频次表 + 原序第二次扫描：只有频次为 1 的串计入名次，按下标顺序取第 k 个。
# 顺序来自入参数组本身，不依赖哈希表的遍历序（`keys()` 不保证插入序）。
[export(case: "camelCase")]
micro kth_distinct(arr: ArrayList<utf8>, k: i64) -> utf8 {
    let count: usize = arr.length()
    let mut counts: HashMap<utf8, i64> = HashMap::new(count)
    let mut i: usize = 0
    while i < count {
        let word: utf8 = arr⁅i⁆
        let mut seen: i64 = 0
        if counts.contains_key(word) {
            seen = counts.get(word).unwrap()
        }
        counts.insert(word, seen + 1)
        i = i + 1
    }

    let mut rank: i64 = 0
    i = 0
    while i < count {
        let word: utf8 = arr⁅i⁆
        if counts.get(word).unwrap() == 1 {
            rank = rank + 1
            if rank == k {
                return word
            }
        }
        i = i + 1
    }
    return ""
}

class Solution {
    micro kthDistinct(self, arr: ArrayList<utf8>, k: i64): utf8 {
        return kth_distinct(arr, k)
    }
}
