export class Solution {
    corpFlightBookings(bookings: number[][], n: number): number[] {
        const answer = new Array<number>(n).fill(0);
        for (const [first, last, seats] of bookings) {
            answer[first - 1] += seats;
            if (last < n) {
                answer[last] -= seats;
            }
        }
        for (let position = 1; position < n; position += 1) {
            answer[position] += answer[position - 1];
        }
        return answer;
    }
}
