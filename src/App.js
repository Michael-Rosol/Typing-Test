import React, {useEffect, useRef, useState} from 'react';
import './App.css';



const getCloud = () => 'I went over to the park to play a game of basketball with my friend and then go for a slice of pizza after'.split(' ')

function Word(props) {

  const {text, active, correct} = props

  

  if(correct === true) {
    return <span className="correct">{text} </span>
  }

  if(correct === false) {
    return <span className="incorrect">{text} </span>
  }

  if(active) {
    return <span className="active">{text} </span>
  }

  return <span className='prompt'>{text} </span>
}

Word = React.memo(Word) 

function Timer(props) { 


  const { correctWords, startCounting }  = props 
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let id 
    if(startCounting) {
      id = setInterval(() => {
        setTimeElapsed(oldTime => oldTime + 1) 

      }, 1000 ) 
    }
    return () => {
      clearInterval(id)
    }
  }, [props.startCounting])

  

  const minutes = timeElapsed/60

  const resetTimer = () => {
    setTimeElapsed(0)
  }

  return <div className='stats'>
     <p><b>Time:</b> {timeElapsed} </p>
    <p><b>Speed:</b> {((correctWords/minutes) || 0).toFixed(2)} WPM</p> 
    <button className='timerbutton' onClick={resetTimer}>Reset Timer</button>
  </div>
  
}


function App() {
  
  const [userInput, setUserInput] = useState(''); 

  const cloud = useRef(getCloud());

  const [startCounting, setStartCounting] = useState(false);

  const[activeWordIndex, setActiveWorldIndex] = useState(0);
  const[correctWordArray, setCorrectWordArray] = useState([]);
  


  function processInput(value) {
    
    
    

    if(activeWordIndex === cloud.current.length) {
      return 
    }

    if(!startCounting) {
      setStartCounting(true)
    }


    if(value.endsWith(' ')) {
      
      if(activeWordIndex === cloud.current.length - 1) {
        //end of the test
        setStartCounting(false)
        setUserInput('Completed')
        
      } else {
        setUserInput('')
      }


      setActiveWorldIndex(index => index + 1)
      

      
     
        //correct word 
        setCorrectWordArray(data => {
          const word = value.trim()
          const newResult = [...data]
          newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
          return newResult
        }) 

      

    } else {
      setUserInput(value)
    }
  }


  function resetTest() {
    setUserInput('');
    cloud.current = getCloud();
    setStartCounting(false);
    setActiveWorldIndex(0);
    setCorrectWordArray([]);
    
  }

  return (
    <div className="Main">
        <h1 className='name'>Le Typing Test</h1>
        
        <Timer 
          startCounting={startCounting}
          correctWords={correctWordArray.filter(Boolean).length}
        />

        <p>{cloud.current.map((word, index) => {

          return <Word 
            text={word} 
              active={index === activeWordIndex}
              correct={correctWordArray[index]}
            />
        })}</p>
        <input
            className='box'
            placeholder="Start typing..."
            type="text"
            value={userInput}
            onChange={(e) => processInput(e.target.value)}
        
        />
        <button className='resetbutton' onClick={resetTest}>Reset Test</button>
    </div>
  );
}

export default App;
