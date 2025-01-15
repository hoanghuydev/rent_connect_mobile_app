export class User {
    private _userId: string;
    private _fullName: string;
    private _email: string;
    private _phoneNumber: string;

    constructor(data: User) {
        this._userId = data.userId;
        this._email = data.email;
        this._fullName = data.fullName;
        this._phoneNumber = data.phoneNumber;
    }

    get userId(): string {
        return this._userId;
    }

    get email(): string {
        return this._email;
    }

    get fullName(): string {
        return this._fullName;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set email(value: string) {
        this._email = value;
    }

    set fullName(value: string) {
        this._fullName = value;
    }

    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }
}
