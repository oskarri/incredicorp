import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthValue } from "./AuthContext"
import { db } from "./firebase"

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
            setPosts(querySnapshotTwo.docs)
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
        <div>
            {currentUser && (
                <div>
                    {posts.map((post) => (
                        <div className="border-2 rounded">
                            <span>Daily post by: {post.data().author}</span>
                            <img src={`https://storage.googleapis.com/images-work-app/${post.data().src}`} alt='hmm'/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Posts