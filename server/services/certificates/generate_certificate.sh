#!/bin/sh
echo openssl genrsa -out ""$1"_"$6"".key --passout pass:"$2" 4096 
openssl genrsa -out ""$1"_"$6"".key --passout pass:"$2" 4096 
echo openssl req -new -key ""$1"_"$6"".key --passin pass:"$2" -out ""$1"_"$6"".csr -subj "/C="$3"/ST="$4"/L="$4"/O="$8"/OU="$9"/CN=uporto-dev.herokuapp.com" -addext "subjectAltName = DNS:www.uporto-dev.herokuapp.com" 
openssl req -new -key ""$1"_"$6"".key --passin pass:"$2" -out ""$1"_"$6"".csr -subj "/C="$3"/ST="$4"/L="$4"/O="$8"/OU="$9"/CN=uporto-dev.herokuapp.com" -addext "subjectAltName = DNS:www.uporto-dev.herokuapp.com" 
echo openssl x509 -req -days 365 -in ""$1"_"$6"".csr -CA sspproviderca.crt --passin pass:"$2" -CAkey  sspproviderca.key -set_serial "$5" -out ""$1"_"$6"".crt
openssl x509 -req -days 365 -in ""$1"_"$6"".csr -CA sspproviderca.crt --passin pass:"$7" -CAkey  sspproviderca.key -set_serial "$5" -out ""$1"_"$6"".crt
echo openssl pkcs12 -export -out ""$1"_"$6"".pfx --password pass:"" -inkey ""$1"_"$6"".key --passin pass:"$2" -in ""$1"_"$6"".crt -certfile sspproviderca.crt
openssl pkcs12 -export -out ""$1"_"$6"".pfx --password pass:"" -inkey ""$1"_"$6"".key --passin pass:"$2" -in ""$1"_"$6"".crt -certfile sspproviderca.crt