namespace leetcode.subarray_sums_divisible_by_k;

using std.collection;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 前缀和同余：两个前缀和对 `k` 同余，其间子数组和就能被 `k` 整除。
# 负数余数先归一到 `[0, k)`，再用频次表累计。
[export(case: "camelCase")]
micro subarraysDivByK(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length() + 1)
    counts.insert(0, 1)

    let mut prefix: i64 = 0
    let mut total: i64 = 0
    loop value in nums {
        prefix = prefix + value
        let mut remainder: i64 = prefix % k
        if remainder < 0 {
            remainder = remainder + k
        }

        if counts.contains_key(remainder) {
            total = total + counts.get(remainder).unwrap()
        }
        let mut next: i64 = 1
        if counts.contains_key(remainder) {
            next = counts.get(remainder).unwrap() + 1
        }
        counts.insert(remainder, next)
    }
    return total
}

class Solution {
    micro subarraysDivByK(self, nums: ArrayList<i64>, k: i64): i64 {
        return subarraysDivByK(nums, k)
    }
}
