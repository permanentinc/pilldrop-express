import $ from 'jquery';
import Swal from 'sweetalert2/src/sweetalert2.js';

$(() => {

    let $body = $('body');

    $body.on('click', '.js-availability', (e) => {
        e.preventDefault();
        let $this = $(e.currentTarget);
        Swal.fire({
            allowEscapeKey: true,
            allowOutsideClick: true,
            confirmButtonText: 'Change Postcode',
            title: 'Change your postcode',
            html: 'Type in your postcode to see available shipping oiptions<br><input id="swal-input2" class="[ js-my-postcode ]" required="required" placeholder="Your postcode..." value="">',
            preConfirm: () => {
                let postcode = $('.js-my-postcode').val();
                localStorage.setItem('_pilldrop_express_postcode', postcode);
                updateShippingOptions();
            }
        });

    });

    const updateShippingOptions = () => {


        // If we have a postcode set already, show the correct details
        if (localStorage.getItem('_pilldrop_express_postcode')) {
            let user_entered_postcode = localStorage.getItem('_pilldrop_express_postcode');

            if (user_entered_postcode) {

                let matched_city = '';
                let options_available = 0;

                // find user_entered_postcode in sunday_home
                sunday_home.find((location) => {
                    if (location.postcode === user_entered_postcode) {
                        matched_city = `${location.region}, `;
                    }
                });

                let html = `<p> Delivering to <span class="[ js-availability ]">${matched_city}${user_entered_postcode}</span><br><br>It should arrive:<br>`;

                if (afternoon_home.find((location) => location.postcode === user_entered_postcode)) {
                    options_available++;
                    html += `<b>Afternoon Delivery</b><br>Tonight before 6pm if ordered by 9am<br>`;
                }

                if (evening_home.find((location) => location.postcode === user_entered_postcode)) {
                    options_available++;
                    html += `<b>Evening Delivery</b><br>Tonight between 6pm - 9pm if ordered by 2pm<br>`;
                }

                if (sunday_home.find((location) => location.postcode === user_entered_postcode)) {
                    options_available++;
                    html += `<b>Sunday Delivery</b><br>Sunday Delivery  between 6pm - 9pm if ordered by 11am<br>`;
                }

                if (options_available < 2) {
                    html += `<b>Nationwide Delivery</b> <br>Standard courier service 1-2 days<p>`;
                }

                html += `<p>`;
                $('.js-availability-wrapper').html(html);
            }

        } else {

            // Otherwise get the users location based on their IP address
            $.get("https://ipinfo.io/json?token=721235d355d069", function (response) {
                let estimated_postcode = response.postal;
                let estimated_city = response.city;
                let options_available = 0;

                if (estimated_postcode) {
                    let html = `<p> Delivering to <span class="[ js-availability ]">${estimated_city}, ${estimated_postcode}</span><br><br>It should arrive:<br>`;

                    if (afternoon_home.includes(estimated_postcode)) {
                        options_available++;
                        html += `<b>Afternoon Delivery</b><br>Tonight before 6pm if ordered by 9am<br>`;
                    }

                    if (evening_home.includes(estimated_postcode)) {
                        options_available++;
                        html += `<b>Evening Delivery</b><br>Tonight between 6pm - 9pm if ordered by 2pm<br>`;
                    }

                    if (sunday_home.includes(estimated_postcode)) {
                        options_available++;
                        html += `<b>Sunday Delivery</b><br>Sunday Delivery  between 6pm - 9pm if ordered by 11am<br>`;
                    }

                    if (options_available < 2) {
                        html += `<b>Nationwide Delivery</b> <br>Standard courier service 1-2 days<p>`;
                    }

                    html += `<p>`;
                    $('.js-availability-wrapper').html(html);

                } else {

                    $('.js-availability-wrapper').html(`<p><b>Nationwide Delivery</b> <br>Standard courier service 1-2 days</p>`);
                }
            });
        }

    };

    updateShippingOptions();

    $('.js-postcode-bar-query').on('keyup', (e) => {
        if (e.keyCode === 13) {
            console.log('enter');

            let user_entered_postcode = $('.js-postcode-bar-query').val();
            if (user_entered_postcode.length > 0) {

                localStorage.getItem('_pilldrop_express_postcode', user_entered_postcode);


                let matched_city = '';
                let options_available = 0;

                // find user_entered_postcode in sunday_home
                sunday_home.find((location) => {
                    if (location.postcode === user_entered_postcode) {
                        matched_city = `${location.region}, `;
                    }
                });

                let html = `<p style="text-align:left;"> Delivering to <span class="[ js-availability ]">${matched_city}${user_entered_postcode}</span><br><br>It should arrive:<br>`;

                if (afternoon_home.find((location) => location.postcode === user_entered_postcode)) {
                    options_available++;
                    html += `<b>Afternoon Delivery</b><br>Tonight before 6pm if ordered by 9am<br>`;
                }

                if (evening_home.find((location) => location.postcode === user_entered_postcode)) {
                    options_available++;
                    html += `<b>Evening Delivery</b><br>Tonight between 6pm - 9pm if ordered by 2pm<br>`;
                }

                if (sunday_home.find((location) => location.postcode === user_entered_postcode)) {
                    options_available++;
                    html += `<b>Sunday Delivery</b><br>Sunday Delivery  between 6pm - 9pm if ordered by 11am<br>`;
                }

                if (options_available < 2) {
                    html += `<b>Nationwide Delivery</b> <br>Standard courier service 1-2 days<p>`;
                }

                html += `<p>`;
                $('.js-availability-wrapper').html(html);


                console.log('postcode found');

                // Show the booking search form with different messages based on the attempt
                Swal.fire({
                    allowEscapeKey: true,
                    allowOutsideClick: true,
                    confirmButtonText: 'Browse Products',
                    title: (options_available === 0) ? 'Standard Shipping' : 'Congratulations! ',
                    html: html,
                    preConfirm: () => {
                        window.location = window.location.origin + `/collections/all`;
                    }
                });

            }
        }
    });


});


