namespace leetcode.image_smoother;

using std.collection;

# 每个格取 3×3 邻域（含自身）的整数均值，边界只统计存在的邻格。
[export(case: "camelCase")]
micro imageSmoother(img: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = img.length()
    let columns: usize = img⁅0⁆.length()
    let mut answer: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row: usize = 0
    while row < rows {
        let mut output_row: ArrayList<i64> = ArrayList::new(columns)
        let mut column: usize = 0
        while column < columns {
            let mut total: i64 = 0
            let mut count: i64 = 0
            let mut row_offset: i64 = -1
            while row_offset <= 1 {
                let neighbor_row: i64 = row as i64 + row_offset
                if neighbor_row >= 0 {
                    if neighbor_row < rows as i64 {
                        let mut column_offset: i64 = -1
                        while column_offset <= 1 {
                            let neighbor_column: i64 = column as i64 + column_offset
                            if neighbor_column >= 0 {
                                if neighbor_column < columns as i64 {
                                    total = total + img⁅neighbor_row as usize⁆⁅neighbor_column as usize⁆
                                    count = count + 1
                                }
                            }
                            column_offset = column_offset + 1
                        }
                    }
                }
                row_offset = row_offset + 1
            }
            output_row.push(total / count)
            column = column + 1
        }
        answer.push(output_row)
        row = row + 1
    }
    return answer
}

class Solution {
    micro imageSmoother(self, img: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return imageSmoother(img)
    }
}
