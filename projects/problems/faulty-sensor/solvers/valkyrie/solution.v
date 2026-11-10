namespace leetcode.faulty_sensor;

using std.collection;

# 找到首个分歧点后，分别检查两传感器各自丢尾是否成立；同时成立则无法判定。
[export(case: "camelCase")]
micro badSensor(sensor1: ArrayList<i64>, sensor2: ArrayList<i64>) -> i64 {
    let length: usize = sensor1.length()
    let mut index: usize = 0
    while index < length && sensor1⁅index⁆ == sensor2⁅index⁆ {
        index = index + 1
    }
    if index == length {
        return -1
    }
    let mut cursor: usize = index
    while cursor + 1 < length && sensor1⁅cursor⁆ == sensor2⁅cursor + 1⁆ {
        cursor = cursor + 1
    }
    let oneIsBad: bool = cursor + 1 == length
    cursor = index
    while cursor + 1 < length && sensor2⁅cursor⁆ == sensor1⁅cursor + 1⁆ {
        cursor = cursor + 1
    }
    let twoIsBad: bool = cursor + 1 == length
    if oneIsBad && twoIsBad {
        return -1
    }
    if oneIsBad {
        return 1
    }
    return 2
}

class Solution {
    micro badSensor(self, sensor1: ArrayList<i64>, sensor2: ArrayList<i64>): i64 {
        return badSensor(sensor1, sensor2)
    }
}
