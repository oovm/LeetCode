namespace leetcode.tuple_with_same_product;

using std.collection;

# 枚举所有二元组并统计相同乘积出现次数：每来一个新二元组，能和它组成
# 8 个有序四元组，故累加 `8 * 已有数量`，O(n^2)。
[export(case: "camelCase")]
micro tupleSameProduct(nums: ArrayList<i64>) -> i64 {
    let mut products: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut total: i64 = 0
    let mut i: i64 = 0
    while i < nums.length() as i64 {
        let mut j: i64 = i + 1
        while j < nums.length() as i64 {
            let product: i64 = nums⁅i as usize⁆ * nums⁅j as usize⁆
            let mut existing: i64 = 0
            if products.contains_key(product) {
                existing = products.get(product).unwrap()
            }
            total = total + existing * 8
            products.insert(product, existing + 1)
            j = j + 1
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro tupleSameProduct(self, nums: ArrayList<i64>): i64 {
        return tupleSameProduct(nums)
    }
}
