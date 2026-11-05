namespace leetcode.open_the_lock;

using std.collection;

# 4 位密码共 10000 个状态，直接以整数做 BFS。每个状态扩展 8 个邻态，
# 总代价 O(10^4 * 8)。
micro parse_state(text: utf8) -> i64 {
    let mut value: i64 = 0
    let mut index: usize = 0
    while index < 4 {
        value = value * 10 + ((text.byte_at(index) as i64) - 48)
        index = index + 1
    }
    return value
}

[export(case: "camelCase")]
micro open_lock(deadends: ArrayList<utf8>, target: utf8) -> i64 {
    let mut states: ArrayList<i64> = ArrayList::new(10000)
    let mut index: i64 = 0
    while index < 10000 {
        states.push(0)
        index = index + 1
    }
    index = 0
    while index < deadends.length() as i64 {
        let blocked: i64 = parse_state(deadends⁅index as usize⁆)
        states⁅blocked as usize⁆ = 2
        index = index + 1
    }
    let goal: i64 = parse_state(target)
    if states⁅0⁆ == 2 {
        return -1
    }
    if goal == 0 {
        return 0
    }
    let mut distance: ArrayList<i64> = ArrayList::new(10000)
    index = 0
    while index < 10000 {
        distance.push(0)
        index = index + 1
    }
    let mut queue: ArrayList<i64> = ArrayList::new(10000)
    queue.push(0)
    states⁅0⁆ = 1
    let mut head: usize = 0
    while head < queue.length() {
        let state: i64 = queue⁅head⁆
        head = head + 1
        if state == goal {
            return distance⁅state as usize⁆
        }
        let mut wheel: i64 = 0
        let mut place: i64 = 1
        while wheel < 4 {
            let digit: i64 = (state / place) % 10
            let up: i64 = (digit + 1) % 10
            let down: i64 = (digit + 9) % 10
            let next_up: i64 = state + (up - digit) * place
            let next_down: i64 = state + (down - digit) * place
            if states⁅next_up as usize⁆ == 0 {
                states⁅next_up as usize⁆ = 1
                distance⁅next_up as usize⁆ = distance⁅state as usize⁆ + 1
                queue.push(next_up)
            }
            if states⁅next_down as usize⁆ == 0 {
                states⁅next_down as usize⁆ = 1
                distance⁅next_down as usize⁆ = distance⁅state as usize⁆ + 1
                queue.push(next_down)
            }
            place = place * 10
            wheel = wheel + 1
        }
    }
    return -1
}

class Solution {
    micro openLock(self, deadends: ArrayList<utf8>, target: utf8): i64 {
        return open_lock(deadends, target)
    }
}
