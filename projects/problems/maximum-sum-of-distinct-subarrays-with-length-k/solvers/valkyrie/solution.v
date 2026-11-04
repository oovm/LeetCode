namespace leetcode.maximum_sum_of_distinct_subarrays_with_length_k;

using std.collection;

# 定长窗 + 频次表：键数等于窗长即窗口内全部不同，此时用窗口和维护最大和。
[export(case: "camelCase")]
micro maximumSubarraySum(nums: ArrayList<i64>, k: i64) -> i64 {
    let width: usize = k as usize
    if width > nums.length() {
        return 0
    }

    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut sum: i64 = 0
    let mut i: usize = 0
    while i < width {
        let value: i64 = nums⁅i⁆
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)
        sum = sum + value
        i = i + 1
    }

    let mut best: i64 = 0
    if counts.length() == width {
        best = sum
    }

    let mut right: usize = width
    while right < nums.length() {
        let incoming: i64 = nums⁅right⁆
        let mut next: i64 = 1
        if counts.contains_key(incoming) {
            next = counts.get(incoming).unwrap() + 1
        }
        counts.insert(incoming, next)
        sum = sum + incoming

        let outgoing: i64 = nums⁅right - width⁆
        let rest: i64 = counts.get(outgoing).unwrap() - 1
        if rest == 0 {
            counts.remove(outgoing)
        }
        else {
            counts.insert(outgoing, rest)
        }
        sum = sum - outgoing

        if counts.length() == width && sum > best {
            best = sum
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro maximumSubarraySum(self, nums: ArrayList<i64>, k: i64): i64 {
        return maximumSubarraySum(nums, k)
    }
}
