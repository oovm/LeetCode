namespace leetcode.combinations;

micro dfs(n: i64, k: i64, start: i64, picked: ArrayList<i64>, out: ArrayList<[i64]>) {
    if picked.length() == k as usize {
        let mut copy: ArrayList<i64> = ArrayList::new(k as usize)
        let mut j: usize = 0
        while j < picked.length() {
            copy.push(picked⁅j⁆)
            j = j + 1
        }
        out.push(copy.to_array())
        return
    }
    let mut i: i64 = start
    while i <= n {
        picked.push(i)
        dfs(n, k, i + 1, picked, out)
        picked.pop()
        i = i + 1
    }
}

[export(case: "camelCase")]
micro combine(n: i64, k: i64) -> [[i64]] {
    let mut out: ArrayList<[i64]> = ArrayList::new(0)
    let mut picked: ArrayList<i64> = ArrayList::new(k as usize)
    dfs(n, k, 1, picked, out)
    return out.to_array()
}

class Solution {
    micro combine(self, n: i64, k: i64): [[i64]] {
        return combine(n, k)
    }
}