let afternoon_home = [
    { postcode: '1010', region: 'Auckland Central', zone: 1, price: '$15.00' },
    { postcode: '1011', region: 'Freemans Bay', zone: 1, price: '$15.00' },
    { postcode: '1021', region: 'Grey Lynn', zone: 1, price: '$15.00' },
    { postcode: '1022', region: 'Point Chevalier', zone: 1, price: '$15.00' },
    { postcode: '1023', region: 'Epsom', zone: 1, price: '$15.00' },
    { postcode: '1024', region: 'Epsom', zone: 1, price: '$15.00' },
    { postcode: '1025', region: 'Mount Albert', zone: 1, price: '$15.00' },
    { postcode: '1041', region: 'Mount Roskill', zone: 1, price: '$15.00' },
    { postcode: '1042', region: 'Hillsborough', zone: 1, price: '$15.00' },
    { postcode: '1050', region: 'Remuera', zone: 1, price: '$15.00' },
    { postcode: '1051', region: 'Ellerslie', zone: 1, price: '$15.00' },
    { postcode: '1052', region: 'Newmarket', zone: 1, price: '$15.00' },
    { postcode: '1060', region: 'Mount Wellington', zone: 1, price: '$15.00' },
    { postcode: '1061', region: 'Onehunga', zone: 1, price: '$15.00' },
    { postcode: '1062', region: 'Otahuhu', zone: 1, price: '$15.00' },
    { postcode: '1072', region: 'Saint Johns', zone: 1, price: '$15.00' },
    { postcode: '2010', region: 'Pakuranga', zone: 1, price: '$15.00' },
    { postcode: '2013', region: 'East Tamaki', zone: 1, price: '$15.00' },
    { postcode: '2022', region: 'Mangere', zone: 1, price: '$15.00' },
    { postcode: '2023', region: 'Otara', zone: 1, price: '$15.00' },
    { postcode: '600', region: 'New Lynn', zone: 2, price: '$15.00' },
    { postcode: '602', region: 'Glen Eden', zone: 2, price: '$15.00' },
    { postcode: '610', region: 'Te Atatu', zone: 2, price: '$15.00' },
    { postcode: '626', region: 'Beach Haven', zone: 2, price: '$15.00' },
    { postcode: '627', region: 'Northcote', zone: 2, price: '$15.00' },
    { postcode: '1026', region: 'Avondale', zone: 2, price: '$15.00' },
    { postcode: '1071', region: 'St Heliers', zone: 2, price: '$15.00' },
    { postcode: '2012', region: 'Bucklands Beach', zone: 2, price: '$15.00' },
    { postcode: '2014', region: 'Howick', zone: 2, price: '$15.00' },
    { postcode: '2016', region: 'Dannemora', zone: 2, price: '$15.00' },
    { postcode: '2019', region: 'Clover Park', zone: 2, price: '$15.00' },
    { postcode: '2024', region: 'Mangere East', zone: 2, price: '$15.00' },
    { postcode: '2025', region: 'Papatoetoe', zone: 2, price: '$15.00' },
    { postcode: '2102', region: 'Manurewa', zone: 2, price: '$15.00' },
    { postcode: '2103', region: 'Wattle Downs', zone: 2, price: '$15.00' },
    { postcode: '2104', region: 'Manukau', zone: 2, price: '$15.00' },
    { postcode: '2105', region: 'The Gardens', zone: 2, price: '$15.00' },
    { postcode: '2112', region: 'Takanini', zone: 2, price: '$15.00' },
    { postcode: '604', region: 'Titirangi', zone: 3, price: '$15.00' },
    { postcode: '612', region: 'Henderson', zone: 3, price: '$15.00' },
    { postcode: '614', region: 'Massey', zone: 3, price: '$15.00' },
    { postcode: '616', region: 'Hobsonville', zone: 3, price: '$15.00' },
    { postcode: '618', region: 'West Harbour', zone: 3, price: '$15.00' },
    { postcode: '620', region: 'Forrest Hill', zone: 3, price: '$15.00' },
    { postcode: '622', region: 'Takapuna', zone: 3, price: '$15.00' },
    { postcode: '623', region: 'Hauraki', zone: 3, price: '$15.00' },
    { postcode: '624', region: 'Devonport', zone: 3, price: '$15.00' },
    { postcode: '629', region: 'Glenfield', zone: 3, price: '$15.00' },
    { postcode: '630', region: 'Browns Bay', zone: 3, price: '$15.00' },
    { postcode: '632', region: 'Albany', zone: 3, price: '$15.00' },
    { postcode: '814', region: 'Massey', zone: 3, price: '$15.00' },
    { postcode: '2110', region: 'Papakura', zone: 3, price: '$15.00' },
    { postcode: '2113', region: 'Rosehill', zone: 3, price: '$15.00' },
    { postcode: '653', region: 'Massey', zone: 4, price: '$20.00' },
    { postcode: '792', region: 'Albany', zone: 4, price: '$20.00' },
    { postcode: '793', region: 'Paremoremo', zone: 4, price: '$20.00' },
    { postcode: '794', region: 'Dairy Flat', zone: 4, price: '$20.00' },
    { postcode: '810', region: 'Kumeu', zone: 4, price: '$20.00' },
    { postcode: '816', region: 'Waitakere', zone: 4, price: '$20.00' },
    { postcode: '820', region: 'Riverhead', zone: 4, price: '$20.00' },
    { postcode: '841', region: 'Kumeu', zone: 4, price: '$20.00' },
    { postcode: '930', region: 'Gulf Harbour', zone: 4, price: '$20.00' },
    { postcode: '931', region: 'Orewa', zone: 4, price: '$20.00' },
    { postcode: '932', region: 'Whangaparaoa', zone: 4, price: '$20.00' },
    { postcode: '2018', region: 'Beachlands', zone: 4, price: '$20.00' },
    { postcode: '2120', region: 'Pukekohe', zone: 4, price: '$20.00' },
    { postcode: '2121', region: 'Tuakau', zone: 4, price: '$20.00' },
    { postcode: '2402', region: 'Pokeno', zone: 4, price: '$20.00' },
    { postcode: '2472', region: 'Pokeno', zone: 4, price: '$20.00' },
    { postcode: '2571', region: 'Whitford', zone: 4, price: '$20.00' },
    { postcode: '2576', region: 'Manurewa', zone: 4, price: '$20.00' },
    { postcode: '2577', region: 'Drury', zone: 4, price: '$20.00' },
    { postcode: '2578', region: 'Drury', zone: 4, price: '$20.00' },
    { postcode: '2579', region: 'Ararimu', zone: 4, price: '$20.00' },
    { postcode: '2580', region: 'Papakura', zone: 4, price: '$20.00' },
    { postcode: '2696', region: 'Pukekawa', zone: 4, price: '$20.00' }
];


