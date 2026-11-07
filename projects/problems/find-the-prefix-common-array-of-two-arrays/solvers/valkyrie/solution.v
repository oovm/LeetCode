namespace leetcode.solution

using std.collection

# 题内触发点: G25 —— 两个前缀集合用 `BitSet` 累积，每个下标求交集的置位数。
# 依赖 `std.collection.BitSet` 的 `clone()` 与 `count()`（G25 已提供，见缺口账本）。
# 容量口径：按输入实际最大值定容，不假设题面上界 —— 这是有意选择，不是偷懒。
# 代价是位集容量由输入数据决定、不可预测；题面写 1..n，但生成器用例存在取值超出 n 的情形，
# 换来的好处是不为此删用例、也不给越界值加特判。
class Solution {
    [export(case: "camelCase")]
    micro findThePrefixCommonArray(A: ArrayList<i64>, B: ArrayList<i64>) -> ArrayList<i64> {
        let n: usize = A.length()
        let mut largest: i64 = 0
        let mut cursor: usize = 0
        while cursor < n {
            if A⁅cursor⁆ > largest {
                largest = A⁅cursor⁆
            }
            if B⁅cursor⁆ > largest {
                largest = B⁅cursor⁆
            }
            cursor = cursor + 1
        }

        let bound: usize = (largest as usize) + 1
        let mut seen_a: BitSet = BitSet::with_capacity(bound)
        let mut seen_b: BitSet = BitSet::with_capacity(bound)
        let mut result: ArrayList<i64> = ArrayList::new(n)

        let mut index: usize = 0
        while index < n {
            seen_a.set(A⁅index⁆ as usize)
            seen_b.set(B⁅index⁆ as usize)
            let mut both: BitSet = seen_a.clone()
            both.intersect(seen_b)
            result.push(both.count() as i64)
            index = index + 1
        }
        return result
    }
}
