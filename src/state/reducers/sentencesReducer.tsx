import {topResponse,Action} from '../../knownInterfaces';

const INITIAL_STATE:topResponse = {
    result: [{
        category: '',
        sentences: ['']
    }]
}
function reducer (state:topResponse = INITIAL_STATE,action: Action){
    //add tokenizeSentences response
    if(action.type === 'loadSentneces'){
        return { result: [...state.result, ...action.payload.result]};
    }
    else{
        return state;
    }
}

export  {reducer, INITIAL_STATE};