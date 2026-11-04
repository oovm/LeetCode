namespace leetcode.eliminate_maximum_number_of_monsters;

using std.collection;

# 到达时间是分数 `dist / speed`，单个 `i64` 装不下，用交叉相乘比较。
# 结构体自带三态序，`sort(list)` 只接受 `ArrayList<T>` 且要求 `T: Comparable`。
structure Monster {
    dist: i64
    speed: i64
}

# [提案] 依赖 `Comparable` 派生。`compare` 返回的三态变体当前不可达
# （`Ordering.Less` 被同命名空间 `trait Equal` 撞名遮蔽），归入
# 「阻塞于 Comparable 派生」组，与 `sort(list)` 组分开记账。
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

micro order_monsters(items: mut ArrayList<Monster>) {
    sort(items)
}

[export(case: "camelCase")]
micro eliminateMaximum(dist: ArrayList<i64>, speed: ArrayList<i64>) -> i64 {
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
    micro eliminateMaximum(self, dist: ArrayList<i64>, speed: ArrayList<i64>): i64 {
        return eliminateMaximum(dist, speed)
    }
}
