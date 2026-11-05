namespace leetcode.adding_two_negabinary_numbers;

using std.collection;

# 负二进制逐位相加：位和 >= 2 时留低位并把 -1 进位，位和为 -1 时留 1 并把 +1 进位。
# 只扫一遍两条输入，O(n)。
[export(case: "camelCase")]
micro addNegabinary(arr1: ArrayList<i64>, arr2: ArrayList<i64>) -> ArrayList<i64> {
    let mut i: i64 = arr1.length() as i64 - 1
    let mut j: i64 = arr2.length() as i64 - 1
    let mut carry: i64 = 0
    let mut reversed: ArrayList<i64> = ArrayList::new((arr1.length() + arr2.length() + 2) as usize)
    while i >= 0 || j >= 0 || carry != 0 {
        let mut sum: i64 = carry
        if i >= 0 {
            sum = sum + arr1⁅i as usize⁆
            i = i - 1
        }
        if j >= 0 {
            sum = sum + arr2⁅j as usize⁆
            j = j - 1
        }
        carry = 0
        if sum >= 2 {
            sum = sum - 2
            carry = 0 - 1
        } else if sum == 0 - 1 {
            sum = 1
            carry = 1
        }
        reversed.push(sum)
    }

    let mut result: ArrayList<i64> = ArrayList::new(reversed.length())
    let mut k: i64 = reversed.length() as i64 - 1
    while k >= 0 {
        result.push(reversed⁅k as usize⁆)
        k = k - 1
    }
    let mut start: usize = 0
    while start + 1 < result.length() && result⁅start⁆ == 0 {
        start = start + 1
    }
    let mut trimmed: ArrayList<i64> = ArrayList::new(result.length() - start)
    while start < result.length() {
        trimmed.push(result⁅start⁆)
        start = start + 1
    }
    return trimmed
}

class Solution {
    micro addNegabinary(self, arr1: ArrayList<i64>, arr2: ArrayList<i64>): ArrayList<i64> {
        return addNegabinary(arr1, arr2)
    }
}
