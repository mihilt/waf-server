exports.upload = async (req, res, next) => {
  try {
    const { file } = req;
    const fileName = file.filename;

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    res
      .status(200)
      .json({ message: 'File uploaded', url: `/uploads/${year}/${month}/${fileName}` });
  } catch (err) {
    next(err);
  }
};
