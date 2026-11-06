namespace leetcode.number_of_unequal_triplets_in_array;

using std.collection;

# 三重循环统计下标递增且三个值两两不同的三元组。
[export(case: "camelCase")]
micro unequalTriplets(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let count: usize = nums.length()
    let mut i: usize = 0
    while i < count {
        let mut j: usize = i + 1
        while j < count {
            let mut k: usize = j + 1
            while k < count {
                let a: i64 = nums⁅i⁆
                let b: i64 = nums⁅j⁆
                let c: i64 = nums⁅k⁆
                if a != b && b != c && a != c {
                    total = total + 1
                }
                k = k + 1
            }
            j = j + 1
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro unequalTriplets(self, nums: ArrayList<i64>): i64 {
        return unequalTriplets(nums)
    }
}
