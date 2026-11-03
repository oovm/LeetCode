namespace leetcode.rings_and_rods;

[export(case: "camelCase")]
micro count_points(rings: utf8) -> i64 {
    let mut rods: ArrayList<i64> = ArrayList::new(10)
    let mut i: usize = 0
    while i < 10 {
        rods.push(0)
        i = i + 1
    }
    let n: usize = rings.length()
    let mut p: usize = 0
    while p + 1 < n {
        let color: u32 = rings⁅p⁆ as u32
        let mut bit: i64 = 4
        if color == 82 {
            bit = 1
        } else if color == 71 {
            bit = 2
        }
        let digit: i64 = rings⁅p + 1⁆ as u32 as i64 - 48
        let slot: usize = digit as usize
        rods⁅slot⁆ = rods⁅slot⁆.unwrap() | bit
        p = p + 2
    }
    let mut total: i64 = 0
    let mut j: usize = 0
    while j < 10 {
        if rods⁅j⁆.unwrap() == 7 {
            total = total + 1
        }
        j = j + 1
    }
    return total
}

class Solution {
    micro countPoints(self, rings: utf8): i64 {
        return count_points(rings)
    }
}
