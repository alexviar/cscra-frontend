import * as yup from 'yup'
import { yup as yupMessages } from './messages.json'
import moment from 'moment'

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

yup.addMethod(yup.date, 'format', function(format="L"){
  return this.transform((value, originalValue, context) => {
    // check to see if the previous transform already parsed the date
    if (context.isType(value)) return value;

    // the default coercion failed so let's try it with Moment.js instead
    value = moment(originalValue, format);

    // if it's valid return the date object, otherwise return an `InvalidDate`
    return value.isValid() ? value.toDate() : value;
  });
})