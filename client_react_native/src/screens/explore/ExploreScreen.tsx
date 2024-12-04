import React from 'react';
import { View, Text } from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {LocationFilterScreenNavigationProp} from "@/navigation/type";

const ExploreScreen = () => {
    const navigation = useNavigation<LocationFilterScreenNavigationProp>()
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg">Khám phá</Text>
        <View className="flex-1 justify-center items-center">
            <Text className="text-lg" onPress={() => navigation.navigate('LocationFilter')}>Location</Text>
        </View>
        <View className="flex-1 justify-center items-center">
            <Text className="text-lg" onPress={() => navigation.navigate('DateFilter')}>Location</Text>
        </View>
    </View>
  );
};

export default ExploreScreen;
