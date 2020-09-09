import * as React from 'react';
import {
    SyntheticEvent,
    useEffect,
    useState,
} from 'react';
import ModalWrapper from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';
import {
    Systemtittel,
    Feilmelding,
} from 'nav-frontend-typografi';
import {
    Checkbox,
    CheckboxGruppe,
} from 'nav-frontend-skjema';
import styled from 'styled-components';
import {
    Arbeidsgiver,
    StoppAutomatikk,
    VirksomhetNr,
} from '../../types/FlaggPerson';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import {
    useSelector,
    useDispatch,
} from 'react-redux';
import { endreStatus } from '../../actions/flaggperson_actions';
import { FlaggpersonState } from '../../reducers/flaggperson';

const texts = {
    tittel: 'Stopp automatisk utbetaling av sykepenger',
    arbeidsgiver: 'Velg arbeidsgiver',
    stansSykepenger: 'Stans sykepenger',
    avbryt: 'Avbryt',
    submitError: 'Du må velge minst én arbeidsgiver',
    serverError: 'Det er ikke mulig å stoppe automatisk utbetaling av sykepenger akkurat nå. Prøv igjen senere.'
};

interface IPengestoppModal {
    brukernavn: String,
    isOpen: boolean,
    arbeidsgivere: Arbeidsgiver[],

    toggle(): void
}

const Modal = styled(ModalWrapper)`
    padding: 2em 2.5em;
    max-width: 50em;
    width: 100%;
`;

const Group = styled.div`
    margin: 1rem 0;
`;

const BottomGroup = styled.div`
    margin-top: 1em;
`;

const PengestoppModal = ({ brukernavn, isOpen, arbeidsgivere, toggle }: IPengestoppModal) => {
    const enhet = useSelector((state: any) => state.enhet);
    const flaggperson: FlaggpersonState = useSelector((state: any) => state.flaggperson);

    const dispatch = useDispatch();

    const [stopped, setStopped] = useState(false);
    const [selected, setSelected] = useState<VirksomhetNr[]>([]);
    const [submitError, setSubmitError] = useState<boolean>(false);
    const [serverError, setServerError] = useState<boolean>(false);

    const fnr = window.location.pathname.split('/')[2];
    const [stoppAutomatikk, setStoppAutomatikk] = useState<StoppAutomatikk>({
        sykmeldtFnr: { value: fnr },
        virksomhetNr: [],
        enhetNr: { value: enhet.valgtEnhet },
    });

    useEffect(() => {
        setStoppAutomatikk({ ...stoppAutomatikk, virksomhetNr: selected });
    }, [selected]);

    useEffect(() => {
        if (flaggperson.endret && !flaggperson.endrer && !flaggperson.endringFeilet) {
            setStopped(true);
        } else if (!flaggperson.endret && !flaggperson.endrer && flaggperson.endringFeilet) {
            setServerError(true);
        }
    }, [flaggperson]);

    const handleStoppAutomatikkButtonPress = () => {
        if (stoppAutomatikk.virksomhetNr.length <= 0) {
            setSubmitError(true);
        } else {
            dispatch(endreStatus(stoppAutomatikk));
        }
    }

    const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
        const orgnr: VirksomhetNr = { value: (event.target as HTMLInputElement).name };
        const { checked } = (event.target as HTMLInputElement);

        if (checked) {
            setSubmitError(false);
            setSelected([
                ...selected,
                orgnr,
            ]);
        } else {
            const filtered = selected.filter((virksomhetNr: VirksomhetNr) => {
                return virksomhetNr.value !== orgnr.value;
            });
            setSelected(filtered);
        }
    };

    const handleCloseModal = () => {
        setSelected([]);
        toggle();
    }

    return (
        <Modal
            // @ts-ignore
            ariaHideApp={false}
            contentLabel={texts.stansSykepenger}
            isOpen={isOpen}
            closeButton={true}
            onRequestClose={handleCloseModal}
        >
            <Systemtittel>{texts.tittel}</Systemtittel>

            {!stopped
                ? <>
                    <Group>
                        <CheckboxGruppe legend={texts.arbeidsgiver} feil={submitError && texts.submitError}>
                            {
                                arbeidsgivere.map((arbeidsgiver: Arbeidsgiver, index: number) => {
                                    return (<Checkbox
                                        key={index}
                                        label={arbeidsgiver.navn}
                                        onChange={handleChange}
                                        name={arbeidsgiver.orgnummer}
                                    />);
                                })
                            }
                        </CheckboxGruppe>
                    </Group>
                    <Knapp type="flat" onClick={handleCloseModal}>{texts.avbryt}</Knapp>
                    <Knapp type="fare" spinner={flaggperson.endrer} disabled={flaggperson.endrer} onClick={handleStoppAutomatikkButtonPress}>{texts.stansSykepenger}</Knapp>

                </>
                : <>
                    <Group>
                        <AlertStripeInfo>{`Sykepengene til ${brukernavn} er stanset. Du kan lage en oppgave i Gosys nå for stans av sykepenger. Det er også mulig å gjøre dette senere`}</AlertStripeInfo>
                    </Group>
                    <Knapp type="flat" onClick={toggle}>{texts.avbryt}</Knapp>
                </>
            }
            {serverError && <BottomGroup><Feilmelding>{texts.serverError}</Feilmelding></BottomGroup>}
        </Modal>

    );
};

export default PengestoppModal;