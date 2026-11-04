namespace leetcode.maximum_subarray_min_product;

using std.collection;

# 单调栈求每个元素作为最小值的最长区间，配合前缀和取最大乘积。
# 左边界取「严格更小」，右边界取「小于等于」，保证每个区间只被计一次。
[export(case: "camelCase")]
micro maxSumMinProduct(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()

    let mut prefix: ArrayList<i64> = ArrayList::new(count + 1)
    prefix.push(0)
    let mut index: usize = 0
    while index < count {
        prefix.push(prefix⁅index⁆ + nums⁅index⁆)
        index = index + 1
    }

    let mut previous: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        previous.push(-1)
        fill = fill + 1
    }

    let mut stack: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        while stack.is_empty() == false {
            let top: usize = stack.last().unwrap() as usize
            if nums⁅top⁆ < nums⁅index⁆ {
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

    let modulo: i64 = 1000000007
    let mut best: i64 = 0
    let mut next_stack: ArrayList<i64> = ArrayList::new(count)
    let mut cursor: usize = count
    while cursor > 0 {
        let position: usize = cursor - 1
        while next_stack.is_empty() == false {
            let top: usize = next_stack.last().unwrap() as usize
            if nums⁅top⁆ <= nums⁅position⁆ {
                break
            }
            next_stack.pop()
        }
        let mut boundary: i64 = count as i64
        if next_stack.is_empty() == false {
            boundary = next_stack.last().unwrap()
        }
        let left: usize = (previous⁅position⁆ + 1) as usize
        let right: usize = boundary as usize - 1
        let window: i64 = prefix⁅right + 1⁆ - prefix⁅left⁆
        let product: i64 = nums⁅position⁆ * window
        if product > best {
            best = product
        }
        next_stack.push(position as i64)
        cursor = cursor - 1
    }
    return best % modulo
}

class Solution {
    micro maxSumMinProduct(self, nums: ArrayList<i64>): i64 {
        return maxSumMinProduct(nums)
    }
}
