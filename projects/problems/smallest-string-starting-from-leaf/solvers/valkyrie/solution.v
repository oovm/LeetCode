namespace leetcode.smallest_string_starting_from_leaf;

using std.collection;

micro lex_smaller(left: utf8, right: utf8) -> bool {
    let mut index: usize = 0
    while index < left.length() {
        if index >= right.length() {
            return false
        }
        let mine: u32 = left⁅index⁆ as u32
        let theirs: u32 = right⁅index⁆ as u32
        if mine < theirs {
            return true
        }
        if mine > theirs {
            return false
        }
        index = index + 1
    }
    return index < right.length()
}

micro leaf_candidate(path: ArrayList<i64>) -> utf8 {
    let depth: usize = path.length()
    let mut builder: Utf8Builder = Utf8Builder::new(depth)
    let mut cursor: usize = depth
    while cursor > 0 {
        builder.append(char::from(97 + path⁅cursor - 1⁆ as u32))
        cursor = cursor - 1
    }
    return builder.build()
}

# 叶子处把根到叶的路径反向拼成字母串，与当前最优按字典序比较。
micro walk(root: ArrayList<i64>, index: usize, path: ArrayList<i64>, best: ArrayList<utf8>) {
    if index >= root.length() {
        return
    }
    path.push(root⁅index⁆)
    let left_index: usize = index * 2 + 1
    let right_index: usize = index * 2 + 2
    let mut leaf: bool = true
    if left_index < root.length() {
        leaf = false
        walk(root, left_index, path, best)
    }
    if right_index < root.length() {
        leaf = false
        walk(root, right_index, path, best)
    }
    if leaf {
        let candidate: utf8 = leaf_candidate(path)
        if lex_smaller(candidate, best⁅0⁆) {
            best⁅0⁆ = candidate
        }
    }
    path.pop()
}

[export(case: "camelCase")]
micro smallest_from_leaf(root: ArrayList<i64>) -> utf8 {
    let mut path: ArrayList<i64> = ArrayList::new(0)
    let mut best: ArrayList<utf8> = ArrayList::new(1)
    let mut sentinel: Utf8Builder = Utf8Builder::new(1)
    sentinel.append(char::from(123))
    best.push(sentinel.build())
    walk(root, 0, path, best)
    return best⁅0⁆
}

class Solution {
    micro smallestFromLeaf(self, root: ArrayList<i64>): utf8 {
        return smallest_from_leaf(root)
    }
}
