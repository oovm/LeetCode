namespace leetcode.find_subsequence_of_length_k_with_the_largest_sum;

using std.collection;

# 索引按 (值, 索引) 升序稳定排序，取末尾 k 个即最大和子序列，再恢复原序输出。
[export(case: "camelCase")]
micro max_subsequence(nums: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut order: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        order.push(index as i64)
        index = index + 1
    }
    # 比较器捕获外层 `nums`：并列值按原索引升序，取末尾 k 个时优先保留下标更大的元素。
    order = sorted_by(order, micro(a: i64, b: i64) -> i32 {
        let left: i64 = nums⁅a as usize⁆
        let right: i64 = nums⁅b as usize⁆
        if left < right {
            return -1
        }
        if left > right {
            return 1
        }
        if a < b {
            return -1
        }
        if a > b {
            return 1
        }
        return 0
    })

    let take: usize = k as usize
    let mut chosen: ArrayList<i64> = ArrayList::new(take)
    let mut cursor: usize = count - take
    while cursor < count {
        chosen.push(order⁅cursor⁆)
        cursor = cursor + 1
    }
    sort(chosen)

    let mut result: ArrayList<i64> = ArrayList::new(take)
    cursor = 0
    while cursor < take {
        let at: usize = chosen⁅cursor⁆ as usize
        result.push(nums⁅at⁆)
        cursor = cursor + 1
    }
    return result
}

class Solution {
    micro maxSubsequence(self, nums: ArrayList<i64>, k: i64): ArrayList<i64> {
        return max_subsequence(nums, k)
    }
}
