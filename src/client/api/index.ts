import axios, { AxiosPromise } from "axios";

export interface ProgressEventParams {
    total: number;
    loaded: number;
}

export type ProgressEvent = (params: ProgressEventParams) => void;

export default new class {
    /**
     * Upload a file to the server
     * @param file The file to upload
     * @returns a promise which resolves to the response from the server
     */
    uploadFile = (
        file: File,
        onUploadProgress?: ProgressEvent,
    ): AxiosPromise => {
        const data = new FormData();
        data.append("file", file);

        return axios.post("/upload", data, {
            onUploadProgress,
        });
    };
}();
