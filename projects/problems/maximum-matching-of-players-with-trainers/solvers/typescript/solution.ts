export class Solution {
    matchPlayersAndTrainers(players: number[], trainers: number[]): number {
        const playerOrder = [...players].sort((a, b) => a - b);
        const trainerOrder = [...trainers].sort((a, b) => a - b);
        let player = 0;
        let trainer = 0;
        let matched = 0;
        while (player < playerOrder.length && trainer < trainerOrder.length) {
            if (playerOrder[player] <= trainerOrder[trainer]) {
                matched += 1;
                player += 1;
                trainer += 1;
            } else {
                trainer += 1;
            }
        }
        return matched;
    }
}
