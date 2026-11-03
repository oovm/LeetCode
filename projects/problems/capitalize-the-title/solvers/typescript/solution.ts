export class Solution {
    capitalizeTitle(title: string): string {
        const words = title.split(/\s+/).filter((word) => word.length > 0);
        return words
            .map((word) =>
                word.length > 2
                    ? word[0].toUpperCase() + word.slice(1).toLowerCase()
                    : word.toLowerCase(),
            )
            .join(' ');
    }
}
