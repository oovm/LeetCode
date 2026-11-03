export class Solution {
    capitalizeTitle(title: string): string {
        return title
            .split(' ')
            .map((word) =>
                word.length > 2
                    ? word[0].toUpperCase() + word.slice(1).toLowerCase()
                    : word.toLowerCase(),
            )
            .join(' ');
    }
}
