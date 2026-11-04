namespace leetcode.advantage_shuffle;

using std.collection;

# 贪心：把 `nums1` 升序排列，按 `nums2` 的值升序匹配。
# 能压过当前 `nums2` 的最小元素优先上场；压不过的 `nums2` 先记为亏损位。
# 亏损位按值升序，剩余元素按值升序，最小的剩余元素配给最大的亏损位。
# 按 `nums2` 的值排序索引需要接收比较器的 `sorted_by`（提案 API，见 G11），
# 比较器还捕获外层 `nums2`（闭包捕获，待验证）。
[export(case: "camelCase")]
micro advantageCount(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> ArrayList<i64> {
    let mut sorted_a: ArrayList<i64> = ArrayList::new(nums1.length())
    loop value in nums1 {
        sorted_a.push(value)
    }
    sort(sorted_a)

    let mut order: ArrayList<i64> = ArrayList::new(nums2.length())
    let mut i: usize = 0
    while i < nums2.length() {
        order.push(i as i64)
        i = i + 1
    }
    order = sorted_by(order, micro(a: i64, b: i64) -> i32 {
        let left: i64 = nums2⁅a as usize⁆
        let right: i64 = nums2⁅b as usize⁆
        if left < right {
            return -1
        }
        if left > right {
            return 1
        }
        return 0
    })

    let mut result: ArrayList<i64> = ArrayList::new(nums1.length())
    let mut used: ArrayList<bool> = ArrayList::new(nums1.length())
    let mut z: usize = 0
    while z < nums1.length() {
        result.push(0)
        used.push(false)
        z = z + 1
    }

    let mut losers: ArrayList<i64> = ArrayList::new(nums1.length())
    let mut candidate: usize = 0
    let mut k: usize = 0
    while k < order.length() {
        let index: usize = order⁅k⁆ as usize
        let target: i64 = nums2⁅index⁆

        while candidate < sorted_a.length() && used⁅candidate⁆ {
            candidate = candidate + 1
        }
        while candidate < sorted_a.length() && sorted_a⁅candidate⁆ <= target {
            candidate = candidate + 1
        }

        if candidate < sorted_a.length() {
            result.set((index + 1) as isize, sorted_a⁅candidate⁆)
            used.set((candidate + 1) as isize, true)
            candidate = candidate + 1
        }
        else {
            losers.push(index as i64)
        }
        k = k + 1
    }

    let mut leftovers: ArrayList<i64> = ArrayList::new(sorted_a.length())
    let mut s: usize = 0
    while s < sorted_a.length() {
        if used⁅s⁆ == false {
            leftovers.push(sorted_a⁅s⁆)
        }
        s = s + 1
    }

    let mut m: usize = 0
    while m < losers.length() {
        let loser_index: usize = losers⁅losers.length() - 1 - m⁆ as usize
        result.set((loser_index + 1) as isize, leftovers⁅m⁆)
        m = m + 1
    }
    return result
}

class Solution {
    micro advantageCount(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): ArrayList<i64> {
        return advantageCount(nums1, nums2)
    }
}
