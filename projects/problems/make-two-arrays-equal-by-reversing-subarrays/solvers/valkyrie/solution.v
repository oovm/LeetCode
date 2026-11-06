namespace leetcode.make_two_arrays_equal_by_reversing_subarrays;

using std.collection;

# 任意子数组反转等价于重排，比较两个多重集合是否一致。
[export(case: "camelCase")]
micro canBeEqual(target: ArrayList<i64>, arr: ArrayList<i64>) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(target.length())
    loop value in target {
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
        }
    }
    loop value in arr {
        if !counts.contains_key(value) {
            return false
        }
        let remaining: i64 = counts.get(value).unwrap() - 1
        if remaining < 0 {
            return false
        }
        counts.insert(value, remaining)
    }
    loop value in target {
        if counts.get(value).unwrap() != 0 {
            return false
        }
    }
    return true
}

class Solution {
    micro canBeEqual(self, target: ArrayList<i64>, arr: ArrayList<i64>): bool {
        return canBeEqual(target, arr)
    }
}
