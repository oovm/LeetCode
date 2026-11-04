namespace leetcode.sort_colors;

# 三路划分（Dijkstra）：0 区 / 1 区 / 2 区各自成段，O(n) 时间 / O(1) 额外空间。
# 定长载体写侧：每次交换都经 `⁅ ⁆=` 落回原容器，不复制整表。
micro swap_cells(mut nums: ArrayList<i64>, a: usize, b: usize): unit {
    let tmp: i64 = nums⁅a⁆
    nums⁅a⁆ = nums⁅b⁆
    nums⁅b⁆ = tmp
}

[export(case: "camelCase")]
micro sort_colors(mut nums: ArrayList<i64>) -> unit {
    let count: i64 = nums.length() as i64
    let mut low: i64 = 0
    let mut high: i64 = count - 1
    let mut cursor: i64 = 0
    while cursor <= high {
        let value: i64 = nums⁅cursor as usize⁆
        if value == 0 {
            swap_cells(nums, low as usize, cursor as usize)
            low = low + 1
            cursor = cursor + 1
        } else {
            if value == 2 {
                # 2 区只在右端生长，交换后 cursor 不前移（换来的值尚未归类）。
                swap_cells(nums, cursor as usize, high as usize)
                high = high - 1
            } else {
                cursor = cursor + 1
            }
        }
    }
}

class Solution {
    micro sortColors(mut self, nums: ArrayList<i64>): unit {
        sort_colors(nums)
    }
}
