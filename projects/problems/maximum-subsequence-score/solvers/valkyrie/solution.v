namespace leetcode.maximum_subsequence_score;

using std.collection;

# 按 `nums2` 降序枚举最小值位置，同时用最小优先队列维护 `nums1` 中最大的 `k` 个。
# 依赖 `sorted_by(list, cmp)`（G11 提案）与 `PriorityQueue<T>`。
[export(case: "camelCase")]
micro maxScore(nums1: ArrayList<i64>, nums2: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums1.length()
    let mut order: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        order.push(index as i64)
        index = index + 1
    }

    let ordered: ArrayList<i64> = sorted_by(order, micro(a: i64, b: i64) -> i32 {
        let left: usize = a as usize
        let right: usize = b as usize
        if nums2⁅left⁆ > nums2⁅right⁆ {
            return -1
        }
        if nums2⁅left⁆ < nums2⁅right⁆ {
            return 1
        }
        return 0
    })

    let mut queue: PriorityQueue<i64> = PriorityQueue::new()
    let mut sum: i64 = 0
    let mut best: i64 = 0
    loop position in ordered {
        let cursor: usize = position as usize
        let value: i64 = nums1⁅cursor⁆
        queue.push(value)
        sum = sum + value
        if queue.length() as i64 > k {
            sum = sum - queue.pop().unwrap()
        }
        if queue.length() as i64 == k {
            let score: i64 = sum * nums2⁅cursor⁆
            if score > best {
                best = score
            }
        }
    }
    return best
}

class Solution {
    micro maxScore(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>, k: i64): i64 {
        return maxScore(nums1, nums2, k)
    }
}
