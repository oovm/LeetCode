namespace leetcode.count_the_number_of_houses_at_a_certain_distance_i;

using std.collection;

# 以每个节点为源做 BFS 得到全部点对距离，按距离累加无序点对的两倍数量。
[export(case: "camelCase")]
micro countOfPairs(n: i64, x: i64, y: i64) -> [i64] {
    let count: usize = n as usize

    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        adjacency.push(row)
        fill = fill + 1
    }

    let mut street: usize = 0
    while street + 1 < count {
        let left: i64 = street as i64
        let right: i64 = left + 1
        let right_index: usize = street + 1

        let mut left_links: ArrayList<i64> = adjacency⁅street⁆
        left_links.push(right)
        adjacency.set((left + 1) as isize, left_links)

        let mut right_links: ArrayList<i64> = adjacency⁅right_index⁆
        right_links.push(left)
        adjacency.set((right + 1) as isize, right_links)

        street = street + 1
    }

    if x != y {
        let from: i64 = x - 1
        let to: i64 = y - 1

        let mut from_links: ArrayList<i64> = adjacency⁅from as usize⁆
        from_links.push(to)
        adjacency.set((from + 1) as isize, from_links)

        let mut to_links: ArrayList<i64> = adjacency⁅to as usize⁆
        to_links.push(from)
        adjacency.set((to + 1) as isize, to_links)
    }

    let mut answer: ArrayList<i64> = ArrayList::new(count)
    fill = 0
    while fill < count {
        answer.push(0)
        fill = fill + 1
    }

    let mut source: usize = 0
    while source < count {
        let mut distance: ArrayList<i64> = ArrayList::new(count)
        fill = 0
        while fill < count {
            distance.push(-1)
            fill = fill + 1
        }
        distance.set(((source as i64) + 1) as isize, 0)

        let mut queue: Deque<i64> = Deque::new()
        queue.push_back(source as i64)
        while queue.is_empty() == false {
            let current: i64 = queue.pop_front().unwrap()
            let links: ArrayList<i64> = adjacency⁅current as usize⁆
            let mut cursor: usize = 0
            while cursor < links.length() {
                let next: i64 = links⁅cursor⁆
                if distance⁅next as usize⁆ < 0 {
                    distance.set((next + 1) as isize, distance⁅current as usize⁆ + 1)
                    queue.push_back(next)
                }
                cursor = cursor + 1
            }
        }

        let mut target: usize = 0
        while target < count {
            if target != source {
                let step: usize = (distance⁅target⁆ - 1) as usize
                answer.set(((step as i64) + 1) as isize, answer⁅step⁆ + 1)
            }
            target = target + 1
        }

        source = source + 1
    }
    return answer.to_array()
}

class Solution {
    micro countOfPairs(self, n: i64, x: i64, y: i64): [i64] {
        return countOfPairs(n, x, y)
    }
}
