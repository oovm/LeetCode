namespace leetcode.find_the_key_of_the_numbers;

[export(case: "camelCase")]
micro generate_key(num1: i64, num2: i64, num3: i64) -> i64 {
    let mut key: i64 = 0
    let mut place: i64 = 1
    let mut a: i64 = num1
    let mut b: i64 = num2
    let mut c: i64 = num3
    let mut count: i64 = 0
    while count < 4 {
        let d1: i64 = a % 10
        let d2: i64 = b % 10
        let d3: i64 = c % 10
        let mut min_digit: i64 = d1
        if d2 < min_digit {
            min_digit = d2
        }
        if d3 < min_digit {
            min_digit = d3
        }
        key = key + min_digit * place
        a = a / 10
        b = b / 10
        c = c / 10
        place = place * 10
        count = count + 1
    }
    return key
}

class Solution {
    micro generateKey(self, num1: i64, num2: i64, num3: i64): i64 {
        return generate_key(num1, num2, num3)
    }
}
