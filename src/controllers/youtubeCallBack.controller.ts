import {
  Controller,
  Get,
  Res,
  Req,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {YoutubeService} from "../services/youtube.service";
import { ConfigService } from '@nestjs/config';


@ApiTags('Youtube')
@Controller('/youtube')
export class YoutubeCallBackController {
  constructor(
      private youtubeService: YoutubeService,
      private configService: ConfigService
  ) {}
  @Get('/callback')
  @ApiOperation({ summary: 'Youtube' })
  @ApiOkResponse()
  async callback(@Query() data, @Res() res) {
    await this.youtubeService.callback(data);
    res.redirect(this.configService.get('REDIRECT_FE_LIST_ACCOUNT_YOUTUBE'));
  }
}