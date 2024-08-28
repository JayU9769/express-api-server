import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsObject, ValidateNested } from 'class-validator';

class UpdateFieldDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public value: any;
}

export class UpdateActionDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  public ids: number[];

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateFieldDto)
  public field: UpdateFieldDto;
}
