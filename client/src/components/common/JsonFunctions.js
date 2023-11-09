/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/common/JsonFunctions.js
 * Descr:    Common JSON functions.  See http://techslides.com/how-to-parse-and-search-json-in-javascript.
 * Created:  2019-09-17
 * Author:   Brad Kaufman
 *
 * Modified: 2019-10-03
 * Changes:
 * Editor:   Brad Kaufman
 */

//return an array of objects according to key, value, or key and value matching
export function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));
    } else
    //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    if (i == key && obj[i] == val || i == key && val == '') { //
      objects.push(obj);
    } else if (obj[i] == val && key == ''){
      //only add if the object is not already in the array
      if (objects.lastIndexOf(obj) == -1){
        objects.push(obj);
      }
    }
  }
  return objects;
}

//return an array of values that match on a certain key
export function getValues(obj, key) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getValues(obj[i], key));
    } else if (i == key) {
      objects.push(obj[i]);
    }
  }
  return objects;
}

//return an array of keys that match on a certain value
export function getKeys(obj, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getKeys(obj[i], val));
    } else if (obj[i] == val) {
      objects.push(i);
    }
  }
  return objects;
}
