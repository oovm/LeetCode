namespace leetcode.simplify_path;

using std.collection;
using std.text;

# 路径栈：split 后丢弃空段与 "."，".." 弹栈，其余压栈；最后以 "/" 连接。
# 时间 O(n) 空间 O(n)。
[export(case: "camelCase")]
micro simplify_path(path: utf8) -> utf8 {
    let parts: [utf8] = path.split("/")
    let mut stack: ArrayList<utf8> = ArrayList::new(parts.length())
    let mut i: usize = 0
    while i < parts.length() {
        let part: utf8 = parts⁅i⁆
        if part.length() > 0 {
            if part == ".." {
                if stack.length() > 0 {
                    stack.pop()
                }
            } else if part != "." {
                stack.push(part)
            }
        }
        i = i + 1
    }

    let mut builder: Utf8Builder = Utf8Builder::new(path.length())
    let mut j: usize = 0
    while j < stack.length() {
        builder.append(char::from(47))
        let component: utf8 = stack⁅j⁆
        let mut c: usize = 0
        while c < component.length() {
            builder.append(component⁅c⁆)
            c = c + 1
        }
        j = j + 1
    }
    if stack.length() == 0 {
        builder.append(char::from(47))
    }
    return builder.build()
}

class Solution {
    micro simplifyPath(self, path: utf8): utf8 {
        return simplify_path(path)
    }
}
