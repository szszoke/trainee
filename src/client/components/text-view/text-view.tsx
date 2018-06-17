import * as React from "react";
import { AutoSizer, Size } from "react-virtualized/dist/es/AutoSizer";
import {
    CellMeasurer,
    CellMeasurerCache,
} from "react-virtualized/dist/es/CellMeasurer";
import { List, ListRowRenderer } from "react-virtualized/dist/es/List";
import { ScrollbarPresenceParams } from "react-virtualized/dist/es/Grid";
import "./text-view.scss";

export interface TextViewProps {
    /**
     * Placeholder text displayed when the number of lines is zero
     */
    placeholder?: string;
    /**
     * Lines to display
     */
    lines: string[];
}

interface TextViewState {
    width: number;
    scrollbarWidth: number;
}

export class TextView extends React.Component<TextViewProps, TextViewState> {
    private readonly cellMeasurerCache: CellMeasurerCache;
    private listRef: List;

    /**
     * Virtualized text view component to display many lines of text
     * Only a subset of the lines are rendered at any given time
     * @param props component props
     */
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            scrollbarWidth: 0,
        };

        this.cellMeasurerCache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 24,
        });
    }

    componentDidUpdate(_, prevState: TextViewState) {
        if (
            this.listRef &&
            (this.state.width !== prevState.width ||
                this.state.scrollbarWidth !== prevState.scrollbarWidth)
        ) {
            this.listRef.measureAllRows();
        }
    }

    onResize = ({ width }: Size) => this.setState({ width });

    onScrollbarPresenceChange = ({ size }: ScrollbarPresenceParams) =>
        this.setState({ scrollbarWidth: size });

    render() {
        const { lines } = this.props;

        return (
            <div className="text-view">
                {lines.length > 0 ? (
                    <div className="text-view__content">
                        <div className="text-view__auto-sizer-container">
                            <AutoSizer onResize={this.onResize}>
                                {dimensions => (
                                    <List
                                        className="text-view__list"
                                        ref={ref => (this.listRef = ref)}
                                        {...dimensions}
                                        deferredMeasurementCache={
                                            this.cellMeasurerCache
                                        }
                                        overscanRowCount={30}
                                        rowHeight={
                                            this.cellMeasurerCache.rowHeight
                                        }
                                        rowCount={lines.length}
                                        rowRenderer={this.renderRow}
                                        onScrollbarPresenceChange={
                                            this.onScrollbarPresenceChange
                                        }
                                    />
                                )}
                            </AutoSizer>
                        </div>
                    </div>
                ) : (
                    this.renderPlaceholder()
                )}
            </div>
        );
    }

    renderRow: ListRowRenderer = ({ key, style, index, parent }) => {
        const { lines } = this.props;
        const { width, scrollbarWidth } = this.state;

        return (
            <CellMeasurer
                cache={this.cellMeasurerCache}
                columnIndex={0}
                rowIndex={index}
                key={key}
                parent={parent}
            >
                <div
                    key={key}
                    style={{
                        ...style,
                        wordWrap: "break-word",
                        overflowY: "hidden",
                        width: width - scrollbarWidth,
                    }}
                    className="text-view__formatted-container"
                >
                    {lines[index]}
                </div>
            </CellMeasurer>
        );
    };

    renderPlaceholder = () => {
        const { placeholder } = this.props;

        return <div className="text-view__placeholder">{placeholder}</div>;
    };

    /**
     * Clear the row height measurement cache
     * Use after the lines have been changed
     */
    clearMeasurerCache = () => this.cellMeasurerCache.clearAll();
}
