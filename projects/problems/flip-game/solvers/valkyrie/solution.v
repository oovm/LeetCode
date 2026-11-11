namespace leetcode.flip_game;

# 每个连续 "++" 翻成 "--"，其余字符保持。
[export(case: "camelCase")]
micro generate_possible_next_moves(currentState: utf8) -> [utf8] {
    let n: usize = currentState.length()
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    let mut i: usize = 0
    while i + 1 < n {
        if currentState⁅i⁆ as u32 == 43 && currentState⁅i + 1⁆ as u32 == 43 {
            let mut builder: Utf8Builder = Utf8Builder::new(n)
            let mut j: usize = 0
            while j < n {
                if j == i || j == i + 1 {
                    builder.append(char::from(45 as u32))
                } else {
                    builder.append(char::from(currentState⁅j⁆ as u32))
                }
                j = j + 1
            }
            result.push(builder.build())
        }
        i = i + 1
    }
    return result.to_array()
}

class Solution {
    micro generatePossibleNextMoves(self, currentState: utf8): [utf8] {
        return generate_possible_next_moves(currentState)
    }
}
