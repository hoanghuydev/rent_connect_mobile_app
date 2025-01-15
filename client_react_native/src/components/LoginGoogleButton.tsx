import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {authApi} from "@/api/authApi";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/navigation/type";
WebBrowser.maybeCompleteAuthSession();
const LoginGoogleButton = () =>{
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [userInfo,setUserInfo] = useState();
    const [request,response,promptAsync] = Google.useAuthRequest({
        androidClientId : "618438047417-54hspv61180alsmvkv82ill1qmar52lk.apps.googleusercontent.com",
        iosClientId : "618438047417-23brjhm9368ea4ue6q21evn83k7smh0i.apps.googleusercontent.com",
        webClientId : "618438047417-6o3fuja17c8flrk4dtrjrn0pec4lsqka.apps.googleusercontent.com"
    })
    const handleLogin = async () => {
        if (response?.type === "success") {
            try {
                const accessToken = response.authentication?.accessToken;
                console.log("Access Token:", accessToken);

                const apiResponse = await authApi.oAuth2Google(accessToken);

                if (apiResponse.success) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Main" }],
                    });
                } else {
                    alert("API Error:", apiResponse.message);
                }
            } catch (error) {
                alert("Login error:", error);
            }
        } else {
            alert("Google sign-in was not successful or was canceled.");
        }
    };

    useEffect(() => {
        if (response) {
            handleLogin();
        }
    }, [response]);
    const softGrayColor = '#E0E0E0';

        return (<TouchableOpacity
            className="p-3 rounded-full border"
            style={{ borderColor: softGrayColor }}
            onPress={promptAsync}
        >
            <Icon name="google" size={24} color="black" />
        </TouchableOpacity>)
    }
    export default LoginGoogleButton;