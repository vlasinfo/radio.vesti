<!-- YOUTUBE API -->
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var jp_video;
function onYouTubeIframeAPIReady(){
    jp_video = new YT.Player('jp_video',{
        height		: '',
        width		: '',
        videoId		: 'epnQQiPnHKs',
        playerVars:{
            'autohide':			1,
            'autoplay':			0,
            'controls': 		0,
            'fs':				1,
            'disablekb':		0,
            'modestbranding':	0,
            // 'cc_load_policy': 1, // forces closed captions on
            'iv_load_policy':	3, // annotations, 1=on, 3=off
            // 'playlist': videoID, videoID, videoID, etc,
            'rel':				0,
            'showinfo':			0,
            'theme':			'light',	// dark, light
            'color':			'white'	// red, white
        },
        events:{
            'onReady': onPlayerReady,
            'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
            'onPlaybackRateChange' : onPlaybackRateChange,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(data){
    initializeJplayerControls();
    jp_video.setVolume(80);
    $('#jp_container_2 .jp-volume-bar .jp-volume-bar-value').width( '80%' );
} // END FUNCTION

function onPlayerPlaybackQualityChange(quality){
} // END FUNCTION

function onPlaybackRateChange(rate){
} // END FUNCTION

function onPlayerStateChange(state){
    switch(state.data){
        case -1: //unstarted
            /* do something */
            break;
        case 0: // ended
            $('#jp_container_2 .jp-pause').show();
            $('#jp_container_2 .jp-play').hide();
            break;
        case 1: // playing
            $('#jp_container_2 .jp-pause').show();
            $('#jp_container_2 .jp-play').hide();
            startYoutubeTime();
            break;
        case 2: // paused
            $('#jp_container_2 .jp-pause').hide();
            $('#jp_container_2 .jp-play').show();
            break;
        case 3: // buffering
            /* do something */
            break;
        case 5: // video cued
            /* do something */
            break;
        default:
        // do nothing
    }
} // END FUNCTION

function onPlayerError(error){
    console.log(error);
} // END FUNCTION

function youtubeFeedCallback(data){
    jQuery(document).ready(function(){
        $('#jp_container_2 .jp-title ul li').text( data.entry['title'].$t /* +' - from: '+data.entry["author"][0].name.$t */ );
        $('#jp_container_2 .jp-duration').text( Math.floor(data.entry['media$group']['yt$duration'].seconds/60)+':'+(data.entry['media$group']['yt$duration'].seconds%60) );
    });
} // END FUNCTION

var youTubeFrequency = 100;
var youTubeInterval = 0;
function startYoutubeTime(){
    if(youTubeInterval > 0) clearInterval(youTubeInterval);  // stop
    youTubeInterval = setInterval( "updateYoutubeTime()", youTubeFrequency );  // run
} // END FUNCTION
function updateYoutubeTime(){
    if( jp_video.getCurrentTime()>=60 ){
        $('#jp_container_2 .jp-current-time').text( Math.floor(jp_video.getCurrentTime()/60)+':'+FormatNumberLength(Math.round(jp_video.getCurrentTime()%60),2) );
    }else{
        $('#jp_container_2 .jp-current-time').text( '0:'+FormatNumberLength(Math.round(jp_video.getCurrentTime()),2) );

        $('#jp_container_2 .jp-progress .jp-play-bar').width( Math.round((jp_video.getCurrentTime()/jp_video.getDuration())*100)+'%' );
    }
} // END FUNCTION
function FormatNumberLength(num,length){var r=""+num;while(r.length<length){r="0"+r;}return r;} // END FUNCTION

function initializeJplayerControls(){
    $('#jp_container_2 .jp-pause').hide();
    $('#jp_container_2 .jp-unmute').hide();
    $('#jp_container_2 .jp-restore-screen').hide();

    $('#jp_container_2 .jp-play').on('click',function(){
        $(this).hide();
        $('#jp_container_2 .jp-pause').show();
        jp_video.playVideo();
    });
    $('#jp_container_2 .jp-pause').on('click',function(){
        $(this).hide();
        $('#jp_container_2 .jp-play').show();
        jp_video.pauseVideo();
    });
    $('#jp_container_2 .jp-full-screen').on('click',function(){
        $(this).hide();
        $('#jp_container_2 .jp-restore-screen').show();
        $('#jp_container_2').addClass('jp-video-full');
        $('#jp_container_2 .jp-jplayer, #jp_container_2 #jp_video').css({'width':'100%','height':'100%'});
    });
    $('#jp_container_2 .jp-restore-screen').on('click',function(){
        $(this).hide();
        $('#jp_container_2 .jp-full-screen').show();
        $('#jp_container_2').removeClass('jp-video-full');
        $('#jp_container_2 .jp-jplayer, #jp_container_2 #jp_video').removeAttr('style');

        $('#jp_container_2 .jp-gui').show();
        clearTimeout(fullScreenHoverTime);
    });
    $('#jp_container_2 .jp-mute').on('click',function(){
        $(this).hide();
        $('#jp_container_2 .jp-unmute').show();
        $('#jp_container_2 .jp-volume-bar .jp-volume-bar-value').hide();
        jp_video.mute();
    });
    $('#jp_container_2 .jp-unmute').on('click',function(){
        $(this).hide();
        $('#jp_container_2 .jp-mute').show();
        $('#jp_container_2 .jp-volume-bar .jp-volume-bar-value').show();
        jp_video.unMute();
    });
    $('#jp_container_2 .jp-volume-bar').click(function(e){
        var posX = $(this).offset().left, posWidth = $(this).width();
        posX = (e.pageX-posX)/posWidth;
        $('#jp_container_2 .jp-volume-bar .jp-volume-bar-value').width( (posX*100)+'%' ).show();
        jp_video.setVolume(posX*100);

        $('#jp_container_2 .jp-unmute').hide();
        $('#jp_container_2 .jp-mute').show();
    });
    $('#jp_container_2 .jp-seek-bar').click(function(e){
        var posX = $(this).offset().left, posWidth = $(this).width();
        posX = (e.pageX-posX)/posWidth;
        $('#jp_container_2 .jp-progress .jp-play-bar').width( (posX*100)+'%' );
        posX = Math.round((posX)*jp_video.getDuration());
        jp_video.seekTo(posX, true);
    });
    $("#jp_container_2.jp-video-full .jp-gui").on('click',function(e){
        if(e.target != this) return;
        if( $('#jp_container_2 .jp-play').is(':visible') ){
            $('#jp_container_2 .jp-play').click();
        }else{
            $('#jp_container_2 .jp-pause').click();
        }
    });

    var fullScreenHoverTime;
    $("#jp_container_2.jp-video-full").on('mouseover',function(){
        $('.jp-gui', this).show();
        clearTimeout(fullScreenHoverTime);
        fullScreenTimeout();
    });
    function fullScreenTimeout(){
        fullScreenHoverTime = setTimeout(function(){
            $('#jp_container_2 .jp-gui').hide();
        },5000);
    }


}

$('.blocks-slider .carousel[data-type="multi"] .item').each(function(){
    var next = $(this).next();
    if (!next.length) {
        next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    for (var i=0;i<2;i++) {
        next=next.next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));
    }
});

$(function(){
    $(function(){
        if($('#prog_callend').size()){
            $.each($('#prog_callend'), function(){
                var this_ = this, active_day = 0;
                $(this_).DatePicker({
                    'openDate' : jQuery.parseJSON($(this_).attr('data-date')),
                    'onChange' : function(cd, cm, cy, m, y){
                        if($(this_).attr('data-select') != y+'-'+m){
                            $.get('/blocks/programcalendar/section='+$(this_).attr('data-absnum')+'/date='+y+'-'+m+'.html', function(data){
                                if(data){
                                    $(this_).attr('data-select', y+'-'+m);
                                    if(cm == m){
                                        $('#atetimepicker_program_cont').children().removeClass('active').filter('[data-day="'+parseInt(cd, 10)+'"]').addClass('active');
                                    }
                                }
                            });
                        }else{
                            if(cm == m){
                                $('#atetimepicker_program_cont').children().removeClass('active').filter('[data-day="'+parseInt(cd, 10)+'"]').addClass('active');
                            }
                        }
                        return true;
                    }
                });
            });
            $('#asearch_program_i').on('focus', function(){
                if($(this).val().trim() == $(this).attr('defvalue')){
                    $(this).val('');
                }
            }).on('blur', function(){
                if(!$(this).val().trim()){
                    $(this).val($(this).attr('defvalue'));
                }
            });
            $('#asearch_program_b').on('submit', function(){
                $('#prog_callend').attr('data-select', '');
                if($('#asearch_program_i').val().trim() && $('#asearch_program_i').val().trim() != $('#asearch_program_i').attr('defvalue')){
                    $.post('/blocks/programsearch/section='+$('#asearch_program_i').attr('data-absnum')+'/', {'w':$('#asearch_program_i').val()}, function(data){
                        if(data){
                            $('#atetimepicker_program_cont').html(data);
                        }
                    });
                }else{
                    $('#asearch_program_i').focus();
                }
                return false;
            });
        }
    });

    $(function(){
        if($('#random_bxslider').size()){
            $.each($('#random_bxslider'), function(){
                $(this).randomize('div.people');
            });
            $('#random_bxslider').randomize();
        }

        $.each($('.bxslider'), function(){
            params = {};
            if($(this).attr('params')){
                params = jQuery.parseJSON($(this).attr('params'))
            }
            $(this).bxSlider(params);
        });
    });

    $(function(){
        if ($('#article-galleria').size()){
            $(function(){
                Galleria.loadTheme('/theme/lib/galleria/themes/classic/galleria.classic.min.js');
                Galleria.run('#article-galleria');
            });
        }
    });
});

(function(){
    $('.carousel-showmanymoveone .item').each(function(){
        var itemToClone = $(this);

        for (var i=1;i<4;i++) {
            itemToClone = itemToClone.next();

            // wrap around if at end of item collection
            if (!itemToClone.length) {
                itemToClone = $(this).siblings(':first');
            }

            // grab item, clone, add marker class, add to collection
            itemToClone.children(':first-child').clone()
                .addClass("cloneditem-"+(i))
                .appendTo($(this));
        }
    });
}());