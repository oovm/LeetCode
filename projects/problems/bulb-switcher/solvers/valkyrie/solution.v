namespace leetcode.bulb_switcher;

[export(case: "camelCase")]
micro bulb_switch(n: i64) -> i64 {
    let mut k: i64 = 1
    let mut count: i64 = 0
    while k * k <= n {
        count = count + 1
        k = k + 1
    }
    return count
}

class Solution {
    micro bulbSwitch(self, n: i64): i64 {
        return bulb_switch(n)
    }
}
