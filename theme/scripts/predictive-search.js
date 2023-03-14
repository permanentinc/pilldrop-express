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


    /*------------------------------------------------------------------
    Predictive Search - search bar block variant
    ------------------------------------------------------------------*/

    const displayResultsBar = (response) => {
        $('.js-search-bar-items').empty();

        console.log('---')
        console.log(response)

        if (response.resources.results.products.length) {
            [...Array(10)].forEach((_, i) => { if (response.resources.results.products[i]) $('.js-search-bar-items').append(templates.searchBarItem(response.resources.results.products[i])) });
        } else {
            $('.js-search-bar-items').html('<h4>No results for that term</h4>')
        }
    };

    let predictiveSearchBar = new PredictiveSearch({
        resources: {
            type: ['product', 'collection'],
            limit: 3,
            options: {
                unavailable_products: 'last',
            }
        }
    });

    predictiveSearchBar.on('success', (response) => setTimeout(() => displayResultsBar(response), 500));

    const showLoadingAnimationSearchBar = () => {
        let html = ``;
        [...Array(3)].forEach((_, i) => { html += templates.searchBarPlaceholder() });
        $('.js-search-bar-items').empty().html(html);
    };

    $('body').on('input propertychange', '.js-search-bar-query', () => {
        if ($('.js-search-bar-query').val() !== '' && $('.js-search-bar-query').val() !== ' ') {
            showLoadingAnimationSearchBar();
            predictiveSearchBar.query($('.js-search-bar-query').val());
            $('.search-bar__wrap__form__searchPane').addClass('active');
        } else {
            $('.search-bar__wrap__form__searchPane').removeClass('active');
        }
    });

    $('.js-full-search-bar').on('click', (e) => {
        e.preventDefault();
        window.location = window.location.origin + `/search?q=` + $('.js-search-bar-query').val()
    });


});
