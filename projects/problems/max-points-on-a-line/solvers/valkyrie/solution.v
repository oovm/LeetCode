namespace leetcode.solution

using std.collection

# 题内触发点: G23 —— std 没有 `gcd`，斜率归一化必须在题内手写最大公约数。
micro absolute(value: i64) -> i64 {
    if value < 0 {
        return 0 - value
    }
    return value
}

micro greatest_common(left: i64, right: i64) -> i64 {
    let mut a: i64 = left
    let mut b: i64 = right
    while b != 0 {
        let remainder: i64 = a % b
        a = b
        b = remainder
    }
    return a
}

class Solution {
    [export(case: "camelCase")]
    micro maxPoints(points: [[i64]]) -> i64 {
        let total: usize = points.length()
        if total <= 2 {
            return total as i64
        }
        let mut best: i64 = 1
        let mut origin: usize = 0
        while origin < total {
            let x0: i64 = points⁅origin⁆⁅0⁆
            let y0: i64 = points⁅origin⁆⁅1⁆
            let mut slopes: HashMap<i64, i64> = HashMap::new(16)
            let mut same: i64 = 0
            let mut local: i64 = 0
            let mut peer: usize = 0
            while peer < total {
                if peer != origin {
                    let dx: i64 = points⁅peer⁆⁅0⁆ - x0
                    let dy: i64 = points⁅peer⁆⁅1⁆ - y0
                    if dx == 0 && dy == 0 {
                        same = same + 1
                    } else {
                        let divisor: i64 = greatest_common(absolute(dx), absolute(dy))
                        let mut ux: i64 = dx / divisor
                        let mut uy: i64 = dy / divisor
                        if ux < 0 || (ux == 0 && uy < 0) {
                            ux = 0 - ux
                            uy = 0 - uy
                        }
                        # 坐标上界 10^4，归一化后分量落在 [-20000, 20000]，编码进单个 i64 键。
                        let key: i64 = (ux + 20000) * 40001 + (uy + 20000)
                        let mut count: i64 = 1
                        if slopes.contains_key(key) {
                            count = slopes.get(key).unwrap() + 1
                        }
                        slopes.insert(key, count)
                        if count > local {
                            local = count
                        }
                    }
                }
                peer = peer + 1
            }
            let candidate: i64 = local + same + 1
            if candidate > best {
                best = candidate
            }
            origin = origin + 1
        }
        return best
    }
}
