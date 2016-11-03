import React, { PropTypes, Component } from 'react';
import NaermesteLedere from '../components/NaermesteLedere';
import Feilmelding from '../components/Feilmelding';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Side from '../sider/Side';
import * as ledereActions from '../actions/ledere_actions';
import AppSpinner from '../components/AppSpinner';

export class NaermesteLedereSide extends Component {
    constructor(props) {
        super(props);
        this.props.actions.hentLedere(this.props.fnr);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.fnr !== this.props.fnr) {
            this.props.actions.hentLedere(nextProps.fnr);
        }
    }

    render() {
        const { fnr, henter, ledere, hentingFeilet, actions, navbruker } = this.props;
        return (<Side tittel="Nærmeste ledere">
        {
            (() => {
                if (hentingFeilet) {
                    return <Feilmelding />;
                } else if (henter) {
                    return <AppSpinner />;
                }
                return <NaermesteLedere ledere={ledere} toggleApenLeder={actions.toggleApenLeder} navbruker={navbruker} />;
            })()
        }
        </Side>);
    }
}

NaermesteLedereSide.propTypes = {
    ledere: PropTypes.array,
    toggleApenLeder: PropTypes.func,
    fnr: PropTypes.string,
    actions: PropTypes.object,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    navbruker: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ledereActions, dispatch),
    };
}

export function mapStateToProps(state, ownProps) {
    const fnr = ownProps.params.fnr;
    return {
        ledere: state.ledere.data,
        henter: state.ledere.henter || state.navbruker.henter,
        hentingFeilet: state.ledere.hentingFeilet,
        navbruker: state.navbruker.data,
        fnr,
    };
}

const NaermesteLedereContainer = connect(mapStateToProps, mapDispatchToProps)(NaermesteLedereSide);

export default NaermesteLedereContainer;
