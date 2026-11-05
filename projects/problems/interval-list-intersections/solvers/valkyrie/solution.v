namespace leetcode.interval_list_intersections;

using std.collection;

micro larger(left: i64, right: i64) -> i64 {
    if left > right {
        return left
    }
    return right
}

micro smaller(left: i64, right: i64) -> i64 {
    if left < right {
        return left
    }
    return right
}

# 双指针同时前进：每次丢弃右端点更小的区间，交集已按左端点有序产出。
[export(case: "camelCase")]
micro interval_intersection(firstList: ArrayList<ArrayList<i64>>, secondList: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let mut first: usize = 0
    let mut second: usize = 0
    while first < firstList.length() {
        if second >= secondList.length() {
            break
        }
        let first_start: i64 = firstList⁅first⁆⁅0⁆
        let first_end: i64 = firstList⁅first⁆⁅1⁆
        let second_start: i64 = secondList⁅second⁆⁅0⁆
        let second_end: i64 = secondList⁅second⁆⁅1⁆
        let start: i64 = larger(first_start, second_start)
        let end: i64 = smaller(first_end, second_end)
        if start <= end {
            let mut pair: ArrayList<i64> = ArrayList::new(2)
            pair.push(start)
            pair.push(end)
            result.push(pair)
        }
        if first_end < second_end {
            first = first + 1
        } else {
            second = second + 1
        }
    }
    return result
}

class Solution {
    micro intervalIntersection(self, firstList: ArrayList<ArrayList<i64>>, secondList: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return interval_intersection(firstList, secondList)
    }
}
