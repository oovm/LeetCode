namespace leetcode.maximum_number_of_balloons;

[export(case: "camelCase")]
micro max_number_of_balloons(text: utf8) -> i64 {
    let mut counts: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        counts.push(0)
        i = i + 1
    }
    i = 0
    while i < text.length() {
        let code: u32 = text⁅i⁆ as u32
        counts⁅(code as usize) - 97⁆ = counts⁅(code as usize) - 97⁆.unwrap() + 1
        i = i + 1
    }
    let mut result: i64 = counts⁅1⁆.unwrap()
    if counts⁅0⁆.unwrap() < result {
        result = counts⁅0⁆.unwrap()
    }
    let half_l: i64 = counts⁅11⁆.unwrap() / 2
    if half_l < result {
        result = half_l
    }
    let half_o: i64 = counts⁅14⁆.unwrap() / 2
    if half_o < result {
        result = half_o
    }
    if counts⁅13⁆.unwrap() < result {
        result = counts⁅13⁆.unwrap()
    }
    return result
}

class Solution {
    micro maxNumberOfBalloons(self, text: utf8): i64 {
        return max_number_of_balloons(text)
    }
}
