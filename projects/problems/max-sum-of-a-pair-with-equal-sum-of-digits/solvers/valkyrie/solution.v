namespace leetcode.max_sum_of_a_pair_with_equal_sum_of_digits;

using std.collection;

# 数位和相同的两个数才能成对：频次表按数位和保存当前见过的最大值，配对时更新答案。
micro digit_sum(value: i64) -> i64 {
    let mut rest: i64 = value
    let mut sum: i64 = 0
    while rest > 0 {
        sum = sum + rest % 10
        rest = rest / 10
    }
    return sum
}

[export(case: "camelCase")]
micro maximumSum(nums: ArrayList<i64>) -> i64 {
    let mut largest: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut answer: i64 = 0 - 1
    loop value in nums {
        let key: i64 = digit_sum(value)
        if largest.contains_key(key) {
            let previous: i64 = largest.get(key).unwrap()
            let pair: i64 = previous + value
            if pair > answer {
                answer = pair
            }
            if value > previous {
                largest.insert(key, value)
            }
        }
        else {
            largest.insert(key, value)
        }
    }
    return answer
}

class Solution {
    micro maximumSum(self, nums: ArrayList<i64>): i64 {
        return maximumSum(nums)
    }
}
