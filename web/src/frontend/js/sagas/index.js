import ledereSagas from './ledereSagas';
import navbrukerSagas from './navbrukerSagas';
import veilederoppgaverSagas from './veilederoppgaverSagas';
import moterSagas from '../mote/sagas/moterSagas';
import epostinnholdSagas from '../mote/sagas/epostinnholdSagas';
import arbeidstakerSagas from '../mote/sagas/arbeidstakerSagas';
import tidslinjerSagas from './tidslinjerSagas';
import sykmeldingerSagas from './sykmeldingerSagas';
import oppfoelgingsdialogerSagas from './oppfoelgingsdialogerSagas';
import modiacontextSagas from './modiacontextSagas';
import arbeidsgiversSykmeldingerSagas from './arbeidsgiversSykmeldingerSagas';
import sykeforloepSagas from './sykeforloepSagas';
import sykepengesoknaderSagas from './sykepengesoknaderSagas';
import historikkSagas from './historikkSagas';
import behandlendeEnhetSagas from './behandlendeEnhetSagas';
import dokumentInfoSagas from './dokumentInfoSagas';
import virksomhetSagas from '../mote/sagas/virksomhetSagas';
import { ledeteksterSagas } from 'digisyfo-npm';

export default function * rootSaga() {
    yield [
        ledereSagas(),
        navbrukerSagas(),
        moterSagas(),
        ledeteksterSagas(),
        tidslinjerSagas(),
        epostinnholdSagas(),
        virksomhetSagas(),
        modiacontextSagas(),
        arbeidstakerSagas(),
        sykmeldingerSagas(),
        oppfoelgingsdialogerSagas(),
        sykepengesoknaderSagas(),
        arbeidsgiversSykmeldingerSagas(),
        sykeforloepSagas(),
        historikkSagas(),
        veilederoppgaverSagas(),
        behandlendeEnhetSagas(),
        dokumentInfoSagas(),
    ];
}
