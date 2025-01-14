import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenManager {
    private static instance: TokenManager;
    private currentToken: string | null = null;
    private readonly TOKEN_KEY = 'user_token';

    private constructor() {}

    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    // Lưu token
    public async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(this.TOKEN_KEY, token);
            this.currentToken = token;
        } catch (error) {
            console.error('Error saving token:', error);
            throw error;
        }
    }

    // Lấy token
    public async getToken(): Promise<string | null> {
        try {
            if (!this.currentToken) {
                this.currentToken = await AsyncStorage.getItem(this.TOKEN_KEY);
            }
            return this.currentToken;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    }

    // Xóa token (logout)
    public async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.TOKEN_KEY);
            this.currentToken = null;
        } catch (error) {
            console.error('Error removing token:', error);
            throw error;
        }
    }

    // Kiểm tra xem có token hay không
    public async hasToken(): Promise<boolean> {
        const token = await this.getToken();
        return token !== null;
    }
}
export default TokenManager.getInstance();