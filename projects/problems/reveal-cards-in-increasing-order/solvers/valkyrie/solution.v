namespace leetcode.reveal_cards_in_increasing_order;

using std.collection;

# 升序排列后按「取一张、把下一张挪到队尾」的逆过程回填下标。
# `sort(list)` 已在 `std.collection` 落地（`ArrayList<T>` 形态，稳定归并）。
[export(case: "camelCase")]
micro deckRevealedIncreasing(mut deck: ArrayList<i64>) -> ArrayList<i64> {
    sort(deck)
    let count: usize = deck.length()

    let mut order: Deque<i64> = Deque::new()
    let mut fill: usize = 0
    while fill < count {
        order.push_back(fill as i64)
        fill = fill + 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    fill = 0
    while fill < count {
        result.push(0)
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < count {
        let position: usize = order.pop_front().unwrap() as usize
        result.set((position + 1) as isize, deck⁅index⁆)
        if order.is_empty() == false {
            let moved: i64 = order.pop_front().unwrap()
            order.push_back(moved)
        }
        index = index + 1
    }
    return result
}

class Solution {
    micro deckRevealedIncreasing(self, deck: ArrayList<i64>): ArrayList<i64> {
        return deckRevealedIncreasing(deck)
    }
}
