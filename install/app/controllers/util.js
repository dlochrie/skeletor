/**
 * Expose `Util` Controller
 */
module.exports = Util;



/**
 * Utility Controller.
 *
 * TODO: Should this be a controller, or just a class???
 *
 * @constructor
 */
function Util() {}


/**
 * Converts markdown-formatted text into HTML using the 'marked' Node Module.
 * @param {string} text String to convert.
 * @return {string} Converted text.
 */
Util.convertMarkdown = function(text) {
  return require('marked')(text || '');
};


/**
 * Converts a string into a friendly url string.
 * @param {string} text The string to convert.
 * @return {string} The converted string.
 */
Util.convertToSlug = function(text) {
  return (text || '')
      .toString()
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
};


/**
 * Gets the current date.
 * @return {Date} New date object
 */
Util.getDate = function() {
  return new Date();
};


/**
 * Returns a trimmed version of the string.

 * TODO: See this link for some crazy awesome HTML sanitization:
 * https://code.google.com/p/google-caja/source/browse/trunk/src/com/
 * --> google/caja/plugin/html-sanitizer.js
 *
 * @param {string} resource The string to sanitize.
 * @return {string} The sanitized string.
 */
Util.sanitize = function(resource) {
  return resource ?
      resource.toString().trim() : '';
};
