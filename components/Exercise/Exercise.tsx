import React, { Component, useState } from "react";
import 'katex/dist/katex.min.css'
import Latex from 'react-latex'


import styles from "./exercise.module.css";
import { post } from "../../utils/restClient";

import { Auth } from "../../utils/types";
import { useAuth } from "../../utils/firebase/auth";
import toast, { Toaster } from 'react-hot-toast'
/*
export default class Exercise extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const classes = useStyles();
    return (
      <>
        <div className={styles.exerciseContainer}>
            <div className={styles.header}>Exercise</div>
            {this.props.children}
        </div>
      </>
    );
  }
}
*/

export default function Exercise(props) {
  const auth: Auth = useAuth() as Auth;


  const [correct, setCorrect] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const [attempts, setAttempts] = useState(5);
  const [score, setScore] = useState(0);
  
  const [prompt, setPrompt] = useState(props.prompt);
  const [img, setImg] = useState(false)
  const [imgPath, setImgPath] = useState("")

  const loadProblem = async () => {

    const id = props.problem;

    const problem = await post<string>(`getProblem`,{id:id, uid: auth.uid});
    
    
    console.log(problem)
    // setAns(problem.answer);
    setPrompt(problem.value.prompt);
    setAttempts(problem.value.attempts);
    setScore(problem.value.score);
    setImg(problem.value.img)

    if (img) {
      setImgPath(problem.value.imgPath)
    }
    if (score > 0) {
      setCorrect(true);
      setDisabled(true);
    }

    if (attempts == 0) {
      setDisabled(true);
    }

  };

  if (!!props.problem) {
    loadProblem()
  }

  const checkCorrect = async() => { //snackbar only, this helper can hide the snackbar as one of the button functions
    /* Example */
    setValue("")
    if (attempts == 0) {
      toast.error('You have no attempts remaining', {
        duration: 4000,
        // Styling
        style: {
          backgroundColor: '#f2aaaa',
        },
        className: '',
        // Custom Icon
        // Change colors of success/error/loading icon
        // Aria
      });
    } else if (isNaN(value)) {
      toast.error('Your answer must be an integer!', {
        duration: 4000,
        // Styling
        style: {
          backgroundColor: '#f2aaaa',
        },
        className: '',
        // Custom Icon
        // Change colors of success/error/loading icon
        // Aria
      });
    } else {
      const data = await post<string>(`submitAnswer`,{id:props.problem, answer: value, uid: auth.uid});

      if (data.value == "Correct") {
        setCorrect(true)
        setDisabled(true)
        toast.success('Correct!', {
          duration: 4000,
          // Styling
          style: {
            backgroundColor: '#9ff092',
          },
          className: '',
          // Custom Icon
          // Change colors of success/error/loading icon
          // Aria
        });
      } else if (data.value == "Incorrect") {
        toast.error('Incorrect', {
          duration: 4000,
          // Styling
          style: {
            backgroundColor: '#f2aaaa',
          },
          className: '',
          // Custom Icon
          // Change colors of success/error/loading icon
          // Aria
        });
      } else if (data.value == "Error") {
        toast.error('Error', {
          duration: 4000,
          // Styling
          style: {
            backgroundColor: '#f2aaaa',
          },
          className: '',
          // Custom Icon
          // Change colors of success/error/loading icon
          // Aria
        });
      }
    }


  
  }

  return (
    <>

      {/* <div className={styles.exerciseContainer} id={ correct ? styles.correct : styles.neutral}>
        <div className={styles.header}>
          Exercise
        </div>

        <hr className={styles.underline}/>

        <em>{msg}</em>
        <div className={styles.prompt}>
          <span><Latex>{prompt}</Latex></span>
        </div>

        <div className={classes.row}>
          <div className={classes.search}>
            <InputBase
              placeholder="Enter your answer here"
              className={classes.searchInput}
              onChange={event=>{
                setValue(event.target.value)
              }}
            />
          </div>

          <div>
            <Button onClick={checkCorrect}>
              CHECK
            </Button>
          </div>
        </div>

      </div> */}
      <div className={"w-3/4 mx-auto rounded overflow-hidden border shadow-lg mt-5"}>

        <div className={"relative px-6 py-4 w-full"}>
          <div className={"relative object-center w-auto"}>
            <div className={"relative font-bold text-2xl mb-2 float-left"}>Problem {props.num}</div>
            <div className="absolute right-1">
              <div className="float-right rounded-full px-3 bg-green-100 text-green-600 font-medium text-lg">
                  <strong>Score:</strong> {score}
                </div>
              <div className="float-right rounded-full px-3 bg-blue-100 text-blue-600 font-medium text-lg mx-3">
                <strong>Attempts:</strong> {attempts}
              </div>
            </div>
 
          </div>
          <div className={"flex w-full"}>
            <p className={"text-l text-gray-700 text-base"}>
              <Latex>{prompt}</Latex>
            </p>
          </div>
          <div className={!img ? "w-0 h-0 invisible" : "flex w-full justify-center m-5"}>
            <img src={"../images/" + imgPath} width="25%"></img>
          </div>

        </div>

        <div className={"object-contain flex ml-5 mr-5"}>
          <input
            disabled={disabled}
            type="text"
            className={"form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white disabled:bg-gray-200 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"}
            placeholder="Enter answer here"
            value={value}
              onChange={event=>{
                setValue(event.target.value)
              }}
          />
        </div>

        <div className={"object-contain flex m-5 mt-2.5"}>
          <button onClick={checkCorrect} className={"bg-green-500 w-full hover:bg-green-700 text-white font-semibold py-2 px-4 border border-gray-400 rounded shadow"}>
            Submit
          </button>
        </div>
      </div>

    </>
  );
}
