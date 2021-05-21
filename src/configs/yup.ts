import * as yup from 'yup';
import { yup as yupMessages } from './messages.json'

yup.setLocale(yupMessages)

yup.addMethod(yup.mixed, 'emptyStringToNull', function () {
  return this.transform(function (value, originalValue) {
    if (this.isType(value)) return value;

    return originalValue === "" ? null : value;
  });
});

yup.addMethod(yup.mixed, 'emptyStringTo', function (val) {
  return this.transform(function (value, originalValue) {
    if (this.isType(value)) return value;

    return originalValue === "" ? val : value;
  });
});