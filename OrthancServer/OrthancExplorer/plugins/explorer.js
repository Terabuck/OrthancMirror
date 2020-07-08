// Extensions to Orthanc Explorer by the registered plugins

/**
 * From plugin: dicom-web (version mainline)
 **/

function ChooseDicomWebServer(callback)
{
  var clickedModality = '';
  var clickedPeer = '';
  var items = $('<ul>')
    .attr('data-divider-theme', 'd')
    .attr('data-role', 'listview');

  $.ajax({
    url: '../dicom-web/servers',
    type: 'GET',
    dataType: 'json',
    async: false,
    cache: false,
    success: function(servers) {
      var name, item;
      
      if (servers.length > 0)
      {
        items.append('<li data-role="list-divider">DICOMweb servers</li>');

        for (var i = 0; i < servers.length; i++) {
          name = servers[i];
          item = $('<li>')
            .html('<a href="#" rel="close">' + name + '</a>')
            .attr('name', name)
            .click(function() { 
              clickedModality = $(this).attr('name');
            });
          items.append(item);
        }
      }

      // Launch the dialog
      $(document).simpledialog2({
        mode: 'blank',
        animate: false,
        headerText: 'Choose target',
        headerClose: true,
        forceInput: false,
        width: '100%',
        blankContent: items,
        callbackClose: function() {
          var timer;
          function WaitForDialogToClose() {
            if (!$('#dialog').is(':visible')) {
              clearInterval(timer);
              callback(clickedModality, clickedPeer);
            }
          }
          timer = setInterval(WaitForDialogToClose, 100);
        }
      });
    }
  });
}


function ConfigureDicomWebStowClient(resourceId, buttonId, positionOnPage)
{
  $('#' + buttonId).remove();

  var b = $('<a>')
      .attr('id', buttonId)
      .attr('data-role', 'button')
      .attr('href', '#')
      .attr('data-icon', 'forward')
      .attr('data-theme', 'e')
      .text('Send to DICOMweb server')
      .button();

  b.insertAfter($('#' + positionOnPage));

  b.click(function() {
    if ($.mobile.pageData) {
      ChooseDicomWebServer(function(server) {
        if (server != '' && resourceId != '') {
          var query = {
            'Resources' : [ resourceId ],
            'Synchronous' : false
          };
          
          $.ajax({
            url: '../dicom-web/servers/' + server + '/stow',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(query),
            async: false,
            error: function() {
              alert('Cannot submit job');
            },
            success: function(job) {
            }
          });
        }
      });
    }
  });
}


$('#patient').live('pagebeforeshow', function() {
  ConfigureDicomWebStowClient($.mobile.pageData.uuid, 'stow-patient', 'patient-info');
});

$('#study').live('pagebeforeshow', function() {
  ConfigureDicomWebStowClient($.mobile.pageData.uuid, 'stow-study', 'study-info');
});

$('#series').live('pagebeforeshow', function() {
  ConfigureDicomWebStowClient($.mobile.pageData.uuid, 'stow-series', 'series-info');
});

$('#instance').live('pagebeforeshow', function() {
  ConfigureDicomWebStowClient($.mobile.pageData.uuid, 'stow-instance', 'instance-info');
});

$('#lookup').live('pagebeforeshow', function() {
  $('#open-dicomweb-client').remove();
  
  var b = $('<fieldset>')
      .attr('id', 'open-dicomweb-client')
      .addClass('ui-grid-b')
      .append($('<div>')
              .addClass('ui-block-a'))
      .append($('<div>')
              .addClass('ui-block-b')
              .append($('<a>')
                      .attr('id', 'coucou')
                      .attr('data-role', 'button')
                      .attr('href', '#')
                      .attr('data-icon', 'forward')
                      .attr('data-theme', 'a')
                      .text('Open DICOMweb client')
                      .button()
                      .click(function(e) {
                        window.open('../dicom-web/app/client/index.html');
                      })));
  
  b.insertAfter($('#lookup-result'));
});



/**
 * From plugin: osimis-web-viewer (version 1.3.1.1.3.1-1.3.1)
 **/

