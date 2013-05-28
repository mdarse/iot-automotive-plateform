
/*
 * GET map page.
 */

exports.index = function(req, res) {
  res.render('map', {
      title: 'Carte des bornes'
    });
};