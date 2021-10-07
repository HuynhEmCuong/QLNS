
/************HienHuynh************/

function ajaxFunction(){
	var ajaxRequest;

	try{
		// Opera 8.0+, Firefox, Safari
		ajaxRequest = new XMLHttpRequest();
	} catch (e){
		// Internet Explorer Browsers
		try{
			ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				//browsers all not support, rare case
				alert("Your browser broke!");
				return false;
			}
		}

	}
	return ajaxRequest;
}

function returnTextSave(value){
	value = value.replace(/\%26/g, "&");
	value = value.replace(/\%2B/g, "+");
	return value;
}

function returnBackText(value){
	value = value.replace(/\&/g, "%26");
	value = value.replace(/\+/g, "%2B");
	return value;
}

/*
	Update Value
	table: tên table cần update
	field: tên field cần update
	obj: đối tượng thay đổi
	fieldCondition: field điều kiện
	valCondition: value điều kiện
	isDate: 1:ngày
*/
function ajaxUpdateValue(table,field,obj,fieldCondition,valCondition,isDate,pjCodeValue,recordID,vi,vj,vm){
	var queryString = "";
/*	alert(table);
	alert(field);
	alert(value);
	alert(fieldCondition);
	alert(valCondition);*/
	var value = obj.value.replace(/\'/g, "''");
	queryString += "table="+table+"&field="+field+"&value='"+returnBackText(value)+"'&fieldCondition="+fieldCondition+"&valCondition='"+valCondition+"'";
	if(isDate==1){
		queryString += "&isDate=1";
	}
	if(pjCodeValue!='' && typeof(pjCodeValue)!='undefined'){
		queryString += "&pjcode='"+pjCodeValue+"'";
	}
	
	if(queryString != ""){
		var url = "ajaxUpdateValue.htm";
		htmlRequest = ajaxFunction();
		if (htmlRequest==null){ // If it cannot create a new Xmlhttp object.
			alert ("Browser does not support HTTP Request");
			return;
		}
		htmlRequest.onreadystatechange = function(){
			if(htmlRequest.readyState == 4){
			//	alert(htmlRequest.responseText);exit();
				//trim khoang trang, neu la 'NG' thi chuyen focus div 
				if(trim(htmlRequest.responseText)=='NG'){
					addClass(obj,'bg-pink');
					obj.focus();
					obj.value = oldValueChoose;
				}else if(trim(htmlRequest.responseText)=='OK'){
					obj.value = returnTextSave(obj.value);
					//set lại value cho contract
					if(recordID!='' && typeof(recordID)!='undefined'){
						setValueAmount(recordID,vi,vj,vm);
					}
					removeClass(obj,'bg-input');
					removeClass(obj.parentNode,'bg-input');
					addClass(obj,'bg-pink');
					addClass(obj.parentNode,'bg-pink');
				}else if(trim(htmlRequest.responseText)=='NOTSAVE'){
					addClass(obj,"bg-pink");
					addClass(obj.parentNode,"bg-pink");
					obj.focus();
					obj.value = "";
				}
			}
		}
		
		htmlRequest.open("POST", url,true);
		htmlRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//	htmlRequest.setRequestHeader("Content-length", queryString.length);
	//	htmlRequest.setRequestHeader("Connection", "close");
		htmlRequest.send(queryString);
	}
}

function hasClass(ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
	if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,' ');
	}
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function checkNumeric(value){
	var anum=/(^\d+$)|(^\d+\.\d+$)/
	
	if (anum.test(value)){
		return true;
	}else{
		return false;
	}	
}

function trim(str)
{
	var start = 0;
	var end = str.length;
	while (start < str.length && str.charAt(start) == ' ') start++;
	while (end > 0 && str.charAt(end-1) == ' ') end--;
	return str.substr(start, end-start);
}

//Cookies
function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	//alert(document.coolie);
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

function deleteCookie()
{
	setCookie("UserID",'');
	setCookie("isLogin",'');
//	alert(document.cookie);
}


function setCookiesUser(UserID){
	setCookie('UserID',UserID,1);
	setCookie('isLogin',1,1);
}

//Hàm: getCookiesUser
//s_UserID: UserID lưu trên server
//c_UserID: UserID lưu trên cookies
function getCookiesUser(){
	var s_UserID = document.getElementById('UserID').value;

	var c_UserID = getCookie('UserID');
//	alert(s_UserID);
//	alert(c_UserID);
	//Trường hợp user chưa login
	if(getCookie('isLogin')!=1){
		location.href="login.htm";
	}else{ //kiểm tra user cũ hay user mới. User mới -> mainpage
		//expire cookie
		if(c_UserID=='/'){
			alert("Expired Cookie.");
			setCookiesUser(s_UserID);
			location.href="login.htm";
		}else{
			if(s_UserID!=c_UserID){
				deleteCookie();
				setCookiesUser(s_UserID);
				location.href="listStaff.htm";
			}
		}
	}
}

