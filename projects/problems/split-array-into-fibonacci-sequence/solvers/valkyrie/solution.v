namespace leetcode.split_array_into_fibonacci_sequence;

using std.collection;

# 从头部贪心枚举前两个数，之后每次只接受「等于前两项之和」的切分。
# 回溯剪枝：值超过 32 位上限或超过前两项之和即停止本起点。
micro extend(num: utf8, start: usize, answer: ArrayList<i64>) -> bool {
    let length: usize = num.byte_length()
    if start == length {
        return answer.length() > 2
    }
    let mut value: i64 = 0
    let mut cursor: usize = start
    while cursor < length {
        if cursor > start && num.byte_at(start) == 48 {
            break
        }
        value = value * 10 + (num.byte_at(cursor) as i64 - 48)
        if value > 2147483647 {
            break
        }
        if answer.length() >= 2 {
            let previous: i64 = answer⁅answer.length() - 2⁆
            let last: i64 = answer⁅answer.length() - 1⁆
            let expected: i64 = previous + last
            if value > expected {
                break
            }
            if value < expected {
                cursor = cursor + 1
                continue
            }
        }
        answer.push(value)
        if extend(num, cursor + 1, answer) {
            return true
        }
        answer.pop()
        cursor = cursor + 1
    }
    return false
}

[export(case: "camelCase")]
micro split_into_fibonacci(num: utf8) -> ArrayList<i64> {
    let mut answer: ArrayList<i64> = ArrayList::new(0)
    extend(num, 0, answer)
    return answer
}

class Solution {
    micro splitIntoFibonacci(self, num: utf8): ArrayList<i64> {
        return split_into_fibonacci(num)
    }
}
