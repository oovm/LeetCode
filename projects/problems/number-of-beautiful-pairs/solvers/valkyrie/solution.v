namespace leetcode.number_of_beautiful_pairs;

using std.collection;

micro greatestCommonDivisor(left: i64, right: i64) -> i64 {
    let mut a: i64 = left
    let mut b: i64 = right
    while b != 0 {
        let remainder: i64 = a % b
        a = b
        b = remainder
    }
    return a
}

# 边扫描边按「首位数字」计频，用当前末位与历史首位求互质。
[export(case: "camelCase")]
micro countBeautifulPairs(nums: ArrayList<i64>) -> i64 {
    let mut counts: ArrayList<i64> = ArrayList::new(10)
    let mut digit: usize = 0
    while digit < 10 {
        counts.push(0)
        digit = digit + 1
    }
    let mut answer: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let last_digit: i64 = value % 10
        let mut head: i64 = value
        while head >= 10 {
            head = head / 10
        }
        let mut previous_digit: usize = 0
        while previous_digit < 10 {
            if counts⁅previous_digit⁆ > 0 {
                if greatestCommonDivisor(last_digit, previous_digit as i64) == 1 {
                    answer = answer + counts⁅previous_digit⁆
                }
            }
            previous_digit = previous_digit + 1
        }
        counts⁅head as usize⁆ = counts⁅head as usize⁆ + 1
        index = index + 1
    }
    return answer
}

class Solution {
    micro countBeautifulPairs(self, nums: ArrayList<i64>): i64 {
        return countBeautifulPairs(nums)
    }
}
