namespace leetcode.maximum_score_from_removing_stones;

# 排序三堆后：最大堆 ≥ 另两堆之和则答案为和，否则 (a+b+c)/2。
[export(case: "camelCase")]
micro maximum_score(a: i64, b: i64, c: i64) -> i64 {
    let mut x: i64 = a
    let mut y: i64 = b
    let mut z: i64 = c
    if x > y {
        let t: i64 = x
        x = y
        y = t
    }
    if y > z {
        let t: i64 = y
        y = z
        z = t
    }
    if x > y {
        let t: i64 = x
        x = y
        y = t
    }
    if z >= x + y {
        return x + y
    }
    return (x + y + z) / 2
}

class Solution {
    micro maximumScore(self, a: i64, b: i64, c: i64): i64 {
        return maximum_score(a, b, c)
    }
}
