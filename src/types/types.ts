export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AccessToken {
    sub: string;
    email: string;
    iat: number;
    exp: number;
    type: 'access';
}

export interface UserDTO {
  id: string;
  email: string;
}


export interface RefreshToken {
    sub: string;
    iat: number;
    exp: number;
    type: 'refresh';
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserDTO;
}









