namespace leetcode.single_row_keyboard;

micro abs_i64(x: i64) -> i64 {
    if x < 0 {
        return 0 - x
    }
    return x
}

[export(case: "camelCase")]
micro calculate_time(keyboard: utf8, word: utf8) -> i64 {
    let mut pos: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        pos.push(-1)
        i = i + 1
    }
    i = 0
    while i < keyboard.length() {
        let code: u32 = keyboard⁅i⁆ as u32
        pos⁅(code as usize) - 97⁆ = i as i64
        i = i + 1
    }
    let mut time: i64 = 0
    let mut current: i64 = 0
    let mut j: usize = 0
    while j < word.length() {
        let code: u32 = word⁅j⁆ as u32
        let target: i64 = pos⁅(code as usize) - 97⁆
        time = time + abs_i64(target - current)
        current = target
        j = j + 1
    }
    return time
}

class Solution {
    micro calculateTime(self, keyboard: utf8, word: utf8): i64 {
        return calculate_time(keyboard, word)
    }
}
