function replaceProducts(products){
    var template = Handlebars.compile($('#product-items').html());
    var productsHtml=template({products});
    $('#product-page-section').html(productsHtml);
}

function replacePageHref(info){
    const pageControllerTemplate= Handlebars.compile($('#page-controller').html());
    const pageControllerHtml=pageControllerTemplate({info});
    $('ul.pagination-controller').html(pageControllerHtml);
}

function getPageAjax(query){
    const jsonquery=JSON.parse('{"' + decodeURI(query.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
    console.log(jsonquery);
    history.pushState(jsonquery,'','?'+query);
    $.getJSON('api/products/fetch-page?'+query, 
     function(data) {
         replaceProducts(data);
     });
    $.getJSON('api/products/get-page-info?'+query,
     function(data){
         replacePageHref(data);
     }
    );
}
function backButtonAjax(query){
        $.getJSON('api/products/fetch-page?'+query, 
        function(data) {
            replaceProducts(data);
        });
       $.getJSON('api/products/get-page-info?'+query,
        function(data){
            replacePageHref(data);
        }
       );
}
window.onpopstate = function (event) {
    if (history.state){
        const querystr=$.param(history.state);
        console.log(querystr);
        backButtonAjax(querystr);
    }
    else{
        history.go();
    }
 };

$("#search-form").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
    const search=$('.search-box').val();
    const category=$('.categories-dropdown').val();
    const orderby=$('.orderby-dropdown').val(); 
    const minprice=$('#minprice').val();
    const maxprice=$('#maxprice').val();
    const query='orderby='+orderby+'&search='+search+'&category='+'&minprice='+minprice+'&maxprice='+maxprice;
    $.ajax({
           type: "GET",
           data: query, // serializes the form's elements.
           success: function(data)
           {
            getPageAjax(query);
           }
         });    
});