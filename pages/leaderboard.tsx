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

function Leaderboard() {
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


      
      <div className={"flex m-5 items-center justify-center shadow-md rounded w-full"}>
        <table className={"w-5/6 rounded-md text-lg text-left text-gray-500"}>
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
            {data.map((val, key) => {
              if (key % 2 == 0) {

                return (
                  <tr className={"bg-gray-100"}>
                    <td className="px-6 py-4">{key+1}</td>
                    {val.map((val2, key2) => {
                      if (key2 == 0) {
                        return (<th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{val2}</th>)
                      } else if (key2 == 1) {
                        return (<td className="px-6 py-4"><strong>{val2}</strong></td>)
                      } else {
                        return (<td className="px-6 py-4">{val2}</td>)
                      }

                    })}
                  </tr>
                )
              } else {
                return (
                  <tr className={"even:bg-grey"}>
                    <td className="px-6 py-4">{key+1}</td>
                    {val.map((val2, key2) => {
                      if (key2 == 0) {
                         return (<th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{val2}</th>)
                      } else if (key2 == 1) {
                        return (<td className="px-6 py-4"><strong>{val2}</strong></td>)
                      } else {
                        return (<td className="px-6 py-4">{val2}</td>)
                      }
                    })}
                  </tr>
                )
              }
            })}
        </table>        
      </div>

    


    </>
  );
}

export default Leaderboard;