namespace leetcode.maximum_area_of_longest_diagonal_rectangle;

using std.collection;

# 用对角线平方比较长短，避免浮点；同长时取面积较大者。
[export(case: "camelCase")]
micro areaOfMaxDiagonal(dimensions: ArrayList<ArrayList<i64>>) -> i64 {
    let mut best_diagonal: i64 = 0
    let mut best_area: i64 = 0
    let mut index: usize = 0
    while index < dimensions.length() {
        let length: i64 = dimensions⁅index⁆⁅0⁆
        let width: i64 = dimensions⁅index⁆⁅1⁆
        let diagonal: i64 = length * length + width * width
        let area: i64 = length * width
        if diagonal > best_diagonal {
            best_diagonal = diagonal
            best_area = area
        } else if diagonal == best_diagonal {
            if area > best_area {
                best_area = area
            }
        }
        index = index + 1
    }
    return best_area
}

class Solution {
    micro areaOfMaxDiagonal(self, dimensions: ArrayList<ArrayList<i64>>): i64 {
        return areaOfMaxDiagonal(dimensions)
    }
}
