namespace leetcode.maximum_matching_of_players_with_trainers;

using std.collection;

# 两队都升序，双指针贪心：当前教练带得动当前球员就配对，否则换更强的教练。
[export(case: "camelCase")]
micro matchPlayersAndTrainers(players: ArrayList<i64>, trainers: ArrayList<i64>) -> i64 {
    let mut player_order: ArrayList<i64> = ArrayList::new(players.length())
    loop value in players {
        player_order.push(value)
    }
    let mut trainer_order: ArrayList<i64> = ArrayList::new(trainers.length())
    loop value in trainers {
        trainer_order.push(value)
    }
    sort(player_order)
    sort(trainer_order)

    let mut player: usize = 0
    let mut trainer: usize = 0
    let mut matched: i64 = 0
    while player < player_order.length() && trainer < trainer_order.length() {
        if player_order⁅player⁆ <= trainer_order⁅trainer⁆ {
            matched = matched + 1
            player = player + 1
            trainer = trainer + 1
        } else {
            trainer = trainer + 1
        }
    }
    return matched
}

class Solution {
    micro matchPlayersAndTrainers(self, players: ArrayList<i64>, trainers: ArrayList<i64>): i64 {
        return matchPlayersAndTrainers(players, trainers)
    }
}
