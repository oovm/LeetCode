namespace leetcode.maximize_distance_to_closest_person;

using std.collection;

# 三段取最大：左端空段、相邻两人之间的半段、右端空段，一趟 O(n)。
[export(case: "camelCase")]
micro maxDistToClosest(seats: ArrayList<i64>) -> i64 {
    let count: i64 = seats.length() as i64
    let mut last: i64 = -1
    let mut best: i64 = 0
    let mut i: i64 = 0
    while i < count {
        if seats⁅i as usize⁆ == 1 {
            if last < 0 {
                best = i
            } else {
                let gap: i64 = (i - last) / 2
                if gap > best {
                    best = gap
                }
            }
            last = i
        }
        i = i + 1
    }
    if last >= 0 && count - 1 - last > best {
        best = count - 1 - last
    }
    return best
}

class Solution {
    micro maxDistToClosest(self, seats: ArrayList<i64>): i64 {
        return maxDistToClosest(seats)
    }
}
