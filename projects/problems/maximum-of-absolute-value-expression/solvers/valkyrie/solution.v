namespace leetcode.maximum_of_absolute_value_expression;

using std.collection;

# |a1-a2| + |b1-b2| + |i-j| 只有四种符号组合，每种组合下最大值与最小值的差
# 就是该组合的最优解，四趟 O(n)。
micro extreme(arr1: ArrayList<i64>, arr2: ArrayList<i64>, sign1: i64, sign2: i64) -> i64 {
    let mut highest: i64 = 0 - 1000000000000000000
    let mut lowest: i64 = 1000000000000000000
    let mut i: i64 = 0
    while i < arr1.length() as i64 {
        let value: i64 = sign1 * arr1⁅i as usize⁆ + sign2 * arr2⁅i as usize⁆ + i
        if value > highest {
            highest = value
        }
        if value < lowest {
            lowest = value
        }
        i = i + 1
    }
    return highest - lowest
}

[export(case: "camelCase")]
micro maxAbsValExpr(arr1: ArrayList<i64>, arr2: ArrayList<i64>) -> i64 {
    let mut best: i64 = extreme(arr1, arr2, 1, 1)
    let candidate1: i64 = extreme(arr1, arr2, 1, 0 - 1)
    if candidate1 > best {
        best = candidate1
    }
    let candidate2: i64 = extreme(arr1, arr2, 0 - 1, 1)
    if candidate2 > best {
        best = candidate2
    }
    let candidate3: i64 = extreme(arr1, arr2, 0 - 1, 0 - 1)
    if candidate3 > best {
        best = candidate3
    }
    return best
}

class Solution {
    micro maxAbsValExpr(self, arr1: ArrayList<i64>, arr2: ArrayList<i64>): i64 {
        return maxAbsValExpr(arr1, arr2)
    }
}
