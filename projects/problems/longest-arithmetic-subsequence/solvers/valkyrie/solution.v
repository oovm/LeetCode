namespace leetcode.longest_arithmetic_subsequence;

using std.collection;

# 按 (末尾下标, 公差) 记录最长链长，公差用固定偏移压进 64 位键。
[export(case: "camelCase")]
micro longest_arith_seq_length(nums: [i64]) -> i64 {
    let count: usize = nums.length()
    let offset: i64 = 2097152
    let stride: i64 = 4194304
    let mut chains: HashMap<i64, i64> = HashMap::new(count * count + 1)
    let mut answer: i64 = 0
    let mut right: usize = 1
    while right < count {
        let mut left: usize = 0
        while left < right {
            let difference: i64 = nums⁅right⁆ - nums⁅left⁆
            let here: i64 = right as i64 * stride + difference + offset
            let previous: i64 = left as i64 * stride + difference + offset
            let mut length: i64 = 2
            if chains.contains_key(previous) {
                let extended: i64 = chains.get(previous).unwrap() + 1
                if extended > length {
                    length = extended
                }
            }
            let mut kept: i64 = 1
            if chains.contains_key(here) {
                kept = chains.get(here).unwrap()
            }
            if length > kept {
                chains.insert(here, length)
                if length > answer {
                    answer = length
                }
            }
            left = left + 1
        }
        right = right + 1
    }
    return answer
}

class Solution {
    micro longestArithSeqLength(self, nums: [i64]): i64 {
        return longest_arith_seq_length(nums)
    }
}
