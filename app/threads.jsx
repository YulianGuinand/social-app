import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { useAuth } from '../contexts/AuthContext'
import { fetchThreads } from '../services/threadService'
import Thread from '../components/Thread'
import { wp } from '../helpers/common'

const threads = () => {
  const {user, setAuth} = useAuth();
  const [threads, setThreads] = useState([]);

  const getThreads = async () => {
    let res = await fetchThreads(user?.id);

    if(res.success) {
      setThreads(res.data);
    }
  }

  useEffect(() => {
    getThreads();
  }, [])
  return (
    <ScreenWrapper>
      
      <FlatList
          data={threads}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Thread item={item}/>
          )}
          onEndReached={() => {
            getThreads();
          }}
          onEndReachedThreshold={0}
          // ListFooterComponent={
          //   hasMore ? (
          //     <View style={{ marginVertical: threads.length == 0 ? 200 : 30 }}>
          //       <Loading />
          //     </View>
          //   ) : (
          //     <View style={{ marginVertical: threads.length == 0 ? 200 : 30 }}>
          //       <Text>No more posts</Text>
          //     </View>
          //   )
          // }
          // refreshing={refreshing}
          // onRefresh={handleRefresh}
        />
    </ScreenWrapper>
  )
}

export default threads

const styles = StyleSheet.create({
  listStyle: {
    paddingHorizontal: wp(6)
  }
})