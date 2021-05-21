import { DateSchema, NumberSchema } from "yup";

declare module "yup" {
    interface NumberSchema {
        emptyStringToNull(): NumberSchema;
        emptyStringTo(val?: number | null): NumberSchema;
    }
    interface DateSchema {
      emptyStringTo(val?: Date | null): DateSchema;
  }
}