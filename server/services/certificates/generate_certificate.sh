#!/bin/sh
echo openssl genrsa -out ""$1"_"$6"".key --passout pass:edssi 4096 
openssl genrsa -out ""$1"_"$6"".key --passout pass:edssi 4096 
echo openssl req -new -key ""$1"_"$6"".key --passin pass:edssi -out ""$1"_"$6"".csr -subj "/C="$3"/ST="$4"/L="$4"/O=EDSSI/OU=EDSSI/CN=edssiregistrationportal.it.auth.gr" -addext "subjectAltName = DNS:www.edssiregistrationportal.it.auth.gr" 
openssl req -new -key ""$1"_"$6"".key --passin pass:"" -out ""$1"_"$6"".csr -subj "/C="$3"/ST="$4"/L="$4"/O=EDSSI/OU=EDSSI/CN=edssiregistrationportal.it.auth.gr" -addext "subjectAltName = DNS:www.edssiregistrationportal.it.auth.gr" 
echo openssl x509 -req -days 365 -in ""$1"_"$6"".csr -CA providerca.crt --passin pass:edssi -CAkey  providerca.key -set_serial "$5" -out ""$1"_"$6"".crt
openssl x509 -req -days 365 -in ""$1"_"$6"".csr -CA providerca.crt --passin pass:edssi -CAkey  providerca.key -set_serial "$5" -out ""$1"_"$6"".crt
