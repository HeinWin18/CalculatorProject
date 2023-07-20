import {useReducer} from "react"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import SpecialOperationButton from "./SpecialOperationButton";
import './App.css';


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CHOOSE_SPECIAL_OPERATION: 'choose-special-operation',
  CHOOSE_SYMBOL: 'choose-symbol',
  TOGGLE: 'toggle',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-Digit',
  EVALUATE: 'evaluate'
}

let switch_mode = false;
let isPi = false;

function reducer(state, {type, payload}){
  if(type != 'choose-symbol'){
    isPi = false;
  }

  switch(type){
    case ACTIONS.ADD_DIGIT: 
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      
      if(state.specialOperation != null){
        return state;
      }

      if(state.currentOperand != undefined){
      if(payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if(payload.digit === "." && state.currentOperand.includes(".")){
        return state;
      }
    }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION: 
      
      if(state.specialOperation != null){
        return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation, 
        specialOperation: null,
        currentOperand: null
        }
      }
      
      if(state.currentOperand == null && state.previousOperand == null){
        return state;
      }
      
      if(state.currentOperand == null){ 
        return{
          ...state,
          operation: payload.operation,
          specialOperation: null,
        }
      }

      if(state.previousOperand == null){ 
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          specialOperation: null,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        specialOperation: null,
        currentOperand: null
      }

    case ACTIONS.CHOOSE_SPECIAL_OPERATION:
    
    if(state.currentOperand == null){ 
      return{
        ...state,
        specialOperation: payload.specialOperation,
        operation: null,
      }
    }

    return{
      ...state,
      specialOperation: payload.specialOperation, 
      previousOperand: state.currentOperand,
      operation: null,
      currentOperand: null,
    };

    case ACTIONS.CHOOSE_SYMBOL:   
    return{
        ...state,
        overwrite: true,
        currentOperand: payload.symbol,
      };

    case ACTIONS.TOGGLE:
      console.log(state.switch_mode);
      return{
        ...state,
        switch_mode: !state.switch_mode,
      }

    case ACTIONS.CLEAR: 
      return {}
    
    case ACTIONS.DELETE_DIGIT: 
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      if(state.currentOperand == null){
        return state
      }

      if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    case ACTIONS.EVALUATE: 
      if(state.specialOperation == null && (state.operation == null ||  state.currentOperand == null || state.previousOperand == null)){
        return state;
      }
      
    return {
      ...state,
      overwrite: true,
      previousOperand: null,
      operation: null,
      specialOperation: null,
      currentOperand: evaluate(state),
    }

  }
}

function evaluate({currentOperand, previousOperand, operation, specialOperation}){ //add 
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)

  let computation = "";
  switch(operation){
    case "+":
      computation = prev + current;
      break;
    case "-" :
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break; 
    case "^":
      computation = Math.pow(prev, current); 
      break;
    case "(*10)^":
      computation = prev * (Math.pow(10, current));
      break;
  default: 
  switch(specialOperation){
    case "√":
      computation = Math.sqrt(prev);
      break;
      case "sin":
      computation =  switch_mode ?  Math.sin(prev) : (Math.sin(prev * 3.14/180));
      break;
    case "cos":
      computation = switch_mode ? Math.cos(prev) : (Math.cos(prev * 3.14/180));
      break;
    case "tan":
      computation = switch_mode ? Math.tan(prev)  : (Math.tan(prev * 3.14/180));
      break;
    case "log":
      computation = Math.log10(prev);
       break;
    case "ln":
      computation = Math.log(prev);
      break;
    default:
      break;
    }
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

//Function to format integer and decimal numbers
function formatOperand(operand) {
  if(operand == null) return 
  
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {
  const [{currentOperand, previousOperand, operation, specialOperation}, dispatch] = useReducer(reducer, {})

  return (
    
    <div className="calculator-grid">
      <div className = "output">
        <div className = "previous-operand">{specialOperation} {formatOperand(previousOperand)} {operation}</div>
        <div className = "current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className = "span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton className = "operationButton" operation="÷" dispatch={dispatch} />
      <OperationButton className = "operationButton" operation="*" dispatch={dispatch} />

      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />  
      
      <OperationButton className = "operationButton" operation="+" dispatch={dispatch} />
      <OperationButton className = "operationButton" operation="-" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />

      <OperationButton className = "operationButton" operation="^" dispatch={dispatch} />
      <SpecialOperationButton specialOperation = "√" dispatch={dispatch} />
     
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />

      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>   

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <OperationButton className = "operationButton" operation="(*10)^" dispatch={dispatch} />
      
      <button  
        onClick={() => 
                {dispatch({ type: ACTIONS.CHOOSE_SYMBOL, 
                payload: {symbol: `${(isPi) ? Math.E.toString() : Math.PI.toString()}`}
            })
            {isPi = !isPi}
        }}
        >
            π / e
        </button>

    <button 
        className= "switch_mode"
        onClick={() => 
          {dispatch({ type: ACTIONS.TOGGLE});
          {switch_mode = !switch_mode}
        }}
    >
      <span className = {`${switch_mode ? "" : "highlight1"}`}>
        DEG
      </span>
      /
      <span className = {`${switch_mode ? "highlight2" : ""}`}>
        RAD
      </span>

    </button>
      
      <SpecialOperationButton specialOperation = "sin" dispatch={dispatch} />
      <SpecialOperationButton specialOperation = "cos" dispatch={dispatch} />
      <SpecialOperationButton specialOperation = "tan" dispatch={dispatch} />
      <SpecialOperationButton specialOperation = "log" dispatch={dispatch} />
      <SpecialOperationButton specialOperation = "ln" dispatch={dispatch} />
  

    </div>
  );
}

export default App;