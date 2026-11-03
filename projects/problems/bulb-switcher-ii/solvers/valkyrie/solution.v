namespace leetcode.bulb_switcher_ii;

# 周期 6 的开关等价类：n=1 → 2；n=2 → 按 presses 3/4；n≥3 → 按 presses 4/7/8。
[export(case: "camelCase")]
micro flip_lights(n: i64, presses: i64) -> i64 {
    if presses == 0 {
        return 1
    }
    if n == 1 {
        return 2
    }
    if n == 2 {
        if presses == 1 {
            return 3
        }
        return 4
    }
    if presses == 1 {
        return 4
    }
    if presses == 2 {
        return 7
    }
    return 8
}

class Solution {
    micro flipLights(self, n: i64, presses: i64): i64 {
        return flip_lights(n, presses)
    }
}
