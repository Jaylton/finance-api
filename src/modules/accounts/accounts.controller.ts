// import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
// import { AccountsService } from './accounts.service';
// import { CreateAccountDto } from './dto/create-account.dto';
// import { UpdateAccountDto } from './dto/update-account.dto';
// import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

// @Controller('accounts')
// export class AccountsController {
//     constructor(private readonly accountsService: AccountsService) { }

//     @Post()
//     @UseGuards(JwtAuthGuard)
//     create(@Body() createAccountDto: CreateAccountDto) {
//         return this.accountsService.create(createAccountDto);
//     }

//     @Get()
//     @UseGuards(JwtAuthGuard)
//     findAll() {
//         return this.accountsService.findAll();
//     }

//     @Get(':id')
//     @UseGuards(JwtAuthGuard)
//     findOne(@Param('id', ParseIntPipe) id: number) {
//         return this.accountsService.findOne(id);
//     }

//     @Patch(':id')
//     @UseGuards(JwtAuthGuard)
//     update(
//         @Param('id', ParseIntPipe) id: number,
//         @Body() updateAccountDto: UpdateAccountDto,
//     ) {
//         return this.accountsService.update(id, updateAccountDto);
//     }

//     @Delete(':id')
//     @UseGuards(JwtAuthGuard)
//     remove(@Param('id', ParseIntPipe) id: number) {
//         return this.accountsService.remove(id);
//     }
// }
