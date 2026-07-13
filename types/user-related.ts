export enum UserRole {
    Student = "student",
    Lecturer = "lecturer",
    Admin = "admin",
}

export interface UIUser {
    userId: number;
    email: string;
    name: string;
    role: UserRole;
    username: string;
    accountStatus: string;
}
export interface CookieUser {
  id: string,
  email: string,
  role: UserRole
}
