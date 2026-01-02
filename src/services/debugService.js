import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'

export const getAllUsersFromCmUsersDev = async () => {
  try {
    const usersRef = collection(db, 'cm-users-dev')
    const querySnapshot = await getDocs(usersRef)
    
    const users = []
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() })
    })
    
    console.log('All users in cm-users-dev:', users)
    return users
  } catch (error) {
    console.error('Error fetching users from cm-users-dev:', error)
    return []
  }
}