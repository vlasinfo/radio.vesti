$(document).ready(function() {
    //something is entered in search form
    $('#searchProg').keyup( function() {
        var that = this;
        // affect all table rows on in systems table
        var tableBody = $('.schedule ul');
        var tableRowsClass = $('.schedule .list-newsfeed li');
        $('.search-sf').remove();
        tableRowsClass.each( function(i, val) {

            //Lower text for case insensitive
            var rowText = $(val).text().toLowerCase();
            var inputText = $(that).val().toLowerCase();

            if( rowText.indexOf( inputText ) == -1 )
            {
                //hide rows
                tableRowsClass.eq(i).hide();
            }
            else
            {
                $('.search-sf').remove();
                tableRowsClass.eq(i).show();
            }
        });
        //all tr elements are hidden
        if(tableRowsClass.children(':visible').length == 0)
        {
            tableBody.append('<li class="search-sf">Нет результатов поиска.</li>');
        }
    });
});