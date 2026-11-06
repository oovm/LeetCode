namespace leetcode.the_employee_that_worked_on_the_longest_task;

using std.collection;

# 单次任务时长等于当前日志时间减上一条日志时间，首条以自身时间计；最长者胜，平手取编号更小者。
[export(case: "camelCase")]
micro hardestWorker(n: i64, logs: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = logs.length()
    let mut answer: i64 = -1
    let mut longest: i64 = -1
    let mut previous_time: i64 = 0
    let mut index: usize = 0
    while index < count {
        let log: ArrayList<i64> = logs⁅index⁆
        let employee: i64 = log⁅0⁆
        let time: i64 = log⁅1⁆
        let duration: i64 = time - previous_time
        if duration > longest {
            longest = duration
            answer = employee
        } else {
            if duration == longest && employee < answer {
                answer = employee
            }
        }
        previous_time = time
        index = index + 1
    }
    return answer
}

class Solution {
    micro hardestWorker(self, n: i64, logs: ArrayList<ArrayList<i64>>): i64 {
        return hardestWorker(n, logs)
    }
}
