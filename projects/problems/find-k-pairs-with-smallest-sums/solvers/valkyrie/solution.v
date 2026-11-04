namespace leetcode.find_k_pairs_with_smallest_sums;

using std.collection;

# k 路归并：nums2 的每一行本身按和递增，每行只把当前队首列放进堆。
# 堆键编码为 `(sum + shift) * base + i`（base = 行数，保证 i 不越位），
# 负值入 `BinaryHeap<i64>`，弹序即 Python 的 `(sum, i, j)` 字典序；
# 每行的 j 由 `next_j` 单独维护，堆内无需带 j。
[export(case: "camelCase")]
micro kSmallestPairs(nums1: ArrayList<i64>, nums2: ArrayList<i64>, k: i64) -> ArrayList<ArrayList<i64>> {
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let rows: usize = nums1.length()
    let columns: usize = nums2.length()
    if rows == 0 || columns == 0 || k <= 0 {
        return result
    }

    let base: i64 = rows as i64
    let mut shift: i64 = 0
    let lowest: i64 = nums1⁅0⁆ + nums2⁅0⁆
    if lowest < 0 {
        shift = 0 - lowest
    }

    let mut limit: usize = k as usize
    if limit > rows {
        limit = rows
    }

    let mut next_j: ArrayList<usize> = ArrayList::new(rows)
    let mut i: usize = 0
    while i < rows {
        next_j.push(0)
        i = i + 1
    }

    let mut heap: BinaryHeap<i64> = BinaryHeap::new()
    i = 0
    while i < limit {
        let total: i64 = nums1⁅i⁆ + nums2⁅0⁆
        heap.push(0 - ((total + shift) * base + i as i64))
        i = i + 1
    }

    let mut remaining: i64 = k
    while remaining > 0 && heap.length() > 0 {
        let key: i64 = 0 - heap.pop().unwrap()
        let row: usize = (key % base) as usize
        let column: usize = next_j⁅row⁆

        let mut pair: ArrayList<i64> = ArrayList::new(2)
        pair.push(nums1⁅row⁆)
        pair.push(nums2⁅column⁆)
        result.push(pair)
        remaining = remaining - 1

        let ahead: usize = column + 1
        if ahead < columns {
            next_j.set((row + 1) as isize, ahead)
            let total: i64 = nums1⁅row⁆ + nums2⁅ahead⁆
            heap.push(0 - ((total + shift) * base + row as i64))
        }
    }
    return result
}

class Solution {
    micro kSmallestPairs(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>, k: i64): ArrayList<ArrayList<i64>> {
        return kSmallestPairs(nums1, nums2, k)
    }
}
