import { DateSchema, NumberSchema } from "yup";

declare module "yup" {
  interface NumberSchema {
    emptyStringToNull(): NumberSchema;
    emptyStringTo(val?: number | null): NumberSchema;
    nonEmpty(): StringSchema;
  }
  interface StringSchema {
    emptyStringToNull(): StringSchema;
    emptyStringTo(val?: string | null): StringSchema;
    nonEmpty(): StringSchema;
  }
  interface DateSchema {
    emptyStringTo(val?: Date | null): DateSchema;
    nonEmpty(): StringSchema;
    format(format?: string): DateSchema;
  }
}