// Kiem tra 1 so la so nguyen
function isInt(myString)
{
	//var reg= /^(\+|-)?((\d+(\.\d+)?)|(\[0].\d+))$/;
	var reg= /^(\+|-)?\d+$/;
	return (reg.test(myString));
}


// Kiem tra 1 so la so thuc
function isFloat(myString)
{
	var reg= /^(\+|-)?((\d+(\.\d+)?)|(\[0].\d+))$/;
	return (reg.test(myString));
}

// Ham lam tron so
function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

//Ham remove '.00' & ','
function returnNumber(value){
	value = value.replace('.00', "");
	value = value.replace(/,/g, "");
	
	return value;
}

function openPopup(idClicked,idOpen)
{			
	signClicked = idClicked;
	
	//alert(id);
	var layer = document.getElementById(idOpen);

	bodyWidth = window.innerWidth;
	bodyHeight = window.innerHeight;
	//alert(bodyWidth);
	var but = document.getElementById(idClicked);
	if((bodyHeight - but.offsetTop)<50){
		layer.style.top = (but.offsetTop-200)+'px';
	}else{
		layer.style.top = (but.offsetTop-100)+'px';
	}
	
	//alert(bodyWidth-but.offsetLeft);
	
	if((bodyWidth-but.offsetLeft)<400)
	{
		layer.style.left = (but.offsetLeft-300)+'px';
	}else layer.style.left = (but.offsetLeft+50)+'px';
	
	layer.style.visibility = (layer.style.visibility == 'visible') ? 'hidden' : 'visible';
}

function closePopup(id)
{
	var layer = document.getElementById(id);
	layer.style.visibility = (layer.style.visibility == 'visible') ? 'hidden' : 'visible';

}

function confirm_entry(name)
{
	input_box=confirm("Are you sure to delete this "+name+"?");
	if (input_box==true){ 
		deleteAjax();
	}
}

function removeContent(content){
	var temp = content;
	if(content.hasChildNodes()){
		for(i=content.childNodes.length-1; i>=0;i--){
			var divid = new String(content.childNodes[i].id);
			if(divid.indexOf('r')==0){
				var tr = document.getElementById(divid);
				temp.removeChild(tr);
			}
		}
	}
}

function disableButton(){
	document.getElementById("deleteBut").disabled = true;
	document.getElementById("editBut").disabled = true;
	document.getElementById("saveBut").disabled = true;
	document.getElementById("cancelBut").disabled = true;
}

function enableButton(){
	document.getElementById("deleteBut").disabled = false;
	document.getElementById("editBut").disabled = false;
	//document.getElementById("saveBut").disabled = false;
	document.getElementById("cancelBut").disabled = false;
}

// Hàm add thêm "BOQ-" vào field BOQ
function addBOQ(obj){
	obj.value = obj.value.replace("BOQ-","");
	if(obj.value!=''){
		obj.value = "BOQ-"+obj.value;
	}
}

function removeBOQ(obj){
	if(obj.value!=''){
		obj.value = obj.value.replace("BOQ-","");
	}
}

function back(pageName)
{
	location.href = pageName+".htm";
}

//Ham add '.00' & ','
/*function typeOfNumber(value){
	value = roundNumber(value,2);
	value = parseFloat(value).toFixed(2);
	value = addCommas(value);
	return value;
}*/
/*function checkCookie()
{
	var username=getCookie("username");
	if (username!=null && username!="")
	{
		alert("Welcome again " + username);
	}
	else 
	{
		username=prompt("Please enter your name:","");
		if (username!=null && username!="")
		{
			setCookie("username",username,365);
		}
	}
}*/

function openPopup(idClicked,idOpen)
{
	//Giữ giá trị id của ô chữ kí vừa được click vào
	//signClicked = idClicked;
	//alert(id);
	var layer = document.getElementById(idOpen);

	bodyWidth = window.innerWidth;
	bodyHeight = window.innerHeight;
//	alert(bodyWidth);
/*	var but = document.getElementById(idClicked);
	if((bodyHeight - but.offsetTop)<50){
		layer.style.top = (but.offsetTop-200)+'px';
	}else{
		layer.style.top = (but.offsetTop-100)+'px';
	}
	
	//alert(bodyWidth-but.offsetLeft);
	
	if((bodyWidth-but.offsetLeft)<400)
	{
		layer.style.left = (but.offsetLeft-300)+'px';
	}else layer.style.left = (but.offsetLeft+50)+'px';*/
	
	layer.style.visibility = (layer.style.visibility == 'visible') ? 'hidden' : 'visible';
			
}

function closePopup(id)
{	
	var layer = document.getElementById(id);
	layer.style.visibility = (layer.style.visibility == 'visible') ? 'hidden' : 'visible';
}


