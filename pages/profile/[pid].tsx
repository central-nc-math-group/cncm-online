import { useRouter } from 'next/router'
import { useState, useEffect} from 'react'
import { post } from '../../utils/restClient'
import Navbar from '../../components/Navbar/navbar'
import { Auth } from '../../utils/types'
import { useAuth } from '../../utils/firebase/auth'

export default function Profile() {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter()
  const { pid } = router.query
  const [rating, setRating] = useState(0)
  const [rank, setRank] = useState(0);
  const [contests, setContests] = useState(0);
  const [you, setYou] = useState(false);
  const image = { uri: "https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80"}

  const loadProfile = async () => {
    const problem = await post<string>(`userInfo`,{id:pid,uid:auth.uid});
    console.log()
    setRating(problem.value.rating)
    setContests(problem.value.contests)
    setRank(problem.value.rank)
    setYou(problem.value.you)
  }
  
  loadProfile()

  useEffect(() => {
    loadProfile();
  });

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
              src="https://images-ext-2.discordapp.net/external/HghzULInC7DHXaJb_fkA7XN9mNXoUllj_jZ9gNxvuqU/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/197445009685872650/435c28f5146e78b265fd76ee4faec368.png"
              className="relative z-20 rounded-full border-6 border-white w-40 h-40"
            />
            <div className="flex mt-5">
              <h3 className="font-body font-bold text-desaturatedBlue text-lg">
                {pid}
              </h3>
              <h3 className="font-body text-lg">{you ? "this is you" : "this is not you"}</h3>
            </div>
          </div>
          <hr className="w-full mt-6" />
          <div className="flex justify-around w-full py-6 px-6">
            <div className="flex w-20 flex-col items-center">
              <h5 className="font-body font-bold text-desaturatedBlue text-lg">{contests}</h5>
              <p className="font-body text-darkGray text-xs tracking-widest mt-1">
                Contests
              </p>
            </div>
            <div className="flex w-20 flex-col items-center">
              <h5 className="font-body font-bold text-desaturatedBlue text-lg">{rating}</h5>
              <p className="font-body text-darkGray text-xs tracking-widest mt-1">
                Rating
              </p>
            </div>
            <div className="flex w-20 flex-col items-center">
              <h5 className="font-body font-bold text-desaturatedBlue text-lg">{rank}</h5>
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