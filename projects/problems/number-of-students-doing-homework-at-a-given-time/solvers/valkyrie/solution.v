namespace leetcode.number_of_students_doing_homework_at_a_given_time

# 逐位判断 queryTime 是否落在 [startTime[i], endTime[i]] 区间内。
[export(case: "camelCase")]
micro busyStudent(startTime: ArrayList<i64>, endTime: ArrayList<i64>, queryTime: i64) -> i64 {
    let count: usize = startTime.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < count {
        if startTime⁅i⁆ <= queryTime {
            if queryTime <= endTime⁅i⁆ {
                total = total + 1
            }
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro busyStudent(self, startTime: ArrayList<i64>, endTime: ArrayList<i64>, queryTime: i64): i64 {
        return busyStudent(startTime, endTime, queryTime)
    }
}
