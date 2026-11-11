namespace leetcode.frequency_of_the_most_frequent_element;

# 升序 + 滑窗：窗口内元素全部抬到右端值所需代价 = `right * 窗长 - 窗和`，超出 k 则左端退出。
[export(case: "camelCase")]
micro maxFrequency(nums: [i64], k: i64) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        ordered.push(value)
    }
    sort(ordered)

    let mut left: usize = 0
    let mut best: i64 = 0
    let mut sum: i64 = 0
    let mut right: usize = 0
    while right < ordered.length() {
        sum = sum + ordered⁅right⁆

        let mut window: i64 = right as i64 - left as i64 + 1
        while ordered⁅right⁆ * window - sum > k {
            sum = sum - ordered⁅left⁆
            left = left + 1
            window = right as i64 - left as i64 + 1
        }
        if window > best {
            best = window
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro maxFrequency(self, nums: [i64], k: i64): i64 {
        return maxFrequency(nums, k)
    }
}
