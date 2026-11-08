namespace probe.state_machine_dispatch;

using std.collection

# 有限状态机 + 命令分发器 + 事件队列：全部用值形 `match` 推进，不在分支里改写状态。
enums State {
    Idle
    Running
    Paused
    Done
}

enums Event {
    Start
    Pause
    Resume
    Finish
    Reset
}

unite Command {
    [constructor]
    Add {
        value: i64
    }
    [constructor]
    Multiply {
        value: i64
    }
    [constructor]
    Reset
}

micro state_code(state: State) -> i64 {
    return match state {
        case Idle: 0
        case Running: 1
        case Paused: 2
        case Done: 3
    }
}

micro step(state: State, event: Event) -> State {
    return match state {
        case Idle:
            match event {
                case Start: Running
                case Pause: Idle
                case Resume: Idle
                case Finish: Idle
                case Reset: Idle
            }
        case Running:
            match event {
                case Start: Running
                case Pause: Paused
                case Resume: Running
                case Finish: Done
                case Reset: Idle
            }
        case Paused:
            match event {
                case Start: Running
                case Pause: Paused
                case Resume: Running
                case Finish: Paused
                case Reset: Idle
            }
        case Done:
            match event {
                case Start: Done
                case Pause: Done
                case Resume: Done
                case Finish: Done
                case Reset: Idle
            }
    }
}

micro apply(command: Command, accumulator: i64) -> i64 {
    return match command {
        case Add(value): accumulator + value
        case Multiply(value): accumulator * value
        case Reset: 0
    }
}

micro run_commands(commands: ArrayList<Command>, start: i64) -> i64 {
    let mut total: i64 = start
    let mut index: usize = 0
    while index < commands.length() {
        total = apply(commands⁅index⁆, total)
        index = index + 1
    }
    return total
}

micro transition_count(events: ArrayList<Event>) -> i64 {
    let mut state: State = Idle
    let mut changed: i64 = 0
    let mut index: usize = 0
    while index < events.length() {
        let next: State = step(state, events⁅index⁆)
        if state_code(next) != state_code(state) {
            changed = changed + 1
        }
        state = next
        index = index + 1
    }
    return changed
}

micro final_state(events: ArrayList<Event>) -> State {
    let mut state: State = Idle
    let mut index: usize = 0
    while index < events.length() {
        state = step(state, events⁅index⁆)
        index = index + 1
    }
    return state
}

# 事件队列按 FIFO 逐条出队处理，返回处理条数。
micro drain_events(events: ArrayList<Event>) -> i64 {
    let mut cursor: usize = 0
    let mut processed: i64 = 0
    while cursor < events.length() {
        let event: Event = events⁅cursor⁆
        let advanced: State = step(Idle, event)
        cursor = cursor + 1
        processed = processed + 1
    }
    return processed
}

micro lifecycle_events() -> ArrayList<Event> {
    let mut events: ArrayList<Event> = ArrayList::new(4)
    events.push(Start)
    events.push(Pause)
    events.push(Resume)
    events.push(Finish)
    return events
}

micro repeated_events() -> ArrayList<Event> {
    let mut events: ArrayList<Event> = ArrayList::new(6)
    events.push(Start)
    events.push(Start)
    events.push(Pause)
    events.push(Pause)
    events.push(Resume)
    events.push(Finish)
    return events
}

micro sample_commands() -> ArrayList<Command> {
    let mut commands: ArrayList<Command> = ArrayList::new(5)
    commands.push(Add { value: 5 })
    commands.push(Multiply { value: 2 })
    commands.push(Add { value: 7 })
    commands.push(Reset)
    commands.push(Add { value: 9 })
    return commands
}

# Start → Pause → Resume → Finish 落到 Done。
[export(name: "fsmFinalStateCode")]
micro fsm_final_state_code() -> i64 {
    return state_code(final_state(lifecycle_events()))
}

# 六个事件里实际改变状态四次。
[export(name: "fsmTransitionCount")]
micro fsm_transition_count() -> i64 {
    return transition_count(repeated_events())
}

# 命令分发：((0 + 5) * 2 + 7) 后 Reset，再 +9 = 9。
[export(name: "commandResultValue")]
micro command_result_value() -> i64 {
    return run_commands(sample_commands(), 0)
}

# 队列四条事件全部出队。
[export(name: "eventQueueDrained")]
micro event_queue_drained() -> i64 {
    return drain_events(lifecycle_events())
}
