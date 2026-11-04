namespace leetcode.solution

using std.collection

# 题内触发点: 分治递归 `ways_in_range` 每层把左右子结果做笛卡尔积并累加到 `ArrayList<i64>`。
micro is_operator(code: u8) -> bool {
    return code == 43 || code == 45 || code == 42
}

micro parse_number(text: utf8, start: i64, stop: i64) -> i64 {
    let mut value: i64 = 0
    let mut index: i64 = start
    while index < stop {
        let digit: u8 = text.byte_at(index as usize)
        value = value * 10 + ((digit - 48) as i64)
        index = index + 1
    }
    return value
}

# 分治：以每个运算符为根切分，左右各递归求值集合，再按运算符合并。
micro ways_in_range(text: utf8, start: i64, stop: i64) -> ArrayList<i64> {
    let results: ArrayList<i64> = ArrayList::new(8)
    let mut index: i64 = start
    let mut has_operator: bool = false
    while index < stop {
        let code: u8 = text.byte_at(index as usize)
        if is_operator(code) {
            has_operator = true
        }
        index = index + 1
    }
    if !has_operator {
        results.push(parse_number(text, start, stop))
        return results
    }
    index = start
    while index < stop {
        let code: u8 = text.byte_at(index as usize)
        if is_operator(code) {
            let lefts: ArrayList<i64> = ways_in_range(text, start, index)
            let rights: ArrayList<i64> = ways_in_range(text, index + 1, stop)
            let mut left_index: i64 = 0
            while left_index < (lefts.length() as i64) {
                let left_value: i64 = lefts⁅left_index as usize⁆
                let mut right_index: i64 = 0
                while right_index < (rights.length() as i64) {
                    let right_value: i64 = rights⁅right_index as usize⁆
                    if code == 43 {
                        results.push(left_value + right_value)
                    } else if code == 45 {
                        results.push(left_value - right_value)
                    } else {
                        results.push(left_value * right_value)
                    }
                    right_index = right_index + 1
                }
                left_index = left_index + 1
            }
        }
        index = index + 1
    }
    return results
}

class Solution {
    [export(case: "diffWaysToCompute")]
    micro diffWaysToCompute(expression: utf8) -> ArrayList<i64> {
        let length: i64 = expression.byte_length() as i64
        return ways_in_range(expression, 0, length)
    }
}
