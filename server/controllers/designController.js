const Design = require('../models/Design');

exports.createDesign = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  try {
    const design = new Design({ title, description, imageUrl, user: req.user.id });
    await design.save();
    res.json(design);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ user: req.user.id }).populate('user', 'username email');
    res.json(designs);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
