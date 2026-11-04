namespace leetcode.satisfiability_of_equality_equations;

using std.collection;

# 方程按首个 "==" / "!=" 切成左右两段；std 的 utf8 只有整段 split，没有 split_once（G14）。
[export(case: "camelCase")]
micro equations_possible(equations: ArrayList<utf8>) -> bool {
    # 变量是小写字母，以 char 作并查集键；std 的 char 缺 Hash impl（G17）。
    let mut sets: DisjointSet<char> = DisjointSet::new()

    # 先处理等式建连通性，再逐条检查不等式。
    loop equation in equations {
        let equality: Option<SplitParts> = equation.split_once("==")
        if equality.is_some() {
            let parts: SplitParts = equality.unwrap()
            sets.union(parts.head.character_at(0), parts.tail.character_at(0))
        }
    }

    loop equation in equations {
        if equation.split_once("==").is_none() {
            let parts: SplitParts = equation.split_once("!=").unwrap()
            if sets.connected(parts.head.character_at(0), parts.tail.character_at(0)) {
                return false
            }
        }
    }
    return true
}

class Solution {
    micro equationsPossible(self, equations: ArrayList<utf8>): bool {
        return equations_possible(equations)
    }
}
