import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, IsObject, ValidateNested } from 'class-validator';

class UpdateFieldDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public value: any;
}

export class UpdateActionDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  public ids: Array<string | number>;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateFieldDto)
  public field: UpdateFieldDto;
}
