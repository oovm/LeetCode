namespace leetcode.car_fleet;

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

# 按位置把车压成键排序，再从头车（最靠前）往车队尾部扫描。
# 到达时间用交叉相乘比较，避免浮点：t_new > t_prev 当且仅当 `num * prev_den > prev_num * den`。
[export(case: "camelCase")]
micro car_fleet(target: i64, position: ArrayList<i64>, speed: ArrayList<i64>) -> i64 {
    let n: usize = position.length()
    let mut keys: ArrayList<i64> = ArrayList::new(n)
    let mut index: usize = 0
    while index < n {
        keys.push(position⁅index⁆ * 131072 + index as i64)
        index = index + 1
    }
    quick_sort(keys, cmp_i64)
    let mut fleets: i64 = 0
    let mut previous_num: i64 = 0
    let mut previous_den: i64 = 1
    let mut cursor: i64 = n as i64 - 1
    while cursor >= 0 {
        let at: usize = cursor as usize
        let car: usize = (keys⁅at⁆ % 131072) as usize
        let num: i64 = target - position⁅car⁆
        let den: i64 = speed⁅car⁆
        if num * previous_den > previous_num * den {
            fleets = fleets + 1
            previous_num = num
            previous_den = den
        }
        cursor = cursor - 1
    }
    return fleets
}

class Solution {
    micro carFleet(self, target: i64, position: ArrayList<i64>, speed: ArrayList<i64>): i64 {
        return car_fleet(target, position, speed)
    }
}
