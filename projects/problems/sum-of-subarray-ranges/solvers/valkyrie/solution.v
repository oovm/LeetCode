namespace leetcode.sum_of_subarray_ranges;

using std.collection;

# 所有子数组「最大值之和」减去「最小值之和」。
# 最大值之和 = -(取反后的数组的「最小值之和」)，复用同一单调栈例程。
micro minimum_total(values: ArrayList<i64>) -> i64 {
    let count: usize = values.length()
    let mut previous: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        previous.push(-1)
        fill = fill + 1
    }

    let mut stack: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        while stack.is_empty() == false {
            let top: usize = stack.last().unwrap() as usize
            if values⁅top⁆ < values⁅index⁆ {
                break
            }
            stack.pop()
        }
        if stack.is_empty() == false {
            previous.set((index + 1) as isize, stack.last().unwrap())
        }
        stack.push(index as i64)
        index = index + 1
    }

    let mut total: i64 = 0
    let mut next_stack: ArrayList<i64> = ArrayList::new(count)
    let mut cursor: usize = count
    while cursor > 0 {
        let position: usize = cursor - 1
        while next_stack.is_empty() == false {
            let top: usize = next_stack.last().unwrap() as usize
            if values⁅top⁆ <= values⁅position⁆ {
                break
            }
            next_stack.pop()
        }
        let mut boundary: i64 = count as i64
        if next_stack.is_empty() == false {
            boundary = next_stack.last().unwrap()
        }
        let left: i64 = position as i64 - previous⁅position⁆
        let right: i64 = boundary - position as i64
        total = total + values⁅position⁆ * left * right
        next_stack.push(position as i64)
        cursor = cursor - 1
    }
    return total
}

[export(case: "camelCase")]
micro subArrayRanges(nums: ArrayList<i64>) -> i64 {
    let mut negated: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        negated.push(-value)
    }
    let minimums: i64 = minimum_total(nums)
    let maximums: i64 = -minimum_total(negated)
    return maximums - minimums
}

class Solution {
    micro subArrayRanges(self, nums: ArrayList<i64>): i64 {
        return subArrayRanges(nums)
    }
}
