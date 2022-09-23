import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthValue } from "./AuthContext"
import { db } from "./firebase"
import Upload from "./UploadFile"

const Posts = () => {
    const [posts, setPosts] = useState([])
    const { currentUser } = useAuthValue()
    const navigate = useNavigate()


    useEffect(() => {
        if (currentUser) {
          console.log("email:", currentUser.data().email)
          const q = query(collection(db, "Users"), where("email", "==", currentUser.data().email));
          let userDB = null
          const getData = async () => {
            const querySnapshot = await getDocs(q);
            userDB = querySnapshot.docs[0]
            console.log(userDB.data())
            const qtwo = query(collection(db, "Posts"), where("visibility", "==", userDB.data().parent));
            const querySnapshotTwo = await getDocs(qtwo);
            const db_posts = querySnapshotTwo.docs
            const clean_db_posts = await Promise.all(db_posts.map(async (post) => {
              const dat = await getDoc(doc(db, "Users", post.data().author))
              console.log("whoop",dat.data())
              const hmm = {...post.data(), author: dat.data().name}
              console.log(hmm)
              return {...post.data(), author: dat.data().name}
            }))
            setPosts(clean_db_posts)
            querySnapshotTwo.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
            });
          }
          getData()
        }
      }, [currentUser])
      useEffect(() => {
        console.log(posts)
      }, [posts])

    return (
        <div className=" flex flex-col space-y-4">
            {(currentUser && posts) &&(
                <div>
                    <Upload/>
                    {posts.map((post) => (
                        <div className="border-2 rounded p-2 flex flex-col">
                            <span className="font-semibold text-lg">Daily post by: {post.author}</span>
                            <span className="text-sm">Posted on: {(new Date(post.uploadTime.seconds * 1000 )).toLocaleDateString('de-DE')}</span>
                            <img className='max-w-md' src={`https://storage.googleapis.com/work_images/${post.src}`} alt='hmm'/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Posts