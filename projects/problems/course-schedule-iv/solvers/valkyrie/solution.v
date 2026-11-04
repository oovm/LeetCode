namespace leetcode.course_schedule_iv;

using std.collection;

# 传递闭包：先用直接先修边填矩阵，再跑 Floyd 得到全部可达关系。
# `numCourses <= 100`，O(n^3) 足够。
[export(case: "camelCase")]
micro checkIfPrerequisite(numCourses: i64, prerequisites: ArrayList<ArrayList<i64>>, queries: ArrayList<ArrayList<i64>>) -> ArrayList<bool> {
    let count: usize = numCourses as usize

    let mut reachable: ArrayList<ArrayList<bool>> = ArrayList::new(count)
    let mut row: usize = 0
    while row < count {
        let mut values: ArrayList<bool> = ArrayList::new(count)
        let mut col: usize = 0
        while col < count {
            values.push(col == row)
            col = col + 1
        }
        reachable.push(values)
        row = row + 1
    }

    let mut index: usize = 0
    while index < prerequisites.length() {
        let pair: ArrayList<i64> = prerequisites⁅index⁆
        let before: i64 = pair⁅0⁆
        let after: i64 = pair⁅1⁆
        let mut values: ArrayList<bool> = reachable⁅before as usize⁆
        values.set((after + 1) as isize, true)
        reachable.set((before + 1) as isize, values)
        index = index + 1
    }

    let mut middle: usize = 0
    while middle < count {
        let via: ArrayList<bool> = reachable⁅middle⁆
        let mut source: usize = 0
        while source < count {
            let source_row: ArrayList<bool> = reachable⁅source⁆
            if source != middle && source_row⁅middle⁆ {
                let mut values: ArrayList<bool> = reachable⁅source⁆
                let mut target: usize = 0
                while target < count {
                    if via⁅target⁆ {
                        values.set((target as i64 + 1) as isize, true)
                    }
                    target = target + 1
                }
                reachable.set((source as i64 + 1) as isize, values)
            }
            source = source + 1
        }
        middle = middle + 1
    }

    let mut result: ArrayList<bool> = ArrayList::new(queries.length())
    index = 0
    while index < queries.length() {
        let pair: ArrayList<i64> = queries⁅index⁆
        let before: i64 = pair⁅0⁆
        let after: i64 = pair⁅1⁆
        let answer_row: ArrayList<bool> = reachable⁅before as usize⁆
        result.push(answer_row⁅after as usize⁆)
        index = index + 1
    }
    return result
}

class Solution {
    micro checkIfPrerequisite(self, numCourses: i64, prerequisites: ArrayList<ArrayList<i64>>, queries: ArrayList<ArrayList<i64>>): ArrayList<bool> {
        return checkIfPrerequisite(numCourses, prerequisites, queries)
    }
}
