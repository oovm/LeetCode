namespace leetcode.count_triplets_that_can_form_two_arrays_of_equal_xor;

# 前缀异或相等的两个位置 i < k 之间贡献 k - i 个合法三元组。
[export(case: "camelCase")]
micro count_triplets(arr: ArrayList<i64>) -> i64 {
    let n: usize = arr.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < n {
        let mut running: i64 = 0
        let mut j: usize = i
        while j < n {
            running = running ^ arr⁅j⁆.unwrap()
            if running == 0 {
                total = total + (j as i64) - (i as i64)
            }
            j = j + 1
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro countTriplets(self, arr: ArrayList<i64>): i64 {
        return count_triplets(arr)
    }
}
