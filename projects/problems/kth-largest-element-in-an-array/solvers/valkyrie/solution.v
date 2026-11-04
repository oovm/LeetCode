namespace leetcode.kth_largest_element_in_an_array;

# 快速选择：定长载体就地分区，额外空间为常数。
micro partition_desc(mut nums: [i64], low: usize, high: usize) -> usize {
    let pivot: i64 = nums⁅high⁆
    let mut store: usize = low
    loop scan in low..high {
        if nums⁅scan⁆ > pivot {
            let held: i64 = nums⁅store⁆
            nums⁅store⁆ = nums⁅scan⁆
            nums⁅scan⁆ = held
            store = store + 1
        }
    }

    let last: i64 = nums⁅store⁆
    nums⁅store⁆ = nums⁅high⁆
    nums⁅high⁆ = last
    return store
}

micro select_kth(mut nums: [i64], low: usize, high: usize, rank: usize) -> i64 {
    if low == high {
        return nums⁅low⁆
    }

    let pivot_index: usize = partition_desc(nums, low, high)
    if rank == pivot_index {
        return nums⁅rank⁆
    }
    if rank < pivot_index {
        return select_kth(nums, low, pivot_index - 1, rank)
    }
    return select_kth(nums, pivot_index + 1, high, rank)
}

[export(case: "camelCase")]
micro kth_largest(mut nums: [i64], k: i64) -> i64 {
    let rank: usize = (k - 1) as usize
    return select_kth(nums, 0, nums.length() - 1, rank)
}

class Solution {
    micro findKthLargest(mut self, nums: [i64], k: i64): i64 {
        return kth_largest(nums, k)
    }
}
