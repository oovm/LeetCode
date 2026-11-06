namespace leetcode.min_stack;

using std.collection;

# 两条并行序列：`_values` 存元素，`_minimums` 存「截至该深度的最小值」。
class MinStack {
    _values: ArrayList<i64>
    _minimums: ArrayList<i64>
}

imply MinStack {
    [export(name: "MinStack")]
    micro new(): Self {
        let values: ArrayList<i64> = ArrayList::new(0)
        let minimums: ArrayList<i64> = ArrayList::new(0)
        return MinStack {
            _values: values,
            _minimums: minimums,
        }
    }

    [export]
    micro push(mut self, value: i64): unit {
        let depth: usize = self._values.length()
        let mut minimum: i64 = value
        if depth > 0 {
            let previous_minimum: i64 = self._minimums⁅depth - 1⁆
            if previous_minimum < value {
                minimum = previous_minimum
            }
        }
        self._values.push(value)
        self._minimums.push(minimum)
    }

    [export]
    micro pop(mut self): unit {
        let popped_value: Option<i64> = self._values.pop()
        let popped_minimum: Option<i64> = self._minimums.pop()
    }

    [export]
    micro top(self): i64 {
        let depth: usize = self._values.length()
        return self._values⁅depth - 1⁆
    }

    [export(name: "getMin")]
    micro get_min(self): i64 {
        let depth: usize = self._minimums.length()
        return self._minimums⁅depth - 1⁆
    }
}
