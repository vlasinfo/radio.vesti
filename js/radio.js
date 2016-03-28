
$(document).ready(function(){

    var	my_jPlayer = $("#rv_player"),
        my_trackName = $("#jp_container .track-name"),
        my_playState = $("#jp_container .play-state"),
        my_extraPlayInfo = $("#jp_container .extra-play-info");

    // Some options
    var	opt_play_first = false,// Автоплей
        opt_auto_play = true, // Автоплей после селекта
        opt_text_playing = "", // Текст перед треком
        opt_text_selected = ""; // Текст когда нет треков

    var first_track = true;

    my_playState.text(opt_text_selected);

    my_jPlayer.jPlayer({
        ready: function () {
            $("#jp_container .track-default").click();
        },
        timeupdate: function(event) {
            my_extraPlayInfo.text(parseInt(event.jPlayer.status.currentPercentAbsolute, 10) + "%");
        },
        play: function(event) {
            my_playState.text(opt_text_playing);
        },
        pause: function(event) {
            my_playState.text(opt_text_selected);
        },
        ended: function(event) {
            my_playState.text(opt_text_selected);
        },
        swfPath: "jplayer",
        cssSelectorAncestor: "#jp_container",
        supplied: "mp3",
        wmode: "window"
    });

    // Create click handlers for the different tracks
    $("#jp_container .track").click(function(e) {
        my_trackName.text($(this).text());
        my_jPlayer.jPlayer("setMedia", {
            mp3: $(this).attr("href")
        });
        if((opt_play_first && first_track) || (opt_auto_play && !first_track)) {
            my_jPlayer.jPlayer("play");
        }
        first_track = false;
        $(this).blur();
        return false;
    });
    $('.btn-rv .dropdown-menu li a.track').click(function() {
        $('.btn-rv .rv-dropdown').removeClass("open");
    });
});