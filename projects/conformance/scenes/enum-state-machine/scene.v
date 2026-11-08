namespace probe.enum_state_machine;

# 用户态 `enums`：无载荷、无标签，状态机推进只靠值形 `match`。
enums Phase {
    Idle
    Running
    Stopped
}

micro advance(phase: Phase) -> Phase {
    return match phase {
        case Idle: Running
        case Running: Stopped
        case Stopped: Idle
    }
}

micro phase_code(phase: Phase) -> i64 {
    return match phase {
        case Idle: 0
        case Running: 1
        case Stopped: 2
    }
}

micro is_idle(phase: Phase) -> bool {
    return match phase {
        case Idle: true
        case Running: false
        case Stopped: false
    }
}

[export(name: "phaseCycleCode")]
micro phase_cycle_code() -> i64 {
    let mut phase: Phase = Idle
    let mut step: i64 = 0
    while step < 7 {
        phase = advance(phase)
        step = step + 1
    }
    return phase_code(phase) * 100 + step
}

[export(name: "phaseStepsCode")]
micro phase_steps_code() -> i64 {
    let mut phase: Phase = Idle
    let mut step: i64 = 0
    while step < 10 {
        phase = advance(phase)
        step = step + 1
        if is_idle(phase) {
            return step * 10 + phase_code(phase)
        }
    }
    return -1
}
