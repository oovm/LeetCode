namespace leetcode.number_of_good_pairs;

micro eq_count<T>(a: T, b: T) -> i64 where T: Equal {
    if a == b {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro num_identical_pairs(nums: ArrayList<i64>) -> i64 {
    let n: usize = nums.length()
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < n {
        let mut j: usize = i + 1
        while j < n {
            count = count + eq_count(nums⁅i⁆.unwrap(), nums⁅j⁆.unwrap())
            j = j + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro numIdenticalPairs(self, nums: ArrayList<i64>): i64 {
        return num_identical_pairs(nums)
    }
}
