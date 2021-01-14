var check = function() {
  if (document.getElementById('password').value ==
      document.getElementById('confirm_password').value) {
      document.getElementById('confirmMessage').style.color = 'green';
      document.getElementById('confirmMessage').innerHTML = 'is matched';
      document.getElementById('signUpSubmit').disabled = false;
  } else {
      document.getElementById('confirmMessage').style.color = 'red';
      document.getElementById('confirmMessage').innerHTML = 'is not matched';
      document.getElementById('signUpSubmit').disabled = true;
  }
}
var checkUser = function() {
  if (document.getElementById('matkhaumoi').value ==
      document.getElementById('nhaplaimatkhau').value) {
      document.getElementById('confirmMessage').style.color = 'green';
      document.getElementById('confirmMessage').innerHTML = 'Trùng khớp';
      document.getElementById('userUpdate').disabled = false;
  } else {
      document.getElementById('confirmMessage').style.color = 'red';
      document.getElementById('confirmMessage').innerHTML = 'Không trùng khớp';
      document.getElementById('userUpdate').disabled = true;
  }
}
var checkIsBigger = function() {
  if(document.getElementById('maxprice').value!=null){
    if(document.getElementById('minprice').value!=null)
    document.getElementById('hidden').style.display = 'none';
    document.getElementById('pricesearch').disabled = false;
}
  if(document.getElementById('minprice').value!=null){
    if( parseInt(document.getElementById('maxprice').value) < parseInt(document.getElementById('minprice').value)){
      document.getElementById('pricesearch').disabled = true;
      document.getElementById('hidden').style.display = 'block';
    }else{
      document.getElementById('hidden').style.display = 'none';
      document.getElementById('pricesearch').disabled = false;
    }
  }else{
    document.getElementById('hidden').style.display = 'none';
    document.getElementById('pricesearch').disabled = false;
  }
}

function checkUserExist(){
  const email=document.getElementById('email').value;
  $.getJSON('api/users/is-user-exist?email='+email, 
  function(data) {
      if (data==true){
        document.getElementById('user-check').innerHTML="&nbsp;&nbsp;is not available";
        $('#user-check').css("color", "red");
      }else{
        document.getElementById('user-check').innerHTML="&nbsp;&nbsp;is available";
        $('#user-check').css("color", "green");
      }
  });
}