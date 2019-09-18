var refreshInterval;

$(document).ready(function() {
  clockUpdate();
  refreshInterval = setInterval(clockUpdate, 1000);
})

hour = {"odber":
        [{
            "from": 9,
            "to":20,
         }],
        "rozvoz":
          [{
              "from":8,
              "to":19,
           }]};
minute = {"odber":
        [{
            "from": 40,
            "to":59,
            "step":20
         }],
          "rozvoz":
          [{
              "from":50,
              "to":59,
              "step":40
           }]};
var minuteStep = minute.odber[0].step;
var hourFrom = hour.odber[0].from;
var hourTo = hour.odber[0].to;
//nastavení nejbližších možných objednávek
function setClosestMin(){
  var date = new Date();
  var m =date.getMinutes();//date.getMinutes(); //pro testování - date.getSeconds();
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
    //uchování ručně zadaných hodnot
    var currStep = ($('#currentState').attr('minute'))-(minuteStep);
    if(($('#currentState').attr('minute').length)>0 && (currStep>m)){
      $('#minutes option[value="'+$('#currentState').attr('minute')+'"]').prop('selected',true);
    }else{
      $('#minutes').children('option:enabled').eq(0).prop('selected',true);  
    }
  }else{  //vybráno 1h+ od reálného času 
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
  if(countDisabled > 5){ //přičtení hodiny 
    $('#currentState').attr('deprecated',h);
    $('#hours').children('option:enabled').eq(0).prop('disabled',true);
    $('#hours').children('option:enabled').eq(0).prop('selected',true);  
    setClosestMin();
  }
  
  
  if((defH-h)==1){ //přepočet minut v nejbližší hodině (16.51 -> 17:20)
    $('#minutes').children().each(function(){
      var remainsMin = 60-m;
      var realStep =($(this).val())-(minuteStep-remainsMin); 
      if(realStep <= 0){
        $(this).attr('disabled','disabled');
      }
    });
    //uchování ručně zadaných hodnot
    var currStep = ($('#currentState').attr('minute'));
    var firstEnabled = $('#minutes').children('option:enabled').eq(0).val();
    if(($('#currentState').attr('minute').length)>0 && currStep>firstEnabled){
      $('#minutes option[value="'+$('#currentState').attr('minute')+'"]').prop('selected',true);
    }else{
      $('#minutes').children('option:enabled').eq(0).prop('selected',true);  
    }
  }
}

// cyklická funkce obnovy času
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
  
  for(z;z<hourTo;z++){   //generovani html s options podle aktuálního času    
    strHour+="<option "+((hourFrom > z || hourTo <= z || h > z ) ? 'disabled' : 'active')+" value="+addZero(z)+">"+addZero(z)+"</option>";
  }
      
    var minDiff = 60/10; //počet kroků
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

//ukládání hodnot do hidden inputu #currentState
$('#hours').on('change',function(){
  setClosestMin();  
  $("#currentState").attr("hour",$(this).children("option:selected").val());
});

$('#minutes').on('change',function(){
  $("#currentState").attr("minute",$(this).children("option:selected").val());
});

//změna způsobu doručení odběr/rozvoz
function changeDelivery(){
  if($('#rozvoz').is(':checked')){
    minuteStep=minute.rozvoz[0].step;
    hourTo = hour.rozvoz[0].to;
    hourFrom = hour.rozvoz[0].from;
  }else{
    minuteStep=minute.odber[0].step;
    hourTo = hour.odber[0].to;
    hourFrom = hour.odber[0].from;
  }
  setClosestMin();
}
$('#rozvoz').on('change', function(){
  changeDelivery();
});

