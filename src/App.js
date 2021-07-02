import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useReducer } from 'react';

const Card = (props) =>{
  const [num, setNum] = useState ("..."); // avoid changing pros.value or props.faceup
  const [disable, setDisable] = useState(props.faceup);
  
  const parentCallback = () =>{
     setDisable(true);
     setNum(props.value);
     props.callback(props.value);
     setTimeout(()=> {setNum("...")}, 500); // first input must be a function 
  }
  return (
    <button className="gridItem" onClick = {parentCallback} disabled = {disable}>  {props.faceup? props.value: num}  </button>
  ) 
}

const Board = (props) =>{
  const [cards, setCards]= useState(createCards(props.cardnums));
  const [pairs, setPairs] = useState([]);
  const [clickedCards, setClickedCards] = useState([])
  const handleCallback = (num)=>{
    setClickedCards((pre)=>  [...pre, num])
    if(clickedCards.length === 1 ) {
      if(clickedCards[0]===num) {
       setPairs((prePairs)=> [...prePairs, num]); 
      }
       setClickedCards([]);
    } 
    console.log(clickedCards);
    console.log(pairs)
  }

  useEffect(()=>{
   // setCards((preCards)=>preCards.map((card)=> ({value:card.value, faceup: pairs.includes(card.value)? true : false} ) ))
    setCards((preCards)=>preCards.map((card)=> ({
                                               ...card,
                                                faceup: pairs.includes(card.value) } ) ))
  },[pairs, clickedCards])

 function createCards(nums){ 
      var cardlist=[];
      for (var i=0; i<nums.length; i++) {
           var card = {value:nums[i], faceup: false };
           cardlist.push(card)
      }
      return cardlist
    }

  return(
    <div>
      <div className= "gridContainer">
        {cards.map((card)=> (<Card value={card.value} faceup={card.faceup} callback = {handleCallback} /> )) }
        {cards.map((card)=> (<Card value={card.value} faceup={card.faceup} callback = {handleCallback} /> )) }
      </div>
    </div>
  )
}
const Game = () =>{
  const [start, setStart] = useState(false);

  const initialState = {nums: [1,2,3]};
  const reducer = (state, action) => {
     switch(action.type) {
      case 'add': 
         return { nums: [...state.nums,Math.max(...state.nums)+1] };
      case 'reduce' : 
         return {nums:state.nums.filter((num)=> num!==Math.max(...state.nums) )};
      default:
        return state.nums   
     }

  }
  const [state, dispatch] = useReducer (reducer, initialState)
 
  const mystyle={
    padding:"20px", 
    fontSize: "30px" 
  }
  return (
    <div className="App">
      <div style={mystyle} >
         current cards:  {state.nums} 
      </div>
      <div style={mystyle}>      
        <button style={mystyle} disabled={start || state.nums.length>=9} onClick={()=> dispatch({type: 'add'})}>Add cards</button> 
      </div>
      <div style={mystyle}> 
        <button style={mystyle} disabled={start || state.nums.length<=1} onClick={()=> dispatch({type: 'reduce'})}>Reduce cards</button> 
      </div>
       {start? <div style={mystyle}> <Board cardnums = {state.nums} /> <button style={mystyle} onClick = {()=> setStart(false)}> restart</button> </div>
              : <button style={mystyle} onClick={()=> setStart(true)}> start </button> } 
     
    </div>
  );
}
function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;