'use strict';

window.flatten = ( object, prefix = '' ) =>
  Object.keys( object ).reduce(
    ( prev, element ) =>
      object[ element ] &&
      typeof object[ element ] === 'object' &&
      !Array.isArray( object[ element ] ) ?
        { ...prev, ...flatten( object[ element ], `${prefix}${element}.` ) } :
        { ...prev, ...{ [ `${prefix}${element}` ]: object[ element ] } },
    {}
  );
