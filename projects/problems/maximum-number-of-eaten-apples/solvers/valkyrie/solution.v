namespace leetcode.maximum_number_of_eaten_apples;

using std.collection;

# 题内触发点：G25 —— 果实按到期日进入 `BinaryHeap`，
# 顺序来自结构体 `Fruit` 的 `Comparable` 派生（`imply` + `infix <`）。
structure Fruit {
    day: i64
    count: i64
}

imply Fruit: std::operator::Comparable {
    infix `<`(self, other: Fruit): bool {
        return self.day < other.day
    }
}

[export(case: "camelCase")]
micro eatenApples(apples: ArrayList<i64>, days: ArrayList<i64>) -> i64 {
    let mut heap: BinaryHeap<Fruit> = BinaryHeap::new()
    let count: usize = apples.length()
    let mut current: i64 = 0
    let mut eaten: i64 = 0
    while current < count as i64 || heap.length() > 0 {
        if current < count as i64 {
            let position: usize = current as usize
            if apples⁅position⁆ > 0 {
                heap.push(Fruit { day: current + days⁅position⁆, count: apples⁅position⁆ })
            }
        }
        while heap.length() > 0 {
            let top: Fruit = heap.peek().unwrap()
            if top.day <= current {
                heap.pop()
            } else {
                break
            }
        }
        if heap.length() > 0 {
            let mut top: Fruit = heap.pop().unwrap()
            eaten = eaten + 1
            top.count = top.count - 1
            if top.count > 0 {
                heap.push(top)
            }
        }
        current = current + 1
    }
    return eaten
}

class Solution {
    micro eatenApples(self, apples: ArrayList<i64>, days: ArrayList<i64>): i64 {
        return eatenApples(apples, days)
    }
}
