import $ from 'jquery';
import Swal from 'sweetalert2/src/sweetalert2.js';

$(() => {


    $('.js-postcode-bar-query').on('keyup', (e) => {
        if (e.keyCode === 13) {
            console.log('enter');

            let postcode = $('.js-postcode-bar-query').val();
            if (postcode.length > 0) {

                if (window.postcodes.includes(postcode)) {
                    console.log('postcode found');

                    // Show the booking search form with different messages based on the attempt
                    Swal.fire({
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        confirmButtonText: 'Browse Products',
                        title: 'Congratulations! ',
                        html: 'You are eligible for our same day delivery service.',
                        preConfirm: () => {
                            window.location = window.location.origin + `/collections/all`;
                        }
                    });

                } else {
                    console.log('postcode not found');

                    // Show the booking search form with different messages based on the attempt
                    Swal.fire({
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        confirmButtonText: 'Browse Products',
                        title: 'Sorry!',
                        html: 'You are not eligible for our same day delivery service. But you are still able to get our products using our nationwide delivery service.',
                        preConfirm: () => {
                            window.location = window.location.origin + `/collections/all`;
                        }
                    });
                }
            }
        }
    });


});
