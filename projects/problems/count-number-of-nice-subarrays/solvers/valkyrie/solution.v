namespace leetcode.count_number_of_nice_subarrays;

using std.collection;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 前缀奇数计数 + 频次表：当前前缀有 `odd` 个奇数时，
# 之前出现过 `odd - k` 个奇数的前缀都能构成恰好 `k` 个奇数的子数组。
[export(case: "camelCase")]
micro numberOfSubarrays(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length() + 1)
    counts.insert(0, 1)

    let mut odd: i64 = 0
    let mut total: i64 = 0
    loop value in nums {
        if value % 2 != 0 {
            odd = odd + 1
        }
        let target: i64 = odd - k
        if counts.contains_key(target) {
            total = total + counts.get(target).unwrap()
        }
        let mut next: i64 = 1
        if counts.contains_key(odd) {
            next = counts.get(odd).unwrap() + 1
        }
        counts.insert(odd, next)
    }
    return total
}

class Solution {
    micro numberOfSubarrays(self, nums: ArrayList<i64>, k: i64): i64 {
        return numberOfSubarrays(nums, k)
    }
}
