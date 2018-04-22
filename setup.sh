#/usr/bin/env bash

cd ~
mkdir .haven
cd .haven
cat > data.json <<EOF 
[
    {
        "identity_name":"Batman",
        "data":{
            "name":"Batman",
            "email":"batman@gmail.com"
        },
        "sites": {

        }
    },
    {
        "identity_name": "Bruce Wayne",
        "data": {
            "name": "Bruce Wayne",
            "email": "bruce@wayne.com"
        },
        "sites": {

        }
    }
]
EOF
