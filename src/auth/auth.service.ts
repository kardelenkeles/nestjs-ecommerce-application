import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadModel } from "./model/jwt-payload.model";
import { LoginDto } from "./dto/login.dto";
import { compare } from "bcrypt";
import { UserService } from "./user/user.service";
import { UserEntity } from "./user/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {
  }

  async validate(username: string, password: string): Promise<any> {

    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new HttpException(
        "User not found.",
        HttpStatus.BAD_REQUEST
      );
    }

    const isMatch = await compare(password, user.password);

    console.log('isMatch',password, user.password, isMatch);

    if (!isMatch) {
      throw new HttpException(
        "Geçersiz email veya şifre.",
        HttpStatus.UNAUTHORIZED
      );
    }

    return user;

  }

  createToken(user: UserEntity) {
    const payload: JwtPayloadModel = {
      userId: user.id
    };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto) {
    const username = loginDto.username;
    const password = loginDto.password;

    const user = await this.validate(username, password);
    const token = this.createToken(user);

    return {
      username: user.username,
      password: user.password,
      token: token
    };

  }

}
