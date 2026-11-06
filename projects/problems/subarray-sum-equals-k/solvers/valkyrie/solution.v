namespace leetcode.solution

using std.collection

# 前缀和 + 频次表：以「当前前缀和减 k」作为历史前缀的查询键，累加出现次数。
class Solution {
    [export(case: "camelCase")]
    micro subarraySum(nums: ArrayList<i64>, k: i64) -> i64 {
        let mut counts: HashMap<i64, i64> = HashMap::new(0)
        counts.insert(0, 1)
        let mut prefix: i64 = 0
        let mut result: i64 = 0
        loop value in nums {
            prefix = prefix + value
            let needed: i64 = prefix - k
            if counts.contains_key(needed) {
                result = result + counts.get(needed).unwrap()
            }
            let mut next: i64 = 1
            if counts.contains_key(prefix) {
                next = counts.get(prefix).unwrap() + 1
            }
            counts.insert(prefix, next)
        }
        return result
    }
}
