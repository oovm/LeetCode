namespace leetcode.stepping_numbers;

# 从 0-9 起 BFS 追加相邻数字，按值自然升序产出。
[export(case: "camelCase")]
micro count_stepping_numbers(low: i64, high: i64) -> ArrayList<i64> {
    let mut queue: ArrayList<i64> = ArrayList::new(0)
    let mut head: usize = 0
    let mut answer: ArrayList<i64> = ArrayList::new(0)
    let mut digit: i64 = 0
    while digit <= 9 {
        queue.push(digit)
        digit = digit + 1
    }
    while head < queue.length() {
        let value: i64 = queue⁅head⁆.unwrap()
        head = head + 1
        if value >= low && value <= high {
            answer.push(value)
        }
        if value > 0 {
            let last: i64 = value % 10
            if last > 0 {
                let next_value: i64 = value * 10 + last - 1
                if next_value <= high {
                    queue.push(next_value)
                }
            }
            if last < 9 {
                let next_value: i64 = value * 10 + last + 1
                if next_value <= high {
                    queue.push(next_value)
                }
            }
        }
    }
    return answer
}

class Solution {
    micro countSteppingNumbers(self, low: i64, high: i64): ArrayList<i64> {
        return count_stepping_numbers(low, high)
    }
}
