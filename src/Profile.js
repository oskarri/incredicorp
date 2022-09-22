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
                            }, { merge: true })
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
            if (querySnapshot.size === 1) {
                if (querySnapshot.docs[0].data().email === currentUser.data().email) {
                    setError("Cannot add yourself!")
                } else {
                    setError("Found it!")
                    if (querySnapshot.docs[0].data().parent) {
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
                <div className="flex flex-row justify-between px-1 items-center">
                    <h1 className='text-3xl font-semibold' >{currentUser.data().name}</h1>
                    <span onClick={() => {
                        signOut(auth)
                        navigate('/')
                    }}
                        className='ml-1 inline-block px-3 ml-16 py-1 border-2 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                        Sign out
                    </span>
                </div>


                <div>
                    {(currentUser.data().role === 'teamlead' && !currentUser?.data().parent) && (
                        <div>
                            <span className="font-medium px-1">Teamlead </span>
                            <form onSubmit={handleSubmit} className="flex flex-col mt-8">
                                <label>To create a group enter the group name in the form below:</label>
                                <input placeholder={'Please enter name for Group'} value={groupName} className='shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' onChange={e => setGroupName(e.target.value)} />
                                <button type='submit' className=' ml-1 inline-block px-3 py-1 border-2 border-green-600 text-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>Create Group</button>
                                <span className="border-red-600 border-2 p-1 text-center text-xs py-1 rounded">{error}</span>
                            </form>
                        </div>
                    )}
                </div>
                <div>
                    {(currentUser.data().role === 'teamlead' && currentUser?.data().parent) && (
                        <div >
                            <span className="font-medium px-1">Teamlead </span>
                            <form onSubmit={handleSubmitAdd} className="flex flex-col mt-8">
                                <label>To add a team member add their e-mail in the form below:</label>
                                <input placeholder={'test@google.com'} value={memberName} className='shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' onChange={e => setMemberName(e.target.value)} />
                                <button type='submit' className=' ml-1 inline-block px-3 py-1 border-2 border-green-600 text-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>Add Member</button>
                                {error && <span className="border-red-600 border-2 mt-2 text-center text-xs py-1 rounded">{error}</span> }
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