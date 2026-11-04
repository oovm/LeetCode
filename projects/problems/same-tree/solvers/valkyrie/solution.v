namespace leetcode.same_tree;

# 两棵层序数组同步递归：任一侧缺节点就要求另一侧同样缺，都存在时再比值和子树。
micro same(p: ArrayList<i64>, q: ArrayList<i64>, index: usize) -> bool {
    let in_p: bool = index < p.length()
    let in_q: bool = index < q.length()
    if in_p == false {
        return in_q == false
    }
    if in_q == false {
        return false
    }
    if p⁅index⁆ != q⁅index⁆ {
        return false
    }
    if same(p, q, 2 * index + 1) == false {
        return false
    }
    return same(p, q, 2 * index + 2)
}

[export(case: "camelCase")]
micro isSameTree(p: ArrayList<i64>, q: ArrayList<i64>) -> bool {
    return same(p, q, 0)
}

class Solution {
    micro isSameTree(self, p: ArrayList<i64>, q: ArrayList<i64>): bool {
        return isSameTree(p, q)
    }
}
