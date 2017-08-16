import React, { PropTypes } from 'react';
import SoknaderTeaser from './SoknaderTeaser';
import { sykepengesoknad as sykepengesoknadPt } from '../../propTypes';

const SoknaderTeasere = ({ sykepengesoknader, fnr, className, tittel = '', tomListeTekst, id }) => {
    return (<div className="blokk--l">
        <header className="inngangspanelerHeader">
            <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
        </header>
        <div id={id} className={className || 'js-content'}>
            {
                (sykepengesoknader.length ? sykepengesoknader.map((soknad, idx) => {
                    return <SoknaderTeaser key={idx} sykepengesoknad={soknad} fnr={fnr} />;
                }) : <p className="panel typo-infotekst">{tomListeTekst}</p>)
            }
        </div>
    </div>);
};

SoknaderTeasere.propTypes = {
    sykepengesoknader: PropTypes.arrayOf(sykepengesoknadPt),
    className: PropTypes.string,
    fnr: PropTypes.string,
    tittel: PropTypes.string,
    tomListeTekst: PropTypes.string,
    id: PropTypes.string,
};

export default SoknaderTeasere;