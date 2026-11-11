namespace leetcode.friends_of_appropriate_ages;

using std.collection;

# 年龄只有 121 种取值，先做频次表再枚举年龄对。
# 条件：`y > 0.5x + 7` 且 `y <= x` 且 `(y <= 100 或 x >= 100)`，等价于 `2y > x + 14`。
# 同岁时减去自己给自己发请求的那一份。
[export(case: "camelCase")]
micro num_friend_requests(ages: [i64]) -> i64 {
    let mut counts: ArrayList<i64> = ArrayList::new(121)
    let mut fill: usize = 0
    while fill < 121 {
        counts.push(0)
        fill = fill + 1
    }
    let mut index: usize = 0
    while index < ages.length() {
        let age: i64 = ages⁅index⁆
        counts⁅age as usize⁆ = counts⁅age as usize⁆ + 1
        index = index + 1
    }
    let mut total: i64 = 0
    let mut younger: i64 = 0
    while younger <= 120 {
        let mut older: i64 = 0
        while older <= 120 {
            if !(older * 2 <= younger + 14 || older > younger || (older > 100 && younger < 100)) {
                let mut duplicate: i64 = 0
                if younger == older {
                    duplicate = 1
                }
                total = total + counts⁅younger as usize⁆ * (counts⁅older as usize⁆ - duplicate)
            }
            older = older + 1
        }
        younger = younger + 1
    }
    return total
}

class Solution {
    micro numFriendRequests(self, ages: [i64]): i64 {
        return num_friend_requests(ages)
    }
}
