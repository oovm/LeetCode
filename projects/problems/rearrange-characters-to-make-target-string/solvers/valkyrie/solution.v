namespace leetcode.rearrange_characters_to_make_target_string;

[export(case: "camelCase")]
micro rearrange_characters(s: utf8, target: utf8) -> i64 {
    let mut have: ArrayList<i64> = ArrayList::new(26)
    let mut need: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        have.push(0)
        need.push(0)
        i = i + 1
    }
    i = 0
    while i < s.length() {
        let idx: usize = (s⁅i⁆ as u32 - 97) as usize
        have⁅idx⁆ = have⁅idx⁆.unwrap() + 1
        i = i + 1
    }
    i = 0
    while i < target.length() {
        let idx: usize = (target⁅i⁆ as u32 - 97) as usize
        need⁅idx⁆ = need⁅idx⁆.unwrap() + 1
        i = i + 1
    }
    let mut best: i64 = 2147483647
    i = 0
    while i < 26 {
        let want: i64 = need⁅i⁆.unwrap()
        if want > 0 {
            let made: i64 = have⁅i⁆.unwrap() / want
            if made < best {
                best = made
            }
        }
        i = i + 1
    }
    if best == 2147483647 {
        return 0
    }
    return best
}

class Solution {
    micro rearrangeCharacters(self, s: utf8, target: utf8): i64 {
        return rearrange_characters(s, target)
    }
}
