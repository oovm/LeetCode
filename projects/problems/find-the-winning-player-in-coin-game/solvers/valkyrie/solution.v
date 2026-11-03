namespace leetcode.find_the_winning_player_in_coin_game;

micro alice_text() -> utf8 {
    return Utf8Text::from_bytes([65, 108, 105, 99, 101])
}

micro bob_text() -> utf8 {
    return Utf8Text::from_bytes([66, 111, 98])
}

# 每回合固定消耗 1 枚 75 与 4 枚 10，可行动回合数为 min(x, y/4)。
[export(case: "camelCase")]
micro winning_player(x: i64, y: i64) -> utf8 {
    let mut turns: i64 = y / 4
    if x < turns {
        turns = x
    }
    if turns % 2 == 1 {
        return alice_text()
    }
    return bob_text()
}

class Solution {
    micro winningPlayer(self, x: i64, y: i64): utf8 {
        return winning_player(x, y)
    }
}
