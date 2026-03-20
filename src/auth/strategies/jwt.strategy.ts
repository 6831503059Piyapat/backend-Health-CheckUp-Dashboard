import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MY_SECRET_KEY_123', // ในโปรเจกต์จริงควรใช้ ConfigService
    });
  }

  async validate(payload: any) {
    // ข้อมูลที่ return ตรงนี้จะไปโผล่ใน req.user ของ Controller
    return { userId: payload.sub, email: payload.email ,name:payload.name  };
  }
}