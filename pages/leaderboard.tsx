import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Component, useEffect } from 'react';
import Navbar from '../components/Navbar/navbar';
import ContestTile from '../components/ContestTile/contestTile';
import { toast } from "tailwind-toast";
import { useAuth } from '../utils/auth'
import { Auth } from '../utils/types';

function Leaderboard() {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter();

  // useEffect(() => {
  //   fetch(`api/spam`).then(res => res.json()).then(json => console.log(json.val));
  // }, []);

  var data = [["name1", 40,40,20,30,40,50,60], 
  ["name2", 40,40,20,30,40,50,70],
  ["name3", 40,40,30,30,40,50,70],
  ["name4", 40,40,50,30,40,50,70],
  ["name5", 40,40,60,30,40,50,70]]
  for (let index in data) {
    var total = 0
    for (let i=1; i < data[index].length; i++) {
      total += data[index][i]
    } 
    data[index].splice(1,0,total)
  }
  data.sort(function(a,b) {
    return b[1] - a[1]
  })
  
  return (
    <>
      <Navbar/>
      
      <div className={"w-full flex flex-col items-center"}>
        <table className={"table-auto border-b border-gray-200 shadow text-3xl text-center w-11/12"}>
            <tr className={"bg-darkGreen-100"}>
                <th className={""}>Rank</th>
                <th className={""}>Username</th>
                <th className={""}>Total</th>
                <th className={""}>P1</th>
                <th className={""}>P2</th>
                <th className={""}>P3</th>
                <th className={""}>P4</th>
                <th className={""}>P5</th>
                <th className={""}>P6</th>
                <th className={""}>P7</th>
            </tr>
            {data.map((val, key) => {
              if (key % 2 == 0) {
                return (
                  <tr className={"bg-gray-100"}>
                    <td>{key+1}</td>
                    {val.map((val2, key2) => {
                      return (<td>{val2}</td>)
                    })}
                  </tr>
                )
              } else {
                return (
                  <tr className={"even:bg-grey"}>
                    <td>{key+1}</td>
                    {val.map((val2, key2) => {
                      return (<td>{val2}</td>)
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