import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateLessonInput, UpdateLessonInput } from './dto/lesson.input';
import {
  LessonModel,
  LessonDetailModel,
  LessonResultModel,
} from './models/lesson.model';

@Resolver()
export class LessonsResolver {
  constructor(private readonly lessonsService: LessonsService) {}

  @Mutation(() => LessonModel, { description: 'Create a new lesson in module (Teacher only)' })
  @UseGuards(GqlAuthGuard)
  async createLesson(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateLessonInput,
  ): Promise<LessonModel> {
    return this.lessonsService.createLesson(input, user.id) as any;
  }

  @Mutation(() => LessonModel, { description: 'Update lesson (Teacher only)' })
  @UseGuards(GqlAuthGuard)
  async updateLesson(
    @CurrentUser() user: { id: string },
    @Args('input') input: UpdateLessonInput,
  ): Promise<LessonModel> {
    return this.lessonsService.updateLesson(input, user.id) as any;
  }

  @Mutation(() => LessonResultModel, { description: 'Delete lesson (Teacher only)' })
  @UseGuards(GqlAuthGuard)
  async deleteLesson(
    @CurrentUser() user: { id: string },
    @Args('lessonId') lessonId: string,
  ): Promise<LessonResultModel> {
    return this.lessonsService.deleteLesson(lessonId, user.id) as any;
  }

  @Mutation(() => LessonModel, { description: 'Toggle lesson draft/published (Teacher only)' })
  @UseGuards(GqlAuthGuard)
  async toggleLessonDraft(
    @CurrentUser() user: { id: string },
    @Args('lessonId') lessonId: string,
  ): Promise<LessonModel> {
    return this.lessonsService.toggleDraft(lessonId, user.id) as any;
  }

  @Mutation(() => LessonDetailModel, { description: 'Attach uploaded media file to lesson (Teacher only)' })
  @UseGuards(GqlAuthGuard)
  async addMediaToLesson(
    @CurrentUser() user: { id: string },
    @Args('lessonId') lessonId: string,
    @Args('mediaId') mediaId: string,
  ): Promise<LessonDetailModel> {
    return this.lessonsService.addMediaToLesson(lessonId, mediaId, user.id) as any;
  }

  @Mutation(() => LessonDetailModel, { description: 'Detach media file from lesson (Teacher only)' })
  @UseGuards(GqlAuthGuard)
  async removeMediaFromLesson(
    @CurrentUser() user: { id: string },
    @Args('lessonId') lessonId: string,
    @Args('mediaId') mediaId: string,
  ): Promise<LessonDetailModel> {
    return this.lessonsService.removeMediaFromLesson(lessonId, mediaId, user.id) as any;
  }

  @Query(() => [LessonModel], { description: 'Get lessons for a module' })
  @UseGuards(GqlAuthGuard)
  async lessons(
    @CurrentUser() user: { id: string },
    @Args('moduleId') moduleId: string,
  ): Promise<LessonModel[]> {
    return this.lessonsService.getLessonsByModule(moduleId, user.id) as any;
  }

  @Query(() => LessonDetailModel, { description: 'Get lesson detail with media (teacher)' })
  @UseGuards(GqlAuthGuard)
  async lessonDetail(
    @CurrentUser() user: { id: string },
    @Args('lessonId') lessonId: string,
  ): Promise<LessonDetailModel> {
    return this.lessonsService.getLessonDetail(lessonId, user.id) as any;
  }

  @Query(() => LessonDetailModel, { description: 'Get lesson detail with media (student/parent view)' })
  @UseGuards(GqlAuthGuard)
  async lessonDetailStudent(
    @Args('lessonId') lessonId: string,
  ): Promise<LessonDetailModel> {
    return this.lessonsService.getLessonDetailForStudent(lessonId) as any;
  }
}
