import { signOut } from "firebase/auth"
import { auth, db } from "./firebase"
import { useAuthValue } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { isDisabled } from "@testing-library/user-event/dist/utils"
const Profile = () => {
    const { currentUser } = useAuthValue()
    const navigate = useNavigate()
    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])
    const [groupName, setGroupName] = useState('')
    const [memberName, setMemberName] = useState('')
    const [error, setError] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        setError('Loading...')
        console.log("trying to create group...")
        const createGroup = async () => {
            getDoc(doc(db, "Groups", groupName))
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    console.log("Group already exists")
                    setError("Group already exists, try a different name!")
                } else {
                    console.log("document does not exists, creating one now")
                    setDoc(doc(db, "Groups", groupName), {
                        name: groupName,
                        Members: [doc(db, "Users", currentUser.id)]
                    }).then(() => {
                        setDoc(doc(db, "Users", currentUser.id), {
                            parent: doc(db, "Groups", groupName)
                        }, {merge: true})
                    }).catch((err) => {
                        console.log(err)
                    })
                } 
            }).catch((err) => {
                console.log(err)
            })
        }
        createGroup()
    }

    const handleSubmitAdd = (e) => {
        e.preventDefault()
        console.log("getting user")
        const getUser = async () => {
            const q = query(collection(db, "Users"), where("email", "==", memberName))
            const querySnapshot = await getDocs(q)
            if(querySnapshot.size===1) {
                if(querySnapshot.docs[0].data().email === currentUser.data().email) {
                    setError("Cannot add yourself!")
                } else{
                    setError("Found it!")
                    if(querySnapshot.docs[0].data().parent) {
                        setError("User is already part of a team!")
                    } else {
                        console.log("got here")
                        setError("User is not part of a team!")
                        await updateDoc(doc(db, "Users", querySnapshot.docs[0].id), {
                            parent: currentUser.data().parent
                        })
                        setError("updated User")
                        await updateDoc(currentUser.data().parent, {
                            Members: arrayUnion(doc(db, "Users", querySnapshot.docs[0].id))
                        })
                        setError("Finished adding")
                    }
                }
                

            } else {
                setError("did not find User")
            }
        }
        getUser()
    }

    return (
        (currentUser ? (
            <div>
                <h1>Username: {currentUser.data().email}</h1>
                <span onClick={() => {
                    signOut(auth)
                    navigate('/')
                }}>
                    Sign out
                </span>

                <div>
                    {(currentUser.data().role === 'teamlead' && !currentUser?.data().parent) && (
                    <div>
                        <span>Create Group</span>
                        <form onSubmit={handleSubmit}>
                            <span>{error}</span>
                            <label>Please enter group name:</label>
                            <input placeholder={'Please enter name for Group'} value={groupName} onChange={e => setGroupName(e.target.value)} />
                            <button type='submit'>Create Group</button>
                        </form>
                    </div>
                    )}
                </div>
                <div>
                    {(currentUser.data().role === 'teamlead' && currentUser?.data().parent) && (
                        <div>
                            <span>Add Member to Group</span>
                            <form onSubmit={handleSubmitAdd}>
                                <span>{error}</span>
                                <label>Please enter team member email</label>
                                <input placeholder={'test@test.com'} value={memberName} onChange={e => setMemberName(e.target.value)}/>
                                <button type='submit'>Add Member</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        )
            : <h1>Please sign in</h1>)

    )
}

export default Profile