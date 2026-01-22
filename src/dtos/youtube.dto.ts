import { ApiProperty } from '@nestjs/swagger';
import {BaseQueryReq, BaseResDto} from "../common/base.dto";
import {IsOptional, Max, Min, IsInt, IsEnum} from "class-validator";
import { Transform, Type } from 'class-transformer';
import {NUMBER_PAGE} from "../common/constant";
import {SORTBY} from "../common/base.enum";


export class YoutubeAccountContent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  name_channel: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  picture: string;

}

export class YoutubeAccountRes extends BaseResDto {
  @ApiProperty({ type: [YoutubeAccountContent] })
  data: YoutubeAccountContent[]
}

export class SearchVideoReq {
  @ApiProperty({ required: false })
  @IsOptional()
  text?: string;

  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  page_token?: string;
}

export class detailVideo {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}

export class updateVideo {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;

  @ApiProperty({ required: true, description: 'json: [{"lang":"vi","title":"vi","description":"vi"},{"lang":"en","title":"en","description":"en"},{"lang":"sq","title":"sq","description":"sq"}]' })
  @IsOptional()
  localizations: string;

  @ApiProperty({ required: true })
  @IsOptional()
  default_lang: string;

  @ApiProperty({ required: false })
  @IsOptional()
  exclude_title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  exclude_description: string;

  @ApiProperty({ required: true })
  @IsOptional()
  category_id: string;
}

export class getCaptions {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}

export class getDetailCaption {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  default_lang: string;

  @ApiProperty({ required: true })
  @IsOptional()
  original_lang: string;
}

export class translationCaption {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  lang: string;

  @ApiProperty({ required: true })
  @IsOptional()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  exclude_text: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  is_default_lang: boolean;
}

export class listAccount {
  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE : +params.value))
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false })
  @Transform((params) => (params.value === '' ? NUMBER_PAGE.PAGE_SIZE : +params.value))
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({ required: false, enum: SORTBY })
  @IsOptional()
  @IsEnum(SORTBY)
  sortBy?: SORTBY = SORTBY.asc;
}

export class refreshVideo {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;
}

export class getVideoPushHistory {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}

export class getLanguagesYoutube {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;
}

export class getCaptionPushHistory {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  youtube_account_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  video_id: string;
}