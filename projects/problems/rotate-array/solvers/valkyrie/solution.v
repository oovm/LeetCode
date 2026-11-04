namespace leetcode.rotate_array;

using std.collection;

# 区间窗口构造缺失：ArrayView 只提供全窗 array_view(source)，没有 [offset, offset + length)
# 的构造入口（G19）。三次反转本应各自持有一个子窗口并写穿。
micro reverse_window(mut window: ArrayView<i64>) -> unit {
    let mut left: usize = 0
    let mut right: usize = window.length()
    while left < right {
        right = right - 1
        let head: i64 = window⁅left⁆
        window⁅left⁆ = window⁅right⁆
        window⁅right⁆ = head
        left = left + 1
    }
}

[export(case: "camelCase")]
micro rotate(mut nums: [i64], k: i64) -> unit {
    let count: usize = nums.length()
    if count == 0 {
        return
    }

    let shift: usize = (k % (count as i64)) as usize
    if shift == 0 {
        return
    }

    reverse_window(array_view(nums, 0, count))
    reverse_window(array_view(nums, 0, shift))
    reverse_window(array_view(nums, shift, count - shift))
}

class Solution {
    micro rotate(mut self, nums: [i64], k: i64): unit {
        rotate(nums, k)
    }
}