$('#series').live('pagebeforecreate', function() {
  //$('#series-preview').parent().remove();

  var b = $('<a>')
    .attr('data-role', 'button')
    .attr('href', '#')
    .attr('data-icon', 'search')
    .attr('data-theme', 'e')
    .text('Osimis Web Viewer');

  b.insertBefore($('#series-delete').parent().parent());
  b.click(function() {
    if ($.mobile.pageData) {
      var urlSearchParams = {
        "series" : $.mobile.pageData.uuid
      };
      if ("authorizationTokens" in window) {
        for (var token in authorizationTokens) {
          urlSearchParams[token] = authorizationTokens[token];
        }
      }
  
      window.open('../osimis-viewer/app/index.html?' + $.param(urlSearchParams));
    }
  });
});

$('#study').live('pagebeforecreate', function() {
  //$('#series-preview').parent().remove();

  var b = $('<a>')
    .attr('data-role', 'button')
    .attr('href', '#')
    .attr('data-icon', 'search')
    .attr('data-theme', 'e')
    .text('Osimis Web Viewer');

  b.insertBefore($('#study-delete').parent().parent());
  b.click(function() {
    if ($.mobile.pageData) {

      var urlSearchParams = {
        "study" : $.mobile.pageData.uuid
      };
      if ("authorizationTokens" in window) {
        for (var token in authorizationTokens) {
          urlSearchParams[token] = authorizationTokens[token];
        }
      }

      window.open('../osimis-viewer/app/index.html?' + $.param(urlSearchParams));
    }
  });
});


/**
 * From plugin: transfers (version mainline)
 **/

function TransfersAcceleratorSelectPeer(callback)
{
  var items = $('<ul>')
    .attr('data-divider-theme', 'd')
    .attr('data-role', 'listview');

  $.ajax({
    url: '../transfers/peers',
    type: 'GET',
    dataType: 'json',
    async: false,
    cache: false,
    success: function(peers) {
      console.log(peers);
      var clickedPeer = null;
      
      for (var name in peers) {
        if (peers.hasOwnProperty(name)) {
          var item = $('<li>')
              .html('<a href="#" rel="close">' + name + '</a>')
              .attr('name', name)
              .click(function() { 
                clickedPeer = $(this).attr('name');
              });

          if (peers[name] != 'installed' &&
              peers[name] != 'bidirectional') {
            item.addClass('ui-disabled');
          }

          items.append(item);          
        }
      }

      // Launch the dialog
      $('#dialog').simpledialog2({
        mode: 'blank',
        animate: false,
        headerText: 'Choose Orthanc peer',
        headerClose: true,
        forceInput: false,
        width: '100%',
        blankContent: items,
        callbackClose: function() {
          var timer;
          function WaitForDialogToClose() {
            if (!$('#dialog').is(':visible')) {
              clearInterval(timer);
              if (clickedPeer !== null) {
                callback(clickedPeer);
              }
            }
          }
          timer = setInterval(WaitForDialogToClose, 100);
        }
      });
    }
  });
}


function TransfersAcceleratorAddSendButton(level, siblingButton)
{
  var b = $('<a>')
    .attr('data-role', 'button')
    .attr('href', '#')
    .attr('data-icon', 'search')
    .attr('data-theme', 'e')
    .text('Transfers accelerator');

  b.insertBefore($(siblingButton).parent().parent());

  b.click(function() {
    if ($.mobile.pageData) {
      var uuid = $.mobile.pageData.uuid;
      TransfersAcceleratorSelectPeer(function(peer) {
        console.log('Sending ' + level + ' ' + uuid + ' to peer ' + peer);

        var query = {
          'Resources' : [
            {
              'Level' : level,
              'ID' : uuid
            }
          ], 
          'Compression' : 'gzip',
          'Peer' : peer
        };

        $.ajax({
          url: '../transfers/send',
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify(query),
          success: function(job) {
            if (!(typeof job.ID === 'undefined')) {
              $.mobile.changePage('#job?uuid=' + job.ID);
            }
          },
          error: function() {
            alert('Error while creating the transfer job');
          }
        });  
      });
    }
  });
}



$('#patient').live('pagebeforecreate', function() {
  TransfersAcceleratorAddSendButton('Patient', '#patient-delete');
});

$('#study').live('pagebeforecreate', function() {
  TransfersAcceleratorAddSendButton('Study', '#study-delete');
});

$('#series').live('pagebeforecreate', function() {
  TransfersAcceleratorAddSendButton('Series', '#series-delete');
});


