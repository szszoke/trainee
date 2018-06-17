import * as React from "react";
import { DropFilesEventHandler } from "react-dropzone";
import { TextView, Uploader } from "~/components";
import api, { ProgressEvent } from "~/api";
import "./app.scss";
import "react-virtualized/styles.css";

export interface AppState {
    lines: string[];

    status:
        | "empty"
        | "uploaded"
        | "small-upload"
        | "uploading"
        | "processing"
        | "downloading"
        | "error"
        | "file-too-big";

    loaded: number;
    total: number;
}

export class App extends React.Component<{}, AppState> {
    private textViewRef: TextView;

    constructor(props) {
        super(props);

        this.state = {
            lines: [],
            status: "empty",
            loaded: 0,
            total: 0,
        };
    }

    render() {
        const { lines, status } = this.state;

        return (
            <div className="app__inner">
                <div className="app__card--dark-background">
                    <div className="app__title">HiQ Trainee program</div>
                </div>
                <div
                    className="app__card"
                    style={{
                        paddingTop: 0,
                        paddingBottom: 0,
                    }}
                >
                    <TextView
                        ref={ref => (this.textViewRef = ref)}
                        placeholder={this.textViewPlaceholder()}
                        lines={lines}
                    />
                </div>
                <div className="app__card">
                    <Uploader
                        disabled={[
                            "uploading",
                            "processing",
                            "downloading",
                        ].includes(status)}
                        onDrop={this.onDropFile}
                    />
                </div>
            </div>
        );
    }

    onDropFile: DropFilesEventHandler = async acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length === 1) {
            const file = acceptedFiles[0];

            if (file.size <= 10 * 1024 * 1024) {
                // Only display the upload progress if it's taking more
                // than 500 ms
                // This way the user doesn't have to see th upload progress
                // instantly jumping to 100%
                const handle = window.setTimeout(() => {
                    const { status } = this.state;
                    if (status !== "processing") {
                        this.setState({ status: "uploading" });
                    }
                }, 500);
                try {
                    this.setState({
                        total: 0,
                        loaded: 0,
                        lines: [],
                        status: "small-upload",
                    });
                    // Clear the cache from the previous file
                    this.textViewRef.clearMeasurerCache();
                    const { data } = await api.uploadFile(
                        file,
                        this.onUploadProgress,
                        this.onDownloadProgress,
                    );

                    // Split the result to lines
                    this.setState({
                        lines: data.split(/\r?\n/gm),
                        status: "uploaded",
                    });
                } catch (error) {
                    this.setState({
                        status: "error",
                        loaded: 0,
                        total: 0,
                    });
                } finally {
                    window.clearTimeout(handle);
                }
            } else {
                this.setState({ status: "file-too-big" });
            }
        }
    };

    onUploadProgress: ProgressEvent = ({ loaded, total }) => {
        const { status } = this.state;
        this.setState({
            loaded,
            total,
            status: total === loaded ? "processing" : status,
        });
    };

    onDownloadProgress = () => this.setState({ status: "downloading" });

    textViewPlaceholder = () => {
        const { lines, status, loaded, total } = this.state;

        switch (status) {
            case "small-upload": {
                return "Uploading...";
            }

            case "uploading": {
                return `Uploading ${((loaded / (total || 1)) * 100).toFixed(
                    0,
                )}%`;
            }

            case "processing": {
                return "Processing...";
            }

            case "downloading": {
                return "Downloading...";
            }

            case "error": {
                return "Error";
            }

            case "uploaded": {
                return !lines || lines.length === 0 ? "The file is empty" : "";
            }

            case "file-too-big": {
                return "File too big, max. 10 MB";
            }

            default: {
                return "No file uploaded";
            }
        }
    };
}
