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