namespace leetcode.image_overlap;

using std.collection;

# 只枚举两图中为 1 的坐标对，把平移量编码成键做频次统计，取最大重叠。
# 代价 O(k1 * k2)，k 为各自 1 的个数；比枚举全部平移的 O(n^4) 更省。
[export(case: "camelCase")]
micro largest_overlap(img1: ArrayList<ArrayList<i64>>, img2: ArrayList<ArrayList<i64>>) -> i64 {
    let n: i64 = img1.length() as i64
    let mut rows1: ArrayList<i64> = ArrayList::new(0)
    let mut cols1: ArrayList<i64> = ArrayList::new(0)
    let mut rows2: ArrayList<i64> = ArrayList::new(0)
    let mut cols2: ArrayList<i64> = ArrayList::new(0)
    let mut row: usize = 0
    while row < img1.length() {
        let mut col: usize = 0
        while col < img1⁅row⁆.length() {
            if img1⁅row⁆⁅col⁆ == 1 {
                rows1.push(row as i64)
                cols1.push(col as i64)
            }
            if img2⁅row⁆⁅col⁆ == 1 {
                rows2.push(row as i64)
                cols2.push(col as i64)
            }
            col = col + 1
        }
        row = row + 1
    }
    let width: i64 = n * 2 + 1
    let mut counts: HashMap<i64, i64> = HashMap::new(rows1.length() * rows2.length() + 1)
    let mut best: i64 = 0
    let mut a: usize = 0
    while a < rows1.length() {
        let mut b: usize = 0
        while b < rows2.length() {
            let key: i64 = (rows1⁅a⁆ - rows2⁅b⁆ + n) * width + (cols1⁅a⁆ - cols2⁅b⁆ + n)
            let mut streak: i64 = 1
            if counts.contains_key(key) {
                streak = counts.get(key).unwrap() + 1
            }
            counts.insert(key, streak)
            if streak > best {
                best = streak
            }
            b = b + 1
        }
        a = a + 1
    }
    return best
}

class Solution {
    micro largestOverlap(self, img1: ArrayList<ArrayList<i64>>, img2: ArrayList<ArrayList<i64>>): i64 {
        return largest_overlap(img1, img2)
    }
}
