namespace probe.type_ordering_player;

using std.collection

structure Player {
    score: i64
    age: i64
}

imply Player: std::operator::Equal {
    infix `==`(self, other: Player): bool {
        if self.score != other.score {
            return false
        }
        return self.age == other.age
    }

    infix `!=`(self, other: Player): bool {
        return !(self == other)
    }
}

imply Player: std::operator::Comparable {
    micro compare(self, other: Self): Ordering {
        if self.score < other.score {
            return Less
        }
        if other.score < self.score {
            return Greater
        }
        if self.age < other.age {
            return Less
        }
        if other.age < self.age {
            return Greater
        }
        return Equal
    }
}

[export(name: "sortPlayerChecksum")]
micro sort_player_checksum() -> i64 {
    let mut players: ArrayList<Player> = ArrayList::new(3)
    players.push(Player { score: 3, age: 30 })
    players.push(Player { score: 1, age: 12 })
    players.push(Player { score: 2, age: 20 })
    sort(players)
    let mut checksum: i64 = 0
    loop player in players {
        checksum = checksum * 10 + player.score
    }
    return checksum
}
