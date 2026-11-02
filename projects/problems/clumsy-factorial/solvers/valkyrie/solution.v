namespace leetcode.clumsy_factorial;

# 按运算符优先级分组求值：* / 构成当前项，遇 + 归并、遇 - 起负项，循环 * / + -。
[export(case: "camelCase")]
micro clumsy(n: i64) -> i64 {
    let mut result: i64 = 0
    let mut current: i64 = n
    let mut i: i64 = n - 1
    let mut op: i64 = 0
    while i >= 1 {
        if op == 0 {
            current = current * i
        } else if op == 1 {
            current = current / i
        } else if op == 2 {
            result = result + current
            current = i
        } else {
            result = result + current
            current = -i
        }
        op = (op + 1) % 4
        i = i - 1
    }
    return result + current
}

class Solution {
    micro clumsy(self, n: i64): i64 {
        return clumsy(n)
    }
}
