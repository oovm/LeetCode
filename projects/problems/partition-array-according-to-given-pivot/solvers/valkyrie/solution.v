namespace leetcode.solution

using std.collection

# 题内触发点: 内联 `micro` 闭包作为 `fold` 的累加器，闭包捕获外层 `pivot`。
micro partition_buckets(capacity: usize) -> ArrayList<ArrayList<i64>> {
    let buckets: ArrayList<ArrayList<i64>> = ArrayList::new(3)
    buckets.push(ArrayList::new(capacity))
    buckets.push(ArrayList::new(capacity))
    buckets.push(ArrayList::new(capacity))
    return buckets
}

class Solution {
    [export(case: "camelCase")]
    micro pivotArray(nums: ArrayList<i64>, pivot: i64) -> ArrayList<i64> {
        let buckets: ArrayList<ArrayList<i64>> = nums.into_iterator().fold(
            partition_buckets(nums.length()),
            micro(acc: ArrayList<ArrayList<i64>>, item: i64) -> ArrayList<ArrayList<i64>> {
                if item < pivot {
                    acc⁅0⁆.push(item)
                } else if item == pivot {
                    acc⁅1⁆.push(item)
                } else {
                    acc⁅2⁆.push(item)
                }
                return acc
            }
        )
        let result: ArrayList<i64> = ArrayList::new(nums.length())
        loop bucket in buckets {
            loop value in bucket {
                result.push(value)
            }
        }
        return result
    }
}
