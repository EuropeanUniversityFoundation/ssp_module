#!/bin/sh
echo openssl genrsa -out ""$1"_"$6"".key --passout pass:"$2" 4096 
openssl genrsa -out ""$1"_"$6"".key --passout pass:"$2" 4096 
echo openssl req -new -key ""$1"_"$6"".key --passin pass:"$2" -out ""$1"_"$6"".csr -subj "/C="$3"/ST="$4"/L="$4"/O="$8"/OU="$9"/CN=dashboard.sspmodule.it.auth.gr" -addext "subjectAltName = DNS:www.dashboard.sspmodule.it.auth.gr" 
openssl req -new -key ""$1"_"$6"".key --passin pass:"$2" -out ""$1"_"$6"".csr -subj "/C="$3"/ST="$4"/L="$4"/O="$8"/OU="$9"/CN=dashboard.sspmodule.it.auth.gr" -addext "subjectAltName = DNS:www.dashboard.sspmodule.it.auth.gr" 
echo openssl x509 -req -days 365 -in ""$1"_"$6"".csr -CA providerca.crt --passin pass:"$2" -CAkey  providerca.key -set_serial "$5" -out ""$1"_"$6"".crt
openssl x509 -req -days 365 -in ""$1"_"$6"".csr -CA providerca.crt --passin pass:"$7" -CAkey  providerca.key -set_serial "$5" -out ""$1"_"$6"".crt
echo openssl pkcs12 -export -out ""$1"_"$6"".pfx --password pass:"" -inkey ""$1"_"$6"".key --passin pass:"$2" -in ""$1"_"$6"".crt -certfile providerca.crt
openssl pkcs12 -export -out ""$1"_"$6"".pfx --password pass:"" -inkey ""$1"_"$6"".key --passin pass:"$2" -in ""$1"_"$6"".crt -certfile providerca.crt