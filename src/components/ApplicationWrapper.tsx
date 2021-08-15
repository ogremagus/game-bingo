import * as React from 'react';

import { Application } from './Application';

export class ApplicationWrapper extends React.Component<{}, null> {

    constructor(props) {
        super(props);
    }

    render() {
        return <Application />;
    }
}