namespace leetcode.combination_sum_ii;

using std.collection;

# 拷贝排序后回溯：同层跳过与前一个相等的候选（`i > start` 判据）去重，每个数至多用一次。
micro backtrack(candidates: ArrayList<i64>, start: usize, remain: i64, path: ArrayList<i64>, out: ArrayList<ArrayList<i64>>) -> unit {
    if remain == 0 {
        let mut row: ArrayList<i64> = ArrayList::new(path.length())
        loop value in path {
            row.push(value)
        }
        out.push(row)
        return
    }
    let mut i: usize = start
    while i < candidates.length() {
        if candidates⁅i⁆ > remain {
            break
        }
        if i > start && candidates⁅i⁆ == candidates⁅i - 1⁆ {
            i = i + 1
            continue
        }
        path.push(candidates⁅i⁆)
        backtrack(candidates, i + 1, remain - candidates⁅i⁆, path, out)
        let dropped: Option<i64> = path.remove(path.length())
        i = i + 1
    }
}

[export(case: "camelCase")]
micro combinationSum2(candidates: ArrayList<i64>, target: i64) -> ArrayList<ArrayList<i64>> {
    let mut sorted: ArrayList<i64> = ArrayList::new(candidates.length())
    loop value in candidates {
        sorted.push(value)
    }
    sort(sorted)
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let mut path: ArrayList<i64> = ArrayList::new(0)
    backtrack(sorted, 0, target, path, out)
    return out
}

class Solution {
    micro combinationSum2(self, candidates: ArrayList<i64>, target: i64): ArrayList<ArrayList<i64>> {
        return combinationSum2(candidates, target)
    }
}
