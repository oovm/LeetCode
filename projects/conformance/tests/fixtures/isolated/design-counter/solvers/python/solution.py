class Counter:
    def __init__(self, initial: int = 0) -> None:
        self.value = initial

    def add(self, delta: int) -> None:
        self.value += delta

    def inc(self) -> None:
        self.add(1)

    def reset(self) -> None:
        self.value = 0

    def get(self) -> int:
        return self.value
