namespace leetcode.factor_combinations;

using std.collection;

# 回溯：当前路径非空时把「剩余因子 n」作为一个解，再只枚举不小于上一个因子的除数，
# 保证每个因子组合按升序只出现一次，O(解数·k)。
micro dfs_factor(remaining: i64, factor: i64, path: ArrayList<i64>, out: ArrayList<ArrayList<i64>>) -> unit {
    if path.length() > 0 {
        let mut row: ArrayList<i64> = ArrayList::new(path.length() + 1)
        loop value in path {
            row.push(value)
        }
        row.push(remaining)
        out.push(row)
    }
    let mut candidate: i64 = factor
    while candidate * candidate <= remaining {
        if remaining % candidate == 0 {
            path.push(candidate)
            dfs_factor(remaining / candidate, candidate, path, out)
            let dropped: Option<i64> = path.remove(path.length())
        }
        candidate = candidate + 1
    }
}

[export(case: "camelCase")]
micro get_factors(n: i64) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(16)
    let mut path: ArrayList<i64> = ArrayList::new(16)
    dfs_factor(n, 2, path, out)
    return out
}

class Solution {
    micro getFactors(self, n: i64): ArrayList<ArrayList<i64>> {
        return get_factors(n)
    }
}
