exports.convertToSlug = function(text) {
  return (text || '')
      .toString()
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
};
