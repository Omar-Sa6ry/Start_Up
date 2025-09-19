import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsOptional, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export function ValidateNationalId() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  );
}

export function NationalIdField(nullable: boolean = false): PropertyDecorator {
  return applyDecorators(
    Field(() => String, { nullable }),
    IsOptional(),
    Transform(({ value }) => value.replace(/\D/g, '')),
    Matches(/^\d{14}$/, {
      message: 'National ID must contain exactly 14 digits',
    }),
    Matches(/^[23]\d{13}$/, {
      message: 'National ID must start with 2 or 3',
    }),
    Length(14, 14, {
      message: 'National ID must be exactly 14 digits',
    }),
  );
}
