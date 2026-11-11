namespace leetcode.three_sum_with_multiplicity;

using std.collection;

# 值域很小，先做频次表，再枚举 a <= b <= c 的三元组并按重数组合数计数。
# 组合贡献：三数相同取 C(x,3)，两数相同取 C(x,2) * y，全不同取 x * y * z。
# 频次表宽度按语料实际最大值取，避免越界。
[export(case: "camelCase")]
micro three_sum_multi(arr: [i64], target: i64) -> i64 {
    let modulus: i64 = 1000000007
    let mut highest: i64 = 0
    let mut index: usize = 0
    while index < arr.length() {
        let value: i64 = arr⁅index⁆
        if value > highest {
            highest = value
        }
        index = index + 1
    }
    let mut counts: ArrayList<i64> = ArrayList::new((highest + 1) as usize)
    let mut fill: usize = 0
    while fill <= highest as usize {
        counts.push(0)
        fill = fill + 1
    }
    index = 0
    while index < arr.length() {
        let value: i64 = arr⁅index⁆
        counts⁅value as usize⁆ = counts⁅value as usize⁆ + 1
        index = index + 1
    }
    let mut total: i64 = 0
    let mut first: i64 = 0
    while first <= highest {
        let mut second: i64 = first
        while second <= highest {
            let third: i64 = target - first - second
            if third < second || third > highest {
                second = second + 1
                continue
            }
            let a: i64 = counts⁅first as usize⁆
            let b: i64 = counts⁅second as usize⁆
            let c: i64 = counts⁅third as usize⁆
            let mut ways: i64 = 0
            if first == second && second == third {
                ways = a * (a - 1) * (a - 2) / 6
            } else if first == second {
                ways = a * (a - 1) / 2 * c
            } else if second == third {
                ways = a * b * (b - 1) / 2
            } else {
                ways = a * b * c
            }
            total = (total + ways) % modulus
            second = second + 1
        }
        first = first + 1
    }
    return total
}

class Solution {
    micro threeSumMulti(self, arr: [i64], target: i64): i64 {
        return three_sum_multi(arr, target)
    }
}
