namespace leetcode.binary_tree_paths;

# 递归携带已拼好的前缀，遇到叶子就落盘；节点值统一经 `Utf8Builder.append_i64` 变成文本。
micro number_text(value: i64) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(16)
    builder.append_i64(value)
    return builder.build()
}

micro walk_paths(root: ArrayList<i64>, index: usize, prefix: utf8, out: ArrayList<utf8>) -> unit {
    if index < root.length() {
        let mut current: utf8 = number_text(root⁅index⁆)
        if prefix.length() > 0 {
            current = prefix.concat("->").concat(current)
        }
        let left: usize = 2 * index + 1
        let right: usize = 2 * index + 2
        let mut leaf: bool = false
        if left >= root.length() {
            if right >= root.length() {
                leaf = true
            }
        }
        if leaf {
            out.push(current)
        }
        else {
            walk_paths(root, left, current, out)
            walk_paths(root, right, current, out)
        }
    }
}

[export(case: "camelCase")]
micro binaryTreePaths(root: ArrayList<i64>) -> ArrayList<utf8> {
    let mut out: ArrayList<utf8> = ArrayList::new(root.length())
    walk_paths(root, 0, "", out)
    return out
}

class Solution {
    micro binaryTreePaths(self, root: ArrayList<i64>): ArrayList<utf8> {
        return binaryTreePaths(root)
    }
}
