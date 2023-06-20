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
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import clientPromise from "../utils/mongo/index";
import { db, auth } from "../utils/firebase/firebaseAdmin";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  try {
    const cookies = ctx.req.cookies
    const token = await auth.verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;
    const { pid } = ctx.query;

    const client = await clientPromise;
    const db = client.db("Users");

    const ratingList = await db
        .collection("Accounts")
        .find({})
        .sort({rating: -1})
        .limit(10)
        .toArray();

    let data = [];

    for (var i = 0; i < ratingList.length; i++) {
      data.push([ratingList[i].name, ratingList[i].rating])
    }
    return {
      props: {data: data},
    };
  } catch (e) {
      return { props: {message: JSON.stringify(e, Object.getOwnPropertyNames(e))} };
  }

};

function HOF(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter();

  return (
    <>
      <Navbar/>

      <div className="flex w-auto items-center justify-center">
      <div className={"flex m-5 items-center justify-center shadow-md rounded w-5/6"}>
        <table className={"w-full rounded-md text-lg text-left text-gray-500"}>
          <tbody>
            <tr className={"rounded-md text-xl text-white uppercase bg-green-500"}>
            <th scope="col" className="px-6 py-3">Rank</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Rating</th>
            </tr>
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

export default HOF;