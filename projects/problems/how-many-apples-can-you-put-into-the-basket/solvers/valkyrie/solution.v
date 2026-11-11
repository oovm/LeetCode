namespace leetcode.how_many_apples_can_you_put_into_the_basket;

using std.collection;

micro compare_ascending(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 升序贪心：总重量不超过 5000 时尽量多装。
[export(case: "camelCase")]
micro maxNumberOfApples(weight: [i64]) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(weight.length())
    loop value in weight {
        ordered.push(value)
    }
    merge_sort(ordered, compare_ascending)
    let mut total: i64 = 0
    let mut count: i64 = 0
    let mut position: usize = 0
    while position < ordered.length() {
        let current: i64 = ordered⁅position⁆
        if total + current > 5000 {
            break
        }
        total = total + current
        count = count + 1
        position = position + 1
    }
    return count
}

class Solution {
    micro maxNumberOfApples(self, weight: [i64]): i64 {
        return maxNumberOfApples(weight)
    }
}
