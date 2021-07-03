import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useReducer } from 'react';

const Card = (props) =>{
  const [num, setNum] = useState ("..."); // avoid changing pros.value or props.faceup
  //const [disable, setDisable] = useState(props.faceup);
  
   const parentCallback = () =>{
     setNum(props.value);
     props.callback({value:props.value, id:props.id});
  
     setTimeout(()=> {setNum("...")}, 800); // first input must be a function 
  }
  return (
    <button className="gridItem" onClick = {parentCallback} disabled = {props.faceup}>  {props.faceup? props.value: num} </button>
  ) 
}

const Board = (props) =>{
  const [counter, setCounter] = useState(0);
  const [end, setEnd] = useState(false);
  const [moves, setMoves] = useState (0);
  const [cards, setCards]= useState(createCards(props.cardnums));
  const [pairs, setPairs] = useState([]);
  const [clickedCards, setClickedCards] = useState([])
 // const timer = setInterval(setTimer, 1000);      
  
 // if(end === true)clearInterval(timer,1000); 
  
//  function setTimer() {
//      setCounter(counter+1);
//  }
  
  useEffect(() => {
    const timer = window.setInterval(() => {
        setCounter((pre)=> pre + 1);
    }, 1000);
    if(end === true) window.clearInterval(timer);
    return () => window.clearInterval(timer);
  }, [end]);
  
  const handleCallback = (data)=> {
      if (clickedCards.length === 0) {
            setClickedCards((pre) => [...pre,data]);
         }
      else if(clickedCards.length === 1 ) {
         if(clickedCards[0].id === data.id) return
         if(clickedCards[0].value === data.value) {
              setPairs((prePairs)=> [...prePairs, data.value]);         
          } 
         setClickedCards([]); 
         setMoves((pre)=> pre+1);
       } 
    else{
        alert("error");
        }
  }

  useEffect(()=>{
   // setCards((preCards)=>preCards.map((card)=> ({value:card.value, faceup: pairs.includes(card.value)? true : false} ) ))
    setCards((preCards)=>preCards.map((card)=> ({
                                               ...card,
                                                faceup: pairs.includes(card.value) || clickedCards.includes(card) } ) ))
    if(pairs.length === cards.length) {
        setEnd(true);
    }
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
    time: {counter} seconds ---
    moves : {moves} moves  
      {pairs.length === cards.length ? <div> Congratulation! you win</div> : null}
      <div className= "gridContainer">
        {cards.map((card, index)=> (<Card id={index} value={card.value} faceup={card.faceup} callback = {handleCallback} /> )) }
        {cards.map((card, index)=> (<Card id={index+10} value={card.value} faceup={card.faceup} callback = {handleCallback} /> )) }
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
       {start? <div style={mystyle}>  <Board cardnums = {state.nums} /> <button style={mystyle} onClick = {()=> setStart(false)}> restart</button> </div>
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
