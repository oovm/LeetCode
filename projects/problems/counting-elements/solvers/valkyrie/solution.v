namespace leetcode.counting_elements;

using std.collection;

# 统计存在 x + 1 的元素个数：先建频次表，再第二遍扫描。
[export(case: "camelCase")]
micro countElements(arr: [i64]) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut position: usize = 0
    while position < arr.length() {
        let value: i64 = arr⁅position⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
        }
        position = position + 1
    }

    let mut total: i64 = 0
    position = 0
    while position < arr.length() {
        let value: i64 = arr⁅position⁆
        if counts.contains_key(value + 1) {
            total = total + 1
        }
        position = position + 1
    }
    return total
}

class Solution {
    micro countElements(self, arr: [i64]): i64 {
        return countElements(arr)
    }
}
