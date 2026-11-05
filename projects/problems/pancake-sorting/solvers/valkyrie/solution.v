namespace leetcode.pancake_sorting;

using std.collection;

micro reverse_prefix(arr: ArrayList<i64>, last: usize) {
    let mut left: usize = 0
    let mut right: usize = last
    while left < right {
        let tmp: i64 = arr⁅left⁆
        arr⁅left⁆ = arr⁅right⁆
        arr⁅right⁆ = tmp
        left = left + 1
        right = right - 1
    }
}

# 从最大值开始逐个归位，每次至多两次翻转，总翻转数不超过 2(n-1)。
[export(case: "camelCase")]
micro pancake_sort(arr: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = arr.length()
    let mut flips: ArrayList<i64> = ArrayList::new(count * 2 + 1)
    let mut target_index: i64 = count as i64 - 1
    while target_index > 0 {
        let target: i64 = target_index + 1
        let mut at: i64 = target_index
        while at > 0 {
            if arr⁅at as usize⁆ == target {
                break
            }
            at = at - 1
        }
        if at < target_index {
            if at > 0 {
                flips.push(at + 1)
                reverse_prefix(arr, at as usize)
            }
            flips.push(target_index + 1)
            reverse_prefix(arr, target_index as usize)
        }
        target_index = target_index - 1
    }
    return flips
}

class Solution {
    micro pancakeSort(self, arr: ArrayList<i64>): ArrayList<i64> {
        return pancake_sort(arr)
    }
}
