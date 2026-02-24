const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../configs/system.js");

// [GET] /admin/products
module.exports.product = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  // console.log(filterStatus);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProducts,
  );

  objectPagination = await paginationHelper(
    objectPagination,
    req.query,
    countProducts,
  );
  // End Pagination

  const products = await Product.find(find)
    .sort({ position: -1 }, { createAt: -1 })
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công");

  const backUrl = req.get("Referrer");
  res.redirect(backUrl);
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const newStatus = req.body.status;
  const ids = req.body.ids.split(", ");

  switch (newStatus) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`,
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`,
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() },
      );
      req.flash("success", `Đã xoá ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for (item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Đã cập nhật vị trí của ${ids.length} sản phẩm`);
      break;
  }

  const backUrl = req.get("Referrer");
  res.redirect(backUrl);
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id }); // Xoá vĩnh viễn
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() },
  ); // Xoá mềm
  req.flash("success", `Đã xoá sản phẩm`);

  const backUrl = req.get("Referrer");
  res.redirect(backUrl);
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.thumbnail = `/uploads/${req.file.filename}`;

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
