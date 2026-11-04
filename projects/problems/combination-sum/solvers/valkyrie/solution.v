namespace leetcode.solution

using std.collection

# 题内触发点: 回溯递归 `collect_sums` 原地压栈/弹栈，命中时把路径复制进结果容器。
micro collect_sums(candidates: ArrayList<i64>, start: i64, target: i64, path: ArrayList<i64>, out: ArrayList<ArrayList<i64>>) -> unit {
    if target == 0 {
        let row: ArrayList<i64> = ArrayList::new(path.length())
        loop value in path {
            row.push(value)
        }
        out.push(row)
        return
    }
    let mut index: i64 = start
    while index < (candidates.length() as i64) {
        let value: i64 = candidates⁅index as usize⁆
        if value <= target {
            path.push(value)
            collect_sums(candidates, index, target - value, path, out)
            let dropped: Option<i64> = path.remove(path.length())
        }
        index = index + 1
    }
}

class Solution {
    [export(case: "combinationSum")]
    micro combinationSum(candidates: ArrayList<i64>, target: i64) -> ArrayList<ArrayList<i64>> {
        let out: ArrayList<ArrayList<i64>> = ArrayList::new(8)
        let path: ArrayList<i64> = ArrayList::new(8)
        collect_sums(candidates, 0, target, path, out)
        return out
    }
}
