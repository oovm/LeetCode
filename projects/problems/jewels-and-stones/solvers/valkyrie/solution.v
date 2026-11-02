namespace leetcode.jewels_and_stones;

[export(case: "camelCase")]
micro num_jewels_in_stones(jewels: utf8, stones: utf8) -> i64 {
    let jn: usize = jewels.length()
    let sn: usize = stones.length()
    let mut count: i64 = 0
    let mut si: usize = 0
    while si < sn {
        let sc: u32 = stones⁅si⁆ as u32
        let mut ji: usize = 0
        let mut hit: bool = false
        while ji < jn && hit == false {
            if jewels⁅ji⁆ as u32 == sc {
                count = count + 1
                hit = true
            }
            ji = ji + 1
        }
        si = si + 1
    }
    return count
}

class Solution {
    micro numJewelsInStones(self, jewels: utf8, stones: utf8): i64 {
        return num_jewels_in_stones(jewels, stones)
    }
}
