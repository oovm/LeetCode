namespace leetcode.sliding_window_median;

using std.collection;

# 有序计数表：重复值计次，按秩取第 k 小。BTreeMap 只有 keys() / iterator 的全量有序遍历，
# 缺按秩定位 nth_key；全量物化会让每步退化为 O(k)（G16 扩展）。约束应随 G15 收敛为 Comparable。
micro insert_value(counts: BTreeMap<i64, i64>, value: i64) -> unit {
    if counts.get(value).is_some() {
        let current: i64 = counts.get(value).unwrap()
        counts.insert(value, current + 1)
    } else {
        counts.insert(value, 1)
    }
}

micro erase_value(counts: BTreeMap<i64, i64>, value: i64) -> unit {
    let current: i64 = counts.get(value).unwrap()
    if current <= 1 {
        counts.remove(value)
    } else {
        counts.insert(value, current - 1)
    }
}

micro median_of(counts: BTreeMap<i64, i64>, size: usize) -> f64 {
    if size % 2 == 1 {
        return counts.nth_key(size / 2).unwrap() as f64
    }

    let low: i64 = counts.nth_key(size / 2 - 1).unwrap()
    let high: i64 = counts.nth_key(size / 2).unwrap()
    return (low + high) as f64 / 2.0
}

[export(case: "camelCase")]
micro sliding_window_median(nums: ArrayList<i64>, k: i64) -> ArrayList<f64> {
    let size: usize = k as usize
    let mut counts: BTreeMap<i64, i64> = BTreeMap::new(size)
    let mut result: ArrayList<f64> = ArrayList::new(nums.length() - size + 1)

    let mut i: usize = 0
    while i < size {
        insert_value(counts, nums⁅i⁆)
        i = i + 1
    }
    result.push(median_of(counts, size))

    i = size
    while i < nums.length() {
        erase_value(counts, nums⁅i - size⁆)
        insert_value(counts, nums⁅i⁆)
        result.push(median_of(counts, size))
        i = i + 1
    }
    return result
}

class Solution {
    micro medianSlidingWindow(self, nums: ArrayList<i64>, k: i64): ArrayList<f64> {
        return sliding_window_median(nums, k)
    }
}
