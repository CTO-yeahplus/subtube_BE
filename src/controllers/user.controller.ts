import {
  Body,
  Controller,
  Get,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { AuthenUserGuard, AuthJwtUserGuard } from 'src/utils/guard';
import { ChangePasswordReq, UserReqUpdate, UserRes } from '../dtos/user.dto';
import { responseHelper } from 'src/utils';
import { SuccessResDto } from 'src/common/base.dto';

@ApiTags('User')
@Controller('/user')
@ApiBearerAuth()
@UseGuards(AuthJwtUserGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @Get('/detail')
  @ApiOperation({ summary: 'User detail' })
  @ApiOkResponse({ type: UserRes })
  async getUserDetail(@Request() req: { account: { user_id :number } }) {
    return responseHelper(await this.userService.findById(+req.account.user_id));
  }

  @Put('/update')
  @ApiOkResponse({ type: UserRes })
  @ApiOperation({ summary: 'User update' })
  async updateUser(
    @Request() req: { account: { user_id :number } },
    @Body() body: UserReqUpdate,
  ) {
    const user = await this.userService.findById(+req.account.user_id);
    return responseHelper( await this.userService.updateUser(user.id, body) );
  }

  @Put('/change-password')
  @ApiOperation({ summary: 'User change password' })
  @ApiOkResponse({ type: SuccessResDto })
  async changePassword(
    @Request() req: { account: { user_id :number } },
    @Body() body: ChangePasswordReq,
  ) {
    await this.userService.changePassword(
      req.account.user_id,
      body.currentPassword,
      body.newPassword,
    );
    return responseHelper( true );
  }
}
