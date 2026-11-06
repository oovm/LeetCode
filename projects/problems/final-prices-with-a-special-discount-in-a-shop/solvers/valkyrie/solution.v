namespace leetcode.final_prices_with_a_special_discount_in_a_shop;

using std.collection;

# 单调栈保存尚未结算的下标，遇到不高于栈顶的价格就立即打折并出栈。
[export(case: "camelCase")]
micro finalPrices(prices: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = prices.length()
    let mut answer: ArrayList<i64> = ArrayList::new(count)
    let mut position: usize = 0
    while position < count {
        answer.push(prices⁅position⁆)
        position = position + 1
    }

    let mut stack: ArrayList<i64> = ArrayList::new(count)
    position = 0
    while position < count {
        let price: i64 = prices⁅position⁆
        while stack.length() > 0 {
            let pending: i64 = stack⁅stack.length() - 1⁆
            let pending_index: usize = pending as usize
            if prices⁅pending_index⁆ >= price {
                let removed: i64 = stack.pop().unwrap()
                let removed_index: usize = removed as usize
                answer⁅removed_index⁆ = answer⁅removed_index⁆ - price
            } else {
                break
            }
        }
        stack.push(position as i64)
        position = position + 1
    }
    return answer
}

class Solution {
    micro finalPrices(self, prices: ArrayList<i64>): ArrayList<i64> {
        return finalPrices(prices)
    }
}
