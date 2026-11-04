namespace leetcode.solution

using std.collection

# 题内触发点: 前缀异或表，区间异或用「右端前缀 ^ 左端前一位前缀」两次查表。
class Solution {
    [export(case: "xorQueries")]
    micro xorQueries(arr: ArrayList<i64>, queries: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
        let prefix: ArrayList<i64> = ArrayList::new(arr.length() + 1)
        prefix.push(0)
        let mut index: usize = 0
        while index < arr.length() {
            let previous: i64 = prefix⁅index⁆
            prefix.push(previous ^ arr⁅index⁆)
            index = index + 1
        }
        let answers: ArrayList<i64> = ArrayList::new(queries.length())
        loop query in queries {
            let left: i64 = query⁅0⁆
            let right: i64 = query⁅1⁆
            answers.push(prefix⁅(right + 1) as usize⁆ ^ prefix⁅left as usize⁆)
        }
        return answers
    }
}
