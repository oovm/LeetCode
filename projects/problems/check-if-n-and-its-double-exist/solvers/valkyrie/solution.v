namespace leetcode.check_if_n_and_its_double_exist;

using std.collection;

# 一次遍历：当前值的二倍或（偶数时）一半已在 seen 中即成立。
[export(case: "camelCase")]
micro checkIfExist(arr: ArrayList<i64>) -> bool {
    let mut seen: HashSet<i64> = HashSet::new()
    loop value in arr {
        if seen.contains(2 * value) {
            return true
        }
        if value % 2 == 0 && seen.contains(value / 2) {
            return true
        }
        seen.insert(value)
    }
    return false
}

class Solution {
    micro checkIfExist(self, arr: ArrayList<i64>): bool {
        return checkIfExist(arr)
    }
}
