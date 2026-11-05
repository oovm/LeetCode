namespace leetcode.distant_barcodes;

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

# 按频次降序排好后把前半段放偶数位、后半段放奇数位，保证相邻不同。
[export(case: "camelCase")]
micro rearrange_barcodes(barcodes: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = barcodes.length()
    let base: i64 = 16384
    let mut frequencies: HashMap<i64, i64> = HashMap::new(count + 1)
    let mut index: usize = 0
    while index < count {
        let value: i64 = barcodes⁅index⁆
        let mut seen: i64 = 0
        if frequencies.contains_key(value) {
            seen = frequencies.get(value).unwrap()
        }
        frequencies.insert(value, seen + 1)
        index = index + 1
    }
    let mut order: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        let value: i64 = barcodes⁅index⁆
        let frequency: i64 = frequencies.get(value).unwrap()
        order.push((128 - frequency) * base + value)
        index = index + 1
    }
    quick_sort(order, compare_i64)
    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        result.push(0)
        fill = fill + 1
    }
    let half: usize = (count + 1) / 2
    let mut position: usize = 0
    while position < half {
        result⁅position * 2⁆ = order⁅position⁆ % base
        position = position + 1
    }
    let mut tail: usize = 0
    while half + tail < count {
        result⁅tail * 2 + 1⁆ = order⁅half + tail⁆ % base
        tail = tail + 1
    }
    return result
}

class Solution {
    micro rearrangeBarcodes(self, barcodes: ArrayList<i64>): ArrayList<i64> {
        return rearrange_barcodes(barcodes)
    }
}
