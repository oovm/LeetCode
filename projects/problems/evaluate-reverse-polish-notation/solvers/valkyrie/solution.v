namespace leetcode.evaluate_reverse_polish_notation;

using std.collection;

# 数字 token 手工按位累积为 i64（std 尚无 utf8 数值解析入口，见缺口账本）。
micro token_to_value(text: utf8) -> i64 {
    let mut index: usize = 0
    let mut negative: bool = false
    if (text⁅0⁆ as u32) == 45 {
        negative = true
        index = 1
    }
    let mut value: i64 = 0
    while index < text.length() {
        value = value * 10 + ((text⁅index⁆ as u32) as i64 - 48)
        index = index + 1
    }
    if negative {
        return -value
    }
    return value
}

# 逆波兰：数字入栈，运算符弹两数回推；除法向零截断。
[export(case: "camelCase")]
micro evalRPN(tokens: [utf8]) -> i64 {
    let mut stack: ArrayList<i64> = ArrayList::new(0)
    loop token in tokens {
        if token == "+" || token == "-" || token == "*" || token == "/" {
            let right: i64 = stack.pop().unwrap()
            let left: i64 = stack.pop().unwrap()
            if token == "+" {
                stack.push(left + right)
            } else if token == "-" {
                stack.push(left - right)
            } else if token == "*" {
                stack.push(left * right)
            } else {
                stack.push(left / right)
            }
        } else {
            stack.push(token_to_value(token))
        }
    }
    return stack.pop().unwrap()
}

class Solution {
    micro evalRPN(self, tokens: [utf8]): i64 {
        return evalRPN(tokens)
    }
}
