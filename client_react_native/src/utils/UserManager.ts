import AsyncStorage from '@react-native-async-storage/async-storage';

class UserManager {
    private static instance: UserManager;
    private currentUser: User | null = null;
    private readonly USER_KEY = 'current_user';

    private constructor() {}

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    // Lưu thông tin user
    public async setUser(user: User): Promise<void> {
        try {
            await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
            this.currentUser = user;
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    // Lấy thông tin user
    public async getUser(): Promise<User | null> {
        try {
            if (!this.currentUser) {
                const userString = await AsyncStorage.getItem(this.USER_KEY);
                if (userString) {
                    this.currentUser = JSON.parse(userString);
                }
            }
            return this.currentUser;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    // Xóa thông tin user (logout)
    public async removeUser(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.USER_KEY);
            this.currentUser = null;
        } catch (error) {
            console.error('Error removing user:', error);
            throw error;
        }
    }

    // Kiểm tra xem có user đang đăng nhập hay không
    public async hasUser(): Promise<boolean> {
        const user = await this.getUser();
        return user !== null;
    }
}

export default UserManager.getInstance();