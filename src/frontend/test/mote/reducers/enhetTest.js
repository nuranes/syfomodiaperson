import { expect } from 'chai';
import enhet from '../../../js/reducers/enhet';
import * as actions from '../../../js/actions/enhet_actions';
import deepFreeze from 'deep-freeze';

describe("enhet", () => {

    it("Har en default state", () => {
        const state = enhet();
        expect(state).to.deep.equal({
            valgtEnhet: '',
        })
    });

    it("Håndterer valgtEnhet()", () => {
        const action = actions.valgtEnhet('2212');
        const currentState = deepFreeze({})
        const state = enhet(currentState, action);
        expect(state).to.deep.equal({
            valgtEnhet: '2212',
        })
    });
});