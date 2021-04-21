---
title: Shell value too great for base
date: "2018-12-09"
author: Yoha
tags:
    - shell
    - Linux
location: Qingdao
image: https://gitee.com/yancqS/blogImage/raw/master/blogImage/20201017234007.jpg
meta:
  - name: title
    content: Shell value too great for base
  - name: description
    content: Shell value too great for base
  - name: keywords
    content: shell, error, base
  - name: author
    content: Yoha
featured: true
---
# Shell: value too great for base

记录一下《鸟叔的linux私房菜(第三版)》第13章P399“编写一个shell脚本计算还有几天过生日”遇到的问题。

```sh
#!/bin/bash
echo "I will caculate..."
read -p "Please input you birthday(YYYYMMDD, ex>19940910):" birthday
date2 = `echo $birthday | grep "[0-9\{8\}]"`
if ["date2" == ""]; then
    echo "please input correct date format" && exit 0
fi
declare -i date_birth_md = 10#`date --date="$date2" +%m%d`
#上面这一句最开始是没有 ‘10#’ 的, 但是在输入为19940910时就报错了，
#因为date --date="$date2" +%m%d变成了0910, 而0x对于shell来说会被解析为8进制，09超过了8进制的表示范围，所以报错Shell: value too great for base。
declare -i date_now_year = `date +%Y`
declare -i date_m = 10#`date -- date="$date2" +%m`
if ["$date_m" -ge "10"]; then
    declare -i date_birth_now = ${date_now_year}${date_birth_md}
else
    declare -i date_birth_now = ${date_now_year}"0"${date_birth_md}
fi
declare -i date_now_second = `date +%s`
declare -i date_birth_now_second = `date --date="$date_birth_now" +%s`
declare -i date_cal_second = $[$date_birth_now_second - $date_now_second]
declare -i date_cal_day = $[$date_cal_second/60/60/24]
if ["$date_cal_day" -le "0"]; then
    echo "Your bithday has over brfore "$[-1*$date_cal_day]" days"
else
    declare -i date_cal_hours = $[$[$date_cal_second - $date_cal_day*60*60*24]/60/60]
    echo "Your birthday after $date_cal_day days and $date_cal_hours hours"
fi
```

>**解决办法:指定其为10进制即可，在结果前加上10#。** 如：declare -i date_birth_md = **10**#`date --date="$date2" +%m%d`
