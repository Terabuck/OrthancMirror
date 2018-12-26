var pendingUploads = [];
var currentUpload = 0;
var totalUpload = 0;

$(document).ready(function() {
  // Initialize the jQuery File Upload widget:
  $('#fileupload').fileupload({
    //dataType: 'json',
    //maxChunkSize: 500,
    //sequentialUploads: true,
    limitConcurrentUploads: 3,
    add: function (e, data) {
      pendingUploads.push(data);
    }
  })
    .bind('fileuploadstop', function(e, data) {
      $('#upload-button').removeClass('ui-disabled');
      //$('#upload-abort').addClass('ui-disabled');
      $('#progress .bar').css('width', '100%');
      if ($('#progress .label').text() != 'Failure')
        $('#progress .label').text('Done');
    })
    .bind('fileuploadfail', function(e, data) {
      $('#progress .bar')
        .css('width', '100%')
        .css('background-color', 'red');
      $('#progress .label').text('Failure');
    })
    .bind('fileuploaddrop', function (e, data) {
      let target = $('#upload-list');
      $.each(data.files, function (index, file) {
        target.append('<li class="pending-file">' + file.name + '</li>');
      });
      target.listview('refresh');
    })
    .bind('fileuploadsend', function (e, data) {
      // Update the progress bar. Note: for some weird reason, the
      // "fileuploadprogressall" does not work under Firefox.
      let progress = parseInt(currentUpload / totalUploads * 100, 10);
      currentUpload += 1;
      $('#progress .label').text('Uploading: ' + progress + '%');
      $('#progress .bar')
        .css('width', progress + '%')
        .css('background-color', 'green');
    });
});



$(document).on("pageshow", "#upload", function() {
  alert('WARNING - This page is currently affected by Orthanc issue #21: ' +
        '"DICOM files might be missing after uploading with Mozilla Firefox." ' +
        'Do not use this upload feature for clinical uses, or carefully ' +
        'check that all instances have been properly received by Orthanc. ' +
        'Please use the command-line "ImportDicomFiles.py" script to circumvent this issue.');
  $('#fileupload').fileupload('enable');
});

$(document).on("pagehide", "#upload", function() {
  $('#fileupload').fileupload('disable');
});


$(document).on("click", "#upload-button", function(e) {
  let pu = pendingUploads;
  pendingUploads = [];

  $('.pending-file').remove();
  $('#upload-list').listview('refresh');
  $('#progress .bar').css('width', '0%');
  $('#progress .label').text('');

  currentUpload = 1;
  totalUploads = pu.length + 1;
  if (pu.length > 0) {
    $('#upload-button').addClass('ui-disabled');
    //$('#upload-abort').removeClass('ui-disabled');
  }

  for (let i = 0; i < pu.length; i++) {
    pu[i].submit();
  }
});

$(document).on("click", "#upload-clear", function(e) {
  pendingUploads = [];
  $('.pending-file').remove();
  $('#upload-list').listview('refresh');
});

/*$('#upload-abort').on('click', function() {
  $('#fileupload').fileupload().abort();
  });*/
