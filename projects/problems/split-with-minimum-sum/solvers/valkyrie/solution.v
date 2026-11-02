namespace leetcode.split_with_minimum_sum;

[export(case: "camelCase")]
micro split_num(num: i64) -> i64 {
    let mut c0: i64 = 0
    let mut c1: i64 = 0
    let mut c2: i64 = 0
    let mut c3: i64 = 0
    let mut c4: i64 = 0
    let mut c5: i64 = 0
    let mut c6: i64 = 0
    let mut c7: i64 = 0
    let mut c8: i64 = 0
    let mut c9: i64 = 0
    let mut rest: i64 = num
    while rest > 0 {
        let digit: i64 = rest % 10
        if digit == 0 {
            c0 = c0 + 1
        } else if digit == 1 {
            c1 = c1 + 1
        } else if digit == 2 {
            c2 = c2 + 1
        } else if digit == 3 {
            c3 = c3 + 1
        } else if digit == 4 {
            c4 = c4 + 1
        } else if digit == 5 {
            c5 = c5 + 1
        } else if digit == 6 {
            c6 = c6 + 1
        } else if digit == 7 {
            c7 = c7 + 1
        } else if digit == 8 {
            c8 = c8 + 1
        } else {
            c9 = c9 + 1
        }
        rest = rest / 10
    }
    let mut num1: i64 = 0
    let mut num2: i64 = 0
    let mut to_first: bool = true
    let mut d: i64 = 0
    while d <= 9 {
        let mut cnt: i64 = 0
        if d == 0 {
            cnt = c0
        } else if d == 1 {
            cnt = c1
        } else if d == 2 {
            cnt = c2
        } else if d == 3 {
            cnt = c3
        } else if d == 4 {
            cnt = c4
        } else if d == 5 {
            cnt = c5
        } else if d == 6 {
            cnt = c6
        } else if d == 7 {
            cnt = c7
        } else if d == 8 {
            cnt = c8
        } else {
            cnt = c9
        }
        while cnt > 0 {
            if to_first {
                num1 = num1 * 10 + d
            } else {
                num2 = num2 * 10 + d
            }
            to_first = !to_first
            cnt = cnt - 1
        }
        d = d + 1
    }
    return num1 + num2
}

class Solution {
    micro splitNum(self, num: i64): i64 {
        return split_num(num)
    }
}
