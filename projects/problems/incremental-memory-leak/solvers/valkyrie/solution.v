namespace leetcode.incremental_memory_leak;

# 第 i 秒把 i 个 bit 分配给当前剩余更多的那个内存条。
[export(case: "camelCase")]
micro mem_leak(memory1: i64, memory2: i64) -> ArrayList<i64> {
    let mut first: i64 = memory1
    let mut second: i64 = memory2
    let mut second_of_time: i64 = 1
    while first >= second_of_time || second >= second_of_time {
        if first >= second {
            first = first - second_of_time
        } else {
            second = second - second_of_time
        }
        second_of_time = second_of_time + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(3)
    answer.push(second_of_time)
    answer.push(first)
    answer.push(second)
    return answer
}

class Solution {
    micro memLeak(self, memory1: i64, memory2: i64): ArrayList<i64> {
        return mem_leak(memory1, memory2)
    }
}
