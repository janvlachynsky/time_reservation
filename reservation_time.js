var refreshInterval;

$(document).ready(function() {
  clockUpdate();
  refreshInterval = setInterval(clockUpdate, 1000);
})

hour = {"pickup":
        [{
            "from": 9,
            "to":20,
         }],
        "carry":
          [{
              "from":8,
              "to":19,
           }]};
minute = {"pickup":
        [{
            "from": 40,
            "to":59,
            "step":20
         }],
          "carry":
          [{
              "from":50,
              "to":59,
              "step":40
           }]};
var minuteStep = minute.pickup[0].step;
var hourFrom = hour.pickup[0].from;
var hourTo = hour.pickup[0].to;

//setting closest possible orders
function setClosestMin(){
  var date = new Date();
  var m =date.getMinutes();
  var h = date.getHours();
  var defH = $('#hours').children('option:selected').val();
  var firstH = $('#hours').children('[active=""]').val();
  if(defH==firstH || defH==h){ // pokud je aktivní hodnota hodiny shodná s reálným časem -> disable minut
    $('#minutes').children().each(function(){
      var realStep =($(this).val())-(minuteStep);
      if(realStep < m){
        $(this).attr('disabled','disabled');
      }
    });
    //store set values
    var currStep = ($('#currentState').attr('minute'))-(minuteStep);
    if(($('#currentState').attr('minute').length)>0 && (currStep>m)){
      $('#minutes option[value="'+$('#currentState').attr('minute')+'"]').prop('selected',true);
    }else{
      $('#minutes').children('option:enabled').eq(0).prop('selected',true);
    }
  }else{  // selected 1h+ from curr time
    $('#minutes').children().each(function(){
      $(this).removeAttr('disabled','disabled');
    });
    var currStep = ($('#currentState').attr('minute'));
    if((currStep.length)>0){
      $('#minutes option[value="'+currStep+'"]').prop('selected',true);
    }else{
      $('#minutes').children('option:enabled').eq(0).prop('selected',true);
    }
  }

  var countDisabled = $('#minutes').children('option:disabled').length;
  if(countDisabled > 5){ // plus 1 hour
    $('#currentState').attr('deprecated',h);
    $('#hours').children('option:enabled').eq(0).prop('disabled',true);
    $('#hours').children('option:enabled').eq(0).prop('selected',true);
    setClosestMin();
  }


  if((defH-h)==1){ // conversion minutes in next hour (16.51 -> 17:20)
    $('#minutes').children().each(function(){
      var remainsMin = 60-m;
      var realStep =($(this).val())-(minuteStep-remainsMin);
      if(realStep <= 0){
        $(this).attr('disabled','disabled');
      }
    });
    // store set values
    var currStep = ($('#currentState').attr('minute'));
    var firstEnabled = $('#minutes').children('option:enabled').eq(0).val();
    if(($('#currentState').attr('minute').length)>0 && currStep>firstEnabled){
      $('#minutes option[value="'+$('#currentState').attr('minute')+'"]').prop('selected',true);
    }else{
      $('#minutes').children('option:enabled').eq(0).prop('selected',true);
    }
  }
}

// time refresh cycle
function clockUpdate() {
  var date = new Date();
  $('.digital-clock').css({'color': '#fff', 'text-shadow': '0 0 6px #ff0'});
  function addZero(x) {
    if (x < 10) {
      return x = '0' + x;
    } else {
      return x;
    }
  }
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  var strHour;
  var strMin;
  var z = hourFrom;
  var depr = $('#currentState').attr('deprecated');

  for(z;z<hourTo;z++){   // generate HTML with time set options
    strHour+="<option "+((hourFrom > z || hourTo <= z || h > z ) ? 'disabled' : 'active')+" value="+addZero(z)+">"+addZero(z)+"</option>";
  }

    var minDiff = 60/10; // number of steps
    for(var i=0;i<minDiff;++i){
      var curStep = (i * 10)%60;
      strMin+="<option value='"+addZero(curStep)+"' >"+addZero(curStep)+"</option>";
      }
  $('#minutes').html(strMin);
  $('#hours').html(strHour);
  $('.digital-clock').text(addZero(h) + ':' + addZero(m) + ':' + addZero(s));

  if(($('#currentState').attr('hour').length)>0){
    $('#hours option[value="'+$('#currentState').attr('hour')+'"]').prop('selected',true);
  }

  setClosestMin();
  if(depr.length>0){
    $('#hours option[value="'+depr+'"]').prop('disabled',true);
  }
  $('#currentState').attr('hour',$('#hours').children('option:selected').val());
  $('#currentState').attr('minute',$('#minutes').children('option:selected').val());
}

// store values to hidden input #currentState
$('#hours').on('change',function(){
  setClosestMin();
  $("#currentState").attr("hour",$(this).children("option:selected").val());
});

$('#minutes').on('change',function(){
  $("#currentState").attr("minute",$(this).children("option:selected").val());
});

// change way delivery (carry/pickup)
function changeDelivery(){
  if($('#carry').is(':checked')){
    minuteStep=minute.carry[0].step;
    hourTo = hour.carry[0].to;
    hourFrom = hour.carry[0].from;
  }else{
    minuteStep=minute.pickup[0].step;
    hourTo = hour.pickup[0].to;
    hourFrom = hour.pickup[0].from;
  }
  setClosestMin();
}
$('#carry').on('change', function(){
  changeDelivery();
});

