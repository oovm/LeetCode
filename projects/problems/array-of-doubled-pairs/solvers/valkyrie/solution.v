namespace leetcode.array_of_doubled_pairs;

using std.collection;

# 按绝对值升序处理：每个值总要和它的两倍配对，绝对值小的先定下来。
# 排序用返回新序列的 `sorted_by`（提案 API，见 G11），比较器按绝对值。
micro abs_value(value: i64) -> i64 {
    if value < 0 {
        return 0 - value
    }
    return value
}

micro cmp_abs(a: i64, b: i64) -> i32 {
    let left: i64 = abs_value(a)
    let right: i64 = abs_value(b)
    if left < right {
        return -1
    }
    if left > right {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro canReorderDoubled(arr: ArrayList<i64>) -> bool {
    let ordered: ArrayList<i64> = sorted_by(arr, cmp_abs)

    let mut counts: HashMap<i64, i64> = HashMap::new(ordered.length())
    loop value in ordered {
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)
    }

    loop value in ordered {
        let amount: i64 = counts.get(value).unwrap()
        if amount == 0 {
            continue
        }
        counts.insert(value, amount - 1)

        let doubled: i64 = value * 2
        if counts.contains_key(doubled) == false {
            return false
        }
        let doubled_amount: i64 = counts.get(doubled).unwrap()
        if doubled_amount == 0 {
            return false
        }
        counts.insert(doubled, doubled_amount - 1)
    }
    return true
}

class Solution {
    micro canReorderDoubled(self, arr: ArrayList<i64>): bool {
        return canReorderDoubled(arr)
    }
}
