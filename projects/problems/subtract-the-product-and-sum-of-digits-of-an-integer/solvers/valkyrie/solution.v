namespace leetcode.subtract_the_product_and_sum_of_digits_of_an_integer;

class Solution {
    micro subtractProductAndSum(self, n: i64): i64 {
        let mut num: i64 = n
        let mut product: i64 = 1
        let mut sum: i64 = 0
        if num == 0 {
            return 0
        }
        while num > 0 {
            let digit: i64 = num % 10
            product = product * digit
            sum = sum + digit
            num = num / 10
        }
        return product - sum
    }
}
