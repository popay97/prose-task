import { ActionTypes } from '../action-types';
import { topResponse } from '../../knownInterfaces';
import { AppDispatch} from '../store';
export const loadSentences = (body: topResponse) => {
    return (dispatch: AppDispatch) => {
        dispatch({
        type: ActionTypes.LOAD,
        payload: body,
        });
    };
}