let evening_home = [
    { postcode: '1010', region: 'Auckland Central', zone: 1, price: '$15.00' },
    { postcode: '1011', region: 'Freemans Bay', zone: 1, price: '$15.00' },
    { postcode: '1021', region: 'Grey Lynn', zone: 1, price: '$15.00' },
    { postcode: '1022', region: 'Point Chevalier', zone: 1, price: '$15.00' },
    { postcode: '1023', region: 'Epsom', zone: 1, price: '$15.00' },
    { postcode: '1024', region: 'Epsom', zone: 1, price: '$15.00' },
    { postcode: '1025', region: 'Mount Albert', zone: 1, price: '$15.00' },
    { postcode: '1041', region: 'Mount Roskill', zone: 1, price: '$15.00' },
    { postcode: '1042', region: 'Hillsborough', zone: 1, price: '$15.00' },
    { postcode: '1050', region: 'Remuera', zone: 1, price: '$15.00' },
    { postcode: '1051', region: 'Ellerslie', zone: 1, price: '$15.00' },
    { postcode: '1052', region: 'Newmarket', zone: 1, price: '$15.00' },
    { postcode: '1060', region: 'Mount Wellington', zone: 1, price: '$15.00' },
    { postcode: '1061', region: 'Onehunga', zone: 1, price: '$15.00' },
    { postcode: '1062', region: 'Otahuhu', zone: 1, price: '$15.00' },
    { postcode: '1072', region: 'Saint Johns', zone: 1, price: '$15.00' },
    { postcode: '2010', region: 'Pakuranga', zone: 1, price: '$15.00' },
    { postcode: '2013', region: 'East Tamaki', zone: 1, price: '$15.00' },
    { postcode: '2022', region: 'Mangere', zone: 1, price: '$15.00' },
    { postcode: '2023', region: 'Otara', zone: 1, price: '$15.00' },
    { postcode: '600', region: 'New Lynn', zone: 2, price: '$15.00' },
    { postcode: '602', region: 'Glen Eden', zone: 2, price: '$15.00' },
    { postcode: '610', region: 'Te Atatu', zone: 2, price: '$15.00' },
    { postcode: '626', region: 'Beach Haven', zone: 2, price: '$15.00' },
    { postcode: '627', region: 'Northcote', zone: 2, price: '$15.00' },
    { postcode: '1026', region: 'Avondale', zone: 2, price: '$15.00' },
    { postcode: '1071', region: 'St Heliers', zone: 2, price: '$15.00' },
    { postcode: '2012', region: 'Bucklands Beach', zone: 2, price: '$15.00' },
    { postcode: '2014', region: 'Howick', zone: 2, price: '$15.00' },
    { postcode: '2016', region: 'Dannemora', zone: 2, price: '$15.00' },
    { postcode: '2019', region: 'Clover Park', zone: 2, price: '$15.00' },
    { postcode: '2024', region: 'Mangere East', zone: 2, price: '$15.00' },
    { postcode: '2025', region: 'Papatoetoe', zone: 2, price: '$15.00' },
    { postcode: '2102', region: 'Manurewa', zone: 2, price: '$15.00' },
    { postcode: '2103', region: 'Wattle Downs', zone: 2, price: '$15.00' },
    { postcode: '2104', region: 'Manukau', zone: 2, price: '$15.00' },
    { postcode: '2105', region: 'The Gardens', zone: 2, price: '$15.00' },
    { postcode: '2112', region: 'Takanini', zone: 2, price: '$15.00' },
    { postcode: '604', region: 'Titirangi', zone: 3, price: '$15.00' },
    { postcode: '612', region: 'Henderson', zone: 3, price: '$15.00' },
    { postcode: '614', region: 'Massey', zone: 3, price: '$15.00' },
    { postcode: '616', region: 'Hobsonville', zone: 3, price: '$15.00' },
    { postcode: '618', region: 'West Harbour', zone: 3, price: '$15.00' },
    { postcode: '620', region: 'Forrest Hill', zone: 3, price: '$15.00' },
    { postcode: '622', region: 'Takapuna', zone: 3, price: '$15.00' },
    { postcode: '623', region: 'Hauraki', zone: 3, price: '$15.00' },
    { postcode: '624', region: 'Devonport', zone: 3, price: '$15.00' },
    { postcode: '629', region: 'Glenfield', zone: 3, price: '$15.00' },
    { postcode: '630', region: 'Browns Bay', zone: 3, price: '$15.00' },
    { postcode: '632', region: 'Albany', zone: 3, price: '$15.00' },
    { postcode: '814', region: 'Massey', zone: 3, price: '$15.00' },
    { postcode: '2110', region: 'Papakura', zone: 3, price: '$15.00' },
    { postcode: '2113', region: 'Rosehill', zone: 3, price: '$15.00' }
];


