namespace leetcode.smallest_value_of_the_rearranged_number;

micro count_digit(x: i64, d: i64) -> i64 {
    let mut count: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        if rest % 10 == d {
            count = count + 1
        }
        rest = rest / 10
    }
    return count
}

# 按计数升序重建（首个数字非零）；负数取绝对值降序重建后取负。
micro build_ascending(magnitude: i64) -> i64 {
    let mut answer: i64 = 0
    let mut first: i64 = 1
    while count_digit(magnitude, first) == 0 {
        first = first + 1
    }
    answer = first
    let mut zeros: i64 = count_digit(magnitude, 0)
    while zeros > 0 {
        answer = answer * 10
        zeros = zeros - 1
    }
    let mut rest: i64 = count_digit(magnitude, first) - 1
    while rest > 0 {
        answer = answer * 10 + first
        rest = rest - 1
    }
    let mut d: i64 = first + 1
    while d <= 9 {
        let mut c: i64 = count_digit(magnitude, d)
        while c > 0 {
            answer = answer * 10 + d
            c = c - 1
        }
        d = d + 1
    }
    return answer
}

micro build_descending(magnitude: i64) -> i64 {
    let mut answer: i64 = 0
    let mut d: i64 = 9
    while d >= 0 {
        let mut c: i64 = count_digit(magnitude, d)
        while c > 0 {
            answer = answer * 10 + d
            c = c - 1
        }
        d = d - 1
    }
    return answer
}

[export(case: "camelCase")]
micro smallest_number(num: i64) -> i64 {
    if num > 0 {
        return build_ascending(num)
    }
    return 0 - build_descending(0 - num)
}

class Solution {
    micro smallestNumber(self, num: i64): i64 {
        return smallest_number(num)
    }
}
