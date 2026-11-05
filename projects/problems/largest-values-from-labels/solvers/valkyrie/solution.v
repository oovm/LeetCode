namespace leetcode.largest_values_from_labels;

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

# 按价值降序贪心，每个标签最多用 useLimit 次，取满 numWanted 即停。
[export(case: "camelCase")]
micro largest_vals_from_labels(values: ArrayList<i64>, labels: ArrayList<i64>, numWanted: i64, useLimit: i64) -> i64 {
    let count: usize = values.length()
    let base: i64 = 131072
    let mut order: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        order.push(values⁅index⁆ * base + index as i64)
        index = index + 1
    }
    quick_sort(order, compare_i64)
    let mut used: HashMap<i64, i64> = HashMap::new(count + 1)
    let mut total: i64 = 0
    let mut picked: i64 = 0
    let mut cursor: i64 = count as i64 - 1
    while cursor >= 0 {
        let at: usize = (order⁅cursor as usize⁆ % base) as usize
        let label: i64 = labels⁅at⁆
        let mut taken: i64 = 0
        if used.contains_key(label) {
            taken = used.get(label).unwrap()
        }
        if taken < useLimit {
            used.insert(label, taken + 1)
            total = total + values⁅at⁆
            picked = picked + 1
            if picked == numWanted {
                return total
            }
        }
        cursor = cursor - 1
    }
    return total
}

class Solution {
    micro largestValsFromLabels(self, values: ArrayList<i64>, labels: ArrayList<i64>, numWanted: i64, useLimit: i64): i64 {
        return largest_vals_from_labels(values, labels, numWanted, useLimit)
    }
}
