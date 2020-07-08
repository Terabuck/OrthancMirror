// http://www.tutorialspark.com/jqueryUI/jQuery_UI_Dialog_Events.php
// http://www.tutorialspark.com/jqueryUI/jQuery_UI_Dialog_beforeClose_Event.php
            $('#demoDialog').dialog({
                modal: true,
                autoOpen: false,
                beforeClose: function() {
                    return closeable;
                },
                open: function() {
                    var counter = delay;
                    var intID = setInterval(function() {
                        counter--;
                        $('#delayTime').text(counter);
                        if (counter == 0) {
                            clearInterval(intID)
                            closeable = true;
                            $('#demoDialog').dialog("close")
                        }
                    }, 1000)
                }
            })