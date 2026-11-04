namespace leetcode.unique_number_of_occurrences;

using std.collection;

# 一次建频次表，再一次把频次值灌进集合：集合大小 == 键数，当且仅当频次互异。
# 题内触发点: G12 —— `HashSet::new()` 没有容量参数（固定 16 起始桶），
# 与 `HashMap::new(capacity)` 不对称；本题规模已知，理想写法是带容量的集合构造。
[export(case: "camelCase")]
micro unique_occurrences(arr: [i64]) -> bool {
    let count: usize = arr.length()
    let mut counts: HashMap<i64, i64> = HashMap::new(count)
    let mut i: usize = 0
    while i < count {
        let value: i64 = arr⁅i⁆
        let mut seen: i64 = 0
        if counts.contains_key(value) {
            seen = counts.get(value).unwrap()
        }
        counts.insert(value, seen + 1)
        i = i + 1
    }

    let mut distinct: HashSet<i64> = HashSet::new()
    let values: ArrayList<i64> = counts.values()
    let mut cursor: usize = 0
    while cursor < values.length() {
        distinct.insert(values⁅cursor⁆)
        cursor = cursor + 1
    }
    return distinct.length() == counts.length()
}

class Solution {
    micro uniqueOccurrences(self, arr: [i64]): bool {
        return unique_occurrences(arr)
    }
}
