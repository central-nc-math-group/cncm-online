import { useRouter } from 'next/router'
import { useState, useEffect} from 'react'
import { post } from '../../utils/restClient'
import { siteURL } from '../../utils/constants'
import Navbar from '../../components/Navbar/navbar'
import { Auth } from '../../utils/types'
import { useAuth } from '../../utils/firebase/auth'
import { GetStaticProps } from 'next'
import nookies from 'nookies'
import { db, auth } from "../../utils/firebase/firebaseAdmin";
import { InferGetServerSidePropsType, GetServerSidePropsContext} from 'next';
import clientPromise from "../../utils/mongo/index";


// export async function getStaticProps() {
//   const auth: Auth = useAuth() as Auth;
//   const router = useRouter()
//   const { pid } = router.query
//   const data = await post<string>(`userInfo`,{id:pid,uid:auth.uid});

//   return {
//     props: { data }
//   }
// }

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

  try {
    const cookies = ctx.req.cookies
    let uid = 1;

    if (cookies.token.length > 0) {
      const token = await auth.verifyIdToken(cookies.token);
      const {x, y} = token;
      uid = x;
    }
    // the user is authenticated!

    const { pid } = ctx.query;

    const client = await clientPromise;
    const db = client.db("Users");

    const data = await db
        .collection("Accounts")
        .find({name: pid})
        .limit(1)
        .toArray();

    return {
      props: {pid: pid, rating: data[0].rating, contests: data[0].contests || null , rank: data[0].rank || null, you: data[0].id == uid},
    };
  } catch (e) {
      return { props: {message: JSON.stringify(e, Object.getOwnPropertyNames(e))} };
  }

};

export default function Profile(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {

  return (
    <>
    <Navbar/>
<div className="relative">

      <div className="mt-10 relative z-10 w-full h-full p-7 md:p-0 flex justify-center items-center">
        <div className="flex flex-col items-center w-96 bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative w-full">

          </div>
          <div className="flex flex-col items-center mt-5">
            <img
              alt="Victor"
              src="https://cdn.discordapp.com/avatars/197445009685872650/68e3fe1b85ab19c0b5999287c93e4e97.png?size=1024"
              className="relative z-20 rounded-full border-6 border-white w-40 h-40"
            />
            <div className="flex mt-5">
              <h3 className="font-body font-bold text-desaturatedBlue text-lg">
                {props.pid}
              </h3>
              <h3 className="font-body text-lg">{props.you ? "" : ""}</h3>
            </div>
          </div>
          <hr className="w-full mt-6" />
          <div className="flex justify-around w-full py-6 px-6">
            <div className="flex w-20 flex-col items-center">
              <h5 className="font-body font-bold text-desaturatedBlue text-lg">{props.contests}</h5>
              <p className="font-body text-darkGray text-xs tracking-widest mt-1">
                Contests
              </p>
            </div>
            <div className="flex w-20 flex-col items-center">
              <h5 className="font-body font-bold text-desaturatedBlue text-lg">{props.rating}</h5>
              <p className="font-body text-darkGray text-xs tracking-widest mt-1">
                Rating
              </p>
            </div>
            <div className="flex w-20 flex-col items-center">
              <h5 className="font-body font-bold text-desaturatedBlue text-lg">{props.rank}</h5>
              <p className="font-body text-darkGray text-xs tracking-widest mt-1">
                Rank
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}