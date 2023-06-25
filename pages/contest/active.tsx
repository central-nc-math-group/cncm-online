import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Component, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/navbar';
import Exercise from '../../components/Exercise/Exercise'
import ContestTile from '../../components/ContestTile/contestTile';
import styles from '../styles/Home.module.css'
import { useAuth } from '../../utils/firebase/auth'
import { Auth } from '../../utils/types';
import { getProblem } from '../../utils/firebase/dbHelpers';
import { post } from '../../utils/restClient';
import { toast } from "tailwind-toast";
import { useTimer } from 'react-timer-hook';
import clientPromise from "../../utils/mongo/index";
import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  try {
    const cookies = ctx.req.cookies

    if (cookies.token.length == 0) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props:{},
      };
    }

    const token = await auth.verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;
    const { pid } = ctx.query;

    const client = await clientPromise;
    const db = client.db("Active");
    const db2 = client.db("Users");

    const data = await db
        .collection("Info")
        .findOne({})

    let start = false;
    let end = false;

    let difference = +new Date(data.startTime) - +new Date();
    let difference2 = +new Date(data.endTime) - +new Date();

    if (difference < 0) {
        start = true;
    }

    if (difference2 < 0) {
      end = true;
    }

    let response = [];

    let scorersTable = await db
        .collection("Scores")
        .find()
        .sort({totalScore: -1})
        .toArray()

    for (var i = 0; i < scorersTable.length; i++) {
        if (scorersTable[i].id == uid) {
            response.push([i+1, scorersTable[i].name, scorersTable[i].totalScore, scorersTable[i].scoreData[0].score, scorersTable[i].scoreData[1].score, scorersTable[i].scoreData[2].score, scorersTable[i].scoreData[3].score, scorersTable[i].scoreData[4].score, scorersTable[i].scoreData[5].score, scorersTable[i].scoreData[6].score]);
        }
    }

      let user = await db2
        .collection("Accounts")
        .findOne({id: uid})

    if (response.length == 0) {
        response.push(['-', user.name, 0, 0, 0, 0, 0, 0, 0, 0])
    }

    return {
      props: {num: data.problems, startTime: data.startTime, round: data.round, endTime: data.endTime, token: cookies.token, start: start, end: end, data:response},
    }
    
  } catch (e) {
      return { props: {message: JSON.stringify(e, Object.getOwnPropertyNames(e))} };
  }

};

const calculateTimeLeft = (startTime) => {
  let year = new Date().getFullYear();
  // console.log(new Date().toISOString());
  let difference = +new Date(startTime) - +new Date();

  let timeLeft = {days: '00', hours: '00', minutes: '00', seconds: '00'};

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

export default function Contest2(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({days: '00', hours: '00', minutes: '00', seconds: '00'});
  const [contestStart, setContestStart] = useState(props.start);
  const [contestEnd, setContestEnd] = useState(props.end);

  const problems = [];

  const loadUserBoard = async () => {
    if (!!auth.uid) {
      const test2 = await post<object>(`userboard`,{uid:auth.uid});
    }
  }

  const timer = () => {
    if (contestStart) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(props.endTime));

        if (Object.keys(calculateTimeLeft(props.endTime)).length === 0) {
          setContestEnd(true)
        }
      }, 1000);
  
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(props.startTime));

        if (Object.keys(calculateTimeLeft(props.startTime)).length === 0) {
          setContestStart(true)
        }
        
      }, 1000);
      
        return () => clearTimeout(timer);
  
    }
  }

  timer();

  
  return (
    <>
      <Navbar num={1}/>

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

      <div id="contestTimer" className={!(contestStart && !contestEnd) ? "invisible w-0 h-0" : "min-w-screen flex items-center justify-center px-5 py-5"}>
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

      <div id="endScreen" className={!contestEnd ? "invisible w-0 h-0" : "min-w-screen flex items-center justify-center px-5 py-5"}>
          <div className="text-gray-500">
              <h1 className="text-3xl text-center mb-3 font-extralight">The contest has ended </h1>

          </div>
      </div>

      <div className="flex w-full items-center justify-center">
      <div className={"flex m-5 items-center justify-center shadow-md rounded w-3/4"}>
        <table className={"w-full rounded-md text-lg text-left text-gray-500"}>
        <thead>
        <tr className={"rounded-md text-xl text-white uppercase bg-green-500"}>
            <th scope="col" className="px-6 py-3">Rank</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Total</th>
                <th scope="col" className="px-6 py-3">P1</th>
                <th scope="col" className="px-6 py-3">P2</th>
                <th scope="col" className="px-6 py-3">P3</th>
                <th scope="col" className="px-6 py-3">P4</th>
                <th scope="col" className="px-6 py-3">P5</th>
                <th scope="col" className="px-6 py-3">P6</th>
                <th scope="col" className="px-6 py-3">P7</th>
            </tr>
        </thead>
      <tbody>
            {props.data && props.data.map((val, key) => {

                return (
                  <tr className={"bg-gray-100"}>
                    {val.map((val2, key2) => {
                      if (key2 == 1) {
                        return (<th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><a href={"/profile/"+val2}>{val2}</a></th>)
                      } else if (key2 == 2) {
                        return (<td className="px-6 py-4"><strong>{val2}</strong></td>)
                      } else {
                        return (<td className="px-6 py-4">{val2}</td>)
                      }

                    })}
                  </tr>
                )
            })}
            </tbody>
        </table>        
      </div>
      </div>
      <div className={(contestStart && !contestEnd) ? "mb-10 visible" : "mb-10 invisible"}>
        {[...Array(props.num)].map((x, i) =>
          <Exercise num={(i+1)} token={props.token}/>
        )}
      </div>

      <div>

      </div>



    </>
  );
}
