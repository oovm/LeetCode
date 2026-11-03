namespace leetcode.smallest_greater_multiple_made_of_two_digits;

[export(case: "camelCase")]
micro findInteger(k: i64, digit1: i64, digit2: i64) -> i64 {
    let mut small: i64 = digit1
    let mut large: i64 = digit2
    if small > large {
        let swap: i64 = small
        small = large
        large = swap
    }
    if small == 0 && large == 0 {
        return -1
    }

    let mut digits: ArrayList<i64> = ArrayList::new(2)
    digits.push(small)
    digits.push(large)

    let mut queue: ArrayList<i64> = ArrayList::new(2)
    if small > 0 {
        queue.push(small)
    }
    if large > 0 {
        queue.push(large)
    }
    let mut seen: HashMap<i64, i64> = HashMap::new(0)
    let limit: i64 = 2147483647
    let safe: i64 = limit / 10

    while queue.length() > 0 {
        let mut next: ArrayList<i64> = ArrayList::new(queue.length() * 2)
        let mut cursor: usize = 0
        while cursor < queue.length() {
            let value: i64 = queue⁅cursor⁆
            if value > k && value % k == 0 {
                return value
            }
            if value <= safe {
                let mut di: usize = 0
                while di < digits.length() {
                    let digit: i64 = digits⁅di⁆
                    let candidate: i64 = value * 10 + digit
                    if candidate <= limit && !seen.contains_key(candidate) {
                        seen.insert(candidate, 1)
                        next.push(candidate)
                    }
                    di = di + 1
                }
            }
            cursor = cursor + 1
        }
        queue = next
    }
    return -1
}

class Solution {
    micro findInteger(self, k: i64, digit1: i64, digit2: i64): i64 {
        return findInteger(k, digit1, digit2)
    }
}
