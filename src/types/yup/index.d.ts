import { DateSchema, NumberSchema } from "yup";

declare module "yup" {
  interface NumberSchema {
    emptyStringToNull(): NumberSchema;
    emptyStringTo(val?: number | null): NumberSchema;
  }
  interface StringSchema {
    emptyStringToNull(): StringSchema;
    emptyStringTo(val?: string | null): StringSchema;
  }
  interface DateSchema {
    emptyStringTo(val?: Date | null): DateSchema;
  }
}