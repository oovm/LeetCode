namespace leetcode.basic_calculator_ii;

using std.collection;

# 单遍栈式求值：数字累积到 current，遇到运算符结算上一个数；
# '+'/'-' 直接入栈，'*'/'/' 与栈顶合并。时间 O(n) 空间 O(n)。
[export(case: "camelCase")]
micro calculate(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut stack: ArrayList<i64> = ArrayList::new(n)
    let mut current: i64 = 0
    let mut sign: u32 = 43
    let mut i: usize = 0
    while i <= n {
        let mut code: u32 = 0
        if i < n {
            code = s⁅i⁆ as u32
        }
        if code >= 48 && code <= 57 {
            current = current * 10 + (code as i64 - 48)
        }
        if i == n || code == 43 || code == 45 || code == 42 || code == 47 {
            if sign == 43 {
                stack.push(current)
            } else if sign == 45 {
                stack.push(0 - current)
            } else if sign == 42 {
                let last: i64 = stack.pop().unwrap()
                stack.push(last * current)
            } else {
                let last: i64 = stack.pop().unwrap()
                stack.push(last / current)
            }
            sign = code
            current = 0
        }
        i = i + 1
    }

    let mut total: i64 = 0
    let mut j: usize = 0
    while j < stack.length() {
        total = total + stack⁅j⁆
        j = j + 1
    }
    return total
}

class Solution {
    micro calculate(self, s: utf8): i64 {
        return calculate(s)
    }
}
