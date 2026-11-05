namespace leetcode.combination_sum_iii;

using std.collection;

# 取/不取 i 的 DFS：先取 i 再回溯，然后跳过 i。与参考实现的次序一致，
# 剪枝用 `i > 剩余和` 与剩余名额，整体 O(C(9,k)·k)。
micro dfs_combine(i: i64, remaining: i64, k: i64, path: ArrayList<i64>, out: ArrayList<ArrayList<i64>>) -> unit {
    if remaining == 0 {
        if path.length() as i64 == k {
            let mut row: ArrayList<i64> = ArrayList::new(path.length())
            loop value in path {
                row.push(value)
            }
            out.push(row)
        }
        return
    }
    if i > 9 || i > remaining {
        return
    }
    if path.length() as i64 >= k {
        return
    }
    path.push(i)
    dfs_combine(i + 1, remaining - i, k, path, out)
    let dropped: Option<i64> = path.remove(path.length())
    dfs_combine(i + 1, remaining, k, path, out)
}

[export(case: "camelCase")]
micro combination_sum3(k: i64, n: i64) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(32)
    let mut path: ArrayList<i64> = ArrayList::new(k as usize)
    dfs_combine(1, n, k, path, out)
    return out
}

class Solution {
    micro combinationSum3(self, k: i64, n: i64): ArrayList<ArrayList<i64>> {
        return combination_sum3(k, n)
    }
}
