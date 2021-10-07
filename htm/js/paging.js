var DEFAULT_PAGING = 5;
var currentPage='C1';
var oldPage;
var endPage=DEFAULT_PAGING;
var arrPageCurrent="";
var firstPage;

function clickPaging(page){
	firstPage = document.getElementById('first');
	if(page==1){
		addClass(firstPage,'select-paging');
		addClass(document.getElementById('C1'),'select-paging');
	}else{
		removeClass(firstPage,'select-paging');
		removeClass(document.getElementById('C1'),'select-paging');
	}
	currentPage='C'+page;
	var objcurrentPage = document.getElementById(currentPage);

	addClass(objcurrentPage,'select-paging');

	if(oldPage){
		removeClass(document.getElementById(oldPage),'select-paging');
	}
	oldPage = currentPage;
}

function addColorPaging(obj){
	addClass(obj,'paging color-paging');
}

function removeColorPaging(obj){
	removeClass(obj,'paging color-paging');
}

function setPaging(dataSearch){
	//alert(DEFAULT_ROW_PAGING);
	//alert(dataSearch.Count);
	if(dataSearch.Count>DEFAULT_ROW_PAGING){
		//add First Page
		var firstPage = document.createElement('div');
		firstPage.setAttribute('id','first');
		firstPage.setAttribute('class','float-left color-paging');
		
		firstPage.setAttribute('style','width:70px;');
		firstPage.setAttribute('onMouseOver',"addColorPaging(this)");
		firstPage.setAttribute('onMouseOut',"removeColorPaging(this)");
		firstPage.setAttribute('onClick',"loadAjax(1)");
		firstPage.innerHTML="First Page";
		document.getElementById('footer-content').appendChild(firstPage);
		
		//HienHuynh 0920PM 30-08-2011: create prePage link
		
		var prePage = document.createElement('div');
		prePage.setAttribute('id','pre');
		prePage.setAttribute('class','float-left');
		prePage.setAttribute('onMouseOver',"addColorPaging(this)");
		prePage.setAttribute('onMouseOut',"removeColorPaging(this)");
		prePage.innerHTML = "...";
		if(endPage<(DEFAULT_PAGING+1)){
			prePage.setAttribute('class','float-left none-display');
		}
		
		document.getElementById('footer-content').appendChild(prePage);
		//End
		
		page=1;
	
		endPage=DEFAULT_PAGING;
		var i=0;
	
		while(i<dataSearch.Count){
			var conpage = document.createElement('div');
			conpage.setAttribute('id','C'+page);
			conpage.setAttribute('class','float-left');
			if(page>(DEFAULT_PAGING)){
				addClass(conpage,'none-display');
			}
			conpage.innerHTML = page;
			if(page==1){
				addClass(conpage,'select-paging');
			}
			conpage.setAttribute('onClick',"loadAjax("+page+");");
			conpage.setAttribute('onMouseOver',"addColorPaging(this)");
			conpage.setAttribute('onMouseOut',"removeColorPaging(this)");
			document.getElementById('footer-content').appendChild(conpage);
			
			page++;
			
			if(dataSearch.Count-i<DEFAULT_ROW_PAGING){
				i = dataSearch.Count;
			}else{
				i=(i+DEFAULT_ROW_PAGING);
			}
		}
		if(page>(DEFAULT_PAGING+1)){
			var morePage = document.createElement('div');
			morePage.setAttribute('id','more');
			morePage.setAttribute('class','float-left');
			morePage.setAttribute('onClick',"nextMorePage("+(page-1)+")");
			
			//HienHuynh 0919PM 30-08-2011: fixed css
			morePage.setAttribute('onMouseOver',"addColorPaging(this)");
			morePage.setAttribute('onMouseOut',"removeColorPaging(this)");
			//End
			morePage.innerHTML = "...";
			document.getElementById('footer-content').appendChild(morePage);
		}
	}
}


function showNextMorePage(start,end){
	arrPageCurrent="";
	var i=0;
	var j=0;
	while(i<start){
		i++;
		var temp = document.getElementById('C'+i);
		addClass(temp,'none-display');
	}
	arrPageCurrent +='{"arrPage":[';
	while(start<end){
		start++;
		var temp = document.getElementById('C'+start);
		removeClass(temp,'none-display');
	
		if(start==end){
			arrPageCurrent+='{"value":"'+start+'"}';
		}else{
			arrPageCurrent+='{"value":"'+start+'"},';
		}
	}
	arrPageCurrent +=']}';
}

function hidePage(start,end){
	var i = start;
	while(i<=end){
		var temp = document.getElementById('C'+i);
		addClass(temp,'none-display');
		i++;
	}
}

function preMorePage(){
	removeClass(document.getElementById('first'),'color-paging');
	var thuong = parseInt(endPage/DEFAULT_PAGING);
	var sodu = endPage-(DEFAULT_PAGING*thuong);
	if(sodu==0){
		var end = endPage-DEFAULT_PAGING;
		var start = endPage-(DEFAULT_PAGING*2);
	}else{
		var end = endPage-sodu;
		var start = endPage-(DEFAULT_PAGING+sodu);
	}
	hidePage(end+1,endPage);
	showNextMorePage(start,end);
	if(endPage > DEFAULT_PAGING){
		document.getElementById('more').innerHTML="...";
	}
	endPage=end;
	if(endPage==DEFAULT_PAGING){
		addClass(document.getElementById('pre'),'none-display');
	}else{
		document.getElementById('more').innerHTML="...";
	}
}

function nextMorePage(page){
//	alert(page);
//	alert(DEFAULT_PAGING);
	removeClass(document.getElementById('first'),'color-paging');
	if(endPage<page){
		if(page>DEFAULT_PAGING){
			//HienHuynh: 0924PM 30-08-11 create pre link
			removeClass(document.getElementById('pre'),'none-display');
			document.getElementById('pre').setAttribute('onClick',"preMorePage()");
		}
		
		if((page-endPage)>DEFAULT_PAGING){
			var end = endPage+DEFAULT_PAGING;
			showNextMorePage(endPage,end);
			endPage=end;
			document.getElementById('more').innerHTML="...";
		}else{
			var end = endPage+(page-endPage);
			showNextMorePage(endPage,end);
			endPage=endPage+(page-endPage);
			document.getElementById('more').innerHTML="";
		}
	}
}