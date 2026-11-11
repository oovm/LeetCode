namespace leetcode.eliminate_maximum_number_of_monsters;

using std.collection;

# 到达时间是分数 `dist / speed`，单个 `i64` 装不下，用交叉相乘比较。
# `Comparable: Equal` 是合同的超 trait，`sort` 的约束同时要求两者；
# 结构体只声明 `Comparable` 不能满足 `T: Comparable`，必须补 `Equal`。
structure Monster {
    dist: i64
    speed: i64
}

imply Monster: std::operator::Equal {
    infix `==`(self, other: Monster): bool {
        return self.dist * other.speed == other.dist * self.speed
    }

    infix `!=`(self, other: Monster): bool {
        return !(self == other)
    }
}

imply Monster: std::operator::Comparable {
    micro compare(self, other: Monster): std::operator::Ordering {
        let left: i64 = self.dist * other.speed
        let right: i64 = other.dist * self.speed
        if left < right {
            return std::operator::Ordering.Less
        }
        if left > right {
            return std::operator::Ordering.Greater
        }
        return std::operator::Ordering.Equal
    }
}

micro order_monsters(mut items: ArrayList<Monster>) {
    sort(items)
}

[export(case: "camelCase")]
micro eliminateMaximum(dist: [i64], speed: [i64]) -> i64 {
    let count: usize = dist.length()
    let mut monsters: ArrayList<Monster> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        monsters.push(Monster { dist: dist⁅index⁆, speed: speed⁅index⁆ })
        index = index + 1
    }
    order_monsters(monsters)

    index = 0
    while index < count {
        let monster: Monster = monsters⁅index⁆
        if monster.dist <= monster.speed * (index as i64) {
            return index as i64
        }
        index = index + 1
    }
    return count as i64
}

class Solution {
    micro eliminateMaximum(self, dist: [i64], speed: [i64]): i64 {
        return eliminateMaximum(dist, speed)
    }
}
