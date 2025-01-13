import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../types';
import {
  changeUserData,
  createUser,
  dbCheckUserPassword,
  getUser,
} from '../../utils/db-utils';

interface DecodedToken {
  id: string;
  exp: number;
}

interface UserForDb {
  nickname: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly SECRET_KEY = 'your_secret_key';

  async register(data: UserForDb): Promise<string | null> {
    return createUser(JSON.stringify(data)).then((userId) => {
      const token = this.generateJWT(userId);

      if (!token) return null;

      return token;
    });
  }

  async login(email: string, password: string): Promise<string | null> {
    const userId = await dbCheckUserPassword(email, password);

    if (!userId) {
      return null;
    }

    const user = (await getUser(userId))[0];
    const token = this.generateJWT(user.id);

    return token;
  }

  async logout() {
    sessionStorage.removeItem('authToken');
  }

  async changeUserFields(
    id: string,
    dataToChange: {
      nickname?: string;
      email?: string;
      password?: string;
    }
  ) {
    changeUserData(id, dataToChange);
  }

  private generateJWT(id: string): string {
    const payload = {
      id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 1 hour
    };

    const base64Payload = btoa(JSON.stringify(payload));
    const base64Header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const signature = btoa(this.SECRET_KEY);

    return `${base64Header}.${base64Payload}.${signature}`;
  }

  verifyToken(token: string): boolean {
    const [header, payload, signature] = token.split('.');
    if (btoa(this.SECRET_KEY) !== signature) {
      return false;
    }

    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.exp > Date.now() / 1000;
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      const decodedToken: any = jwtDecode(token);

      return decodedToken;
    } catch (error) {
      console.error('Failed to decode token:', error);

      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      console.error('Token not found.');
      return null;
    }

    if (!this.verifyToken(token)) {
      console.error('Invalid token.');
      return null;
    }

    const decodedToken = this.decodeToken(token);

    if (!decodedToken) {
      console.error('Decoded token error.');
      return null;
    }

    const user = (await getUser(decodedToken.id))[0];

    return user;
  }
}
