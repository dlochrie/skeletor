/**
 * Perform Markdown Conversion on Selected Fields.
 * @param {Object} params Request parameters.
 * @param {Array.string} fields Parameters which will be converted.
 * @param {Function} done Callback function.
 */
exports.convert = function(params, fields, done) {
  var md = require('marked'),
      opts = {};

  function reformat(field) {
    if (params[field]) {
      md(params[field].toString().trim(), opts, function(err, out) {
        params[field] = (err) ? params.field : out;
        reformat(fields.shift());
      });
    } else {
      done(params);
    }
  }

  reformat(fields.shift());
};
