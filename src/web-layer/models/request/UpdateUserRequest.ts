import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  public phone: string;

  @IsString()
  @IsOptional()
  public newPhone?: string;

  @IsString()
  @IsOptional()
  public pass?: string;

  @IsString()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public dob?: string;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsOptional()
  public district?: string;

  @IsString()
  @IsOptional()
  public state?: string;

  @IsString()
  @IsOptional()
  public country?: string;
}
