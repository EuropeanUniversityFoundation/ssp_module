#!/bin/sh
str=$1
newStr="${str// /_}"
echo openssl genrsa -des3 -out ""$newStr"_"$6"".key --passout pass:"$2" 4096
openssl genrsa -des3 -out ""$newStr"_"$6"".key --passout pass:"$2" 4096
echo openssl req -new -key ""$newStr"_"$6"".key -passin pass:"$2" -out ""$newStr"_"$6"".csr -subj "/C="$3"/ST=$4/L=$4/O=$str/OU=$8/CN=unizone-unit.herokuapp.com"
openssl req -new -key ""$newStr"_"$6"".key -passin pass:"$2" -out ""$newStr"_"$6"".csr -subj "/C="$3"/ST=$4/L=$4/O=$str/OU=$8/CN=unizone-unit.herokuapp.com"
echo openssl x509 -req -days 365 -in ""$newStr"_"$6"".csr -CA sspprovidercaunit.crt --passin pass:"$7" -CAkey  sspprovidercaunit.key -set_serial "$5" -out ""$newStr"_"$6"".crt
openssl x509 -req -days 365 -in ""$newStr"_"$6"".csr -CA sspprovidercaunit.crt --passin pass:"$7" -CAkey  sspprovidercaunit.key -set_serial "$5" -out ""$newStr"_"$6"".crt
echo openssl pkcs12 -export -out ""$newStr"_"$6"".pfx --password pass:"" -inkey ""$newStr"_"$6"".key --passin pass:"$2" -in ""$newStr"_"$6"".crt -certfile sspprovidercaunit.crt
openssl pkcs12 -export -out ""$newStr"__"$6"".pfx --password pass:"" -inkey ""$newStr"_"$6"".key --passin pass:"$2" -in ""$newStr"_"$6"".crt -certfile sspprovidercaunit.crt
