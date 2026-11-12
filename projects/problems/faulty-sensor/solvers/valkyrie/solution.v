namespace leetcode.faulty_sensor;

using std.collection;

# 官方语义（LC 1826）：坏传感器恰好丢一个值，右侧整体左移、末位换成随机值。
# 找到首个分歧 i 后按排除法判定：`sensor1[i+1] != sensor2[i]` 排除「sensor2 丢值」
# （丢值方应满足右移对齐），故 sensor1 坏；反之 sensor2 坏；两边都对齐到倒数第二位
# 则无法判定，返回 -1。判定顺序与官方一致，先排除 2 再排除 1。
[export(case: "camelCase")]
micro badSensor(sensor1: [i64], sensor2: [i64]) -> i64 {
    let length: usize = sensor1.length()
    let mut index: usize = 0
    while index + 1 < length && sensor1⁅index⁆ == sensor2⁅index⁆ {
        index = index + 1
    }
    while index + 1 < length {
        if sensor1⁅index + 1⁆ != sensor2⁅index⁆ {
            return 1
        }
        if sensor1⁅index⁆ != sensor2⁅index + 1⁆ {
            return 2
        }
        index = index + 1
    }
    return -1
}

class Solution {
    micro badSensor(self, sensor1: [i64], sensor2: [i64]): i64 {
        return badSensor(sensor1, sensor2)
    }
}
