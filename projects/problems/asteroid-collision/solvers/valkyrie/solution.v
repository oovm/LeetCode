namespace leetcode.asteroid_collision;

using std.collection;

# 栈模拟：正数直接入栈，负数先与栈顶正数对撞（质量小则弹出，相等则两边消失），
# 存活才入栈，均摊 O(n)。
micro settle(stack: ArrayList<i64>, rock: i64) -> bool {
    while stack.length() > 0 {
        let top: i64 = stack⁅stack.length() - 1⁆
        if top <= 0 {
            return true
        }
        if top < 0 - rock {
            stack.pop()
        } else if top == 0 - rock {
            stack.pop()
            return false
        } else {
            return false
        }
    }
    return true
}

[export(case: "camelCase")]
micro asteroid_collision(asteroids: [i64]) -> [i64] {
    let mut stack: ArrayList<i64> = ArrayList::new(asteroids.length())
    let mut index: usize = 0
    while index < asteroids.length() {
        let rock: i64 = asteroids⁅index⁆
        if rock > 0 {
            stack.push(rock)
        } else if settle(stack, rock) {
            stack.push(rock)
        }
        index = index + 1
    }
    return stack.to_array()
}

class Solution {
    micro asteroidCollision(self, asteroids: [i64]): [i64] {
        return asteroid_collision(asteroids)
    }
}
