namespace leetcode.high_five;

using std.collection;

# 按 id 聚合成绩，id 升序输出，每组取前五大的均值为该 id 的成绩。
[export(case: "camelCase")]
micro high_five(items: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let count: usize = items.length()
    let mut scores: HashMap<i64, ArrayList<i64>> = HashMap::new(count)
    let mut ids: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        let item: ArrayList<i64> = items⁅index⁆
        let id: i64 = item⁅0⁆
        let score: i64 = item⁅1⁆
        if scores.contains_key(id) {
            let mut bucket: ArrayList<i64> = scores.get(id).unwrap()
            bucket.push(score)
            scores.insert(id, bucket)
        } else {
            let mut fresh: ArrayList<i64> = ArrayList::new(5)
            fresh.push(score)
            scores.insert(id, fresh)
            ids.push(id)
        }
        index = index + 1
    }
    sort(ids)

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(ids.length())
    let mut cursor: usize = 0
    while cursor < ids.length() {
        let id: i64 = ids⁅cursor⁆
        let mut bucket: ArrayList<i64> = scores.get(id).unwrap()
        # 比较器降序排序，前五个即该 id 的最高分。
        bucket = sorted_by(bucket, micro(a: i64, b: i64) -> i32 {
            if a > b {
                return -1
            }
            if a < b {
                return 1
            }
            return 0
        })

        let mut take: usize = 5
        if bucket.length() < take {
            take = bucket.length()
        }
        let mut total: i64 = 0
        let mut pick: usize = 0
        while pick < take {
            total = total + bucket⁅pick⁆
            pick = pick + 1
        }

        let mut row: ArrayList<i64> = ArrayList::new(2)
        row.push(id)
        row.push(total / 5)
        result.push(row)
        cursor = cursor + 1
    }
    return result
}

class Solution {
    micro highFive(self, items: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return high_five(items)
    }
}
