namespace leetcode.categorize_box_according_to_criteria;

micro word_both() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(4)
    builder.append(char::from(66))
    builder.append(char::from(111))
    builder.append(char::from(116))
    builder.append(char::from(104))
    return builder.build()
}

micro word_bulky() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(5)
    builder.append(char::from(66))
    builder.append(char::from(117))
    builder.append(char::from(108))
    builder.append(char::from(107))
    builder.append(char::from(121))
    return builder.build()
}

micro word_heavy() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(5)
    builder.append(char::from(72))
    builder.append(char::from(101))
    builder.append(char::from(97))
    builder.append(char::from(118))
    builder.append(char::from(121))
    return builder.build()
}

micro word_neither() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(7)
    builder.append(char::from(78))
    builder.append(char::from(101))
    builder.append(char::from(105))
    builder.append(char::from(116))
    builder.append(char::from(104))
    builder.append(char::from(101))
    builder.append(char::from(114))
    return builder.build()
}

[export(case: "camelCase")]
micro categorize_box(length: i64, width: i64, height: i64, mass: i64) -> utf8 {
    let mut max_dim: i64 = length
    if width > max_dim {
        max_dim = width
    }
    if height > max_dim {
        max_dim = height
    }
    let mut bulky: bool = false
    if max_dim >= 10000 {
        bulky = true
    } else {
        let volume: i64 = length * width * height
        if volume >= 1000000000 {
            bulky = true
        }
    }
    let heavy: bool = mass >= 100
    if bulky && heavy {
        return word_both()
    }
    if bulky {
        return word_bulky()
    }
    if heavy {
        return word_heavy()
    }
    return word_neither()
}

class Solution {
    micro categorizeBox(self, length: i64, width: i64, height: i64, mass: i64): utf8 {
        return categorize_box(length, width, height, mass)
    }
}
