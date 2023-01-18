import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class DriveLinkPipePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    const Link = value.movieLink;
    const regex = /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view\?.*/;
    if (!regex.test(Link)) {
      throw new BadRequestException('This link is not public , please make sure to upload the correct file');
    }
    const parts = Link.split('/');
    const fileId = parts[5];
    value.movieLink=fileId;
    return value;
  }
}
