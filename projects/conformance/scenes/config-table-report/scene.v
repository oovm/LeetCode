namespace probe.config_table_report;

using std.collection
using std.text

# 键值配置：`#` 注释与空行跳过，首个 `=` 分割键值，两侧 `trim`。
structure Config {
    keys: ArrayList<utf8>
    values: ArrayList<utf8>
}

micro first_code(text: utf8) -> i64 {
    if text.length() == 0 {
        return -1
    }
    return (text.character_at(0) as u32) as i64
}

micro config_index_of(text: utf8, target: i64) -> i64 {
    let length: i64 = text.length() as i64
    let mut index: i64 = 0
    while index < length {
        if (((text.character_at(index as usize) as u32) as i64) == target) {
            return index
        }
        index = index + 1
    }
    return -1
}

micro parse_config(text: utf8) -> Config {
    let lines: [utf8] = text.split("\n")
    let mut keys: ArrayList<utf8> = ArrayList::new(8)
    let mut values: ArrayList<utf8> = ArrayList::new(8)
    let mut index: usize = 0
    while index < lines.length() {
        let line: utf8 = lines⁅index⁆.trim()
        index = index + 1
        if line.length() == 0 {
            continue
        }
        if first_code(line) == 35 {
            continue
        }
        let separator: i64 = config_index_of(line, 61)
        if separator < 0 {
            continue
        }
        let width: i64 = line.length() as i64
        let key: utf8 = line.slice(0, separator as usize).trim()
        let value: utf8 = line.slice((separator + 1) as usize, (width - separator - 1) as usize).trim()
        if key.length() == 0 {
            continue
        }
        keys.push(key)
        values.push(value)
    }
    return Config { keys: keys, values: values }
}

micro parse_unsigned(text: utf8) -> i64 {
    let mut total: i64 = 0
    let mut index: usize = 0
    let length: i64 = text.length() as i64
    let mut running: bool = true
    while running && (index as i64) < length {
        let code: i64 = (text.character_at(index) as u32) as i64
        if code >= 48 && code <= 57 {
            total = total * 10 + (code - 48)
            index = index + 1
        } else {
            running = false
        }
    }
    return total
}

micro value_sum(values: ArrayList<utf8>) -> i64 {
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < values.length() {
        total = total + parse_unsigned(values⁅index⁆)
        index = index + 1
    }
    return total
}

micro max_key_width(keys: ArrayList<utf8>) -> i64 {
    let mut widest: i64 = 0
    let mut index: usize = 0
    while index < keys.length() {
        let width: i64 = keys⁅index⁆.length() as i64
        if width > widest {
            widest = width
        }
        index = index + 1
    }
    return widest
}

# 右对齐表格：键按最宽键补空格，再 `: ` 接值。
micro render_table(config: Config) -> utf8 {
    let width: i64 = max_key_width(config.keys)
    let mut buffer: Utf8Builder = Utf8Builder::new(32)
    let newline: char = '\n'
    let space: char = ' '
    let colon: char = ':'
    let mut index: usize = 0
    while index < config.keys.length() {
        if index > 0 {
            buffer.append(newline)
        }
        let key: utf8 = config.keys⁅index⁆
        buffer.append(key)
        let padding: i64 = width - (key.length() as i64)
        let mut spaces: i64 = 0
        while spaces < padding {
            buffer.append(space)
            spaces = spaces + 1
        }
        buffer.append(colon)
        buffer.append(space)
        buffer.append(config.values⁅index⁆)
        index = index + 1
    }
    return buffer.build()
}

micro text_checksum(text: utf8) -> i64 {
    let mut total: i64 = 0
    loop current in text {
        total = total + ((current as u32) as i64)
    }
    return total
}

micro sample_config() -> Config {
    return parse_config("a=1\nlong_key=22\n\n# note\nb=333")
}

[export(name: "configEntryCount")]
micro config_entry_count() -> i64 {
    let config: Config = sample_config()
    return config.keys.length() as i64
}

[export(name: "configValueSum")]
micro config_value_sum() -> i64 {
    let config: Config = sample_config()
    return value_sum(config.values)
}

# 三行表格加两个换行，校验和 2091。
[export(name: "configTableChecksum")]
micro config_table_checksum() -> i64 {
    let config: Config = sample_config()
    return text_checksum(render_table(config))
}

# 首行 `a` + 7 空格 + `: 1`，宽 11。
[export(name: "configFirstLineWidth")]
micro config_first_line_width() -> i64 {
    let config: Config = sample_config()
    let table: utf8 = render_table(config)
    return config_index_of(table, 10) as i64
}

# i64 `Display`：`123456789` 校验和 477。
[export(name: "integerFormatChecksum")]
micro integer_format_checksum() -> i64 {
    let number: i64 = 123456789
    return text_checksum(number.display())
}

# f64 `Display`：`0.1` 与 `1234.5678`，校验和 143 + 466 = 609。
[export(name: "float64FormatChecksum")]
micro float64_format_checksum() -> i64 {
    let small: f64 = 0.1f64
    let large: f64 = 1234.5678f64
    return text_checksum(small.display()) + text_checksum(large.display())
}
