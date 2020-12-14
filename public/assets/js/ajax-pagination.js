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
    history.pushState({},'','?'+query);
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

$("#search-form").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.
    const search=$('.search-box').val();
    const category=$('.categories-dropdown').val(); 
    const query='search='+search+'&category='+category;
    $.ajax({
           type: "GET",
           data: query, // serializes the form's elements.
           success: function(data)
           {
            getPageAjax(query);
           }
         });    
});