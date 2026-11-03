namespace leetcode.find_three_consecutive_integers_that_sum_to_a_given_number;

# 三连整数之和模 3 必为 0，起点为 num/3 - 1。
[export(case: "camelCase")]
micro sum_of_three(num: i64) -> ArrayList<i64> {
    let mut answer: ArrayList<i64> = ArrayList::new(0)
    if num % 3 != 0 {
        return answer
    }
    let middle: i64 = num / 3
    answer.push(middle - 1)
    answer.push(middle)
    answer.push(middle + 1)
    return answer
}

class Solution {
    micro sumOfThree(self, num: i64): ArrayList<i64> {
        return sum_of_three(num)
    }
}
