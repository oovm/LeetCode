namespace leetcode.filling_bookcase_shelves;

using std.collection;

# 前缀 DP：dp[i] 为前 i 本书的最小总高，枚举最后一层的起点转移。
[export(case: "camelCase")]
micro min_height_shelves(books: [[i64]], shelfWidth: i64) -> i64 {
    let count: usize = books.length()
    let mut table: ArrayList<i64> = ArrayList::new(count + 1)
    let mut fill: usize = 0
    while fill <= count {
        table.push(0)
        fill = fill + 1
    }
    let mut done: usize = 1
    while done <= count {
        let width: i64 = books⁅done - 1⁆⁅0⁆
        let height: i64 = books⁅done - 1⁆⁅1⁆
        table⁅done⁆ = table⁅done - 1⁆ + height
        let mut layer_width: i64 = width
        let mut layer_height: i64 = height
        let mut start: usize = done - 1
        while start > 0 {
            let at: usize = start - 1
            layer_width = layer_width + books⁅at⁆⁅0⁆
            if layer_width > shelfWidth {
                break
            }
            if books⁅at⁆⁅1⁆ > layer_height {
                layer_height = books⁅at⁆⁅1⁆
            }
            let candidate: i64 = table⁅at⁆ + layer_height
            if candidate < table⁅done⁆ {
                table⁅done⁆ = candidate
            }
            start = start - 1
        }
        done = done + 1
    }
    return table⁅count⁆
}

class Solution {
    micro minHeightShelves(self, books: [[i64]], shelfWidth: i64): i64 {
        return min_height_shelves(books, shelfWidth)
    }
}
