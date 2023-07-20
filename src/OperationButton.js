import { ACTIONS } from "./App"

export default function OperationButton({dispatch, operation}){
    return(
        <button 
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: {operation}})}
        
        >

        {operation}
        </button>
    )
}   






// const handleClick = () => {
//     //|| operation === "sin" || operation === "cos" || operation === "tan"
//     if(operation === "√" || operation === "sin" || operation === "cos" || operation === "tan"){
//         dispatch({type: ACTIONS.CHOOSE_SPECIAL_OPERATION, payload:{operation} });
//     }else{
//         dispatch({type: ACTIONS.CHOOSE_OPERATION, payload:{operation} });
//     }
// }


// return(
// <button onClick={handleClick}>{operation}</button>
// )