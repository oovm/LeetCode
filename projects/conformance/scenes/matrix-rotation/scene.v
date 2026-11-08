namespace probe.matrix_rotation;

using std.collection

# 二维矩阵按行优先铺成 `row * size + column`。
micro matrix_new(size: i64) -> ArrayList<ArrayList<i64>> {
    let mut rows: ArrayList<ArrayList<i64>> = ArrayList::new(size as usize)
    let mut r: i64 = 0
    while r < size {
        let mut row: ArrayList<i64> = ArrayList::new(size as usize)
        let mut c: i64 = 0
        while c < size {
            row.push(r * size + c)
            c = c + 1
        }
        rows.push(row)
        r = r + 1
    }
    return rows
}

# 非线性格子，用于区分旋转后的两条对角线。
micro matrix_product(size: i64) -> ArrayList<ArrayList<i64>> {
    let mut rows: ArrayList<ArrayList<i64>> = ArrayList::new(size as usize)
    let mut r: i64 = 0
    while r < size {
        let mut row: ArrayList<i64> = ArrayList::new(size as usize)
        let mut c: i64 = 0
        while c < size {
            row.push((r + 1) * (c + 2))
            c = c + 1
        }
        rows.push(row)
        r = r + 1
    }
    return rows
}

# 原地顺时针旋转：先转置，再逐行反转。
micro rotate_clockwise(mut matrix: ArrayList<ArrayList<i64>>, size: i64) -> unit {
    let mut r: i64 = 0
    while r < size {
        let row_r: ArrayList<i64> = matrix⁅r as usize⁆
        let mut c: i64 = r + 1
        while c < size {
            let row_c: ArrayList<i64> = matrix⁅c as usize⁆
            let keep: i64 = row_r⁅c as usize⁆
            row_r.set_cardinal(c as usize, row_c⁅r as usize⁆)
            row_c.set_cardinal(r as usize, keep)
            c = c + 1
        }
        r = r + 1
    }
    let mut i: i64 = 0
    while i < size {
        let row: ArrayList<i64> = matrix⁅i as usize⁆
        let mut left: usize = 0
        let mut right: usize = row.length() - 1
        while left < right {
            let keep: i64 = row⁅left⁆
            row.set_cardinal(left, row⁅right⁆)
            row.set_cardinal(right, keep)
            left = left + 1
            right = right - 1
        }
        i = i + 1
    }
}

[export(name: "rotatedChecksum")]
micro rotated_checksum() -> i64 {
    let mut matrix: ArrayList<ArrayList<i64>> = matrix_new(3)
    rotate_clockwise(matrix, 3)
    let mut checksum: i64 = 0
    let mut r: i64 = 0
    while r < 3 {
        let row: ArrayList<i64> = matrix⁅r as usize⁆
        let mut c: i64 = 0
        while c < 3 {
            checksum = checksum * 10 + row⁅c as usize⁆
            c = c + 1
        }
        r = r + 1
    }
    return checksum
}

[export(name: "rotatedDiagonals")]
micro rotated_diagonals() -> i64 {
    let mut matrix: ArrayList<ArrayList<i64>> = matrix_product(3)
    rotate_clockwise(matrix, 3)
    let mut main: i64 = 0
    let mut anti: i64 = 0
    let mut i: i64 = 0
    while i < 3 {
        let row: ArrayList<i64> = matrix⁅i as usize⁆
        main = main + row⁅i as usize⁆
        anti = anti + row⁅(2 - i) as usize⁆
        i = i + 1
    }
    return main * 10 + anti
}
