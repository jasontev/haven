#/usr/bin/env bash

cd ~
mkdir .haven
cd .haven
echo '{}' > accounts.json
echo '{}' > keys.json
cat > data.json <<EOF 
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "birthdate": "2000-01-01"
}
EOF
echo '{}' > accounts.json
