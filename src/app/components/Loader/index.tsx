import * as React from 'react';
import './loader.scss';

export interface ILoaderProps {
}

export class Loader extends React.PureComponent<ILoaderProps, {}> {
    constructor(props: ILoaderProps) {
        super(props);
    }

    render() {
        return <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    }
}