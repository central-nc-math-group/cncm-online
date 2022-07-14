import { useRouter } from 'next/router'
import { useState, useEffect} from 'react'
import { post } from '../../utils/restClient'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query
  const [rating, setRating] = useState(0)

  const loadProfile = async () => {
    const problem = await post<string>(`userInfo`,{id:pid});
    setRating(problem.value.rating)
  }
  
  loadProfile()

  useEffect(() => {
    loadProfile();
  });





  return <p>Post: {pid} Rating: {rating}</p>
}

export default Post