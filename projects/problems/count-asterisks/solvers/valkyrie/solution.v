namespace leetcode.count_asterisks;

[export(case: "camelCase")]
micro count_asterisks(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut i: usize = 0
    let mut inside: bool = false
    let mut count: i64 = 0
    while i < n {
        let code: u32 = s.char_at(i + 1).unwrap() as u32
        if code == 124 {
            inside = !inside
        } else if code == 42 && inside == false {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro countAsterisks(self, s: utf8): i64 {
        return count_asterisks(s)
    }
}
