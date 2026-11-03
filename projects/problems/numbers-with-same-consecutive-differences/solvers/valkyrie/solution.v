namespace leetcode.numbers_with_same_consecutive_differences;

micro digit_count(value: i64) -> i64 {
    let mut v: i64 = value
    let mut count: i64 = 0
    while v > 0 {
        v = v / 10
        count = count + 1
    }
    return count
}

# 从首位数字 1-9 起 BFS，逐位追加相差 k 的数字。
[export(case: "camelCase")]
micro nums_same_consec_diff(n: i64, k: i64) -> ArrayList<i64> {
    let mut queue: ArrayList<i64> = ArrayList::new(0)
    let mut head: usize = 0
    let mut answer: ArrayList<i64> = ArrayList::new(0)
    let mut digit: i64 = 1
    while digit <= 9 {
        queue.push(digit)
        digit = digit + 1
    }
    while head < queue.length() {
        let value: i64 = queue⁅head⁆
        head = head + 1
        if digit_count(value) == n {
            answer.push(value)
            continue
        }
        let last: i64 = value % 10
        if k == 0 {
            queue.push(value * 10 + last)
        } else {
            if last + k <= 9 {
                queue.push(value * 10 + last + k)
            }
            if last - k >= 0 {
                queue.push(value * 10 + last - k)
            }
        }
    }
    return answer
}

class Solution {
    micro numsSameConsecDiff(self, n: i64, k: i64): ArrayList<i64> {
        return nums_same_consec_diff(n, k)
    }
}
