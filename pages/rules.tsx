import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Component, useEffect, useState } from 'react';
import Navbar from '../components/Navbar/navbar';
import ContestTile from '../components/ContestTile/contestTile';
import { toast } from "tailwind-toast";
import { useAuth } from '../utils/firebase/auth'
import { Auth } from '../utils/types';
import { post } from '../utils/restClient';

function Rules() {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter();

  // useEffect(() => {
  //   fetch(`api/spam`).then(res => res.json()).then(json => console.log(json.val));
  // }, []);
  
  const [data, setData] = useState([]);


  useEffect(() => {
    loadProblem();
  });

  const loadProblem = async () => {

    const test = await post<object>(`leaderboard`,{id:1});
    setData(test.value);
  };
  // for (let index in data) {
  //   var total = 0
  //   for (let i=1; i < data[index].length; i++) {
  //     total += data[index][i]
  //   } 
  //   data[index].splice(1,0,total)
  // }
  // data.sort(function(a,b) {
  //   return b[1] - a[1];
  // })
  
  return (
    <>
      <Navbar/>

      <div className="flexbox w-3/4 mx-auto mt-5">
        <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-green-600 m-1/4">Rules</h1>
        <div className="w-full rounded border shadow-lg mt-5">
            <div className="m-5 overflow-hidden text-lg">
                <ul className="list-disc">
                <li className=""><b>Contest</b></li>
                    <ul className="ml-8 list-disc"> 
                    <li>CNCM Online is a recurring 7 problem 60 minute online short answer contest</li>
                    <li>The competition is individual and speed-based, so scores for each problem will depend on its time of submission and number of attempts</li>
                    <li>Problem difficulty ranges from AMC to olympiad level</li>
                    <li>The only resources allowed are writing utensils, paper, a compass, and a ruler</li>
                    <li>We reserve the right to disqualify any competitor suspected of cheating from the contest</li>
                    </ul>
                </ul>
            </div>
        </div>
        <div className="w-full rounded border shadow-lg mt-5">
            <div className="m-5 overflow-hidden text-lg">
                <ul>
                <li><b>Scoring</b></li>
                    <ul className="ml-8 list-disc">
                    <li>Each answer is an integer</li>
                    <li>Submissions will be graded live, and a live leaderboard will organize all of the scores in decreasing order</li>
                    <li>5 incorrect attempts on the same problem will disallow you from submitting an answer for the said problem for the rest of the contest</li>
                    <li>The official scoring formula is as follows: <b>[points] = [baseScore] x (1 - [timeTaken] / 120)</b></li>
                        <ul className="ml-12 list-disc">
                            <li>There is a 100 point deduction for each incorrect attempt even if the question is not eventually answered correctly</li>
                            <li>Base score values can be found in the table below and may vary between each contest</li>
                            <li>[timeTaken] is measured in minutes and is rounded down</li>
                        </ul>
                    </ul>
                    </ul>
            </div>
            </div>

            <div className="w-full rounded border shadow-lg mt-5 rounded-md">
            <div className="m-5 overflow-hidden text-lg rounded-md">
            <strong>Point Values</strong>
            <table className="w-full rounded-md text-sm text-left text-gray-500">
                <thead className="rounded-md text-xs text-white uppercase bg-green-500">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Problem Number
                        </th>
                        <th scope="col" className="px-6 py-3">
                            P1
                        </th>
                        <th scope="col" className="px-6 py-3">
                            P2
                        </th>
                        <th scope="col" className="px-6 py-3">
                            P3
                        </th>
                        <th scope="col" className="px-6 py-3">
                            P4
                        </th>
                        <th scope="col" className="px-6 py-3">
                            P5
                        </th>
                        <th scope="col" className="px-6 py-3">
                            P6
                        </th>
                        <th scope="col" className="px-6 py-3">
                            P7
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            Base Score
                        </th>
                        <td className="px-6 py-4">
                            1500
                        </td>
                        <td className="px-6 py-4">
                            1800
                        </td>
                        <td className="px-6 py-4">
                            2100
                        </td>
                        <td className="px-6 py-4">
                            2400
                        </td>
                        <td className="px-6 py-4">
                            2700
                        </td>
                        <td className="px-6 py-4">
                            3000
                        </td>
                        <td className="px-6 py-4">
                            4000
                        </td>
                    </tr>
                </tbody>
            </table>

            </div>
        </div>
      </div>
 

    


    </>
  );
}

export default Rules;