import * as React from "react";
import "./text-view.scss";

export interface TextViewProps {
    placeholder?: React.ReactNode;
}

export const TextView: React.StatelessComponent<TextViewProps> = ({
    children,
    placeholder,
}) => (
    <div className="text-view">
        {children ? (
            <div className="text-view__content">
                <textarea
                    className="text-view__preformatted-container"
                    readOnly
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={children as string}
                />
            </div>
        ) : (
            <div className="text-view__placeholder">{placeholder}</div>
        )}
    </div>
);
