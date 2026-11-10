namespace leetcode.slowest_key;

using std.collection;
using std.text;

# 逐键比较时长：首键时长为 releaseTimes[0]，其后为相邻差；时长更大或等长但码位更大者胜。
[export(case: "camelCase")]
micro slowestKey(releaseTimes: ArrayList<i64>, keysPressed: utf8) -> utf8 {
    let mut best_code: u32 = keysPressed⁅0⁆ as u32
    let mut best_dur: i64 = releaseTimes⁅0⁆
    let mut i: usize = 1
    while i < keysPressed.length() {
        let dur: i64 = releaseTimes⁅i⁆ - releaseTimes⁅i - 1⁆
        let code: u32 = keysPressed⁅i⁆ as u32
        if dur > best_dur || (dur == best_dur && code > best_code) {
            best_dur = dur
            best_code = code
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    builder.append(best_code as char)
    return builder.build()
}

class Solution {
    micro slowestKey(self, releaseTimes: ArrayList<i64>, keysPressed: utf8): utf8 {
        return slowestKey(releaseTimes, keysPressed)
    }
}
