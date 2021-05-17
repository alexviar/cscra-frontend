export * from "./latLngExpressionToString"
export * from "./isMatch"

export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

export const toUnderscore = (key: string) => {
  return key.replace( /([A-Z])/g, "_$1").toLowerCase();
}

const isArray = function (a: any) {
  return Array.isArray(a);
};

const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
}

export const keysTransform = (o: any, transform: (key: string)=>string) => {
  if (isObject(o)) {
    const n:any = {};

    Object.keys(o)
      .forEach((k) => {
        n[transform(k)] = keysTransform(o[k], transform);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysTransform(i, transform);
    });
  }

  return o;
}

export const keysToCamel = function (o: any) {
  if (isObject(o)) {
    const n:any = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysToCamel(i);
    });
  }

  return o;
}

export const keysToUnderscore = function (o: any) {
  if (isObject(o)) {
    const n:any = {};

    Object.keys(o)
      .forEach((k) => {
        n[toUnderscore(k)] = keysToUnderscore(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return keysToUnderscore(i);
    });
  }

  return o;
}