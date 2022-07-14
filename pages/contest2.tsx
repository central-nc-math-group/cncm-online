import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Component, useEffect, useState } from 'react';
import Navbar from '../components/Navbar/navbar';
import Exercise from '../components/Exercise/Exercise'
import ContestTile from '../components/ContestTile/contestTile';
import styles from '../styles/Home.module.css'
import { useAuth } from '../utils/firebase/auth'
import { Auth } from '../utils/types';
import { getProblem } from '../utils/firebase/dbHelpers';
import { post } from '../utils/restClient';
import { toast } from "tailwind-toast";
import { useTimer } from 'react-timer-hook';

const calculateTimeLeft = (startTime) => {
  let year = new Date().getFullYear();
  // console.log(new Date().toISOString());
  let difference = +new Date(startTime) - +new Date();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: ("0" + Math.floor(difference / (1000 * 60 * 60 * 24))).slice(-2),
      hours: ("0" + Math.floor((difference / (1000 * 60 * 60)) % 24)).slice(-2),
      minutes: ("0" + Math.floor((difference / 1000 / 60) % 60)).slice(-2),
      seconds: ("0" + Math.floor((difference / 1000) % 60)).slice(-2),
    };
  }
  return timeLeft;
}

export default function Contest2() {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({});
  const [startTime, setStartTime]= useState("");
  const [endTime, setEndTime] = useState("");
  const [contestStart, setContestStart] = useState(false);
  const [probs, setProbs] = useState(0);
  const problems = [];

  useEffect(() => {
    // Update the document title using the browser API
    loadProblem();

    
    if (contestStart) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(endTime));
        console.log(Object.keys(calculateTimeLeft(endTime)).length === 0)
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(startTime));
        console.log(Object.keys(calculateTimeLeft(startTime)).length === 0)
        if (Object.keys(calculateTimeLeft(startTime)).length === 0) {
          setContestStart(true)
        }
        
      }, 1000);
      return () => clearTimeout(timer);
    }





  });





  const loadProblem = async () => {
    const test = await post<object>(`contestInfo`,{test:1});
    const response = await fetch("http://worldtimeapi.org/api/timezone/America/New_York");

 
    const jsonData = await response.json();
    setStartTime(test.value.startTime)
    setEndTime(test.value.endTime)
    setProbs(test.value.num)

 
    for (var i = 1; i <= probs; i++) {
      problems.push("q" + i)
    }




  };


  
  return (
    <>
      <Navbar/>

        <div id="startTimer" className={contestStart ? "invisible w-0 h-0" : "min-w-screen flex items-center justify-center px-5 py-5"}>
          <div className="text-gray-500">
              <h1 className="text-3xl text-center mb-3 font-extralight">The next CNCM Online round will start </h1>
              <div className="text-6xl text-center flex w-full items-center justify-center">
                  <div className="text-2xl mr-1 font-extralight">in</div>
                  <div className="w-24 mx-1 p-2 bg-green-500 text-white rounded-lg">
                      <div className="font-mono leading-none" x-text="days">{timeLeft.days}</div>
                      <div className="font-mono uppercase text-sm leading-none">Days</div>
                  </div>
                  <div className="w-24 mx-1 p-2 bg-green-500 text-white rounded-lg">
                      <div className="font-mono leading-none" x-text="hours">{timeLeft.hours}</div>
                      <div className="font-mono uppercase text-sm leading-none">Hours</div>
                  </div>
                  <div className="w-24 mx-1 p-2 bg-green-500 text-white rounded-lg">
                      <div className="font-mono leading-none" x-text="minutes">{timeLeft.minutes}</div>
                      <div className="font-mono uppercase text-sm leading-none">Minutes</div>
                  </div>
                  <div className="text-2xl mx-1 font-extralight">and</div>
                  <div className="w-24 mx-1 p-2 bg-green-500 text-white rounded-lg">
                      <div className="font-mono leading-none" x-text="seconds">{timeLeft.seconds}</div>
                      <div className="font-mono uppercase text-sm leading-none">Seconds</div>
                  </div>
              </div>
          </div>
      </div>

      <div id="contestTimer" className={!contestStart ? "invisible w-0 h-0" : "min-w-screen flex items-center justify-center px-5 py-5"}>
          <div className="text-gray-500">
              <h1 className="text-3xl text-center mb-3 font-extralight">The current round will end </h1>
              <div className="text-6xl text-center flex w-full items-center justify-center">
                  <div className="text-2xl mr-1 font-extralight">in</div>
                  <div className="w-24 mx-1 p-2 bg-green-500 text-white rounded-lg">
                      <div className="font-mono leading-none" x-text="minutes">{timeLeft.minutes}</div>
                      <div className="font-mono uppercase text-sm leading-none">Minutes</div>
                  </div>
                  <div className="text-2xl mx-1 font-extralight">and</div>
                  <div className="w-24 mx-1 p-2 bg-green-500 text-white rounded-lg">
                      <div className="font-mono leading-none" x-text="seconds">{timeLeft.seconds}</div>
                      <div className="font-mono uppercase text-sm leading-none">Seconds</div>
                  </div>
              </div>
          </div>
      </div>
      <div className={ contestStart ? "mb-10 visible" : "mb-10 invisible"}>
        {[...Array(probs)].map((x, i) =>
          <Exercise num={(i+1)} problem={"q"+(i+1)} />
        )}
      </div>

      <div>

      </div>



    </>
  );
}
