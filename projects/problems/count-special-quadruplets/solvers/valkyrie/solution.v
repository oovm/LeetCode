namespace leetcode.count_special_quadruplets;

using std.collection;

# 枚举 d、c、b、a 四下标（a < b < c < d），判 `nums[a] + nums[b] + nums[c] == nums[d]`。
[export(case: "camelCase")]
micro countQuadruplets(nums: ArrayList<i64>) -> i64 {
    let length: usize = nums.length()
    let mut count: i64 = 0
    let mut d: usize = 3
    while d < length {
        let mut c: usize = 2
        while c < d {
            let mut b: usize = 1
            while b < c {
                let mut a: usize = 0
                while a < b {
                    if nums⁅a⁆ + nums⁅b⁆ + nums⁅c⁆ == nums⁅d⁆ {
                        count = count + 1
                    }
                    a = a + 1
                }
                b = b + 1
            }
            c = c + 1
        }
        d = d + 1
    }
    return count
}

class Solution {
    micro countQuadruplets(self, nums: ArrayList<i64>): i64 {
        return countQuadruplets(nums)
    }
}
