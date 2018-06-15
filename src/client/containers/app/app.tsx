import * as React from "react";
import { DropFilesEventHandler } from "react-dropzone";
import { TextView, Uploader } from "~/components";
import api, { ProgressEvent } from "~/api";
import "./app.scss";

export interface AppState {
    content: string;

    status:
        | "empty"
        | "uploaded"
        | "small-upload"
        | "uploading"
        | "processing"
        | "error";

    loaded: number;
    total: number;
}

export class App extends React.Component<{}, AppState> {
    constructor(props) {
        super(props);

        this.state = {
            content: null,
            status: "empty",
            loaded: 0,
            total: 0,
        };
    }

    render() {
        const { content, status } = this.state;

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
                    <TextView placeholder={this.textViewPlaceholder()}>
                        {content}
                    </TextView>
                </div>
                <div className="app__card">
                    <Uploader
                        disabled={
                            status === "uploading" || status === "processing"
                        }
                        onDrop={this.onDropFile}
                    />
                </div>
            </div>
        );
    }

    onDropFile: DropFilesEventHandler = async acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length === 1) {
            const file = acceptedFiles[0];
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
                    content: null,
                    status: "small-upload",
                });
                const { data } = await api.uploadFile(
                    file,
                    this.onUploadProgress,
                );
                this.setState({
                    content: data,
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

    textViewPlaceholder = () => {
        const { content, status, loaded, total } = this.state;

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
                return "Processing";
            }

            case "error": {
                return "Error";
            }

            case "uploaded": {
                return !content ? "The file is empty" : "";
            }

            default: {
                return "No file uploaded";
            }
        }
    };
}
