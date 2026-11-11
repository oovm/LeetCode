namespace leetcode.destroying_asteroids;

# 升序行星：质量够就把行星并进总质量，否则永远吞不下更大的，直接失败。
[export(case: "camelCase")]
micro asteroidsDestroyed(mass: i64, asteroids: [i64]) -> bool {
    let mut ordered: ArrayList<i64> = ArrayList::new(asteroids.length())
    loop value in asteroids {
        ordered.push(value)
    }
    sort(ordered)

    let mut current: i64 = mass
    loop value in ordered {
        if current < value {
            return false
        }
        current = current + value
    }
    return true
}

class Solution {
    micro asteroidsDestroyed(self, mass: i64, asteroids: [i64]): bool {
        return asteroidsDestroyed(mass, asteroids)
    }
}
