namespace leetcode.maximum_product_difference_between_two_pairs;

using std.collection;

# 单次扫描取最大两个与最小两个，按公式求差。
[export(case: "camelCase")]
micro maxProductDifference(nums: ArrayList<i64>) -> i64 {
    let mut largest: i64 = nums⁅0⁆
    let mut second_largest: i64 = nums⁅1⁆
    if second_largest > largest {
        let swap: i64 = largest
        largest = second_largest
        second_largest = swap
    }
    let mut smallest: i64 = nums⁅0⁆
    let mut second_smallest: i64 = nums⁅1⁆
    if second_smallest < smallest {
        let swap: i64 = smallest
        smallest = second_smallest
        second_smallest = swap
    }
    let mut index: usize = 2
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if value > largest {
            second_largest = largest
            largest = value
        } else {
            if value > second_largest {
                second_largest = value
            }
        }
        if value < smallest {
            second_smallest = smallest
            smallest = value
        } else {
            if value < second_smallest {
                second_smallest = value
            }
        }
        index = index + 1
    }
    return largest * second_largest - smallest * second_smallest
}

class Solution {
    micro maxProductDifference(self, nums: ArrayList<i64>): i64 {
        return maxProductDifference(nums)
    }
}
