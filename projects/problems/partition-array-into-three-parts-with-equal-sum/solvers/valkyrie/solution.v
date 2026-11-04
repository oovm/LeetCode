namespace leetcode.partition_array_into_three_parts_with_equal_sum

# 总和必须能被 3 整除；从左累加到 target 即切一段，最多切两段后剩余自然等于 target。
[export(case: "camelCase")]
micro canThreePartsEqualSum(arr: ArrayList<i64>) -> bool {
    let count: usize = arr.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < count {
        total = total + arr⁅i⁆
        i = i + 1
    }
    if total % 3 != 0 {
        return false
    }
    let target: i64 = total / 3
    let mut parts: i64 = 0
    let mut sum: i64 = 0
    let mut index: usize = 0
    while index < count {
        sum = sum + arr⁅index⁆
        if sum == target && parts < 2 {
            parts = parts + 1
            sum = 0
        }
        index = index + 1
    }
    return parts == 2
}

class Solution {
    micro canThreePartsEqualSum(self, arr: ArrayList<i64>): bool {
        return canThreePartsEqualSum(arr)
    }
}
