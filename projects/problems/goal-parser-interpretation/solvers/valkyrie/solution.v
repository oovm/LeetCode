namespace leetcode.goal_parser_interpretation;

[export(case: "camelCase")]
micro interpret(command: utf8) -> utf8 {
    let n: usize = command.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        let c: u32 = command⁅i⁆ as u32
        if c == 71 {
            builder.append(command⁅i⁆)
            i = i + 1
        } else {
            let next: u32 = command⁅i + 1⁆ as u32
            if next == 41 {
                builder.append(char::from(111))
                i = i + 2
            } else {
                builder.append(char::from(97))
                builder.append(char::from(108))
                i = i + 4
            }
        }
    }
    return builder.build()
}

class Solution {
    micro interpret(self, command: utf8): utf8 {
        return interpret(command)
    }
}
