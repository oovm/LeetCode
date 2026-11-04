namespace leetcode.teemo_attacking;

# 相邻两次攻击的间隔若小于持续时长，只有间隔那段被真正生效：
# 逐段取 min(下次攻击时间 - 本次攻击时间, duration)，最后一段取完整 duration。
[export(case: "camelCase")]
micro findPoisonedDuration(timeSeries: ArrayList<i64>, duration: i64) -> i64 {
    let count: usize = timeSeries.length()
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < count {
        let mut chunk: i64 = duration
        let next: usize = index + 1
        if next < count {
            let gap: i64 = timeSeries⁅next⁆ - timeSeries⁅index⁆
            if gap < duration {
                chunk = gap
            }
        }
        total = total + chunk
        index = index + 1
    }
    return total
}

class Solution {
    micro findPoisonedDuration(self, timeSeries: ArrayList<i64>, duration: i64): i64 {
        return findPoisonedDuration(timeSeries, duration)
    }
}
