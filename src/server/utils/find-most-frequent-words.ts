import * as fs from "fs";

interface OccurrenceMap {
    [K: string]: number;
}

/**
 * Converts a token to lowercase and removes surrounding punctuation marks
 * @param token input token
 * @returns the normalized token
 */
const normalizeToken = (token: string) =>
    token.toLowerCase().replace(/(?!'\w)\W/gi, "");

/**
 * Finds the most frequently used words in a file (all of them if there are more)
 * @param filePath Path of the file
 * @returns Promise which resolves to the array of most frequently used words in the file
 */
export const findMostFrequentWords = async (
    filePath: string,
): Promise<string[]> =>
    new Promise<string[]>((resolve, _) => {
        const stream = fs.createReadStream(filePath, {
            encoding: "utf8",
        });
        const result: string[] = [];
        const occurrences: OccurrenceMap = {};

        stream.on("data", (data: string) => {
            const tokens = data.split(/\s+/g);

            for (const token of tokens) {
                occurrences[normalizeToken(token)] =
                    (occurrences[normalizeToken(token)] || 0) + 1;
            }
        });

        stream.on("close", () => {
            const keys = Object.keys(occurrences);
            if (keys.length > 0) {
                keys.sort((a, b) => {
                    if (occurrences[a] < occurrences[b]) {
                        return 1;
                    }

                    if (occurrences[a] > occurrences[b]) {
                        return -1;
                    }

                    return 0;
                });

                const max = occurrences[keys[0]];

                for (const key of keys) {
                    if (occurrences[key] === max) {
                        result.push(key);
                    } else {
                        break;
                    }
                }
            }

            resolve(result);
        });
    });
