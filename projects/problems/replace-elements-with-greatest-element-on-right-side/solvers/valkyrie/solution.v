namespace leetcode.replace_elements_with_greatest_element_on_right_side;

using std.collection;

# 从右向左维护后缀最大值，先写入答案再更新最大值。
[export(case: "camelCase")]
micro replaceElements(arr: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = arr.length()
    let mut answer: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        answer.push(0)
        fill = fill + 1
    }

    let mut greatest: i64 = -1
    let mut position: usize = count
    while position > 0 {
        position = position - 1
        answer⁅position⁆ = greatest
        if arr⁅position⁆ > greatest {
            greatest = arr⁅position⁆
        }
    }
    return answer
}

class Solution {
    micro replaceElements(self, arr: ArrayList<i64>): ArrayList<i64> {
        return replaceElements(arr)
    }
}
