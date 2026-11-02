namespace leetcode.decode_the_message;

micro position_in(key: utf8, target: u32) -> i64 {
    let n: usize = key.length()
    let mut i: usize = 0
    let mut seen: i64 = -1
    while i < n {
        let code: u32 = key⁅i⁆ as u32
        if code != 32 {
            seen = seen + 1
            if code == target {
                return seen
            }
        }
        i = i + 1
    }
    return -1
}

[export(case: "camelCase")]
micro decode_message(key: utf8, message: utf8) -> utf8 {
    let n: usize = message.length()
    let mut result: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        let code: u32 = message⁅i⁆ as u32
        if code == 32 {
            result.append(char::from(32))
        } else {
            let position: i64 = position_in(key, code)
            result.append(char::from((97 + position) as u32))
        }
        i = i + 1
    }
    return result.build()
}

class Solution {
    micro decodeMessage(self, key: utf8, message: utf8): utf8 {
        return decode_message(key, message)
    }
}
