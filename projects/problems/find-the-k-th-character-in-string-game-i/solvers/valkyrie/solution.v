namespace leetcode.find_the_k_th_character_in_string_game_i;

# 第 k 位相对 'a' 的偏移等于 k-1 的二进制 1 位数。
[export(case: "camelCase")]
micro kth_character(k: i64) -> utf8 {
    let mut value: i64 = k - 1
    let mut shifts: i64 = 0
    while value > 0 {
        shifts = shifts + (value % 2)
        value = value / 2
    }
    let mut builder: Utf8Builder = Utf8Builder::new(1)
    builder.append(char::from((97 + shifts % 26) as u32))
    return builder.build()
}

class Solution {
    micro kthCharacter(self, k: i64): utf8 {
        return kth_character(k)
    }
}
