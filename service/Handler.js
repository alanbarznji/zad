const asyncHandler = require("express-async-handler");
const ApiError = require("../Utility/ErroreApi");
const ApiFeatures = require("../Utility/apifeatcher");
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log('====================================');
    console.log(req.params);
    console.log('====================================');
    const document = await Model.findOneAndDelete({_id:id});
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
  });
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    console.log('sarchopy');
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    document.save()
    res.status(200).json({ data: document });
  });
exports.createOne = (Model) =>
asyncHandler(async (req, res,next) => {
    const newDoc = await Model.create(req.body);
    if(!newDoc){
      return next(new ApiError("کێشەیەک ڕویدا چیکی امترنێت بکەوە",400))
    }
    res.status(201).json({ data: newDoc });
  });
exports.getOne = (Model,ModelReference='') =>
  asyncHandler(async (req, res, next) => {
    console.log(Date.now());
    const { id } = req.params;
    let query = await Model.findById(id);
    if(ModelReference!==""){

query = query.populate(ModelReference);
    }
    const document=await query
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  }); 
exports.getAll = (Model, modelName = '') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      console.log(req.filterObj);
      filter = req.filterObj;
    }

    // Build query
    
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search()
      .fields()
      .sort();

    // Execute query
    const { mongooseDb, paginationResult } = apiFeatures;
    const documents = await mongooseDb;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });