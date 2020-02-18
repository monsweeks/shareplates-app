import React from 'react';

import './NoMatch.scss';
import {withTranslation} from "react-i18next";

class NoMatch extends React.PureComponent {

    render() {

        const {t } = this.props;

        return (
            <div className="no-match-wrapper">
                <h2>{t('message.404')}</h2>
            </div>
        );
    }
}

export default withTranslation()(NoMatch);