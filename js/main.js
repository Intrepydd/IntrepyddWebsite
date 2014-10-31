jQuery(function ($) {
	"use strict";
    $(document).ready(function () {
        var currentSectionIndex = 1;
        var currentSlideIndex = 0;
        $.fn.fullpage({
            anchors: ['timer', 'details'],
            navigation: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            onLeave: function (index, nextIndex, direction) {
                if ($("div.slides").parents(".section.active").length == 1) {
                    $(".directionNav ").removeClass('disable');
                } else {
                    $(".directionNav").addClass('disable');
                }
                if (nextIndex == 2) {
                    $.vegas('pause');
                    $('.vegas-background').addClass('grayscale');
                } else {
                    $('.vegas-background').removeClass('grayscale');
                    $('.vegas-background').addClass('normal');
                    $.vegas('slideshow');
                }
            },
            afterLoad: function (anchorLink, index) {
                currentSectionIndex = index;
                if (index == '2') {
                    var index = $(".slide.active").index();
                    if (index != 1)
                        $.fn.fullpage.moveTo(2, 1);
                }
            },
            onSlideLeave: function (anchorLink, index, slideIndex, direction) {

                if (slideIndex != '1') {
                    $('.vegas-background').removeClass('normal');
                    $('.vegas-background').addClass('grayscale');

                } else {
                    $('.vegas-background').removeClass('grayscale');
                    $('.vegas-background').addClass('normal');
                }
            },
            afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {
                currentSlideIndex = slideIndex;
            }
        });
      
		var params = {
			'action'    : 'Initialize'
		};
		$.ajax({
			type: "POST",
			url: "php/mainHandler.php",
			data: params,
			success: function(response){
				if(response){
					var responseObj = jQuery.parseJSON(response);
					if(responseObj.ResponseData)
					{
						if(responseObj.ResponseData.Start_Date)
						{
							var startDate = new Date(responseObj.ResponseData.Start_Date);
							$('#countdown_dashboard').countDown({
								targetDate: {
									'day': startDate.getDate(),
									'month': startDate.getUTCMonth()+1,
									'year': startDate.getFullYear(),
									'hour': 0,
									'min': 0,
									'sec': 0
								},
								omitWeeks: true
							});
						}
						if(responseObj.ResponseData.Backgrounds)
						{
							var bgs = responseObj.ResponseData.Backgrounds;
							var bgsarray = bgs.split(',');
							var obj = [];
							for(var i=0; i< bgsarray.length; i++) {
							   obj.push({"src": bgsarray[i],"fade":1000})
							}
							$.vegas('slideshow', {
								backgrounds: obj
							})('overlay', {
								src: 'overlays/02.png',
								opacity: '.5'
							});
						}
						
					}
				}
			}
		});
        
		$("#contact-form input, #contact-form textarea").keyup(function () {
			$("#contact-form input, #contact-form textarea").css('border-color', '');
			$("#result").slideUp();
        });

        $('#contact-submit').click(function (e) {
            var user_name = $('input[name=name]').val();
            var user_email = $('input[name=email]').val();
            var user_message = $('textarea[name=message]').val();
            var proceed = true;
            if (user_name == "") {
                $('input[name=name]').css('border-color', 'red');
                proceed = false;
            }
            if (user_email == "") {
                $('input[name=email]').css('border-color', 'red');
                proceed = false;
            }

            if (user_message == "") {
                $('textarea[name=message]').css('border-color', 'red');
                proceed = false;
            }

            if (proceed) {
                post_data = {
                    'userName': user_name,
                    'userEmail': user_email,
                    'userMessage': user_message
                };
                $.post('php/contact.php', post_data, function (response) {
                    if (response.type == 'error') {
                        output = '<div class="error">' + response.text + '</div>';
                    } else {
                        output = '<div class="success">' + response.text + '</div>';
                        $('#contact-form input').val('');
                        $('#contact-form textarea').val('');
                    }

                    $("#result").hide().html(output).slideDown();
                }, 'json');
            }
        });
		$('.directionNav .prevNav').click(function () {
            $.fn.fullpage.moveSlideLeft();
        });
        $('.directionNav .nextNav').click(function () {
            $.fn.fullpage.moveSlideRight();
        });
		
    });
});