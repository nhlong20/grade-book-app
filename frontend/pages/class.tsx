import { API } from '../environment'
import type { GetServerSideProps, NextPage } from "next";
import { getSession, useSession,signin, signout } from 'next-auth/client'


const Page: NextPage<{ data:any }> = ({ data }) => {
  const [session] = useSession()
console.log(session)
    console.log(data)
    return (
        <p>{data?.toString()}</p>
    );
};



export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx)
    console.log(session)
    if (session)
    return {props: session}

      return { redirect: { destination: '/404', permanent: false } }
  
  }

export default Page;
