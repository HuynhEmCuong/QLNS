
/************HienHuynh************/
var run=0,count_ind=0;
orig=new Date();
var messages1=new Array("Loading ----",
						"Loading |---",
						"Loading ||--",
						"Loading |||-",
						"Loading ||||");

function GetIndex1(){
	if(count_ind==5){
		count_ind=0;return(0);
	}else return(count_ind++);
}

function doload(){
	if(run==0){
		document.clkform.clk.value=messages1[GetIndex1()];
		setTimeout("doload();", 500);
	}
}

function loaded(){
	var today;today=new Date();
	if(run==0){run=(today-orig)/1000;
	//	document.clkform.clk.value="Loaded in "+run+" seconds.";
		document.clkform.clk.disabled = true;
		document.clkform.clk.value="";
	}
}





