import { IsString, IsEnum, IsOptional, Length } from "class-validator";
import { TaskStatus } from "../models/Task";

export class CreateTaskInput {
  @IsString()
  @Length(1, 100)
  title!: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  assignedToId?: string;
}

export class UpdateTaskInput {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  title?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  assignedToId?: string;
}
