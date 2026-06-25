import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole } from '@profiler-ai/shared';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.sub, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.remove(id, user.sub, user.role as UserRole);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.CREATED)
  like(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.like(id, user.sub);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.reviewsService.unlike(id, user.sub);
  }
}
