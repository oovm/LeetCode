namespace leetcode.solution

using std.collection

# 题内触发点: G25 —— 两个前缀集合用 `BitSet` 累积，每个下标求交集的置位数。
# 依赖 `std.collection.BitSet` 的 `clone()` 与 `count()`（G25 已提供，见缺口账本）。
# 容量口径：按输入实际最大值定容，不假设题面上界 —— 越界取值用例已按官方合同标注为语料缺陷。
# 入参与返回走值形切片（`[i64]`）：名义 `ArrayList` 句柄的 wasm 入参编组仍是编译器缺口（见 06 登记）。
class Solution {
    [export(case: "camelCase")]
    micro findThePrefixCommonArray(A: [i64], B: [i64]) -> [i64] {
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
        return result.to_array()
    }
}
