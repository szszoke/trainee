import * as React from "react";
import Dropzone, { DropFilesEventHandler } from "react-dropzone";
import "./uploader.scss";

export interface UploaderProps {
    disabled?: boolean;
    onDrop?: DropFilesEventHandler;
}

export const Uploader: React.StatelessComponent<UploaderProps> = ({
    disabled,
    onDrop,
}) => (
    <Dropzone
        disabled={disabled}
        disablePreview
        multiple={false}
        className="uploader__dropzone"
        acceptClassName="uploader__dropzone--accept"
        rejectClassName="uploader__dropzone--reject"
        disabledClassName="uploader__dropzone--disabled"
        onDrop={onDrop}
    >
        Upload a file here
    </Dropzone>
);
