namespace leetcode.maximum_number_of_accepted_invitations;

using std.collection;

# 二分图最大匹配：逐个左侧节点做 BFS 找增广路，再沿 parent 链翻转匹配。
[export(case: "camelCase")]
micro maximumInvitations(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let cols: usize = grid⁅0⁆.length()

    let mut match_left: ArrayList<i64> = ArrayList::new(rows)
    let mut match_right: ArrayList<i64> = ArrayList::new(cols)
    let mut fill: usize = 0
    while fill < rows {
        match_left.push(-1)
        fill = fill + 1
    }
    fill = 0
    while fill < cols {
        match_right.push(-1)
        fill = fill + 1
    }

    let mut matched: i64 = 0
    let mut person: usize = 0
    while person < rows {
        let mut visited: ArrayList<bool> = ArrayList::new(cols)
        let mut parent: ArrayList<i64> = ArrayList::new(cols)
        fill = 0
        while fill < cols {
            visited.push(false)
            parent.push(-1)
            fill = fill + 1
        }

        let mut queue: Deque<i64> = Deque::new()
        queue.push_back(person as i64)
        let mut found: i64 = -1
        while queue.is_empty() == false && found < 0 {
            let current: i64 = queue.pop_front().unwrap()
            let options: ArrayList<i64> = grid⁅current as usize⁆
            let mut cursor: usize = 0
            while cursor < options.length() {
                if options⁅cursor⁆ == 1 && visited⁅cursor⁆ == false {
                    visited.set(((cursor as i64) + 1) as isize, true)
                    parent.set(((cursor as i64) + 1) as isize, current)
                    let partner: i64 = match_right⁅cursor⁆
                    if partner == -1 {
                        found = cursor as i64
                        break
                    } else {
                        queue.push_back(partner)
                    }
                }
                cursor = cursor + 1
            }
        }

        if found >= 0 {
            let mut right: i64 = found
            let mut left: i64 = parent⁅found as usize⁆
            while left >= 0 {
                let previous: i64 = match_left⁅left as usize⁆
                match_right.set((right + 1) as isize, left)
                match_left.set((left + 1) as isize, right)
                right = previous
                if right < 0 {
                    left = -1
                } else {
                    left = parent⁅right as usize⁆
                }
            }
            matched = matched + 1
        }
        person = person + 1
    }
    return matched
}

class Solution {
    micro maximumInvitations(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return maximumInvitations(grid)
    }
}
