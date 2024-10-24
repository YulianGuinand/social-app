import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUserData } from '../services/userService'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './Avatar'
import { getFilePath } from '../services/imageService'
import { fetchMessages } from '../services/messageService'
import moment from 'moment'

const Thread = ({item}) => {
  const [user2, setUser2] = useState([])
  const [messages, setMessages] = useState([])
  const [lastMessage, setLastMessage] = useState()
  
  const {user, setAuth} = useAuth();
  
  const getUsers = async () => {
    let res;
    if(user.id == item.user1_Id) {
      res = await getUserData(item.user2_Id);
    } else {
      res = await getUserData(item.user1_Id);
    }
    
    if(res.success) {
      setUser2(res.data)
    }
  }

  const getMessages = async () => {
    let res;
    if(user.id == item.user1_Id) {
      res = await fetchMessages(user.id, item.user2_Id);
    } else {
      res = await fetchMessages(user.id, item.user1_Id);
    }
    
    if(res.success) {
      setMessages(res.data)
      setLastMessage(res.data[0])
    }
  }

  useEffect(() => {
    getUsers();
    getMessages()
  }, [])


  const createdAt = moment(lastMessage?.created_at).fromNow()
  return (
    <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
      <View style={{width: '50%', flexDirection: 'row', alignItems: "center", gap: 15}}>
        <Avatar uri={user2?.image} size={45} />
        
        <View>
          <Text>{user2?.name}</Text>
          <Text>{lastMessage?.body}</Text>
        </View>
      </View>

      <View style={{width: "50%", alignItems: "flex-end"}}>
        <Text>{createdAt}</Text>
      </View>
    </View>
  )
}

export default Thread

const styles = StyleSheet.create({
  avatar: {

  }
})