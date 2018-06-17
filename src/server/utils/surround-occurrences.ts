import * as fs from "fs";
import * as stream from "stream";

/**
 * Surrounds the occurrences of the words in a file with the prefix and postfix
 * and writes the result to a stream
 * @param stream Output stream
 * @param path Path of the file
 * @param words List of words to surround
 * @param prefix Prefix for the occurrences
 * @param postfix Postfix for the occurrences
 */
export const surroundOccurrences = (
    stream: stream.Writable,
    path: string,
    words: string[],
    prefix: string,
    postfix: string,
): Promise<void> =>
    new Promise<void>((resolve, _) => {
        const fileStream = fs.createReadStream(path, { encoding: "utf8" });

        fileStream.on("data", (data: string) => {
            stream.write(
                words.reduce(
                    (prev, curr) =>
                        prev.replace(
                            new RegExp(
                                `(^|\\s|\\W?)(${curr.replace(
                                    /[\/\\^$*+?.()|[\]{}]/g,
                                    "\\$&",
                                )}(?![']\\w))(\\s|\\W|$)`,
                                "gium",
                            ),
                            (_, p0, p1, p2) =>
                                `${p0}${prefix}${p1}${postfix}${p2}`,
                        ),
                    data,
                ),
                "utf8",
            );
        });

        fileStream.on("end", resolve);
    });
