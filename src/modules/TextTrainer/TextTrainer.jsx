import React, {useEffect, useRef, useState} from "react";

import ModalFinalText from "../../components/ModalFinalText.jsx";
import ModalStartText from "../../components/ModalStartText.jsx";
import TextInputItem from "./component/TextInputItem.jsx";

import App from './hooks/app.js';
import countError from "./hooks/countError.js";
const app = new App();


const TextTrainer = () => {

    const [counter, setCounter] = useState(0);
    const [span, setSpan] = useState([]);
    const [start, setStart] = useState(false);
    const [reset, setReset] = useState(false);

    const textInput = useRef();

    useEffect(() => {
        const elem = textInput.current;
        if(elem) {
            elem.focus();
            console.log('focus')
        }

    }, [start, reset])
    

    const createSpan = (e) => {
        e.preventDefault();

        if(e.key === 'Backspace' && counter > 0) {
     
            setSpan((prevSpan) => {
                return prevSpan.map((elem, index) => {
                    return (index === counter - 1) ? {...elem, status: 'none'} : elem;
                })
            });

            setCounter((prevCount) => prevCount - 1);
        }

        if ((!(e.key.length > 1) || e.key == 'Space') && span.length > counter) {

            setSpan((prevSpan) => {
                return prevSpan.map((elem, index) => {
                    
                    if(index === counter) {
                        if(e.key === elem.text) {
                            return {...elem, status: 'true'};
                        } else {
                            countError.counter();
                            return {...elem, status: 'false'};
                        }
                    }

                    return elem;
                });
            });

            setCounter((prevCount) => prevCount + 1);
        }
    }

    const getNewText = () => {
        countError.clear();
        app.start()
        setCounter(0);
        setSpan([...app.getArray()]);
    }

    const startTest = () => {
        countError.clear();
        setStart(true);
        app.start();
        
        (!reset) ? setSpan([...app.getArray()]) : setReset(false);
    }

    const resetText = () => {
        countError.clear();
        setStart(false);
        app.start();
        setCounter(0);
        setReset(true);
        setSpan([...app.resetArray()]);
    }

    return(
        <div className="text_input_container">
            {
                (!start) ? <ModalStartText start={startTest} textInput={textInput}/> : 

                    (span.length == counter) ? <ModalFinalText create={getNewText} reset={resetText} timer={app}/> :

                    <TextInputItem ref={textInput} createSpan={createSpan} resetText={resetText} span={span} newText={getNewText}/>
            }
        </div>
        
    )
};

export default TextTrainer;
