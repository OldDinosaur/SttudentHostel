var theTable = document.getElementById("tableTest"); //要进行分页的表格 
    var spanFirst = document.getElementById("spanFirst");  //第一页     
    var spanPre = document.getElementById("spanPre");     //上一页      
    var spanNext = document.getElementById("spanNext");   //下一页        
    var spanLast = document.getElementById("spanLast");  //最后一页    
    var pageNum = document.getElementById("spanPageNum"); //当前页          
    var totalPage = document.getElementById("spanTotalPage");  //总页数         

    var numberRowsInTable = theTable.rows.length;    //table中<tr>的数量      
    var pageSize = 8;     //一页中数据显示的数量  
    hide();
      
    if(numberRowsInTable == 0){
        pageNum.innerText = 0
    }
    //判断当前页和总页数是否相等
   if(pageNum.innerText == totalPage.innerText){
       nextText()
       lastText(); 
   }
   var page = pageNum.innerText;  
    //下一页       
    function next() {
        hideTable();  //隐藏所有表格行     
        var currentRow = pageSize * page;    //(计算开始从哪里开始显示)得到当前页的前所有行数     
        var maxRow = currentRow + pageSize;  //(计算开始从哪里开始停止显示)得到当前页前的总行数加一页行数          
        if (maxRow > numberRowsInTable) maxRow = numberRowsInTable;  //越界则改为最大行数     
        for (var i = currentRow; i < maxRow; i++) {  //将区间内的<tr>样式改为可见     
            theTable.rows[i].style.display = '';
        }
        page++;
        if (maxRow == numberRowsInTable) { //当前行数是否到达最大行数
            nextText(); //下一页文本
            lastText(); //最后一页文本
        }

        preLink();      //上一页链接  
        firstLink(); 	//第一页链接
        showPage(); 	//当前页数
    }

    //上一页       
    function pre() {

        hideTable();
        page--;
        var currentRow = pageSize * page;      //(计算开始从哪里开始显示)得到当前页的前所有行数  
        var maxRow = currentRow - pageSize;   //(计算开始从哪里开始停止显示)得到要显示页的行数   
        if (currentRow > numberRowsInTable) currentRow = numberRowsInTable;

        for (var i = maxRow; i < currentRow; i++) {    //修改区间的内容为可见  
            theTable.rows[i].style.display = '';
        }
        if (maxRow == 0) { //当前行数是否为开始
            preText(); 	//上一页文本
            firstText(); //第一页文本
        } 
        nextLink();    //下一页链接   
        lastLink();   //最后一页链接
        showPage();  //当前页数
    }


    //第一页       
    function first() {
        hideTable();
        page = 1;
        for (var i = 0; i < pageSize; i++) {
            theTable.rows[i].style.display = '';
        }

        firstText();	//第一页文本 
        preText();     //上一页文本   
        nextLink();    	//下一页链接    
        lastLink();  	//最后一页链接 
        showPage(); 	//显示页数 
    }




    //最后一页       
    function last() {
        hideTable();
        page = pageCount();
        var currentRow = pageSize * (page - 1);
        for (var i = currentRow; i < numberRowsInTable; i++) {
            theTable.rows[i].style.display = '';
        }

        firstLink();    //第一页链接
        preLink();      //上一页链接 
        nextText(); 	//下一页文本
        lastText();		//最后一页文本
        showPage(); 	//当前页数

    }


    //隐藏表格中所有行
    function hideTable() {
        for (var i = 0; i < numberRowsInTable; i++) {
            theTable.rows[i].style.display = 'none';
        }
    }

    //显示页数  
    function showPage() {
        pageNum.innerText = page;
    }

    //总共页数       
    function pageCount() {
        var count = 0;
        if (numberRowsInTable % pageSize != 0) count = 1;
        return parseInt(numberRowsInTable / pageSize) + count;
    }

    //显示按钮内容       
    function preLink() { spanPre.innerHTML = "<a href='javascript:pre();'>上一页</a>"; }
    function preText() { spanPre.innerHTML = "<a>上一页</a>"; }

    function nextLink() { spanNext.innerHTML = "<a href='javascript:next();'>下一页</a>"; }
    function nextText() { spanNext.innerHTML = "<a>下一页</a>"; }

    function firstLink() { spanFirst.innerHTML = "<a href='javascript:first();'>首页</a>"; }
    function firstText() { spanFirst.innerHTML = "<a>首页</a>"; }

    function lastLink() { spanLast.innerHTML = "<a href='javascript:last();'>尾页</a>"; }
    function lastText() { spanLast.innerHTML = "<a>尾页</a>"; }

    //隐藏表格       
    function hide() {

        for (var i = pageSize; i < numberRowsInTable; i++) {
            theTable.rows[i].style.display = 'none';
        }
        totalPage.innerHTML = pageCount();
        pageNum.innerText = 1;

        nextLink();
        lastLink();
    }

   