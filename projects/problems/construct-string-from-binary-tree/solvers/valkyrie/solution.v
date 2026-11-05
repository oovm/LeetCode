namespace leetcode.construct_string_from_binary_tree;

using std.collection;

micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

# 先序递归：叶子只输出值；只有左孩子时输出 `值(左)`；两个孩子都在时输出 `值(左)(右)`。
# 每个节点访问一次，O(n)。
micro render(root: ArrayList<i64>, index: usize) -> utf8 {
    if index >= root.length() {
        return empty_text()
    }
    let value: i64 = root⁅index⁆
    let left: utf8 = render(root, 2 * index + 1)
    let right: utf8 = render(root, 2 * index + 2)
    let mut builder: Utf8Builder = Utf8Builder::new(left.byte_length() + right.byte_length() + 8)
    builder.append_i64(value)
    if left.byte_length() == 0 && right.byte_length() == 0 {
        return builder.build()
    }
    builder.append(char::from(40))
    builder.append(left)
    builder.append(char::from(41))
    if right.byte_length() > 0 {
        builder.append(char::from(40))
        builder.append(right)
        builder.append(char::from(41))
    }
    return builder.build()
}

[export(case: "camelCase")]
micro tree2str(root: ArrayList<i64>) -> utf8 {
    return render(root, 0)
}

class Solution {
    micro tree2str(self, root: ArrayList<i64>): utf8 {
        return tree2str(root)
    }
}
