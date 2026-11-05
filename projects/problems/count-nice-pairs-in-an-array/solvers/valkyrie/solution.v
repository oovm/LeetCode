namespace leetcode.count_nice_pairs_in_an_array;

using std.collection;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 等价式：`nums[i] + rev(nums[j]) == nums[j] + rev(nums[i])` 当且仅当
# `nums[i] - rev(nums[i]) == nums[j] - rev(nums[j])`；按该键计数并累加已有同类个数。
micro reverse_number(value: i64) -> i64 {
    let mut rest: i64 = value
    let mut reversed: i64 = 0
    while rest > 0 {
        reversed = reversed * 10 + rest % 10
        rest = rest / 10
    }
    return reversed
}

[export(case: "camelCase")]
micro countNicePairs(nums: ArrayList<i64>) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut total: i64 = 0
    loop value in nums {
        let key: i64 = value - reverse_number(value)
        if counts.contains_key(key) {
            total = total + counts.get(key).unwrap()
        }
        let mut next: i64 = 1
        if counts.contains_key(key) {
            next = counts.get(key).unwrap() + 1
        }
        counts.insert(key, next)
    }
    return total % 1000000007
}

class Solution {
    micro countNicePairs(self, nums: ArrayList<i64>): i64 {
        return countNicePairs(nums)
    }
}
