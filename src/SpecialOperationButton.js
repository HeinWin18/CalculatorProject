import { ACTIONS } from "./App"

export default function SpecialOperationButton({dispatch, specialOperation}){
    return(
        <button 
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_SPECIAL_OPERATION, payload: {specialOperation}})}
        
        >
            {specialOperation}
        </button>
    )
}  