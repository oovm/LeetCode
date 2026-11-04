namespace leetcode.solution

using std.collection

# 题内触发点: 用 `enums` 标记类型替代 `0/1/2` 魔法值，`match` 分派目录操作。
enums FolderOp {
    Parent
    Current
    Child
}

micro classify_folder(entry: utf8) -> FolderOp {
    if entry.byte_length() >= 3 {
        if entry.byte_at(0) == 46 && entry.byte_at(1) == 46 {
            return Parent
        }
    }
    if entry.byte_length() == 2 {
        return Current
    }
    return Child
}

class Solution {
    [export(case: "minOperations")]
    micro minOperations(logs: ArrayList<utf8>) -> i64 {
        let mut depth: i64 = 0
        loop entry in logs {
            let op: FolderOp = classify_folder(entry)
            match op {
                case Parent: {
                    if depth > 0 {
                        depth = depth - 1
                    }
                }
                case Current: {
                    depth = depth + 0
                }
                case Child: {
                    depth = depth + 1
                }
            }
        }
        return depth
    }
}
