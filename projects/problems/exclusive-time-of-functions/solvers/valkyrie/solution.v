namespace leetcode.exclusive_time_of_functions;

using std.collection;

# 栈模拟调用：start 入栈并结算上一个区间，end 出栈并结算闭区间（含端点 +1）。
# 每条日志只解析一次，O(日志数)。
micro colon_from(log: utf8, from: usize) -> usize {
    let mut index: usize = from
    while index < log.byte_length() {
        if (log.byte_at(index) as i64) == 58 {
            return index
        }
        index = index + 1
    }
    return log.byte_length()
}

micro parse_number(log: utf8, start: usize, stop: usize) -> i64 {
    let mut value: i64 = 0
    let mut index: usize = start
    while index < stop {
        value = value * 10 + (log.byte_at(index) as i64) - 48
        index = index + 1
    }
    return value
}

[export(case: "camelCase")]
micro exclusive_time(n: i64, logs: [utf8]) -> [i64] {
    let mut answer: ArrayList<i64> = ArrayList::new(n as usize)
    let mut index: i64 = 0
    while index < n {
        answer.push(0)
        index = index + 1
    }

    let mut stack: ArrayList<i64> = ArrayList::new(logs.length())
    let mut previous: i64 = 0
    let mut at: usize = 0
    while at < logs.length() {
        let log: utf8 = logs⁅at⁆
        let first: usize = colon_from(log, 0)
        let second: usize = colon_from(log, first + 1)
        let identifier: i64 = parse_number(log, 0, first)
        let stamp: i64 = parse_number(log, second + 1, log.byte_length())
        if (log.byte_at(first + 1) as i64) == 115 {
            if stack.length() > 0 {
                let top: usize = stack.length() - 1
                let slot: usize = stack⁅top⁆ as usize
                answer⁅slot⁆ = answer⁅slot⁆ + stamp - previous
            }
            stack.push(identifier)
            previous = stamp
        } else {
            let finished: Option<i64> = stack.pop()
            let slot: usize = finished.unwrap() as usize
            answer⁅slot⁆ = answer⁅slot⁆ + stamp - previous + 1
            previous = stamp + 1
        }
        at = at + 1
    }
    return answer.to_array()
}

class Solution {
    micro exclusiveTime(self, n: i64, logs: [utf8]): [i64] {
        return exclusive_time(n, logs)
    }
}
