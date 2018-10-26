/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import Speech from 'react-native-speech';
import Voice from 'react-native-voice';
import { Header } from 'react-native-elements'
import {
  Player,
  Recorder,
  MediaStates
} from 'react-native-audio-toolkit';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor(){
    super();
    this.state = {
      results: [],
      supportedVoices: [],
      disabled: false,
      rec: false
    }
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  onSpeechResults(e){
    console.log(e)
    this.setState({
      results:e.value
    })
  }

  speech(){
    Speech.speak({
      text:'こんにちは、元気ですか？',
      voice:'ja_JP'
    })
    Speech.supportedVoices()
    .then(locales => {
      console.log(locales); // ["ar-SA", "en-ZA", "nl-BE", "en-AU", "th-TH", ...]
      this.setState({
        supportedVoices: locales
      })
    });
  }

  onSpeechStart(){
    console.log('onSpeechStart')
    Voice.start('en_US');
    this.setState({
      rec: new Recorder("filename.mp4").record()
    })
  }

  onSpeechEnd(){
    console.log('onSpeechEnd')
    Voice.stop();
    setTimeout(() => {
      this.state.rec.stop((err) => {
        new Player("filename.mp4")
        .play()
        .on('ended', () => {});
      })
      console.log(this.state.rec);
    }, 300);
  }
  _renderScrollViewContent() {
    const data = Array.from({length: 3});
    return (
      <View style={styles.scrollViewContent}>
        {data.map((_, i) =>
          <View key={i} style={styles.row}>
            <Text>{i}</Text>
          </View>
        )}
      </View>
    );
  }

  render() {
    return (

      <View style={styles.fill}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <ScrollView
          style={styles.fill}
        >
          {this.state.results.map( (text,index) => {
            return(
              <Text key={index}>{text}</Text>
            )
          })}
          <Text>
          {this.state.supportedVoices.map( (text,index) => {
            return(
              text + ', '
            )
          })}
          </Text>
          <View style={styles.btn}>
            <TouchableOpacity onPress={() => this.speech()} style={styles.btnStyle}>
              <Text>Speak</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onSpeechStart()} style={styles.btnStyle}>
            <Text>Start the conversation</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onSpeechEnd()} style={styles.btnStyle}>
            <Text>End the conversation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  },
  title: {
    fontSize: 20,
  },
  ScrollView:{
    flex:1
  },
  Content:{
    flex:1,
    alignItems:'center',
    marginTop:30
  },
  btn:{
    justifyContent:'center',
    flex:1
  },
  btnStyle:{
    padding:10,
    backgroundColor:'#cecece',
    marginBottom:10
  },
  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
