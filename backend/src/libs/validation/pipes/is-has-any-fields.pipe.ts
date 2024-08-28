import { ArgumentMetadata, PipeTransform, UnprocessableEntityException } from "@nestjs/common";

export class IsHasAnyFieldsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const filters = Object.values(value).filter((f) => f);
    if (!filters.length) {
      throw new UnprocessableEntityException("Set at least one field");
    }
    return value
  }
}