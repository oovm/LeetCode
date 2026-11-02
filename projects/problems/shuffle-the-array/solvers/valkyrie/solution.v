namespace leetcode.shuffle_the_array;

[export(case: "camelCase")]
micro shuffle(nums: ArrayList<i64>, n: i64) -> ArrayList<i64> {
    let half: usize = n as usize
    let total: usize = nums.length()
    let rest: usize = total - half
    let limit: usize = half
    if rest < half {
        limit = rest
    }
    let mut result: ArrayList<i64> = ArrayList::new(total)
    let mut i: usize = 0
    while i < limit {
        result.push(nums⁅i⁆.unwrap())
        result.push(nums⁅i + half⁆.unwrap())
        i = i + 1
    }
    return result
}

class Solution {
    micro shuffle(self, nums: ArrayList<i64>, n: i64): ArrayList<i64> {
        return shuffle(nums, n)
    }
}
