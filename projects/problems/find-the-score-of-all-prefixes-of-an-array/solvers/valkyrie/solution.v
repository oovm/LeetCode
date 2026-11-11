namespace leetcode.find_the_score_of_all_prefixes_of_an_array;

using std.collection;

# 前缀最大值 + 前缀和：每个前缀分数是「前缀最大值 + 当前值」，再累加成转化数组。
[export(case: "camelCase")]
micro findPrefixScore(nums: [i64]) -> [i64] {
    let mut result: ArrayList<i64> = ArrayList::new(nums.length())
    let mut maximum: i64 = 0
    let mut total: i64 = 0
    loop value in nums {
        if value > maximum {
            maximum = value
        }
        total = total + maximum + value
        result.push(total)
    }
    return result.to_array()
}

class Solution {
    micro findPrefixScore(self, nums: [i64]): [i64] {
        return findPrefixScore(nums)
    }
}
