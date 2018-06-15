import * as express from "express";
import * as multer from "multer";
import * as fs from "fs";
import * as utils from "~/utils";
import { listenerCount } from "cluster";

const { listen, init } = new class {
    private readonly app = express();
    private readonly router = express.Router();
    private readonly upload = multer({
        dest: "uploads/",
    });

    private prefix: string;
    private postfix: string;

    init = (prefix: string, postfix: string) => {
        this.prefix = prefix;
        this.postfix = postfix;

        console.log("Using prefix", `"${prefix}"`);
        console.log("Using postfix", `"${postfix}"`);

        this.router.post(
            "/upload",
            this.upload.single("file"),
            async (req, res) => {
                try {
                    const { file } = req;

                    if (file) {
                        console.log("file:", file.path);
                        console.time("occurrences");
                        const words = await utils.findMostFrequentWords(
                            file.path,
                        );
                        console.timeEnd("occurrences");
                        console.log("words:", words);
                        console.time("surround");
                        await utils.surroundOccurrences(
                            res,
                            file.path,
                            words,
                            this.prefix,
                            this.postfix,
                        );
                        console.timeEnd("surround");
                        res.end();
                        console.log("OK");
                    } else {
                        res.sendStatus(400);
                    }
                } catch (error) {
                    console.error(error);
                    res.sendStatus(500);
                }
            },
        );

        this.app.use(express.static("./dist"));
        this.app.get("/", (_, res) => res.sendFile("./dist/index.html"));
        this.app.use(this.router);
    };

    listen = (port: number) => {
        this.app.listen(port);
        console.log("Listening on PORT", port);
    };
}();

init(process.env.PREFIX || "foo", process.env.POSTFIX || "bar");
listen(+process.env.PORT || 3000);
