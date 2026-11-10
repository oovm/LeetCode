namespace leetcode.number_of_provinces;

using std.collection;

# 并查集：路径压缩 find，逐上三角合并 isConnected 为 1 的点对，最后数根。O(n² α(n))。
micro find(x: usize, parent: ArrayList<i64>) -> usize {
    let p: usize = parent⁅x⁆ as usize
    if p != x {
        let root: usize = find(p, parent)
        parent⁅x⁆ = root as i64
        return root
    }
    return x
}

[export(case: "camelCase")]
micro findCircleNum(isConnected: ArrayList<ArrayList<i64>>) -> i64 {
    let n: usize = isConnected.length()
    let mut parent: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        parent.push(i as i64)
        i = i + 1
    }
    i = 0
    while i < n {
        let mut j: usize = i + 1
        while j < n {
            if isConnected⁅i⁆⁅j⁆ == 1 {
                let ri: usize = find(i, parent)
                let rj: usize = find(j, parent)
                if ri != rj {
                    parent⁅ri⁆ = rj as i64
                }
            }
            j = j + 1
        }
        i = i + 1
    }
    let mut count: i64 = 0
    i = 0
    while i < n {
        if find(i, parent) == i {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro findCircleNum(self, isConnected: ArrayList<ArrayList<i64>>): i64 {
        return findCircleNum(isConnected)
    }
}
