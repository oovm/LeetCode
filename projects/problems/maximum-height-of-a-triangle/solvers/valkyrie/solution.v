namespace leetcode.maximum_height_of_a_triangle;

# 首行用 first 色、逐行交替时能达到的高度；行 i 需要 i 个同色球。
micro height_starting(first: i64, second: i64) -> i64 {
    let mut a: i64 = first
    let mut b: i64 = second
    let mut row: i64 = 1
    while true {
        if row % 2 == 1 {
            if a < row {
                return row - 1
            }
            a = a - row
        } else {
            if b < row {
                return row - 1
            }
            b = b - row
        }
        row = row + 1
    }
    return 0
}

[export(case: "camelCase")]
micro max_height_of_triangle(red: i64, blue: i64) -> i64 {
    let start_red: i64 = height_starting(red, blue)
    let start_blue: i64 = height_starting(blue, red)
    if start_red > start_blue {
        return start_red
    }
    return start_blue
}

class Solution {
    micro maxHeightOfTriangle(self, red: i64, blue: i64): i64 {
        return max_height_of_triangle(red, blue)
    }
}
