import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { Component, useEffect } from 'react';
import Navbar from '../components/Navbar/navbar';
import ContestTile from '../components/ContestTile/contestTile';
import { toast } from "tailwind-toast";
import { useAuth } from '../utils/auth'
import { Auth } from '../utils/types';

function Contest() {
  const auth: Auth = useAuth() as Auth;
  const router = useRouter();

  // useEffect(() => {
  //   fetch(`api/spam`).then(res => res.json()).then(json => console.log(json.val));
  // }, []);
  
  return (
    <>
      <Navbar/>

      <div className={"grid justify-center gap-8 m-8 grid-cols-2"}>
        <div className={"h-screen border border-b border-gray-200 shadow"}>
            <div className={"w-full border-b border-gray-200 text-2xl"}>
                <p className={"ml-5"}>Problem</p>
            </div>
        </div>
        <div className={"flex-col space-y-8 mb-5"}>
            <div className={"border border-b border-gray-200 shadow"}>
                <div className={"w-full border-b border-gray-200 text-2xl"}>
                    <p className={"ml-5"}>Score</p>
                </div>
                    
                <table className={"table-auto text-2xl text-center w-full"}>
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
                    <tr>
                        <td>100</td>
                        <td>name1</td>
                        <td>-3500</td>
                        <td>-500</td>
                        <td>-500</td>
                        <td>-500</td>
                        <td>-500</td>
                        <td>-500</td>
                        <td>-500</td>
                        <td>-500</td>
                    </tr>
                </table>
            </div>
            <div className={"border border-b border-gray-200 shadow"}>
                <div className={"w-full border-b border-gray-200 text-2xl"}>
                    <p className={"ml-5"}>Submission</p>
                </div>
                <table className={"table-auto text-2xl text-center w-full"}>
                    <tr>
                        <td>1</td>
                        <td><input type="text" placeholder="Enter answer here"></input></td>
                        <td><button>Submit</button></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td><input type="text" placeholder="Enter answer here"></input></td>
                        <td><button>Submit</button></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td><input type="text" placeholder="Enter answer here"></input></td>
                        <td><button>Submit</button></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td><input type="text" placeholder="Enter answer here"></input></td>
                        <td><button>Submit</button></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td><input type="text" placeholder="Enter answer here"></input></td>
                        <td><button>Submit</button></td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td><input type="text" placeholder="Enter answer here"></input></td>
                        <td><button>Submit</button></td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td><input type="text" placeholder="Enter answer here"></input></td>
                        <td><button>Submit</button></td>
                    </tr>

                </table>
            </div> 
        </div>
      </div>
    </>
  );
}

export default Contest;