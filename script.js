/* sugang */

var s = document.createElement("script");
s.innerHTML =
"var form = document.getElementById('CA102') || document.getElementById('CA202');" +
"form && (form.onsubmit = function() {" +
"	fnCourseApproveCheck();" +
"	return false;" +
"});" +
"var fc_os = document.getElementsByClassName('fc_o'), fc_o;" +
"fc_os && fc_os.length >= 3 && (fc_o = fc_os[2]);" +
"var n = parseInt(fc_o.innerHTML);" +
"$('.tbl_basic tbody tr').eq(n * 2).find('input').eq(0).click();"
;
s.onload = function() {
	this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);