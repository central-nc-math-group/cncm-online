import React, { Component, useState } from "react";
import 'katex/dist/katex.min.css'
import Latex from 'react-latex'
import { toast } from "tailwind-toast";

import styles from "./exercise.module.css";
import { post } from "../../utils/restClient";

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


  const [correct, setCorrect] = useState(0);
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  
  //const [ans, setAns] = useState(props.answer);
  const [prompt, setPrompt] = useState(props.prompt);

  const loadProblem = async () => {

    const id = props.problem;

    const problem = await post<string>(`getProblem`,{id:id});
    
    console.log(problem)
    // setAns(problem.answer);
    setPrompt(problem.value);

  };

  if (!!props.problem) {
    loadProblem()
  }

  // function checkCorrect() {
  //   if (value==ans) {
  //     setMsg("Correct!")
  //     setCorrect(1);
  //   } else {
  //     setMsg("Incorrect")
  //     setCorrect(0);
  //   }
  // }

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
      <div className={"w-3/4 mx-auto rounded overflow-hidden shadow-lg"}>

        <div className={"px-6 py-4"}>
          <div className={"font-bold text-2xl mb-2 object-center"}>Problem 1 <em>{msg}</em></div>
          <p className={"text-l text-gray-700 text-base"}>
            <Latex>{prompt}</Latex>
          </p>
        </div>

        <div className={"object-contain flex ml-5 mr-5"}>
          <input
            type="text"
            className={"form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"}
            id="exampleText0"
            placeholder="Enter answer here"
            onChange={event=>{
              setValue(event.target.value)
            }}
          />
        </div>

        <div className={"object-contain flex m-5 mt-2.5"}>
          <button  className={"bg-green-600 w-full hover:bg-green-800 text-white font-semibold py-2 px-4 border border-gray-400 rounded shadow"}>
            Submit
          </button>
        </div>
      </div>

    </>
  );
}
