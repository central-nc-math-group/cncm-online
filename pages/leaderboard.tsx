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
import { db, auth } from "../utils/firebase/firebaseAdmin";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import clientPromise from '../utils/mongo';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  try {
    const cookies = ctx.req.cookies
    if (cookies.token.length > 0) {
      const token = await auth.verifyIdToken(cookies.token);
          // the user is authenticated!
      const { uid, email } = token;
      const { pid } = ctx.query;
    }

    const client = await clientPromise;
    const db = client.db("Active");

    const data = await db
        .collection("Info")
        .findOne({})

    let response = [];

    let scorersTable = await db
        .collection("Scores")
        .find()
        .sort({totalScore: -1})
        .toArray()

    for (var i = 0; i < scorersTable.length; i++) {
        response.push([scorersTable[i].name, scorersTable[i].totalScore, scorersTable[i].scoreData[0].score, scorersTable[i].scoreData[1].score, scorersTable[i].scoreData[2].score, scorersTable[i].scoreData[3].score, scorersTable[i].scoreData[4].score, scorersTable[i].scoreData[5].score, scorersTable[i].scoreData[6].score]);
    }

    return {
      props: {data:response},
    }
    
  } catch (e) {
      return { props: {message: JSON.stringify(e, Object.getOwnPropertyNames(e))} };
  }

};

function Leaderboard(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {

  // useEffect(() => {
  //   fetch(`api/spam`).then(res => res.json()).then(json => console.log(json.val));
  // }, []);


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
      <Navbar num={2}/>


      <div className="flex w-auto items-center justify-center">
      <div className={"flex m-5 items-center justify-center shadow-md rounded w-5/6"}>

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
            {props.data.map((val, key) => {
              if (key % 2 == 0) {

                return (
                  <tr className={"bg-gray-100"}>
                    <td className="px-6 py-4">{key+1}</td>
                    {val.map((val2, key2) => {
                      if (key2 == 0) {
                        return (<th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><a href={"/profile/"+val2}>{val2}</a></th>)
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
                         return (<th scope="row" className="px-6 py-4 font-medium whitespace-nowrap"><a href={"/profile/"+val2}>{val2}</a></th>)
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
            </tbody>
        </table>        
      </div>
      </div>

    


    </>
  );
}

export default Leaderboard;