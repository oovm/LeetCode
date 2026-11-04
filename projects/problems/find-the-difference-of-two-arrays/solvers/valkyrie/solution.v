namespace leetcode.find_the_difference_of_two_arrays;

using std.collection;

# 两遍建集合并保留首次出现顺序（HashSet 无序，故另存 order 列表），再互为差集。
# 题内触发点: G12 —— `HashSet::new()` 无容量构造，只能空构造后逐个 `insert`。
# 题内触发点: G3 —— 返回 `ArrayList<ArrayList<i64>>` 命中嵌套聚合 bridge 缺口。
micro build_set(values: ArrayList<i64>, mut present: HashSet<i64>, mut order: ArrayList<i64>) -> unit {
    loop value in values {
        if !present.contains(value) {
            present.insert(value)
            order.push(value)
        }
    }
}

micro build_difference(order: ArrayList<i64>, present: HashSet<i64>) -> ArrayList<i64> {
    let mut difference: ArrayList<i64> = ArrayList::new(order.length())
    loop value in order {
        if !present.contains(value) {
            difference.push(value)
        }
    }
    return difference
}

[export(case: "camelCase")]
micro find_difference(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    let mut present_one: HashSet<i64> = HashSet::new()
    let mut order_one: ArrayList<i64> = ArrayList::new(nums1.length())
    build_set(nums1, present_one, order_one)

    let mut present_two: HashSet<i64> = HashSet::new()
    let mut order_two: ArrayList<i64> = ArrayList::new(nums2.length())
    build_set(nums2, present_two, order_two)

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(2)
    result.push(build_difference(order_one, present_two))
    result.push(build_difference(order_two, present_one))
    return result
}

class Solution {
    micro findDifference(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return find_difference(nums1, nums2)
    }
}
