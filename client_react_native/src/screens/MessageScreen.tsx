import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

const FirstRoute = ()=> (
  <View className='flex justify-center items-center'>
    <Text>View 1</Text>
  </View>
)
const SecondRoute = () => (
  <View className='flex justify-center items-center'>
    <Text>Tab 2 - Nội dung thứ hai</Text>
  </View>
);
const MessageScreen = () => {
  const layout = {width : Dimensions.get('window').width}
  const [index,setIndex] = useState(0);
  const [routes] = useState([
    {key : 'first',title : 'Tab 1'},
    {key : 'second',title : 'Tab 2'},

  ])
  return (
    <TabView
    navigationState={{index,routes}}
    renderScene={SceneMap({
      first: FirstRoute,
      second: SecondRoute,
    })}
    onIndexChange={setIndex}
    initialLayout={layout}
    renderTabBar={props => (
      <TabBar
        {...props}
        style={{ backgroundColor: 'black' }} 
      />
    )}
    >

    </TabView>
  );
};

export default MessageScreen;
