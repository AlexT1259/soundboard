import { StatusBar } from 'expo-status-bar';
import {Button, Platform, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Audio} from "expo-av";
import {useEffect, useState} from "react";
import * as SQLite from "expo-sqlite"
import Item from "./Item";
import styles from './styles'

export default function App() {
  const [db, setDb] = useState(null)
  const [updateItems, forceUpdate] = useState(0)
  const [items, setItems] = useState([])
  const [permissionResponse, requestPermission] = Audio.usePermissions() // because consent
  const [recording, setRecording] = useState(null) // the sound recording object

  useEffect(()=>{
    let db = null
    if (Platform.OS === 'web'){
      db = {
        transaction: () => {
          return {
            executeSql: () => {},
          }
        }
      }
    }else {
      db = SQLite.openDatabase('haha.db')
    }

    setDb(db)

    db.transaction((tx)=>{
      tx.executeSql(
          "create table if not exists sounds (id integer primary key not null, uri text)"
      )})

    return () => db?db.close:undefined;

  },[])

  //RECORDING
  const startRecording = async () => {

    try {
      //make sure we have permission
      if (permissionResponse.status !== 'granted'){
        console.log("Request Permission")
        await requestPermission()
      }
      console.log("Permission is ", permissionResponse.status)

      //set device specific values
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      console.log("Starting...")
      const {recording} = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(recording)
      console.log("Recording...")

    } catch(error) {
      console.log("Error during startRecording(): ", error)
    }

  }

  const stopRecording = async () => {
    if(!recording){return}
    try{
      await recording.stopAndUnloadAsync() // actually stop

      const uri = recording.getURI()
      createRecord(uri)

      setRecording(undefined)

      console.log("Recording Stopped and Stored at: ", uri)
    } catch(error) {
      console.log("Error during stopRecording() ", error)
    }
  }

  //update when the database changes [db, updateItems]
  useEffect(() => {
    if (db) {
      db.transaction(
          (tx) => {
            tx.executeSql("select * from sounds", [], (_, {rows:{_array}}) => setItems(_array))
          }
      )
    }
  }, [db, updateItems]);

  const createRecord = (uri) => {

    db.transaction(
        (tx) => {
          tx.executeSql("insert into sounds (uri) values (?);", [uri])
          tx.executeSql("select * from sounds", [], (_, {rows}) => console.log(JSON.stringify(rows)));
        },
        () => {console.log("dead")},
        () => {console.log("done");forceUpdate(f=>f+1)}
    )
  }

  const delRecord = (id) => {

    db.transaction(
        (tx) => {
          tx.executeSql("delete from sounds where id = ?", [id])
          //tx.executeSql("select * from items", [], (_, {rows}) => console.log(JSON.stringify(rows)));
        },
        () => {console.log("dead")},
        () => {console.log("done");forceUpdate(f=>f+1)}
    )
  }

  const play=async (uri) => {
    console.log(uri)

    const {sound}=await Audio.Sound.createAsync(uri)

    try{
      await sound.playAsync()
    }catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    return recording ? recording.stopAndUnloadAsync() : undefined
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sound Board App</Text>
      <Text>Press a sound to play it back, or hold the record button at the bottom to record your own sound! Long press it to delete your recorded sound. </Text>

      {/*unfortunately, react native's "require" is not dynamic, I can not just put these uri in to database and let it
      Dynamically load all the sound files stored in the app. I have to lay it out like this manually*/}
      <ScrollView style={styles.listArea}>
        <Text style={styles.heading}>Included Sounds</Text>
        <Item key={1111} itemId={1111} itemText={"Sound 1"} onPress={() => {
          play(require("./assets/sounds/Sound1.m4a"))
        }}/>
        <Item key={2222} itemId={2222} itemText={"Sound 2"} onPress={() => {
          play(require("./assets/sounds/Sound2.m4a"))
        }}/>
        <Item key={3333} itemId={2222} itemText={"Sound 3"} onPress={() => {
          play(require("./assets/sounds/Sound3.m4a"))
        }}/>
        <Item key={4444} itemId={2222} itemText={"Sound 4"} onPress={() => {
          play(require("./assets/sounds/Sound4.m4a"))
        }}/>
        <Item key={5555} itemId={2222} itemText={"Sound 5"} onPress={() => {
          play(require("./assets/sounds/Sound5.m4a"))
        }}/>
        <Item key={6666} itemId={2222} itemText={"Sound 6"} onPress={() => {
          play(require("./assets/sounds/Sound6.m4a"))
        }}/>
        <Item key={7777} itemId={2222} itemText={"Sound 7"} onPress={() => {
          play(require("./assets/sounds/Sound7.m4a"))
        }}/>
        <Item key={8888} itemId={2222} itemText={"Sound 8"} onPress={() => {
          play(require("./assets/sounds/Sound8.m4a"))
        }}/>

        <Text style={styles.heading}>Recordings</Text>
        {items.map(
            ({id, uri}) => {
              return (
                  <Item key={id} itemId={id} itemText={"Recording: "+id} onPress={() => {
                    play({uri: uri})
                  }} onLongPress={()=>{delRecord(id)}}/>
              )
            }
        )}

      </ScrollView>
      <Pressable onPressIn={startRecording} onPressOut={stopRecording} ><Text style={styles.input}>{recording?"Release to Stop":"Hold to Record"}</Text></Pressable>
      <StatusBar style="auto" />
    </View>
  );
}
