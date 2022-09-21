import { signOut } from "firebase/auth"
import { auth, db } from "./firebase"
import { useAuthValue } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { doc, setDoc } from "firebase/firestore"
const Profile = () => {
    const { currentUser } = useAuthValue()
    const navigate = useNavigate()
    useEffect(() => {
        console.log(currentUser)
    }, [currentUser])
    const [groupName, setGroupName] = useState('')
    const [error, setError] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        console.log("trying to create group...")
        const createGroup = async () => {
            try {
                await setDoc(doc(db, 'Groups', groupName))
            } catch(err) {
                setError(err)
            }
        }

    }
    return (
        (currentUser ? (
            <div>
                <h1>Username: {currentUser.email}</h1>
                <span onClick={() => {
                    signOut(auth)
                    navigate('/')
                }}>
                    Sign out
                </span>

                <div>
                    {(currentUser.role === 'teamlead' && !currentUser?.parent) && (
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
            </div>
        )
            : <h1>Please sign in</h1>)

    )
}

export default Profile