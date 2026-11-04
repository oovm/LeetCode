namespace leetcode.degree_of_an_array;

# 三张 HashMap：首次下标 / 末次下标 / 频次；建表时顺带求最大度，
# 再扫一遍数组，只在达到最大度的键上取最短跨度。O(n) 时间 / O(n) 额外空间。
[export(case: "camelCase")]
micro find_shortest_sub_array(nums: [i64]) -> i64 {
    let count: usize = nums.length()
    let mut first: HashMap<i64, i64> = HashMap::new(0)
    let mut last: HashMap<i64, i64> = HashMap::new(0)
    let mut frequency: HashMap<i64, i64> = HashMap::new(0)
    let mut degree: i64 = 0

    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        if !first.contains_key(value) {
            first.insert(value, i as i64)
        }
        last.insert(value, i as i64)
        let mut seen: i64 = 0
        if frequency.contains_key(value) {
            seen = frequency.get(value).unwrap()
        }
        frequency.insert(value, seen + 1)
        if seen + 1 > degree {
            degree = seen + 1
        }
        i = i + 1
    }

    let mut best: i64 = -1
    i = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        if frequency.get(value).unwrap() == degree {
            let span: i64 = last.get(value).unwrap() - first.get(value).unwrap() + 1
            if best < 0 || span < best {
                best = span
            }
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro findShortestSubArray(self, nums: [i64]): i64 {
        return find_shortest_sub_array(nums)
    }
}
