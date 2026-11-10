namespace leetcode.four_sum;

using std.collection;

# 排序后固定两元，双指针找和；命中后跳过 lo/hi 的重复值，外层跳过 a/b 重复值。
[export(case: "camelCase")]
micro fourSum(nums: ArrayList<i64>, target: i64) -> ArrayList<ArrayList<i64>> {
    let mut sorted: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        sorted.push(value)
    }
    sort(sorted)
    let length: usize = sorted.length()
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let mut a: usize = 0
    while a + 3 < length {
        if a == 0 || sorted⁅a⁆ != sorted⁅a - 1⁆ {
            let mut b: usize = a + 1
            while b + 2 < length {
                if b == a + 1 || sorted⁅b⁆ != sorted⁅b - 1⁆ {
                    let mut low: usize = b + 1
                    let mut high: usize = length - 1
                    while low < high {
                        let sum: i64 = sorted⁅a⁆ + sorted⁅b⁆ + sorted⁅low⁆ + sorted⁅high⁆
                        if sum < target {
                            low = low + 1
                        } else if sum > target {
                            high = high - 1
                        } else {
                            let mut quad: ArrayList<i64> = ArrayList::new(4)
                            quad.push(sorted⁅a⁆)
                            quad.push(sorted⁅b⁆)
                            quad.push(sorted⁅low⁆)
                            quad.push(sorted⁅high⁆)
                            result.push(quad)
                            while low < high && sorted⁅low⁆ == sorted⁅low + 1⁆ {
                                low = low + 1
                            }
                            while low < high && sorted⁅high⁆ == sorted⁅high - 1⁆ {
                                high = high - 1
                            }
                            low = low + 1
                            high = high - 1
                        }
                    }
                }
                b = b + 1
            }
        }
        a = a + 1
    }
    return result
}

class Solution {
    micro fourSum(self, nums: ArrayList<i64>, target: i64): ArrayList<ArrayList<i64>> {
        return fourSum(nums, target)
    }
}
