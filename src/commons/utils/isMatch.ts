
//@ts-ignore
import { stripDiacritics } from 'react-bootstrap-typeahead/lib/utils'

export function isMatch(string: string, props: any) {
  var searchStr = props.text;
  var str = string;

  if (!props.caseSensitive) {
    searchStr = searchStr.toLowerCase();
    str = str.toLowerCase();
  }

  if (props.ignoreDiacritics) {
    searchStr = stripDiacritics(searchStr);
    str = stripDiacritics(str);
  }

  return str.indexOf(searchStr) !== -1;
}