let sunday_home = [
    { postcode: '2022', region: 'Mangere', zone: 1, price: '$15.00' },
    { postcode: '2013', region: 'East Tamaki', zone: 1, price: '$15.00' },
    { postcode: '2010', region: 'Pakuranga', zone: 1, price: '$15.00' },
    { postcode: '1072', region: 'Saint Johns', zone: 1, price: '$15.00' },
    { postcode: '1062', region: 'Otahuhu', zone: 1, price: '$15.00' },
    { postcode: '1061', region: 'Onehunga', zone: 1, price: '$15.00' },
    { postcode: '1060', region: 'Mount Wellington', zone: 1, price: '$15.00' },
    { postcode: '1052', region: 'Newmarket', zone: 1, price: '$15.00' },
    { postcode: '1051', region: 'Ellerslie', zone: 1, price: '$15.00' },
    { postcode: '1050', region: 'Remuera', zone: 1, price: '$15.00' },
    { postcode: '1042', region: 'Hillsborough', zone: 1, price: '$15.00' },
    { postcode: '1041', region: 'Mount Roskill', zone: 1, price: '$15.00' },
    { postcode: '1025', region: 'Mount Albert', zone: 1, price: '$15.00' },
    { postcode: '1024', region: 'Epsom', zone: 1, price: '$15.00' },
    { postcode: '1023', region: 'Epsom', zone: 1, price: '$15.00' },
    { postcode: '1022', region: 'Point Chevalier', zone: 1, price: '$15.00' },
    { postcode: '1021', region: 'Grey Lynn', zone: 1, price: '$15.00' },
    { postcode: '1011', region: 'Freemans Bay', zone: 1, price: '$15.00' },
    { postcode: '1010', region: 'Auckland Central', zone: 1, price: '$15.00' },
    { postcode: '2023', region: 'Otara', zone: 1, price: '$15.00' },
    { postcode: '2112', region: 'Takanini', zone: 2, price: '$15.00' },
    { postcode: '2105', region: 'The Gardens', zone: 2, price: '$15.00' },
    { postcode: '2104', region: 'Manukau', zone: 2, price: '$15.00' },
    { postcode: '2103', region: 'Wattle Downs', zone: 2, price: '$15.00' },
    { postcode: '2102', region: 'Manurewa', zone: 2, price: '$15.00' },
    { postcode: '2025', region: 'Papatoetoe', zone: 2, price: '$15.00' },
    { postcode: '2024', region: 'Mangere East', zone: 2, price: '$15.00' },
    { postcode: '2019', region: 'Clover Park', zone: 2, price: '$15.00' },
    { postcode: '2016', region: 'Dannemora', zone: 2, price: '$15.00' },
    { postcode: '2014', region: 'Howick', zone: 2, price: '$15.00' },
    { postcode: '2012', region: 'Bucklands Beach', zone: 2, price: '$15.00' },
    { postcode: '1071', region: 'St Heliers', zone: 2, price: '$15.00' },
    { postcode: '627', region: 'Northcote', zone: 2, price: '$15.00' },
    { postcode: '626', region: 'Beach Haven', zone: 2, price: '$15.00' },
    { postcode: '610', region: 'Te Atatu', zone: 2, price: '$15.00' },
    { postcode: '602', region: 'Glen Eden', zone: 2, price: '$15.00' },
    { postcode: '600', region: 'New Lynn', zone: 2, price: '$15.00' },
    { postcode: '1026', region: 'Avondale', zone: 2, price: '$15.00' },
    { postcode: '2113', region: 'Rosehill', zone: 3, price: '$15.00' },
    { postcode: '2110', region: 'Papakura', zone: 3, price: '$15.00' },
    { postcode: '814', region: 'Massey', zone: 3, price: '$15.00' },
    { postcode: '632', region: 'Albany', zone: 3, price: '$15.00' },
    { postcode: '630', region: 'Browns Bay', zone: 3, price: '$15.00' },
    { postcode: '629', region: 'Glenfield', zone: 3, price: '$15.00' },
    { postcode: '624', region: 'Devonport', zone: 3, price: '$15.00' },
    { postcode: '622', region: 'Takapuna', zone: 3, price: '$15.00' },
    { postcode: '620', region: 'Forrest Hill', zone: 3, price: '$15.00' },
    { postcode: '614', region: 'Massey', zone: 3, price: '$15.00' },
    { postcode: '2120', region: 'Pukekohe', zone: 4, price: '$20.00' },
    { postcode: '2018', region: 'Beachlands', zone: 4, price: '$20.00' },
    { postcode: '2472', region: 'Pokeno', zone: 4, price: '$20.00' },
    { postcode: '2571', region: 'Whitford', zone: 4, price: '$20.00' },
    { postcode: '2579', region: 'Ararimu', zone: 4, price: '$20.00' },
    { postcode: '2578', region: 'Drury', zone: 4, price: '$20.00' },
    { postcode: '2577', region: 'Drury', zone: 4, price: '$20.00' },
    { postcode: '2576', region: 'Manurewa', zone: 4, price: '$20.00' },
    { postcode: '820', region: 'Riverhead', zone: 4, price: '$20.00' },
    { postcode: '810', region: 'Kumeu', zone: 4, price: '$20.00' },
    { postcode: '794', region: 'Dairy Flat', zone: 4, price: '$20.00' },
    { postcode: '793', region: 'Paremoremo', zone: 4, price: '$20.00' },
    { postcode: '792', region: 'Albany', zone: 4, price: '$20.00' },
    { postcode: '618', region: 'West Harbour', zone: 4, price: '$20.00' },
    { postcode: '616', region: 'Hobsonville', zone: 4, price: '$20.00' },
    { postcode: '612', region: 'Henderson', zone: 4, price: '$20.00' },
    { postcode: '604', region: 'Titirangi', zone: 4, price: '$20.00' },
    { postcode: '932', region: 'Whangaparaoa', zone: 4, price: '$20.00' },
    { postcode: '931', region: 'Orewa', zone: 4, price: '$20.00' },
    { postcode: '930', region: 'Gulf Harbour', zone: 4, price: '$20.00' },
    { postcode: '2402', region: 'Pokeno', zone: 5, price: '$25.00' },
    { postcode: '2123', region: 'Waiuku', zone: 5, price: '$25.00' },
    { postcode: '2122', region: 'Clarks Beach', zone: 5, price: '$25.00' },
    { postcode: '2121', region: 'Tuakau', zone: 5, price: '$25.00' },
    { postcode: '2676', region: 'Pukekohe', zone: 5, price: '$25.00' },
    { postcode: '2679', region: 'Patumahoe', zone: 5, price: '$25.00' },
    { postcode: '2678', region: 'Puni', zone: 5, price: '$25.00' },
    { postcode: '816', region: 'Waitakere', zone: 5, price: '$25.00' },
    { postcode: '891', region: 'Kumeu', zone: 5, price: '$25.00' },
    { postcode: '994', region: 'Waiwera', zone: 5, price: '$25.00' },
    { postcode: '993', region: 'Redvale', zone: 5, price: '$25.00' },
    { postcode: '992', region: 'Upper Orewa', zone: 5, price: '$25.00' },
    { postcode: '892', region: 'Kumeu RD 2', zone: 5, price: '$25.00' },
    { postcode: '2471', region: 'Maramarua', zone: 5, price: '$25.00' },
    { postcode: '871', region: 'Wainui', zone: 5, price: '$25.00' },
    { postcode: '881', region: 'Muriwai', zone: 6, price: '$35.00' },
    { postcode: '882', region: 'Waimauku', zone: 6, price: '$35.00' },
    { postcode: '812', region: 'Waimauku', zone: 6, price: '$35.00' },
    { postcode: '2582', region: 'Papakura', zone: 6, price: '$35.00' },
    { postcode: '2580', region: 'Papakura', zone: 6, price: '$35.00' },
    { postcode: '2584', region: 'Papakura', zone: 6, price: '$35.00' },
    { postcode: '2675', region: 'Bombay', zone: 6, price: '$35.00' },
    { postcode: '2677', region: 'Ramarama', zone: 6, price: '$35.00' },
    { postcode: '2683', region: 'Waiuku', zone: 6, price: '$35.00' },
    { postcode: '800', region: 'Helensville', zone: 6, price: '$35.00' },
    { postcode: '883', region: 'Waimauku', zone: 6, price: '$35.00' },
    { postcode: '782', region: 'Taupaki', zone: 6, price: '$35.00' },
    { postcode: '2124', region: 'Paerata', zone: 6, price: '$35.00' },
    { postcode: '2684', region: 'Waiuku', zone: 6, price: '$35.00' },
    { postcode: '2583', region: 'Papakura', zone: 8, price: '$35.00' },



];
