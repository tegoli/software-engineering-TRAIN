export class User {
    constructor(userId, name, surname, email, preferredLanguage) {
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.preferredLanguage = preferredLanguage;
    }
    changeLanguage(lang) { this.preferredLanguage = lang; }
}