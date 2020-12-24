const productModelAPI = require('../../models/productModel');
const queryString = require('query-string');

exports.fetchData=async(req,res,next)=>{
    //filter
    const filter={};
    filter.search=req.query.search || "";
    filter.category=req.query.category || "";
    //paginate
    const nPage=parseInt(req.query.page) || 1;
    res.json(await productModelAPI.getPage(filter,nPage));
}
exports.getPageInfo=async(req,res,next)=>{
        //filter
        const filter={};
        filter.search=req.query.search || "";
        filter.category=req.query.category || "";
        //paginate
        const nPage=parseInt(req.query.page) || 1;
        const info=await productModelAPI.pageInfo(filter,nPage);
        const nextQuery={...req.query,page:info.nextPage};
        const previousQuery={...req.query,page:info.previousPage};
        const totalQuery={...req.query,page:info.totalPage};
        const currentQuery={...req.query};
        const firstQuery={...req.query,page:1};
        info.nextPageQuery=queryString.stringify(nextQuery);
        info.totalPageQuery=queryString.stringify(totalQuery);
        info.previousPageQuery=queryString.stringify(previousQuery);
        info.currentPageQuery=queryString.stringify(currentQuery);
        info.firstPageQuery=queryString.stringify(firstQuery);
        info.currentPage=nPage;
        res.json(info);
}