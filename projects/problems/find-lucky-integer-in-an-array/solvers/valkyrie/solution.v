namespace leetcode.find_lucky_integer_in_an_array;

using std.collection;

# 频次等于自身值的数称为幸运数，取其中最大者。
[export(case: "camelCase")]
micro findLucky(arr: [i64]) -> i64 {
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

    let mut best: i64 = -1
    position = 0
    while position < arr.length() {
        let value: i64 = arr⁅position⁆
        if counts.get(value).unwrap() == value {
            if value > best {
                best = value
            }
        }
        position = position + 1
    }
    return best
}

class Solution {
    micro findLucky(self, arr: [i64]): i64 {
        return findLucky(arr)
    }
}
