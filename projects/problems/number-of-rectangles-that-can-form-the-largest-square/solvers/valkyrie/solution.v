namespace leetcode.number_of_rectangles_that_can_form_the_largest_square;

using std.collection;

# 每块矩形能切出的最大正方形边长为两条边的最小值，统计该最大值出现次数。
[export(case: "camelCase")]
micro countGoodRectangles(rectangles: ArrayList<ArrayList<i64>>) -> i64 {
    let mut best: i64 = 0
    let mut count: i64 = 0
    let mut position: usize = 0
    while position < rectangles.length() {
        let length: i64 = rectangles⁅position⁆⁅0⁆
        let width: i64 = rectangles⁅position⁆⁅1⁆
        let mut side: i64 = length
        if width < length {
            side = width
        }
        if side > best {
            best = side
            count = 1
        } else if side == best {
            count = count + 1
        }
        position = position + 1
    }
    return count
}

class Solution {
    micro countGoodRectangles(self, rectangles: ArrayList<ArrayList<i64>>): i64 {
        return countGoodRectangles(rectangles)
    }
}
