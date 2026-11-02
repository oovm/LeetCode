namespace leetcode.flood_fill;

micro fill(image: ArrayList<ArrayList<i64>>, rows: usize, cols: usize, x: usize, y: usize, old: i64, color: i64) {
    image⁅x⁆.unwrap()⁅y⁆ = color
    if x > 0 && image⁅x - 1⁆.unwrap()⁅y⁆.unwrap() == old {
        fill(image, rows, cols, x - 1, y, old, color)
    }
    if x + 1 < rows && image⁅x + 1⁆.unwrap()⁅y⁆.unwrap() == old {
        fill(image, rows, cols, x + 1, y, old, color)
    }
    if y > 0 && image⁅x⁆.unwrap()⁅y - 1⁆.unwrap() == old {
        fill(image, rows, cols, x, y - 1, old, color)
    }
    if y + 1 < cols && image⁅x⁆.unwrap()⁅y + 1⁆.unwrap() == old {
        fill(image, rows, cols, x, y + 1, old, color)
    }
}

[export(case: "camelCase")]
micro flood_fill(image: ArrayList<ArrayList<i64>>, sr: i64, sc: i64, color: i64) -> ArrayList<ArrayList<i64>> {
    let rows: usize = image.length()
    let cols: usize = image⁅0⁆.unwrap().length()
    let old: i64 = image⁅sr as usize⁆.unwrap()⁅sc as usize⁆.unwrap()
    if old != color {
        fill(image, rows, cols, sr as usize, sc as usize, old, color)
    }
    return image
}

class Solution {
    micro floodFill(self, image: ArrayList<ArrayList<i64>>, sr: i64, sc: i64, color: i64): ArrayList<ArrayList<i64>> {
        return flood_fill(image, sr, sc, color)
    }
}
