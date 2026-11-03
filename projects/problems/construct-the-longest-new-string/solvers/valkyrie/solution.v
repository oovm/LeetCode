namespace leetcode.construct_the_longest_new_string;

# AB 全部可用；AA/BB 交替配对 2·min(x,y)，不等时多挂一段，z 段各 2 长。
[export(case: "camelCase")]
micro longest_string(x: i64, y: i64, z: i64) -> i64 {
    let mut pair: i64 = x
    if y < x {
        pair = y
    }
    let mut extra: i64 = 0
    if x != y {
        extra = 1
    }
    return 2 * (2 * pair + extra) + 2 * z
}

class Solution {
    micro longestString(self, x: i64, y: i64, z: i64): i64 {
        return longest_string(x, y, z)
    }
}
