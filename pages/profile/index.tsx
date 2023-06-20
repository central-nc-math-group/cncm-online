import { useRouter } from 'next/router';
import { useAuth } from '../../utils/firebase/auth'
import { Auth } from '../../utils/types';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { db, auth } from "../../utils/firebase/firebaseAdmin";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {

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
  const { name } = token;

  return {
    redirect: {
      permanent: false,
      destination: "/profile/" + name,
    },
    props:{},
  };
}

function RedirectPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
)  {


  return (
    <div>
        Redirecting...
    </div>
  );
}

export default RedirectPage