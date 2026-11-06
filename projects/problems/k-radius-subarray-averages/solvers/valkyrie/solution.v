namespace leetcode.k_radius_subarray_averages;

using std.collection;

# 半径 k 的窗口和用前缀和一次求出；两侧不足 k 个元素的位置填 -1。
[export(case: "camelCase")]
micro getAverages(nums: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut prefix: ArrayList<i64> = ArrayList::new(count + 1)
    prefix.push(0)
    let mut index: usize = 0
    while index < count {
        prefix.push(prefix⁅index⁆ + nums⁅index⁆)
        index = index + 1
    }

    let radius: i64 = k
    let window: i64 = 2 * k + 1
    let mut answer: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        let position: i64 = index as i64
        if position - radius < 0 || position + radius >= count as i64 {
            answer.push(-1)
        } else {
            let from: usize = index - k as usize
            let to: usize = index + k as usize
            let total: i64 = prefix⁅to + 1⁆ - prefix⁅from⁆
            answer.push(total / window)
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro getAverages(self, nums: ArrayList<i64>, k: i64): ArrayList<i64> {
        return getAverages(nums, k)
    }
}
