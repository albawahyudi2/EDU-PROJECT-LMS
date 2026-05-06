import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLUpload } from 'graphql-upload-ts';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { MediaModel, MediaType } from '../lessons/models/lesson.model';
import { Readable } from 'stream';

// Define FileUpload interface from graphql-upload
interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}

// Helper to convert FileUpload to Express.Multer.File
async function fileUploadToMulterFile(upload: FileUpload): Promise<Express.Multer.File> {
  const { createReadStream, filename, mimetype, encoding } = upload;
  
  const stream = createReadStream();
  const chunks: Buffer[] = [];
  
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  
  const buffer = Buffer.concat(chunks);
  
  return {
    fieldname: 'file',
    originalname: filename,
    encoding,
    mimetype,
    size: buffer.length,
    buffer,
    stream: createReadStream(),
    destination: '',
    filename: '',
    path: '',
  };
}

// Response type for pre-signed URL
@ObjectType()
class PresignedUploadUrl {
  @Field()
  uploadUrl: string;

  @Field()
  publicUrl: string;

  @Field()
  key: string;
}

@Resolver(() => MediaModel)
export class MediaResolver {
  constructor(private mediaService: MediaService) {}

  @Mutation(() => MediaModel)
  @UseGuards(GqlAuthGuard)
  async uploadMedia(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args('type', { type: () => MediaType }) type: MediaType,
    @Args('folder', { nullable: true }) folder: string,
    @CurrentUser() user: any,
  ) {
    const multerFile = await fileUploadToMulterFile(file);
    return this.mediaService.uploadMedia(multerFile, type, user.id, folder);
  }

  /**
   * Generate pre-signed URL for direct browser-to-R2 upload
   * Use this instead of uploadMedia when server-side upload fails
   */
  @Mutation(() => PresignedUploadUrl)
  @UseGuards(GqlAuthGuard)
  async getUploadPresignedUrl(
    @Args('filename') filename: string,
    @Args('contentType') contentType: string,
    @Args('type', { type: () => MediaType }) type: MediaType,
    @Args('folder', { nullable: true, defaultValue: 'uploads' }) folder: string,
    @CurrentUser() user: any,
  ) {
    return this.mediaService.getUploadPresignedUrl(filename, contentType, type, user.id, folder);
  }

  /**
   * After browser uploads directly to R2, call this to save to database
   */
  @Mutation(() => MediaModel)
  @UseGuards(GqlAuthGuard)
  async confirmMediaUpload(
    @Args('key') key: string,
    @Args('originalName') originalName: string,
    @Args('mimeType') mimeType: string,
    @Args('size', { type: () => Int }) size: number,
    @Args('type', { type: () => MediaType }) type: MediaType,
    @Args('publicUrl') publicUrl: string,
    @CurrentUser() user: any,
  ) {
    return this.mediaService.confirmUpload(key, originalName, mimeType, size, type, publicUrl, user.id);
  }

  @Query(() => [MediaModel])
  @UseGuards(GqlAuthGuard)
  async media(
    @Args('type', { type: () => MediaType, nullable: true }) type?: MediaType,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    return this.mediaService.getAllMedia(type, limit, offset);
  }

  @Query(() => MediaModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async mediaById(@Args('id') id: string) {
    return this.mediaService.getMediaById(id);
  }

  @Query(() => [MediaModel])
  @UseGuards(GqlAuthGuard)
  async myMedia(
    @Args('type', { type: () => MediaType, nullable: true }) type: MediaType,
    @CurrentUser() user: any,
  ) {
    return this.mediaService.getMediaByUser(user.id, type);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteMedia(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    const result = await this.mediaService.deleteMedia(id, user.id);
    return result.success;
  }
}
