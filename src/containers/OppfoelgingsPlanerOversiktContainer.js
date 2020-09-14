import React, {
    useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
    connect,
    useDispatch,
} from 'react-redux';
import Side from '../sider/Side';
import * as oppdialogActions from '../actions/oppfoelgingsdialoger_actions';
import Feilmelding from '../components/Feilmelding';
import OppfoelgingsPlanerOversikt from '../components/oppfoelgingsdialoger/OppfoelgingsPlanerOversikt';
import AppSpinner from '../components/AppSpinner';
import IngenPlaner from '../components/oppfoelgingsdialoger/IngenPlaner';
import { OPPFOELGINGSPLANER } from '../enums/menypunkter';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';
import { activeOppfolgingsplaner } from '../utils/oppfolgingsplanerUtils';
import { harForsoktHentetOppfoelgingsdialoger } from '../utils/reducerUtils';

const texts = {
    errorTitle: 'Du har ikke tilgang til denne tjenesten',
};

const OppfoelgingsPlanerOversiktSide = (
    {
        aktiveDialoger,
        inaktiveDialoger,
        henter,
        hentingFeilet,
        tilgang,
        fnr,
    }
) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(oppdialogActions.hentOppfoelgingsdialoger(fnr));
    }, []);

    return (
        <Side fnr={fnr} tittel="Oppfølgingsplaner" aktivtMenypunkt={OPPFOELGINGSPLANER}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    }
                    if (!tilgang.harTilgang) {
                        return (<Feilmelding
                            tittel={texts.errorTitle}
                            melding={hentBegrunnelseTekst(tilgang.begrunnelse)}
                        />);
                    }
                    if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    if (aktiveDialoger.length === 0 && inaktiveDialoger.length === 0) {
                        return <IngenPlaner />;
                    }
                    return (
                        <OppfoelgingsPlanerOversikt
                            aktiveDialoger={aktiveDialoger}
                            inaktiveDialoger={inaktiveDialoger}
                            fnr={fnr}
                        />
                    );
                })()
            }
        </Side>
    );
};


OppfoelgingsPlanerOversiktSide.propTypes = {
    fnr: PropTypes.string,
    aktiveDialoger: PropTypes.array,
    inaktiveDialoger: PropTypes.array,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    tilgang: PropTypes.object,
};

export function mapStateToProps(state, ownProps) {
    const harForsoktHentetAlt = harForsoktHentetOppfoelgingsdialoger(state.oppfoelgingsdialoger);
    const henter = !harForsoktHentetAlt || state.tilgang.henter;
    const hentingFeilet = state.oppfoelgingsdialoger.hentingFeilet || state.tilgang.hentingFeilet;

    const oppfoelgingsdialoger = state.oppfoelgingsdialoger.data;

    const aktiveDialoger = activeOppfolgingsplaner(oppfoelgingsdialoger);
    const inaktiveDialoger = [];
    oppfoelgingsdialoger.forEach((dialog) => {
        if (!aktiveDialoger.includes(dialog)) {
            inaktiveDialoger.push(dialog);
        }
    });
    return {
        brukernavn: state.navbruker.data.navn,
        fnr: ownProps.params.fnr,
        henter,
        hentingFeilet,
        inaktiveDialoger,
        aktiveDialoger,
        tilgang: state.tilgang.data,
    };
}

const OppfoelgingsPlanerOversiktContainer = connect(mapStateToProps)(OppfoelgingsPlanerOversiktSide);
export default OppfoelgingsPlanerOversiktContainer;
