namespace leetcode.maximize_greatness_of_an_array;

# 升序 + 双指针：给每个「更大的既有值」贪心匹配一个更小下标，计数即最大 greatness。
[export(case: "camelCase")]
micro maximizeGreatness(nums: ArrayList<i64>) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        ordered.push(value)
    }
    sort(ordered)

    let mut left: usize = 0
    let mut right: usize = 0
    let mut greatness: i64 = 0
    while left < ordered.length() && right < ordered.length() {
        while right < ordered.length() && ordered⁅right⁆ <= ordered⁅left⁆ {
            right = right + 1
        }
        if right < ordered.length() {
            greatness = greatness + 1
            right = right + 1
        }
        left = left + 1
    }
    return greatness
}

class Solution {
    micro maximizeGreatness(self, nums: ArrayList<i64>): i64 {
        return maximizeGreatness(nums)
    }
}
