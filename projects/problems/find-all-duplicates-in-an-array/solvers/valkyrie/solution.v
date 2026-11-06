namespace leetcode.solution

using std.collection

# 题内触发点: `BitSet(n + 1)` 作为出现标记；`get` 判定第二次出现，`set` 记账。
class Solution {
    [export(case: "camelCase")]
    micro findDuplicates(nums: ArrayList<i64>) -> ArrayList<i64> {
        let seen: BitSet = BitSet::with_capacity(nums.length() + 1)
        let out: ArrayList<i64> = ArrayList::new(nums.length())
        loop value in nums {
            let index: usize = value as usize
            if seen.get(index) {
                out.push(value)
            } else {
                seen.set(index)
            }
        }
        return out
    }
}
