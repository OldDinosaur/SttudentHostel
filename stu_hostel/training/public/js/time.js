;window.onload = function(){
    var span = document.getElementById('time-span');
    var dateStr = formatDate();
    // 将时间放置到span内
    span.innerText = dateStr;
    // 每隔一秒，再放置一次最新的时间
    setInterval(function(){
        span.innerText = formatDate();
    },1000);
    //格式化年月日时分秒 
    function formatDate(){
        var date = new Date();
        var week=getWeek(date);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        month = month<10?'0'+month:month;
        var day = date.getDate();
        day = day<10?'0'+day:day;
        var hours = date.getHours();
        hours = hours<10?'0'+hours:hours;
        var minutes = date.getMinutes();
        minutes = minutes<10?'0'+minutes:minutes;
        var seconds = date.getSeconds();
        seconds = seconds<10?'0'+seconds:seconds;
        // 2019-07-23 09:40:30
        return year+'  年 '+month+' 月 '+day+' 日 '+hours+':'+minutes+':'+seconds+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+week;
    }
    
    function getWeek (d) {
            var weekday = new Array(7)
            weekday[0] = "星期日"
            weekday[1] = "星期一"
            weekday[2] = "星期二"
            weekday[3] = "星期三"
            weekday[4] = "星期四"
            weekday[5] = "星期五"
            weekday[6] = "星期六"
                
            return weekday[d.getDay()];
        }

}
