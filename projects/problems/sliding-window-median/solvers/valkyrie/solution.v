namespace leetcode.sliding_window_median;

using std.collection;

micro compare_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

micro fenwick_add(mut tree: ArrayList<i64>, position: i64) -> unit {
    let limit: i64 = tree.length() as i64 - 1
    let mut index: i64 = position
    while index <= limit {
        tree⁅index as usize⁆ = tree⁅index as usize⁆ + 1
        index = index + (index & ((0 as i64) - index))
    }
}

micro fenwick_remove(mut tree: ArrayList<i64>, position: i64) -> unit {
    let limit: i64 = tree.length() as i64 - 1
    let mut index: i64 = position
    while index <= limit {
        tree⁅index as usize⁆ = tree⁅index as usize⁆ - 1
        index = index + (index & ((0 as i64) - index))
    }
}

# 树状数组按秩二分：返回第 target 小（1 起）的压缩秩。
micro fenwick_kth(tree: ArrayList<i64>, target: i64, size: i64) -> i64 {
    let mut step: i64 = 1
    while step * 2 <= size {
        step = step * 2
    }
    let mut position: i64 = 0
    let mut remaining: i64 = target
    while step > 0 {
        let next: i64 = position + step
        if next <= size {
            let slot: i64 = tree⁅next as usize⁆
            if slot < remaining {
                position = next
                remaining = remaining - slot
            }
        }
        step = step / 2
    }
    return position + 1
}

micro window_median(unique: ArrayList<i64>, tree: ArrayList<i64>, k: i64, size: i64) -> f64 {
    if k % 2 == 1 {
        let rank: i64 = fenwick_kth(tree, k / 2 + 1, size)
        return unique⁅(rank - 1) as usize⁆ as f64
    }
    let left_rank: i64 = fenwick_kth(tree, k / 2, size)
    let right_rank: i64 = fenwick_kth(tree, k / 2 + 1, size)
    let left_value: i64 = unique⁅(left_rank - 1) as usize⁆
    let right_value: i64 = unique⁅(right_rank - 1) as usize⁆
    return (left_value + right_value) as f64 / 2.0
}

# 坐标压缩 + 树状数组计数：滑窗增删 O(log n)，按秩取中位数 O(log n)。
[export(case: "camelCase")]
micro sliding_window_median(nums: ArrayList<i64>, k: i64) -> ArrayList<f64> {
    let n: i64 = nums.length() as i64
    let ordered: ArrayList<i64> = sorted_by(nums, compare_i64)

    let mut unique: ArrayList<i64> = ArrayList::new(nums.length())
    loop index in 0..nums.length() {
        let value: i64 = ordered⁅index⁆
        if index == 0 || value != ordered⁅index - 1⁆ {
            unique.push(value)
        }
    }

    let mut ranks: HashMap<i64, i64> = HashMap::new(unique.length())
    loop index in 0..unique.length() {
        ranks.insert(unique⁅index⁆, (index as i64) + 1)
    }

    let size: i64 = unique.length() as i64
    let mut tree: ArrayList<i64> = ArrayList::new(unique.length() + 1)
    loop _zero in 0..(unique.length() + 1) {
        tree.push(0)
    }

    let mut position: i64 = 0
    while position < k {
        let value: i64 = nums⁅position as usize⁆
        fenwick_add(tree, ranks.get(value).unwrap())
        position = position + 1
    }

    let window_count: i64 = n - k + 1
    let mut answer: ArrayList<f64> = ArrayList::new(window_count as usize)
    answer.push(window_median(unique, tree, k, size))

    let mut start: i64 = 0
    let mut end: i64 = k
    while end < n {
        let incoming: i64 = nums⁅end as usize⁆
        fenwick_add(tree, ranks.get(incoming).unwrap())
        let outgoing: i64 = nums⁅start as usize⁆
        fenwick_remove(tree, ranks.get(outgoing).unwrap())
        answer.push(window_median(unique, tree, k, size))
        start = start + 1
        end = end + 1
    }
    return answer
}

class Solution {
    micro slidingWindowMedian(self, nums: ArrayList<i64>, k: i64): ArrayList<f64> {
        return sliding_window_median(nums, k)
    }
}
