namespace leetcode.construct_the_rectangle;

# 宽取 floor(sqrt(area))，向下找最大可行因子保证 长 >= 宽。
[export(case: "camelCase")]
micro construct_rectangle(area: i64) -> [i64] {
    let mut width: i64 = 1
    let mut best: i64 = 1
    while width * width <= area {
        if area % width == 0 {
            best = width
        }
        width = width + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(2)
    result.push(area / best)
    result.push(best)
    return result.to_array()
}

class Solution {
    micro constructRectangle(self, area: i64): [i64] {
        return construct_rectangle(area)
    }
}
