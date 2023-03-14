import $ from 'jquery';
import PredictiveSearch from "@shopify/theme-predictive-search";
import * as templates from './templates';

$(() => {

    $('body').on('click', '.js-toggle-search', (e) => {
        e.preventDefault();
        $('body').toggleClass('search-active');
        setTimeout(() => $('.js-search-query').get(0).focus(), 1000);
    });

    const displayResults = (response) => {
        $('.js-search-items').empty();
        if (response.resources.results.products.length) {
            [...Array(10)].forEach((_, i) => { if (response.resources.results.products[i]) $('.js-search-items').append(templates.searchItem(response.resources.results.products[i])) });
        } else {
            $('.js-search-items').html('<h4>No results for that term</h4>')
        }
    };

    const showLoadingAnimation = () => {
        let html = ``;
        [...Array(4)].forEach((_, i) => { html += templates.searchPlaceholder() });
        $('.js-search-items').empty().html(html);
    };

    $('body').on('input propertychange', '.js-search-query', () => {
        if ($('.js-search-query').val() !== '' && $('.js-search-query').val() !== ' ') {
            showLoadingAnimation();
            predictiveSearch.query($('.js-search-query').val());
            $('.searchPane').addClass('active');
        } else {
            $('.searchPane').removeClass('active');
        }
    });

    $('.js-full-search').on('click', (e) => {
        e.preventDefault();
        window.location = window.location.origin + `/search?q=` + $('.js-search-query').val()
    });

    $('body').on('click', '.js-search-again', (e) => {
        e.preventDefault();
        $('body').toggleClass('search-active');
        setTimeout(() => $('.js-search-query').get(0).focus(), 1000);
    });



    /*------------------------------------------------------------------
    Predictive Search
    ------------------------------------------------------------------*/

    let predictiveSearch = new PredictiveSearch({
        resources: {
            type: ['product', 'page', 'article', 'collection'],
            limit: 4,
            options: {
                unavailable_products: 'last',
            }
        }
    });


    predictiveSearch.on('success', (response) => setTimeout(() => displayResults(response), 500));

});
