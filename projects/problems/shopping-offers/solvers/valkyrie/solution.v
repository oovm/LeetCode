namespace leetcode.shopping_offers;

using std.collection;

# 把 needs 按每项 4 bit 编码成一个整数状态，记忆化搜索：
# 每次先按单价买齐，再尝试每个不超量的优惠包递归。状态数 = ∏(need+1)。
micro spend(
    state: i64,
    price: ArrayList<i64>,
    special: ArrayList<ArrayList<i64>>,
    bits: i64,
    memo: HashMap<i64, i64>,
) -> i64 {
    if memo.contains_key(state) {
        return memo.get(state).unwrap()
    }
    let mut best: i64 = 0
    let mut item: i64 = 0
    while item < price.length() as i64 {
        let amount: i64 = state.bit_shift_right(item * bits).bit_and(15)
        best = best + amount * price⁅item as usize⁆
        item = item + 1
    }

    let mut offer_index: usize = 0
    while offer_index < special.length() {
        let offer: ArrayList<i64> = special⁅offer_index⁆
        let mut next: i64 = state
        let mut fits: bool = true
        let mut position: i64 = 0
        while position < price.length() as i64 {
            let available: i64 = state.bit_shift_right(position * bits).bit_and(15)
            let wanted: i64 = offer⁅position as usize⁆
            if available < wanted {
                fits = false
                position = price.length() as i64
            } else {
                next = next - wanted.bit_shift_left(position * bits)
                position = position + 1
            }
        }
        if fits && next != state {
            let cost: i64 = offer⁅offer.length() - 1⁆ + spend(next, price, special, bits, memo)
            if cost < best {
                best = cost
            }
        }
        offer_index = offer_index + 1
    }
    memo.insert(state, best)
    return best
}

[export(case: "camelCase")]
micro shopping_offers(price: ArrayList<i64>, special: ArrayList<ArrayList<i64>>, needs: ArrayList<i64>) -> i64 {
    let bits: i64 = 4
    let mut state: i64 = 0
    let mut index: i64 = 0
    while index < needs.length() as i64 {
        state = state.bit_or(needs⁅index as usize⁆.bit_shift_left(index * bits))
        index = index + 1
    }
    let mut memo: HashMap<i64, i64> = HashMap::new(64)
    return spend(state, price, special, bits, memo)
}

class Solution {
    micro shoppingOffers(self, price: ArrayList<i64>, special: ArrayList<ArrayList<i64>>, needs: ArrayList<i64>): i64 {
        return shopping_offers(price, special, needs)
    }
}
