namespace leetcode.minimum_area_rectangle;

using std.collection;

micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 把点按 (x, y) 编码排序，同 x 的 y 自然有序。
# 对每条竖线上的 y 对做哈希查找，命中上一列即得到一个轴对齐矩形。
# 代价 O(n log n + n^2)，额外空间 O(n^2) 哈希项。
[export(case: "camelCase")]
micro min_area_rect(points: ArrayList<ArrayList<i64>>) -> i64 {
    let base: i64 = 80001
    let offset: i64 = 40000
    let mut keys: ArrayList<i64> = ArrayList::new(points.length())
    let mut index: usize = 0
    while index < points.length() {
        let x: i64 = points⁅index⁆⁅0⁆
        let y: i64 = points⁅index⁆⁅1⁆
        keys.push((x + offset) * base + (y + offset))
        index = index + 1
    }
    quick_sort(keys, cmp_i64)
    let mut pairs: HashMap<i64, i64> = HashMap::new(points.length() * points.length() + 1)
    let mut best: i64 = -1
    let mut start: usize = 0
    while start < keys.length() {
        let x: i64 = keys⁅start⁆ / base - offset
        let mut stop: usize = start
        while stop < keys.length() && keys⁅stop⁆ / base == keys⁅start⁆ / base {
            stop = stop + 1
        }
        let mut first: usize = start
        while first < stop {
            let low: i64 = keys⁅first⁆ % base - offset
            let mut second: usize = first + 1
            while second < stop {
                let high: i64 = keys⁅second⁆ % base - offset
                let pair: i64 = (low + offset) * base + (high + offset)
                if pairs.contains_key(pair) {
                    let previous: i64 = pairs.get(pair).unwrap()
                    let area: i64 = (x - previous) * (high - low)
                    if best < 0 || area < best {
                        best = area
                    }
                }
                pairs.insert(pair, x)
                second = second + 1
            }
            first = first + 1
        }
        start = stop
    }
    if best < 0 {
        return 0
    }
    return best
}

class Solution {
    micro minAreaRect(self, points: ArrayList<ArrayList<i64>>): i64 {
        return min_area_rect(points)
    }
}
