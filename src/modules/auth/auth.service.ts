// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { User } from '@prisma/client';

// @Injectable()
// export class AuthService {

//     constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

//     async validateUser(email: string, password: string) {
//         const user = await this.prisma.user.findUnique({ where: { email } });

//         if (user && (await bcrypt.compare(password, user.password))) {
//             return await this.login(user);
//         }
//         throw new UnauthorizedException('Invalid credentials');
//     }

//     async login(user: User) {
//         return this.jwtService.signAsync({ sub: user.id, email: user.email });
//     }

// }
