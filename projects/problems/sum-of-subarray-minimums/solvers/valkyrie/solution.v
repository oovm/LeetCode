namespace leetcode.sum_of_subarray_minimums;

using std.collection;

# 单调栈求每个元素的左右更小边界，贡献为 `arr[i] * 左宽度 * 右宽度`。
[export(case: "camelCase")]
micro sumSubarrayMins(arr: ArrayList<i64>) -> i64 {
    let count: usize = arr.length()
    let mut previous: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        previous.push(0)
        fill = fill + 1
    }

    let mut stack: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        while stack.is_empty() == false {
            let top: usize = stack.last().unwrap() as usize
            if arr⁅top⁆ < arr⁅index⁆ {
                break
            }
            stack.pop()
        }
        let mut boundary: i64 = -1
        if stack.is_empty() == false {
            boundary = stack.last().unwrap()
        }
        previous.set((index + 1) as isize, boundary)
        stack.push(index as i64)
        index = index + 1
    }

    let modulo: i64 = 1000000007
    let mut total: i64 = 0
    let mut next_stack: ArrayList<i64> = ArrayList::new(count)
    let mut cursor: usize = count
    while cursor > 0 {
        let position: usize = cursor - 1
        while next_stack.is_empty() == false {
            let top: usize = next_stack.last().unwrap() as usize
            if arr⁅top⁆ <= arr⁅position⁆ {
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
        total = total + arr⁅position⁆ * left * right % modulo
        total = total % modulo
        next_stack.push(position as i64)
        cursor = cursor - 1
    }
    return total
}

class Solution {
    micro sumSubarrayMins(self, arr: ArrayList<i64>): i64 {
        return sumSubarrayMins(arr)
    }
}
