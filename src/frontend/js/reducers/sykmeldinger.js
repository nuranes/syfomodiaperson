import { parseSykmelding } from 'digisyfo-npm';
import { HENT_SYKMELDINGER_FEILET, HENTER_SYKMELDINGER, SYKMELDINGER_HENTET, SYKMELDINGER_SORTERT } from '../actions/actiontyper';

const initiellState = {
    henter: false,
    hentingFeilet: false,
    hentet: false,
    data: [],
};

export default function sykmeldinger(state = initiellState, action = {}) {
    switch (action.type) {
        case HENT_SYKMELDINGER_FEILET: {
            return Object.assign({}, state, {
                data: [],
                henter: false,
                hentet: true,
                hentingFeilet: true,
            });
        }
        case HENTER_SYKMELDINGER: {
            return {
                data: [],
                henter: true,
                hentet: false,
                hentingFeilet: false,
            };
        }
        case SYKMELDINGER_HENTET: {
            return {
                henter: false,
                hentingFeilet: false,
                hentet: true,
                data: action.data.map(parseSykmelding),
            };
        }
        case SYKMELDINGER_SORTERT: {
            let sortering = {};
            sortering[action.status] = action.kriterium;
            sortering = {
                ...state.sortering,
                ...sortering,
            };
            return {
                ...state,
                sortering,
            };
        }
        default: {
            return state;
        }
    }
}