import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    getLedetekst,
    TIDSLINJE_TYPER,
    keyValue,
} from '@navikt/digisyfo-npm';
import Radiofaner from '../components/Radiofaner';

const verdier = {};
verdier[TIDSLINJE_TYPER.MED_ARBEIDSGIVER] = 'med-arbeidsgiver';
verdier[TIDSLINJE_TYPER.UTEN_ARBEIDSGIVER] = 'uten-arbeidsgiver';

const arbeidssituasjoner = (ledetekster) => {
    return [{
        tittel: getLedetekst('tidslinje.filter.med-arbeidsgiver', ledetekster),
        verdi: TIDSLINJE_TYPER.MED_ARBEIDSGIVER,
    }, {
        tittel: getLedetekst('tidslinje.filter.uten-arbeidsgiver', ledetekster),
        verdi: TIDSLINJE_TYPER.UTEN_ARBEIDSGIVER,
        hjelpetekst: {
            tittel: getLedetekst('tidslinje.filter.med-arbeidsgiver.hjelpetekst.tittel', ledetekster),
            tekst: getLedetekst('tidslinje.filter.med-arbeidsgiver.hjelpetekst.tekst', ledetekster),
        },
    }];
};

export class VelgArbeidssituasjon extends Component {
    changeHandler(verdi) {
        this.props.endreUrl(`${this.props.rootUrl}/tidslinjen/${verdier[verdi]}`);
        this.props.hentTidslinjer(verdi);
    }
    render() {
        const { valgtArbeidssituasjon, ledetekster } = this.props;
        return (<Radiofaner
            alternativer={arbeidssituasjoner(ledetekster)}
            valgtAlternativ={valgtArbeidssituasjon}
            changeHandler={(v) => { this.changeHandler(v); }}
            radioName="tidslinje-arbeidssituasjon"
            className="blokk-xl"
        />);
    }
}

VelgArbeidssituasjon.propTypes = {
    ledetekster: keyValue,
    valgtArbeidssituasjon: PropTypes.string,
    hentTidslinjer: PropTypes.func,
    endreUrl: PropTypes.func,
    rootUrl: PropTypes.string,
};

export default VelgArbeidssituasjon;